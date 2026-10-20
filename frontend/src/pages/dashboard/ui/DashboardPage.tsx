import { useState } from 'react';
import { usePatients } from '../../../entities/patient/api/usePatients';
import { AnalyzedPatient } from '../../../entities/patient/model/types';
import { PopulationKpiSummary } from '../../../widgets/population-kpi-summary/ui/PopulationKpiSummary';
import { PatientTriageTable, TriageFilterType } from '../../../widgets/patient-triage-table/ui/PatientTriageTable';
import { WhatsAppSimulator } from '../../../widgets/whatsapp-simulator/ui/WhatsAppSimulator';
import { Modal } from '../../../shared/ui/modal';
import { Button } from '../../../shared/ui/button';
import { ShieldCheck, ArrowRight, MessageSquare, AlertTriangle, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../shared/config/routes';

export function DashboardPage() {
  const { data: patients, isLoading, error } = usePatients();
  const [selectedPatient, setSelectedPatient] = useState<AnalyzedPatient | null>(null);
  const [tableFilter, setTableFilter] = useState<TriageFilterType>('all');

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-500">
            Ingesting primary care lab records & computing eGFR slopes...
          </p>
        </div>
      </div>
    );
  }

  if (error || !patients) {
    return (
      <div className="p-8 text-center text-rose-600 text-sm font-semibold">
        Failed to load patient cohort.
      </div>
    );
  }

  const rapidDeclinersCount = patients.filter((p) => p.isRapidProgressor).length;
  const highRiskCount = patients.filter((p) => p.kdigoTier === 'high' || p.kdigoTier === 'very_high').length;

  return (
    <div className="space-y-5">
      {/* 1. Header Toolbar (Replaces 260px Marketing Hero) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Cardiorenal Upstream Surveillance
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Latent primary care lab trajectory interception • CKD-EPI 2021 eGFR slopes & Tangri KFRE 5-year ESKD risk
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200/80 text-[11px] font-semibold text-slate-700 shadow-2xs">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>KDIGO 2024 / Tangri KFRE</span>
          </div>

          <Link to={ROUTES.SIMULATOR}>
            <Button
              size="sm"
              variant="outline"
              shape="rounded"
              className="h-8 px-3 text-xs font-semibold gap-1.5 rounded-lg border-slate-200 hover:border-slate-300 shadow-2xs"
            >
              <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
              <span>Outreach Simulator</span>
              <ArrowRight className="h-3 w-3 text-slate-400" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Actionable Surveillance Alert Strip */}
      {rapidDeclinersCount > 0 && (
        <div className="rounded-xl border border-rose-200/90 bg-rose-50/50 p-3 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-rose-100/90 text-rose-700 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-rose-900">
                  {rapidDeclinersCount} patients flagged with rapid eGFR decline (slope &le; -3.0 mL/min/yr)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-rose-200/70 text-rose-800">
                  {highRiskCount} qualify for 1-Click GDMT initiation
                </span>
              </div>
              <p className="text-[11px] text-rose-700/90 mt-0.5">
                Upstream interception recommended to delay ESKD dialysis transition per KDIGO 2024 guidelines.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant={tableFilter === 'rapid' ? 'secondary' : 'outline'}
              shape="rounded"
              onClick={() => setTableFilter(tableFilter === 'rapid' ? 'all' : 'rapid')}
              className="h-7 px-2.5 text-[11px] font-semibold gap-1 rounded-lg border-rose-200 bg-white hover:bg-rose-50 text-rose-800"
            >
              <Filter className="h-3 w-3" />
              <span>{tableFilter === 'rapid' ? 'Show All Cohort' : `Filter ${rapidDeclinersCount} Rapid Decliners`}</span>
            </Button>
          </div>
        </div>
      )}

      {/* 3. High-Density Population Health KPI Cards */}
      <PopulationKpiSummary patients={patients} />

      {/* 4. Triage Registry Table */}
      <PatientTriageTable
        patients={patients}
        activeFilter={tableFilter}
        onFilterChange={setTableFilter}
        onOpenOutreach={(p) => setSelectedPatient(p)}
      />

      {/* WhatsApp Outreach Modal via reusable Modal Primitive */}
      <Modal
        isOpen={selectedPatient !== null}
        onClose={() => setSelectedPatient(null)}
        title={selectedPatient ? `WhatsApp Outreach • ${selectedPatient.name}` : ''}
        description="Culturally tailored asynchronous patient engagement to secure clinic follow-up"
        maxWidth="md"
      >
        {selectedPatient && <WhatsAppSimulator patient={selectedPatient} />}
      </Modal>
    </div>
  );
}
