import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import { Header } from '../widgets/header/ui/Header';
import { DashboardPage } from '../pages/dashboard/ui/DashboardPage';
import { PatientDetailPage } from '../pages/patient-detail/ui/PatientDetailPage';
import { OutreachSimulatorPage } from '../pages/outreach-simulator/ui/OutreachSimulatorPage';
import { GenoCitizenPage } from '../pages/geno-citizen/ui/GenoCitizenPage';
import { GenoCounselorPage } from '../pages/geno-counselor/ui/GenoCounselorPage';
import { ROUTES } from '../shared/config/routes';

export function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-canvas text-text-primary flex flex-col font-sans">
          <Header />
          <main className="flex-1 w-full">
            <Routes>
              {/* RENAL-PULSE Routes */}
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
              <Route path="/patients" element={<DashboardPage />} />
              <Route path={ROUTES.PATIENT_DETAIL(':id')} element={<PatientDetailPage />} />
              <Route path={ROUTES.SIMULATOR} element={<OutreachSimulatorPage />} />

              {/* GENO-BRIDGE Routes (Challenge 03: Preconception Genomics) */}
              <Route path={ROUTES.GENO_CITIZEN} element={<GenoCitizenPage />} />
              <Route path={ROUTES.GENO_COUNSELOR} element={<GenoCounselorPage />} />

              {/* Default Fallback */}
              <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            </Routes>
          </main>

          <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900">FUTURE HEALTH PLATFORM</span>
                <span>•</span>
                <span>Abu Dhabi Global Digital Innovation Challenge 2026</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span>Dual Solutions: RENAL-PULSE (KDIGO 2024) & GENO-BRIDGE (ACMG / ADPHC 570-Gene)</span>
                <span>•</span>
                <a
                  href="/design-system.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-semibold hover:underline"
                >
                  Design System
                </a>
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </QueryProvider>
  );
}
