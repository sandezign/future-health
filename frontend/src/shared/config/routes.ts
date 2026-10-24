export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/',
  PATIENTS: '/patients',
  PATIENT_DETAIL: (id: string = ':id') => `/patients/${id}`,
  SIMULATOR: '/simulator',
  ECONOMICS: '/economics',
  // GENO-BRIDGE Routes (Challenge 03 - Inherited Disease Risk)
  GENO_CITIZEN: '/geno-bridge/citizen',
  GENO_COUNSELOR: '/geno-bridge/counselor',
} as const;
