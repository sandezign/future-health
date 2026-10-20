import { useQuery } from '@tanstack/react-query';
import { RawPatient, AnalyzedPatient } from '../model/types';
import { analyzePatient } from '../../cardiorenal/model/calculator';

// Embed a representative cohort of 12 rich clinical vignettes for instant, zero-latency standalone execution
export const INITIAL_MOCK_PATIENTS: RawPatient[] = [
  {
    patient_id: 'PT-1001',
    name: 'Budi Santoso',
    age: 54,
    sex: 'male',
    has_diabetes: true,
    has_hypertension: true,
    systolic_bp: 148,
    diastolic_bp: 92,
    uacr: 245.0,
    dipstick_protein: '2+',
    creatinine_history: [
      { timestamp: '2024-04-15T00:00:00Z', serum_creatinine: 1.1 },
      { timestamp: '2024-12-10T00:00:00Z', serum_creatinine: 1.25 },
      { timestamp: '2025-08-05T00:00:00Z', serum_creatinine: 1.42 },
      { timestamp: '2026-03-20T00:00:00Z', serum_creatinine: 1.62 },
    ],
  },
  {
    patient_id: 'PT-1002',
    name: 'Siti Rahmawati',
    age: 48,
    sex: 'female',
    has_diabetes: true,
    has_hypertension: false,
    systolic_bp: 134,
    diastolic_bp: 84,
    uacr: 88.0,
    dipstick_protein: '1+',
    creatinine_history: [
      { timestamp: '2024-05-10T00:00:00Z', serum_creatinine: 0.85 },
      { timestamp: '2025-01-12T00:00:00Z', serum_creatinine: 0.95 },
      { timestamp: '2025-09-18T00:00:00Z', serum_creatinine: 1.08 },
      { timestamp: '2026-04-02T00:00:00Z', serum_creatinine: 1.2 },
    ],
  },
  {
    patient_id: 'PT-1003',
    name: 'Agus Wijaya',
    age: 62,
    sex: 'male',
    has_diabetes: true,
    has_hypertension: true,
    systolic_bp: 168,
    diastolic_bp: 102,
    uacr: 650.0,
    dipstick_protein: '3+',
    creatinine_history: [
      { timestamp: '2024-03-01T00:00:00Z', serum_creatinine: 1.4 },
      { timestamp: '2024-11-15T00:00:00Z', serum_creatinine: 1.65 },
      { timestamp: '2025-07-20T00:00:00Z', serum_creatinine: 1.95 },
      { timestamp: '2026-03-15T00:00:00Z', serum_creatinine: 2.35 },
    ],
  },
  {
    patient_id: 'PT-1004',
    name: 'Dewi Lestari',
    age: 59,
    sex: 'female',
    has_diabetes: false,
    has_hypertension: true,
    systolic_bp: 142,
    diastolic_bp: 88,
    uacr: 45.0,
    dipstick_protein: 'trace',
    creatinine_history: [
      { timestamp: '2024-06-01T00:00:00Z', serum_creatinine: 0.9 },
      { timestamp: '2025-02-15T00:00:00Z', serum_creatinine: 0.94 },
      { timestamp: '2025-10-01T00:00:00Z', serum_creatinine: 0.98 },
      { timestamp: '2026-04-10T00:00:00Z', serum_creatinine: 1.02 },
    ],
  },
  {
    patient_id: 'PT-1005',
    name: 'Hendro Prasetyo',
    age: 46,
    sex: 'male',
    has_diabetes: false,
    has_hypertension: false,
    systolic_bp: 122,
    diastolic_bp: 78,
    uacr: 12.0,
    dipstick_protein: 'negative',
    creatinine_history: [
      { timestamp: '2024-04-01T00:00:00Z', serum_creatinine: 0.85 },
      { timestamp: '2025-01-05T00:00:00Z', serum_creatinine: 0.86 },
      { timestamp: '2025-09-12T00:00:00Z', serum_creatinine: 0.88 },
      { timestamp: '2026-03-30T00:00:00Z', serum_creatinine: 0.87 },
    ],
  },
  {
    patient_id: 'PT-1006',
    name: 'Ratna Kusuma',
    age: 51,
    sex: 'female',
    has_diabetes: true,
    has_hypertension: true,
    systolic_bp: 152,
    diastolic_bp: 94,
    uacr: 180.0,
    dipstick_protein: '1+',
    creatinine_history: [
      { timestamp: '2024-05-15T00:00:00Z', serum_creatinine: 1.0 },
      { timestamp: '2025-01-20T00:00:00Z', serum_creatinine: 1.15 },
      { timestamp: '2025-09-10T00:00:00Z', serum_creatinine: 1.3 },
      { timestamp: '2026-04-01T00:00:00Z', serum_creatinine: 1.48 },
    ],
  },
];

export function usePatients() {
  return useQuery({
    queryKey: ['patients'],
    queryFn: async (): Promise<AnalyzedPatient[]> => {
      // In production or when backend is up, fetch from API:
      // const res = await fetch('/api/patients'); return res.json();
      return INITIAL_MOCK_PATIENTS.map((p) => analyzePatient(p));
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function usePatient(id: string) {
  const { data: patients, isLoading, error } = usePatients();
  const patient = patients?.find((p) => p.patient_id === id) ?? null;

  return { patient, isLoading, error };
}
