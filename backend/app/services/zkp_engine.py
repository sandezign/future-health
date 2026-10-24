import hmac
import hashlib
import secrets
from typing import List, Tuple
from datetime import datetime, timezone, timedelta

FILTER_BIT_SIZE = 512
NUM_HASH_FUNCTIONS = 3

PANEL_GENES = ["HBB", "SMN1", "CFTR", "CYP21A2", "PCDH15", "G6PD", "PAH", "HEXA", "MEFV", "GAA"]

def generate_session_salt() -> str:
    """Generates a cryptographically secure 32-byte hex salt for an ephemeral SafeMatch session."""
    return secrets.token_hex(32)

def compute_gene_indices(gene_symbol: str, salt_hex: str, bit_size: int = FILTER_BIT_SIZE) -> List[int]:
    """
    Computes deterministic bit indices in [0, bit_size) for a gene symbol
    using HMAC-SHA256 with the session salt.
    """
    salt = bytes.fromhex(salt_hex)
    digest = hmac.new(salt, gene_symbol.strip().upper().encode("utf-8"), hashlib.sha256).digest()
    
    indices = []
    for i in range(NUM_HASH_FUNCTIONS):
        # Slice 2 bytes per hash index
        chunk = digest[i * 2 : (i + 1) * 2]
        val = int.from_bytes(chunk, byteorder="big")
        indices.append(val % bit_size)
    return indices

def build_bloom_filter_hex(gene_symbols: List[str], salt_hex: str, bit_size: int = FILTER_BIT_SIZE) -> str:
    """Builds a bit vector for the provided genes and returns it as a hex string."""
    byte_count = bit_size // 8
    bit_array = bytearray(byte_count)
    
    for gene in gene_symbols:
        indices = compute_gene_indices(gene, salt_hex, bit_size)
        for idx in indices:
            byte_idx = idx // 8
            bit_idx = idx % 8
            bit_array[byte_idx] |= (1 << bit_idx)
            
    return bit_array.hex()

def verify_bloom_intersection(
    filter_hex_a: str,
    filter_hex_b: str,
    salt_hex: str,
    reference_panel: List[str] = PANEL_GENES,
    bit_size: int = FILTER_BIT_SIZE,
) -> Tuple[bool, str, str]:
    """
    Computes bitwise AND between two blinded Bloom filters.
    Tests if any known recessive screening panel gene is present in the intersection.
    Returns: (match_detected, verdict_string, verification_proof_hash)
    """
    bytes_a = bytes.fromhex(filter_hex_a)
    bytes_b = bytes.fromhex(filter_hex_b)
    
    if len(bytes_a) != len(bytes_b) or len(bytes_a) != (bit_size // 8):
        raise ValueError("Invalid filter length or dimension mismatch.")
        
    # Bitwise AND intersection
    intersection = bytes(a & b for a, b in zip(bytes_a, bytes_b))
    
    match_detected = False
    for gene in reference_panel:
        indices = compute_gene_indices(gene, salt_hex, bit_size)
        all_bits_set = True
        for idx in indices:
            byte_idx = idx // 8
            bit_idx = idx % 8
            if not (intersection[byte_idx] & (1 << bit_idx)):
                all_bits_set = False
                break
        if all_bits_set:
            match_detected = True
            break
            
    verdict = "COUNSELING_RECOMMENDED" if match_detected else "COMPATIBLE"
    
    # Compute tamper-evident verification proof hash
    proof_material = f"{filter_hex_a}:{filter_hex_b}:{salt_hex}:{verdict}".encode("utf-8")
    proof_hash = hashlib.sha256(proof_material).hexdigest()
    
    return match_detected, verdict, proof_hash
