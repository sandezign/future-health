import json
import os
import secrets
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException

from app.models.genomics import (
    CoupleMatchRequest,
    CoupleMatchResponse,
    ZKPInitRequest,
    ZKPInitResponse,
    ZKPVerifyRequest,
    ZKPVerifyResponse,
)
from app.services.genomic_matcher import evaluate_couple_compatibility
from app.services.zkp_engine import (
    generate_session_salt,
    verify_bloom_intersection,
)

router = APIRouter(prefix="/genomics", tags=["genomics"])

# In-memory storage for active ZKP challenge sessions (15-minute TTL)
ACTIVE_ZKP_SESSIONS: Dict[str, Dict[str, Any]] = {}

COHORT_FILE_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../../../data/synthetic/geno_bridge_cohort.json")
)

@router.get("/health")
def genomics_health():
    return {"status": "ok", "service": "geno-bridge-genomics"}

@router.get("/cohort")
def get_synthetic_cohort():
    """Returns the synthetic premarital genomic screening cohort."""
    if not os.path.exists(COHORT_FILE_PATH):
        raise HTTPException(status_code=404, detail="Synthetic cohort file not found.")
    try:
        with open(COHORT_FILE_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read cohort data: {str(e)}")

@router.post("/match", response_model=CoupleMatchResponse)
def match_couple(req: CoupleMatchRequest):
    """
    Evaluates autosomal recessive compatibility between two prospective partners.
    """
    days_until_wedding = None
    if req.wedding_date:
        try:
            w_date = datetime.strptime(req.wedding_date, "%Y-%m-%d").date()
            today = datetime.now(timezone.utc).date()
            days_until_wedding = (w_date - today).days
        except Exception:
            pass

    return evaluate_couple_compatibility(
        partner_a=req.partner_a,
        partner_b=req.partner_b,
        days_until_wedding=days_until_wedding,
    )

@router.post("/zkp/challenge", response_model=ZKPInitResponse)
def create_zkp_challenge(req: ZKPInitRequest):
    """
    Generates a secure 15-minute SafeMatch session code and cryptographic salt.
    """
    session_id = f"ZKP-{secrets.token_hex(4).upper()}"
    salt = generate_session_salt()
    expires_at = (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()
    qr_token = f"geno-safematch://join?session={session_id}&salt={salt}"

    ACTIVE_ZKP_SESSIONS[session_id] = {
        "initiator_id": req.initiator_id,
        "salt": salt,
        "expires_at": expires_at,
    }

    return ZKPInitResponse(
        session_id=session_id,
        session_salt=salt,
        qr_token=qr_token,
        expires_at=expires_at,
    )

@router.post("/zkp/verify", response_model=ZKPVerifyResponse)
def verify_zkp(req: ZKPVerifyRequest):
    """
    Evaluates blinded client-side Bloom filter intersection without exposing raw genes.
    """
    try:
        match_detected, verdict, proof_hash = verify_bloom_intersection(
            filter_hex_a=req.filter_hex_a,
            filter_hex_b=req.filter_hex_b,
            salt_hex=req.salt,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Verification failed: {str(e)}")

    return ZKPVerifyResponse(
        session_id=req.session_id,
        verdict=verdict,
        match_detected=match_detected,
        proof_timestamp=datetime.now(timezone.utc).isoformat(),
        verification_hash=proof_hash,
    )
