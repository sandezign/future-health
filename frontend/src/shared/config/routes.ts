export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/',
  PATIENTS: '/patients',
  PATIENT_DETAIL: (id: string = ':id') => `/patients/${id}`,
  SIMULATOR: '/simulator',
  ECONOMICS: '/economics',
} as const;
