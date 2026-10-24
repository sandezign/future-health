import unittest
import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.zkp_engine import (
    generate_session_salt,
    build_bloom_filter_hex,
    verify_bloom_intersection,
)

class TestZKPEngine(unittest.TestCase):
    def test_zkp_overlapping_carrier_match(self):
        salt = generate_session_salt()
        # Partner A carries HBB and G6PD
        filter_a = build_bloom_filter_hex(["HBB", "G6PD"], salt)
        # Partner B carries HBB and CFTR
        filter_b = build_bloom_filter_hex(["HBB", "CFTR"], salt)

        match_detected, verdict, proof_hash = verify_bloom_intersection(filter_a, filter_b, salt)
        self.assertTrue(match_detected)
        self.assertEqual(verdict, "COUNSELING_RECOMMENDED")
        self.assertEqual(len(proof_hash), 64)

    def test_zkp_non_overlapping_compatible(self):
        salt = generate_session_salt()
        # Partner A carries HBB
        filter_a = build_bloom_filter_hex(["HBB"], salt)
        # Partner B carries SMN1
        filter_b = build_bloom_filter_hex(["SMN1"], salt)

        match_detected, verdict, proof_hash = verify_bloom_intersection(filter_a, filter_b, salt)
        self.assertFalse(match_detected)
        self.assertEqual(verdict, "COMPATIBLE")
        self.assertEqual(len(proof_hash), 64)

    def test_zkp_wildtype_empty(self):
        salt = generate_session_salt()
        # Partner A carries nothing
        filter_a = build_bloom_filter_hex([], salt)
        # Partner B carries nothing
        filter_b = build_bloom_filter_hex([], salt)

        match_detected, verdict, proof_hash = verify_bloom_intersection(filter_a, filter_b, salt)
        self.assertFalse(match_detected)
        self.assertEqual(verdict, "COMPATIBLE")

if __name__ == "__main__":
    unittest.main()
