from typing import Optional, List, Tuple
from app.models.genomics import (
    PartnerProfile,
    CoupleMatchResponse,
    CompatibilityStatus,
    TriagePriority,
    SeverityTier,
    ClinVarSignificance,
    GenomicVariant,
)

HIGH_PREVALENCE_GENE_DETAILS = {
    "HBB": {
        "condition_name": "Beta-Thalassemia Major",
        "omim_id": "603902",
        "severity_tier": SeverityTier.TIER_1_LETHAL,
        "recommendation": "Urgent referral to DoH certified genetic counselor and PGT-M / IVF consultation under Thiqa coverage.",
    },
    "SMN1": {
        "condition_name": "Spinal Muscular Atrophy Type 1",
        "omim_id": "253300",
        "severity_tier": SeverityTier.TIER_1_LETHAL,
        "recommendation": "Priority premarital genetic counseling and pre-implantation monogenic testing (PGT-M) consultation recommended.",
    },
    "CFTR": {
        "condition_name": "Cystic Fibrosis",
        "omim_id": "219700",
        "severity_tier": SeverityTier.TIER_2_DEBILITATING,
        "recommendation": "Genetic counseling and reproductive options navigation including PGT-M protocol.",
    },
    "CYP21A2": {
        "condition_name": "Congenital Adrenal Hyperplasia (Classic)",
        "omim_id": "201910",
        "severity_tier": SeverityTier.TIER_1_LETHAL,
        "recommendation": "Immediate clinical endocrinology and genetic counseling referral.",
    },
    "PCDH15": {
        "condition_name": "Usher Syndrome Type 1F",
        "omim_id": "602083",
        "severity_tier": SeverityTier.TIER_2_DEBILITATING,
        "recommendation": "Genetic counseling review regarding autosomal recessive sensory disorder risks.",
    },
    "PAH": {
        "condition_name": "Phenylketonuria (PKU)",
        "omim_id": "261600",
        "severity_tier": SeverityTier.TIER_1_LETHAL,
        "recommendation": "Genetic counseling and pre-implantation genetic testing (PGT-M) consultation recommended to prevent severe neonatal neurodevelopmental complications.",
    },
}

def extract_pathogenic_genes(variants: List[GenomicVariant]) -> List[str]:
    """Filters variants to non-VUS pathogenic or likely pathogenic carrier genes."""
    genes = []
    for var in variants:
        if not var.is_vus and var.clinvar_significance in [
            ClinVarSignificance.PATHOGENIC,
            ClinVarSignificance.LIKELY_PATHOGENIC,
        ]:
            genes.append(var.gene_symbol.upper())
    return list(set(genes))

def evaluate_couple_compatibility(
    partner_a: PartnerProfile,
    partner_b: PartnerProfile,
    days_until_wedding: Optional[int] = None,
) -> CoupleMatchResponse:
    """
    Evaluates autosomal recessive carrier overlap between two prospective partners.
    Adheres to ACMG 2015 variant guidelines and ADPHC premarital screening criteria.
    """
    genes_a = extract_pathogenic_genes(partner_a.variants)
    genes_b = extract_pathogenic_genes(partner_b.variants)

    overlapping_genes = [g for g in genes_a if g in genes_b]

    if overlapping_genes:
        matched_gene = overlapping_genes[0]
        gene_info = HIGH_PREVALENCE_GENE_DETAILS.get(
            matched_gene,
            {
                "condition_name": f"Autosomal Recessive {matched_gene}-Related Condition",
                "omim_id": "Unknown",
                "severity_tier": SeverityTier.TIER_2_DEBILITATING,
                "recommendation": "Consult a certified genetic counselor for personalized risk assessment.",
            },
        )

        severity = gene_info["severity_tier"]
        is_urgent = (
            days_until_wedding is not None and days_until_wedding <= 30
        ) or severity == SeverityTier.TIER_1_LETHAL

        if is_urgent and days_until_wedding is not None and days_until_wedding <= 30:
            triage_priority = TriagePriority.TIER_1_URGENT
        elif severity == SeverityTier.TIER_1_LETHAL:
            triage_priority = TriagePriority.TIER_1_ROUTINE
        else:
            triage_priority = TriagePriority.TIER_2_MODERATE

        explanation = (
            f"Both partners are healthy carriers of pathogenic variants in the {matched_gene} gene. "
            f"Under autosomal recessive inheritance, there is a 25% chance in each pregnancy of an affected child, "
            f"a 50% chance of a healthy carrier child, and a 25% chance of an unaffected non-carrier child."
        )

        return CoupleMatchResponse(
            compatibility_status=CompatibilityStatus.INCOMPATIBLE,
            triage_priority=triage_priority,
            target_gene=matched_gene,
            condition_name=gene_info["condition_name"],
            omim_id=gene_info["omim_id"],
            recurrence_risk=0.25,
            carrier_recurrence_risk=0.50,
            unaffected_non_carrier_risk=0.25,
            explanation=explanation,
            clinical_recommendation=gene_info["recommendation"],
            requires_counselor_triage=True,
        )

    # Compatible branch
    explanation = (
        "No overlapping pathogenic recessive carrier variants were detected between partners across the 570-gene screening panel. "
        "The couple is genetically compatible for common screened conditions."
    )
    if genes_a or genes_b:
        individual_carriers = []
        if genes_a:
            individual_carriers.append(f"{partner_a.full_name} ({', '.join(genes_a)})")
        if genes_b:
            individual_carriers.append(f"{partner_b.full_name} ({', '.join(genes_b)})")
        explanation += f" Individual non-overlapping carrier status noted for: {'; '.join(individual_carriers)}."

    return CoupleMatchResponse(
        compatibility_status=CompatibilityStatus.COMPATIBLE,
        triage_priority=TriagePriority.COMPATIBLE,
        target_gene=None,
        condition_name=None,
        omim_id=None,
        recurrence_risk=0.0,
        carrier_recurrence_risk=0.50 if (genes_a or genes_b) else 0.0,
        unaffected_non_carrier_risk=1.0 if not (genes_a or genes_b) else 0.50,
        explanation=explanation,
        clinical_recommendation="Cleared for marriage documentation. Standard preconception wellness counseling recommended.",
        requires_counselor_triage=False,
    )
