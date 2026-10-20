import { useState } from 'react';
import { usePatients } from '../../../entities/patient/api/usePatients';
import { AnalyzedPatient } from '../../../entities/patient/model/types';
import { PopulationKpiSummary } from '../../../widgets/population-kpi-summary/ui/PopulationKpiSummary';
import { PatientTriageTable } from '../../../widgets/patient-triage-table/ui/PatientTriageTable';
import { WhatsAppSimulator } from '../../../widgets/whatsapp-simulator/ui/WhatsAppSimulator';
import { ShieldCheck, Sparkles, X } from 'lucide-react';

export function DashboardPage() {
  const { data: patients, isLoading, error } = usePatients();
  const [selectedPatient, setSelectedPatient] = useState<AnalyzedPatient | null>(null);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-500">
            Ingesting primary care lab records & computing eGFR slopes...
          </p>
        </div>
      </div>
    );
  }

  if (error || !patients) {
    return (
      <div className="p-8 text-center text-rose-600 text-sm">
        Failed to load patient cohort.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Track & Vision Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              Future Health Challenge • Track 2: Population Health
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Cardiorenal Early Interception Command Center
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Converting routine, latent primary care creatinine and dipstick tests into automated eGFR trajectory alerts, 1-click organ-protective therapy (GDMT), and behavioral patient activation.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10 shrink-0">
            <ShieldCheck className="h-8 w-8 text-emerald-400" />
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Clinical Standard
              </span>
              <span className="text-xs font-bold text-white">KDIGO 2024 / Tangri KFRE</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <PopulationKpiSummary patients={patients} />

      {/* Triage Registry Table */}
      <PatientTriageTable
        patients={patients}
        onOpenOutreach={(p) => setSelectedPatient(p)}
      />

      {/* WhatsApp Outreach Drawer / Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedPatient(null)}
              className="absolute -top-3 -right-3 z-10 h-8 w-8 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-lg hover:bg-slate-700 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <WhatsAppSimulator patient={selectedPatient} />
          </div>
        </div>
      )}
    </div>
  );
}
