import {
  PartnerProfile,
  CoupleMatchResponse,
  TriagePriority,
  SeverityTier,
  GenomicVariant,
} from './types';

export const HIGH_PREVALENCE_GENE_DETAILS: Record<
  string,
  {
    condition_name: string;
    omim_id: string;
    severity_tier: SeverityTier;
    recommendation: string;
  }
> = {
  HBB: {
    condition_name: 'Beta-Thalassemia Major',
    omim_id: '603902',
    severity_tier: 'TIER_1_LETHAL',
    recommendation:
      'Urgent referral to DoH certified genetic counselor and PGT-M / IVF consultation under Thiqa coverage.',
  },
  SMN1: {
    condition_name: 'Spinal Muscular Atrophy Type 1',
    omim_id: '253300',
    severity_tier: 'TIER_1_LETHAL',
    recommendation:
      'Priority premarital genetic counseling and pre-implantation monogenic testing (PGT-M) consultation recommended.',
  },
  CFTR: {
    condition_name: 'Cystic Fibrosis',
    omim_id: '219700',
    severity_tier: 'TIER_2_DEBILITATING',
    recommendation:
      'Genetic counseling and reproductive options navigation including PGT-M protocol.',
  },
  CYP21A2: {
    condition_name: 'Congenital Adrenal Hyperplasia (Classic)',
    omim_id: '201910',
    severity_tier: 'TIER_1_LETHAL',
    recommendation:
      'Immediate clinical endocrinology and genetic counseling referral.',
  },
  PCDH15: {
    condition_name: 'Usher Syndrome Type 1F',
    omim_id: '602083',
    severity_tier: 'TIER_2_DEBILITATING',
    recommendation:
      'Genetic counseling review regarding autosomal recessive sensory disorder risks.',
  },
  PAH: {
    condition_name: 'Phenylketonuria (PKU)',
    omim_id: '261600',
    severity_tier: 'TIER_1_LETHAL',
    recommendation:
      'Genetic counseling and pre-implantation genetic testing (PGT-M) consultation recommended to prevent severe neonatal neurodevelopmental complications.',
  },
};

export function extractPathogenicGenes(variants: GenomicVariant[]): string[] {
  const genes: string[] = [];
  for (const v of variants) {
    if (
      !v.is_vus &&
      (v.clinvar_significance === 'Pathogenic' ||
        v.clinvar_significance === 'Likely Pathogenic')
    ) {
      genes.push(v.gene_symbol.toUpperCase());
    }
  }
  return Array.from(new Set(genes));
}

export function evaluateCoupleCompatibility(
  partnerA: PartnerProfile,
  partnerB: PartnerProfile,
  daysUntilWedding?: number
): CoupleMatchResponse {
  const genesA = extractPathogenicGenes(partnerA.variants);
  const genesB = extractPathogenicGenes(partnerB.variants);

  const overlappingGenes = genesA.filter((g) => genesB.includes(g));

  if (overlappingGenes.length > 0) {
    const matchedGene = overlappingGenes[0];
    const geneInfo = HIGH_PREVALENCE_GENE_DETAILS[matchedGene] || {
      condition_name: `Autosomal Recessive ${matchedGene}-Related Condition`,
      omim_id: 'Unknown',
      severity_tier: 'TIER_2_DEBILITATING',
      recommendation:
        'Consult a certified genetic counselor for personalized risk assessment.',
    };

    const severity = geneInfo.severity_tier;
    const isUrgent =
      (daysUntilWedding !== undefined && daysUntilWedding <= 30) ||
      severity === 'TIER_1_LETHAL';

    let triagePriority: TriagePriority = 'TIER_2_MODERATE';
    if (isUrgent && daysUntilWedding !== undefined && daysUntilWedding <= 30) {
      triagePriority = 'TIER_1_URGENT';
    } else if (severity === 'TIER_1_LETHAL') {
      triagePriority = 'TIER_1_ROUTINE';
    }

    const explanation =
      `Both partners are healthy carriers of pathogenic variants in the ${matchedGene} gene. ` +
      `Under autosomal recessive inheritance, there is a 25% chance in each pregnancy of an affected child, ` +
      `a 50% chance of a healthy carrier child, and a 25% chance of an unaffected non-carrier child.`;

    return {
      compatibility_status: 'INCOMPATIBLE',
      triage_priority: triagePriority,
      target_gene: matchedGene,
      condition_name: geneInfo.condition_name,
      omim_id: geneInfo.omim_id,
      recurrence_risk: 0.25,
      carrier_recurrence_risk: 0.5,
      unaffected_non_carrier_risk: 0.25,
      explanation,
      clinical_recommendation: geneInfo.recommendation,
      requires_counselor_triage: true,
    };
  }

  let explanation =
    'No overlapping pathogenic recessive carrier variants were detected between partners across the 570-gene screening panel. ' +
    'The couple is genetically compatible for common screened conditions.';

  if (genesA.length > 0 || genesB.length > 0) {
    const carriers: string[] = [];
    if (genesA.length > 0) {
      carriers.push(`${partnerA.full_name} (${genesA.join(', ')})`);
    }
    if (genesB.length > 0) {
      carriers.push(`${partnerB.full_name} (${genesB.join(', ')})`);
    }
    explanation += ` Individual non-overlapping carrier status noted for: ${carriers.join('; ')}.`;
  }

  return {
    compatibility_status: 'COMPATIBLE',
    triage_priority: 'COMPATIBLE',
    target_gene: null,
    condition_name: null,
    omim_id: null,
    recurrence_risk: 0.0,
    carrier_recurrence_risk: genesA.length > 0 || genesB.length > 0 ? 0.5 : 0.0,
    unaffected_non_carrier_risk:
      genesA.length === 0 && genesB.length === 0 ? 1.0 : 0.5,
    explanation,
    clinical_recommendation:
      'Cleared for marriage documentation. Standard preconception wellness counseling recommended.',
    requires_counselor_triage: false,
  };
}
