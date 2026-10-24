export type ClinVarSignificance =
  | 'Pathogenic'
  | 'Likely Pathogenic'
  | 'Variant of Uncertain Significance'
  | 'Benign';

export type SeverityTier =
  | 'TIER_1_LETHAL'
  | 'TIER_2_DEBILITATING'
  | 'TIER_3_MILD';

export type CompatibilityStatus =
  | 'COMPATIBLE'
  | 'INCOMPATIBLE'
  | 'INCONCLUSIVE';

export type TriagePriority =
  | 'TIER_1_URGENT'
  | 'TIER_1_ROUTINE'
  | 'TIER_2_MODERATE'
  | 'COMPATIBLE';

export interface GenomicVariant {
  gene_symbol: string;
  condition_name: string;
  omim_id: string;
  hgvs_c: string;
  hgvs_p?: string;
  zygosity: string;
  clinvar_id?: string;
  clinvar_significance: ClinVarSignificance;
  severity_tier: SeverityTier;
  is_vus: boolean;
  plain_summary?: string;
}

export interface PartnerProfile {
  id: string;
  full_name: string;
  gender: 'male' | 'female';
  birth_date: string;
  emirates_id_hash: string;
  screening_date: string;
  variants: GenomicVariant[];
}

export interface CoupleRecord {
  couple_id: string;
  region: 'Abu Dhabi Central' | 'Al Ain' | 'Al Dhafra';
  wedding_date: string;
  days_until_wedding: number;
  triage_priority: TriagePriority;
  overall_status: CompatibilityStatus;
  target_gene: string | null;
  condition_name: string | null;
  omim_id: string | null;
  recurrence_risk: number;
  partner_a: PartnerProfile;
  partner_b: PartnerProfile;
}

export interface CoupleMatchResponse {
  couple_id?: string;
  compatibility_status: CompatibilityStatus;
  triage_priority: TriagePriority;
  target_gene: string | null;
  condition_name: string | null;
  omim_id: string | null;
  recurrence_risk: number;
  carrier_recurrence_risk: number;
  unaffected_non_carrier_risk: number;
  explanation: string;
  clinical_recommendation: string;
  requires_counselor_triage: boolean;
}

export interface ZKPVerifyResult {
  session_id: string;
  verdict: 'COMPATIBLE' | 'COUNSELING_RECOMMENDED';
  match_detected: boolean;
  proof_timestamp: string;
  verification_hash: string;
}
