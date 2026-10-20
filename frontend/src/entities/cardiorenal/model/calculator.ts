import {
  RawPatient,
  AnalyzedPatient,
  BiologicalSex,
  CreatinineRecord,
  EgfrTrajectoryPoint,
  KdigoRiskTier,
  GdmtRecommendation,
} from '../../patient/model/types';

/**
 * CKD-EPI 2021 Race-Free Creatinine Equation
 * Inker et al., NEJM 2021
 */
export function calculateCkdEpi2021(
  serumCreatinine: number,
  age: number,
  sex: BiologicalSex
): number {
  const isFemale = sex === 'female';
  const kappa = isFemale ? 0.7 : 0.9;
  const alpha = isFemale ? -0.241 : -0.302;
  const femaleFactor = isFemale ? 1.012 : 1.0;

  const scrOverKappa = serumCreatinine / kappa;
  const minTerm = Math.min(scrOverKappa, 1.0);
  const maxTerm = Math.max(scrOverKappa, 1.0);

  const egfr =
    142 *
    Math.pow(minTerm, alpha) *
    Math.pow(maxTerm, -1.2) *
    Math.pow(0.9938, age) *
    femaleFactor;

  return Math.round(egfr * 10) / 10;
}

/**
 * Ordinary Least Squares (OLS) eGFR Slope Calculation
 * Computes annual rate of change in mL/min/1.73m²/year
 */
export function calculateTrajectoryAndSlope(
  history: CreatinineRecord[],
  age: number,
  sex: BiologicalSex
): { points: EgfrTrajectoryPoint[]; slopeAnnual: number } {
  if (!history || history.length === 0) {
    return { points: [], slopeAnnual: 0 };
  }

  // Sort chronological
  const sorted = [...history].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const firstTime = new Date(sorted[0]!.timestamp).getTime();
  const lastTime = new Date(sorted[sorted.length - 1]!.timestamp).getTime();

  const points: EgfrTrajectoryPoint[] = sorted.map((rec) => {
    const t = new Date(rec.timestamp).getTime();
    const daysAgo = Math.round((lastTime - t) / (1000 * 60 * 60 * 24));
    const yearsFromBaseline = (t - firstTime) / (1000 * 60 * 60 * 24 * 365.25);
    const egfr = calculateCkdEpi2021(rec.serum_creatinine, age, sex);

    return {
      date: rec.timestamp.split('T')[0] ?? rec.timestamp,
      daysAgo,
      yearsFromBaseline,
      creatinine: rec.serum_creatinine,
      egfr,
    };
  });

  if (points.length < 2) {
    return { points, slopeAnnual: 0 };
  }

  // Calculate OLS slope: eGFR = intercept + slope * yearsFromBaseline
  const n = points.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (const p of points) {
    sumX += p.yearsFromBaseline;
    sumY += p.egfr;
    sumXY += p.yearsFromBaseline * p.egfr;
    sumX2 += p.yearsFromBaseline * p.yearsFromBaseline;
  }

  const denominator = n * sumX2 - sumX * sumX;
  const slope = denominator !== 0 ? (n * sumXY - sumX * sumY) / denominator : 0;

  return { points, slopeAnnual: Math.round(slope * 10) / 10 };
}

/**
 * Tangri 4-Variable Kidney Failure Risk Equation (KFRE)
 * JAMA 2016
 */
export function calculateKfre(
  age: number,
  sex: BiologicalSex,
  egfr: number,
  uacr: number
): { risk2Yr: number; risk5Yr: number } {
  const maleFlag = sex === 'male' ? 1.0 : 0.0;
  const safeUacr = Math.max(uacr, 1.0); // prevent log(0)

  // Tangri 4-variable linear predictor
  const lp =
    -0.2201 * (age / 10.0 - 7.036) +
    0.2467 * (maleFlag - 0.5642) -
    0.5567 * (egfr / 5.0 - 7.222) +
    0.451 * (Math.log(safeUacr) - 5.137);

  // Non-North American baseline survival parameters
  const s0_2yr = 0.9832;
  const s0_5yr = 0.9365;

  const expLp = Math.exp(lp);
  const risk2Yr = 1.0 - Math.pow(s0_2yr, expLp);
  const risk5Yr = 1.0 - Math.pow(s0_5yr, expLp);

  return {
    risk2Yr: Math.min(Math.max(risk2Yr, 0.001), 0.999),
    risk5Yr: Math.min(Math.max(risk5Yr, 0.001), 0.999),
  };
}

/**
 * KDIGO 2024 Staging & Risk Heatmap Matrix
 */
