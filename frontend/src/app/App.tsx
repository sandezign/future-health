import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import { Header } from '../widgets/header/ui/Header';
import { DashboardPage } from '../pages/dashboard/ui/DashboardPage';
import { PatientDetailPage } from '../pages/patient-detail/ui/PatientDetailPage';
import { OutreachSimulatorPage } from '../pages/outreach-simulator/ui/OutreachSimulatorPage';
import { ROUTES } from '../shared/config/routes';

export function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-canvas text-text-primary flex flex-col font-sans">
          <Header />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <Routes>
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
              <Route path="/patients" element={<DashboardPage />} />
              <Route path={ROUTES.PATIENT_DETAIL(':id')} element={<PatientDetailPage />} />
              <Route path={ROUTES.SIMULATOR} element={<OutreachSimulatorPage />} />
              <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            </Routes>
          </main>

          <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900">RENAL-PULSE</span>
                <span>•</span>
                <span>Future Health Digital Innovation Challenge 2026</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span>Grounded in KDIGO 2024 Clinical Practice Guidelines & Tangri KFRE (JAMA 2016)</span>
                <span>•</span>
                <a
                  href="/design-system.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  HTML Design System
                </a>
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;
