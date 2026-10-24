import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.models.genomics import (
    PartnerProfile,
    GenomicVariant,
    ClinVarSignificance,
    SeverityTier,
    CompatibilityStatus,
    TriagePriority,
)
from app.services.genomic_matcher import evaluate_couple_compatibility

class TestGenomicMatcher(unittest.TestCase):
    def test_hbb_incompatible_urgent(self):
        var_a = GenomicVariant(
            gene_symbol="HBB",
            condition_name="Beta-Thalassemia Major",
            omim_id="603902",
            hgvs_c="c.93-21G>A",
            zygosity="heterozygous",
            clinvar_significance=ClinVarSignificance.PATHOGENIC,
            severity_tier=SeverityTier.TIER_1_LETHAL,
        )
        var_b = GenomicVariant(
            gene_symbol="HBB",
            condition_name="Beta-Thalassemia Major",
            omim_id="603902",
            hgvs_c="c.118C>T",
            zygosity="heterozygous",
            clinvar_significance=ClinVarSignificance.PATHOGENIC,
            severity_tier=SeverityTier.TIER_1_LETHAL,
        )
        p_a = PartnerProfile(
            id="P1",
            full_name="Partner A",
            gender="male",
            birth_date="1995-01-01",
            emirates_id_hash="784-1",
            screening_date="2026-10-01",
            variants=[var_a],
        )
        p_b = PartnerProfile(
            id="P2",
            full_name="Partner B",
            gender="female",
            birth_date="1997-01-01",
            emirates_id_hash="784-2",
            screening_date="2026-10-01",
            variants=[var_b],
        )

        res = evaluate_couple_compatibility(p_a, p_b, days_until_wedding=14)
        self.assertEqual(res.compatibility_status, CompatibilityStatus.INCOMPATIBLE)
        self.assertEqual(res.target_gene, "HBB")
        self.assertEqual(res.recurrence_risk, 0.25)
        self.assertEqual(res.triage_priority, TriagePriority.TIER_1_URGENT)
        self.assertTrue(res.requires_counselor_triage)

    def test_different_genes_compatible(self):
        var_a = GenomicVariant(
            gene_symbol="HBB",
            condition_name="Beta-Thalassemia Major",
            omim_id="603902",
            hgvs_c="c.93-21G>A",
            zygosity="heterozygous",
            clinvar_significance=ClinVarSignificance.PATHOGENIC,
            severity_tier=SeverityTier.TIER_1_LETHAL,
        )
        var_b = GenomicVariant(
            gene_symbol="CFTR",
            condition_name="Cystic Fibrosis",
            omim_id="219700",
            hgvs_c="c.1521_1523delCTT",
            zygosity="heterozygous",
            clinvar_significance=ClinVarSignificance.PATHOGENIC,
            severity_tier=SeverityTier.TIER_2_DEBILITATING,
        )
        p_a = PartnerProfile(
            id="P1",
            full_name="Partner A",
            gender="male",
            birth_date="1995-01-01",
            emirates_id_hash="784-1",
            screening_date="2026-10-01",
            variants=[var_a],
        )
        p_b = PartnerProfile(
            id="P2",
            full_name="Partner B",
            gender="female",
            birth_date="1997-01-01",
            emirates_id_hash="784-2",
            screening_date="2026-10-01",
            variants=[var_b],
        )

        res = evaluate_couple_compatibility(p_a, p_b, days_until_wedding=60)
        self.assertEqual(res.compatibility_status, CompatibilityStatus.COMPATIBLE)
        self.assertIsNone(res.target_gene)
        self.assertEqual(res.recurrence_risk, 0.0)
        self.assertEqual(res.triage_priority, TriagePriority.COMPATIBLE)
        self.assertFalse(res.requires_counselor_triage)

    def test_vus_ignored_in_carrier_matching(self):
        var_a = GenomicVariant(
            gene_symbol="CFTR",
            condition_name="Cystic Fibrosis",
            omim_id="219700",
            hgvs_c="c.100A>G",
            zygosity="heterozygous",
            clinvar_significance=ClinVarSignificance.VUS,
            is_vus=True,
        )
        var_b = GenomicVariant(
            gene_symbol="CFTR",
            condition_name="Cystic Fibrosis",
            omim_id="219700",
            hgvs_c="c.1521_1523delCTT",
            zygosity="heterozygous",
            clinvar_significance=ClinVarSignificance.PATHOGENIC,
        )
        p_a = PartnerProfile(
            id="P1",
            full_name="Partner A",
            gender="male",
            birth_date="1995-01-01",
            emirates_id_hash="784-1",
            screening_date="2026-10-01",
            variants=[var_a],
        )
        p_b = PartnerProfile(
            id="P2",
            full_name="Partner B",
            gender="female",
            birth_date="1997-01-01",
            emirates_id_hash="784-2",
            screening_date="2026-10-01",
            variants=[var_b],
        )

        res = evaluate_couple_compatibility(p_a, p_b)
        self.assertEqual(res.compatibility_status, CompatibilityStatus.COMPATIBLE)
        self.assertFalse(res.requires_counselor_triage)

    def test_pah_incompatible_consanguineous(self):
        var_a = GenomicVariant(
            gene_symbol="PAH",
            condition_name="Phenylketonuria (PKU)",
            omim_id="261600",
            hgvs_c="c.1066-11G>A",
            zygosity="heterozygous",
            clinvar_significance=ClinVarSignificance.PATHOGENIC,
            severity_tier=SeverityTier.TIER_1_LETHAL,
        )
        var_b = GenomicVariant(
            gene_symbol="PAH",
            condition_name="Phenylketonuria (PKU)",
            omim_id="261600",
            hgvs_c="c.1222C>T",
            zygosity="heterozygous",
            clinvar_significance=ClinVarSignificance.PATHOGENIC,
            severity_tier=SeverityTier.TIER_1_LETHAL,
        )
        p_a = PartnerProfile(
            id="P_Tariq",
            full_name="Tariq Al-Zaabi",
            gender="male",
            birth_date="2001-03-10",
            emirates_id_hash="784-2001-9922114-5",
            screening_date="2026-10-23",
            variants=[var_a],
        )
        p_b = PartnerProfile(
            id="P_Reem",
            full_name="Reem Al-Zaabi",
            gender="female",
            birth_date="2003-07-25",
            emirates_id_hash="784-2003-1122334-8",
            screening_date="2026-10-23",
            variants=[var_b],
        )

        res = evaluate_couple_compatibility(p_a, p_b, days_until_wedding=110)
        self.assertEqual(res.compatibility_status, CompatibilityStatus.INCOMPATIBLE)
        self.assertEqual(res.target_gene, "PAH")
        self.assertEqual(res.condition_name, "Phenylketonuria (PKU)")
        self.assertEqual(res.recurrence_risk, 0.25)
        self.assertEqual(res.triage_priority, TriagePriority.TIER_1_ROUTINE)
        self.assertTrue(res.requires_counselor_triage)

if __name__ == "__main__":
    unittest.main()