export function determineKdigoClassification(
  egfr: number,
  uacr: number
): {
  gStage: 'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5';
  aStage: 'A1' | 'A2' | 'A3';
  tier: KdigoRiskTier;
} {
  let gStage: 'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5';
  if (egfr >= 90) gStage = 'G1';
  else if (egfr >= 60) gStage = 'G2';
  else if (egfr >= 45) gStage = 'G3a';
  else if (egfr >= 30) gStage = 'G3b';
  else if (egfr >= 15) gStage = 'G4';
  else gStage = 'G5';

  let aStage: 'A1' | 'A2' | 'A3';
  if (uacr < 30) aStage = 'A1';
  else if (uacr <= 300) aStage = 'A2';
  else aStage = 'A3';

  // KDIGO 2024 Risk Heatmap categorization
  let tier: KdigoRiskTier = 'low';

  if (gStage === 'G1' || gStage === 'G2') {
    if (aStage === 'A1') tier = 'low';
    else if (aStage === 'A2') tier = 'moderate';
    else tier = 'high';
  } else if (gStage === 'G3a') {
    if (aStage === 'A1') tier = 'moderate';
    else if (aStage === 'A2') tier = 'high';
    else tier = 'very_high';
  } else if (gStage === 'G3b') {
    if (aStage === 'A1') tier = 'high';
    else tier = 'very_high';
  } else {
    // G4 or G5
    tier = 'very_high';
  }

  return { gStage, aStage, tier };
}

/**
 * Generate 1-Click Guideline-Directed Medical Therapy (GDMT) Order Set
 */
export function generateGdmtPlan(
  patient: RawPatient,
  currentEgfr: number,
  slopeAnnual: number,
  tier: KdigoRiskTier
): GdmtRecommendation {
  const eligibleForSglt2i =
    currentEgfr >= 20 && (patient.has_diabetes || patient.uacr >= 150 || slopeAnnual <= -3.0);

  const eligibleForArb =
    (patient.has_hypertension || patient.uacr >= 30) && currentEgfr >= 15;

  const actionRequired = (eligibleForSglt2i || eligibleForArb) && tier !== 'low';

  return {
    eligibleForSglt2i,
    sglt2iDrug: 'Dapagliflozin (or Empagliflozin)',
    sglt2iDose: '10 mg once daily orally',
    sglt2iRationale:
      'KDIGO 2024 Class 1A recommendation: Delays kidney disease progression by ~35-40% and reduces cardiovascular mortality.',
    eligibleForArb,
    arbDrug: 'Telmisartan (or Losartan)',
    arbDose: '40 mg once daily orally',
    arbRationale:
      'First-line renal hemodynamics: reduces intraglomerular pressure and proteinuria.',
    hemodynamicDipReassurance:
      'KDIGO Clinical Safeguard: Expect an initial 10-20% eGFR reduction at 4 weeks. This reflects beneficial drop in intraglomerular hypertension and confirms nephron protection. Do NOT discontinue.',
    monitoringPlan:
      'Schedule 4-week automated safety lab order: Serum Potassium + Creatinine.',
    actionRequired,
  };
}

/**
 * Comprehensive Patient Analyzer
 */
export function analyzePatient(raw: RawPatient): AnalyzedPatient {
  const { points, slopeAnnual } = calculateTrajectoryAndSlope(
    raw.creatinine_history,
    raw.age,
    raw.sex
  );

  const currentPoint = points[points.length - 1];
  const baselinePoint = points[0];

  const currentEgfr = currentPoint
    ? currentPoint.egfr
    : calculateCkdEpi2021(raw.creatinine_history[0]?.serum_creatinine ?? 1.0, raw.age, raw.sex);

  const baselineEgfr = baselinePoint ? baselinePoint.egfr : currentEgfr;

  const isRapidProgressor = slopeAnnual <= -3.0;

  const { risk2Yr, risk5Yr } = calculateKfre(raw.age, raw.sex, currentEgfr, raw.uacr);

  const { gStage, aStage, tier } = determineKdigoClassification(currentEgfr, raw.uacr);

  // Projected years to dialysis (eGFR < 15 mL/min/1.73m²)
  let projectedYearsToDialysis: number | null = null;
  if (slopeAnnual < -0.5 && currentEgfr > 15) {
    const remainingGfr = currentEgfr - 15;
    projectedYearsToDialysis = Math.round((remainingGfr / Math.abs(slopeAnnual)) * 10) / 10;
  }

  const gdmt = generateGdmtPlan(raw, currentEgfr, slopeAnnual, tier);

  return {
    ...raw,
    currentEgfr,
    baselineEgfr,
    egfrSlopeAnnual: slopeAnnual,
    isRapidProgressor,
    kfre2YearPercent: risk2Yr,
    kfre5YearPercent: risk5Yr,
    kdigoTier: tier,
    kdigoGStage: gStage,
    kdigoAStage: aStage,
    trajectoryPoints: points,
    projectedYearsToDialysis,
    gdmt,
  };
}
