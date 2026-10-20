import { describe, it, expect } from 'vitest';
import {
  calculateCkdEpi2021,
  calculateTrajectoryAndSlope,
  calculateKfre,
  determineKdigoClassification,
  generateGdmtPlan,
} from './calculator';

describe('Cardiorenal Clinical Formulas (KDIGO 2024 & JAMA 2016)', () => {
  it('calculates CKD-EPI 2021 correctly for standard female and male profiles', () => {
    // 50yo male, creatinine 1.0 mg/dL -> expected eGFR ~94 mL/min/1.73m²
    const maleEgfr = calculateCkdEpi2021(1.0, 50, 'male');
    expect(maleEgfr).toBeGreaterThan(90);
    expect(maleEgfr).toBeLessThan(100);

    // 60yo female, creatinine 1.4 mg/dL -> expected eGFR ~40-45 mL/min/1.73m² (Stage G3b)
    const femaleEgfr = calculateCkdEpi2021(1.4, 60, 'female');
    expect(femaleEgfr).toBeGreaterThan(38);
    expect(femaleEgfr).toBeLessThan(48);
  });

  it('calculates OLS eGFR slope correctly and flags rapid decline', () => {
    const history = [
      { timestamp: '2024-01-01T00:00:00Z', serum_creatinine: 1.0 },
      { timestamp: '2025-01-01T00:00:00Z', serum_creatinine: 1.25 },
      { timestamp: '2026-01-01T00:00:00Z', serum_creatinine: 1.55 },
    ];

    const { slopeAnnual } = calculateTrajectoryAndSlope(history, 55, 'male');
    // Creatinine went from 1.0 to 1.55 in 2 years, eGFR drops significantly
    expect(slopeAnnual).toBeLessThan(-3.0); // rapid decliner threshold
  });

  it('calculates KFRE 4-variable risk correctly', () => {
    // 65yo male, eGFR 35, uACR 450 mg/g -> high 5-year dialysis risk
    const { risk2Yr, risk5Yr } = calculateKfre(65, 'male', 35, 450);
    expect(risk5Yr).toBeGreaterThan(0.05); // > 5% risk
    expect(risk5Yr).toBeGreaterThan(risk2Yr);
  });

  it('classifies KDIGO 2024 matrix correctly', () => {
    // eGFR 40 (G3b), uACR 250 (A2) -> Very High Risk (Red)
    const classification = determineKdigoClassification(40, 250);
    expect(classification.gStage).toBe('G3b');
    expect(classification.aStage).toBe('A2');
    expect(classification.tier).toBe('very_high');
  });

  it('generates 1-click GDMT recommendation including SGLT2i and ARB', () => {
    const mockRawPatient = {
      patient_id: 'TEST-01',
      name: 'Test Patient',
      age: 55,
      sex: 'male' as const,
      has_diabetes: true,
      has_hypertension: true,
      systolic_bp: 145,
      diastolic_bp: 90,
      uacr: 200,
      dipstick_protein: '2+' as const,
      creatinine_history: [{ timestamp: '2025-01-01T00:00:00Z', serum_creatinine: 1.3 }],
    };

    const gdmt = generateGdmtPlan(mockRawPatient, 52, -4.0, 'high');
    expect(gdmt.eligibleForSglt2i).toBe(true);
    expect(gdmt.sglt2iDrug).toContain('Dapagliflozin');
    expect(gdmt.eligibleForArb).toBe(true);
    expect(gdmt.hemodynamicDipReassurance).toContain('initial 10-20% eGFR reduction');
  });
});
