export type BiologicalSex = 'male' | 'female';

export type DipstickProtein = 'negative' | 'trace' | '1+' | '2+' | '3+' | '4+';

export type KdigoRiskTier = 'low' | 'moderate' | 'high' | 'very_high';

export interface CreatinineRecord {
  timestamp: string;
  serum_creatinine: number;
}

export interface EgfrTrajectoryPoint {
  date: string;
  daysAgo: number;
  yearsFromBaseline: number;
  creatinine: number;
  egfr: number;
}

export interface RawPatient {
  patient_id: string;
  name: string;
  age: number;
  sex: BiologicalSex;
  has_diabetes: boolean;
  has_hypertension: boolean;
  systolic_bp: number;
  diastolic_bp: number;
  uacr: number; // in mg/g
  dipstick_protein: DipstickProtein;
  creatinine_history: CreatinineRecord[];
}

export interface GdmtRecommendation {
  eligibleForSglt2i: boolean;
  sglt2iDrug: string;
  sglt2iDose: string;
  sglt2iRationale: string;
  eligibleForArb: boolean;
  arbDrug: string;
  arbDose: string;
  arbRationale: string;
  hemodynamicDipReassurance: string;
  monitoringPlan: string;
  actionRequired: boolean;
}

export interface AnalyzedPatient extends RawPatient {
  currentEgfr: number;
  baselineEgfr: number;
  egfrSlopeAnnual: number; // in mL/min/1.73m²/year (negative means decline)
  isRapidProgressor: boolean; // slope <= -3.0 mL/min/yr
  kfre2YearPercent: number; // 0.0 to 1.0
  kfre5YearPercent: number; // 0.0 to 1.0
  kdigoTier: KdigoRiskTier;
  kdigoGStage: 'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5';
  kdigoAStage: 'A1' | 'A2' | 'A3';
  trajectoryPoints: EgfrTrajectoryPoint[];
  projectedYearsToDialysis: number | null; // null if stable
  gdmt: GdmtRecommendation;
}
