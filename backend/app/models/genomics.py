from enum import Enum
from typing import List, Optional, Dict, Any

try:
    from pydantic import BaseModel, Field
except ImportError:
    class BaseModel:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)
        def model_dump(self):
            return self.__dict__
    def Field(default_factory=None, **kwargs):
        return default_factory() if default_factory else None

class ClinVarSignificance(str, Enum):
    PATHOGENIC = "Pathogenic"
    LIKELY_PATHOGENIC = "Likely Pathogenic"
    VUS = "Variant of Uncertain Significance"
    BENIGN = "Benign"

class SeverityTier(str, Enum):
    TIER_1_LETHAL = "TIER_1_LETHAL"
    TIER_2_DEBILITATING = "TIER_2_DEBILITATING"
    TIER_3_MILD = "TIER_3_MILD"

class CompatibilityStatus(str, Enum):
    COMPATIBLE = "COMPATIBLE"
    INCOMPATIBLE = "INCOMPATIBLE"
    INCONCLUSIVE = "INCONCLUSIVE"

class TriagePriority(str, Enum):
    TIER_1_URGENT = "TIER_1_URGENT"
    TIER_1_ROUTINE = "TIER_1_ROUTINE"
    TIER_2_MODERATE = "TIER_2_MODERATE"
    COMPATIBLE = "COMPATIBLE"

class GenomicVariant(BaseModel):
    gene_symbol: str
    condition_name: str
    omim_id: str
    hgvs_c: str
    hgvs_p: Optional[str] = None
    zygosity: str = "heterozygous"
    clinvar_id: Optional[str] = None
    clinvar_significance: ClinVarSignificance = ClinVarSignificance.PATHOGENIC
    severity_tier: SeverityTier = SeverityTier.TIER_1_LETHAL
    is_vus: bool = False
    plain_summary: Optional[str] = None

class PartnerProfile(BaseModel):
    id: str
    full_name: str
    gender: str
    birth_date: str
    emirates_id_hash: str
    screening_date: str
    variants: List[GenomicVariant] = Field(default_factory=list)

class CoupleRecord(BaseModel):
    couple_id: str
    region: str
    wedding_date: str
    days_until_wedding: int
    triage_priority: TriagePriority
    overall_status: CompatibilityStatus
    target_gene: Optional[str] = None
    condition_name: Optional[str] = None
    omim_id: Optional[str] = None
    recurrence_risk: float = 0.0
    carrier_recurrence_risk: float = 0.50
    unaffected_non_carrier_risk: float = 0.25
    partner_a: PartnerProfile
    partner_b: PartnerProfile

class CoupleMatchRequest(BaseModel):
    partner_a: PartnerProfile
    partner_b: PartnerProfile
    wedding_date: Optional[str] = None

class CoupleMatchResponse(BaseModel):
    couple_id: Optional[str] = None
    compatibility_status: CompatibilityStatus
    triage_priority: TriagePriority
    target_gene: Optional[str] = None
    condition_name: Optional[str] = None
    omim_id: Optional[str] = None
    recurrence_risk: float = 0.0
    carrier_recurrence_risk: float = 0.50
    unaffected_non_carrier_risk: float = 0.25
    explanation: str
    clinical_recommendation: str
    requires_counselor_triage: bool = False

class ZKPInitRequest(BaseModel):
    initiator_id: str

class ZKPInitResponse(BaseModel):
    session_id: str
    session_salt: str
    qr_token: str
    expires_at: str

class ZKPVerifyRequest(BaseModel):
    session_id: str
    filter_hex_a: str
    filter_hex_b: str
    salt: str

class ZKPVerifyResponse(BaseModel):
    session_id: str
    verdict: str
    match_detected: bool
    proof_timestamp: str
    verification_hash: str
