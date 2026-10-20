import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePatient } from '../../../entities/patient/api/usePatients';
import { EgfrTrajectoryChart } from '../../../widgets/egfr-trajectory-chart/ui/EgfrTrajectoryChart';
import { GdmtPrescriptionCard } from '../../../widgets/gdmt-prescription-card/ui/GdmtPrescriptionCard';
import { KdigoHeatmap } from '../../../widgets/kdigo-heatmap/ui/KdigoHeatmap';
import { WhatsAppSimulator } from '../../../widgets/whatsapp-simulator/ui/WhatsAppSimulator';
import { Button } from '../../../shared/ui/button';
import { Card, CardContent } from '../../../shared/ui/card';
import { ROUTES } from '../../../shared/config/routes';
import { formatRiskPercent } from '../../../shared/lib/formatters';
import { ChevronLeft, HeartPulse, UserCheck, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { patient, isLoading } = usePatient(id ?? '');
  const [showOutreachSimulator, setShowOutreachSimulator] = useState(true);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-500">Loading patient cardiorenal profile...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-base font-bold text-slate-800">Patient Record Not Found</p>
        <Link to={ROUTES.HOME}>
          <Button variant="outline" shape="rounded" size="sm">Back to Triage Registry</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* 1. Top Breadcrumb & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-1">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Triage Registry</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            {patient.patient_id}
          </span>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            Primary Care Surveillance
          </span>
        </div>
      </div>

      {/* 2. Patient Profile Dossier Card (Bulletproof Responsive Layout) */}
      <Card className="border border-slate-200/80 shadow-xs overflow-hidden">
        <CardContent className="p-4 sm:p-6 space-y-5">
          {/* Top Row: Demographics & Clinical Baseline */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Identity & Tags */}
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-12 w-12 sm:h-13 sm:w-13 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg sm:text-xl shadow-xs shrink-0">
                {patient.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {patient.name}
                  </h1>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/60 shrink-0">
                    {patient.age}y • {patient.sex.toUpperCase()}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200/70 inline-flex items-center gap-1 shrink-0">
                    <UserCheck className="h-3 w-3" /> Active Surveillance
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                  Record ID: {patient.patient_id} • Puskesmas Cohort Surveillance
                </p>
              </div>
            </div>

            {/* Baseline Comorbidities & Vitals Badges (Isolated self-contained chips, zero orphaned dots) */}
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-700 font-medium">
                <HeartPulse className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                <span className="text-slate-500">BP:</span>
                <strong className="font-mono text-slate-900">{Math.round(patient.systolic_bp)}/{Math.round(patient.diastolic_bp)} mmHg</strong>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-700 font-medium">
                <span className="text-slate-500">Diabetes:</span>
                <strong className="text-slate-900">{patient.has_diabetes ? 'Type 2' : 'None'}</strong>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-700 font-medium">
                <span className="text-slate-500">HTN:</span>
                <strong className="text-slate-900">{patient.has_hypertension ? 'Confirmed' : 'None'}</strong>
              </div>
            </div>
          </div>

          {/* Clean Divider */}
          <div className="border-t border-slate-100" />

          {/* Bottom Row: 4 Balanced Full-Width Stat Cards (grid-cols-2 on mobile, grid-cols-4 on desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Current eGFR */}
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Current eGFR
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
                  {patient.currentEgfr.toFixed(1)}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">mL/min/1.73m²</span>
              </div>
              <span className="text-[11px] text-slate-600 font-medium mt-1 inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                Stage {patient.kdigoGStage}
              </span>
            </div>

            {/* 2. Annual eGFR Slope */}
            <div className="p-3.5 rounded-xl bg-rose-50/20 border border-rose-200/80 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider">
                eGFR Slope
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span
                  className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${
                    patient.egfrSlopeAnnual <= -3.0 ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  {patient.egfrSlopeAnnual > 0 ? '+' : ''}{patient.egfrSlopeAnnual.toFixed(1)}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">mL/min/yr</span>
              </div>
              <span className="text-[11px] font-bold text-rose-600 mt-1 inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                {patient.isRapidProgressor ? 'Rapid Decline (≤ -3.0)' : 'Typical Decline'}
              </span>
            </div>

            {/* 3. uACR Albumin */}
            <div className="p-3.5 rounded-xl bg-amber-50/20 border border-amber-200/80 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">
                uACR Albumin
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl sm:text-2xl font-black text-amber-700 font-mono tracking-tight">
                  {patient.uacr.toFixed(0)}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">mg/g</span>
              </div>
              <span className="text-[11px] text-amber-800 font-medium mt-1 inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Stage {patient.kdigoAStage} (Microleak)
              </span>
            </div>

            {/* 4. 5-Yr Dialysis Risk */}
            <div className="p-3.5 rounded-xl bg-rose-50/20 border border-rose-200/80 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider">
                5-Yr Dialysis Risk
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl sm:text-2xl font-black text-rose-600 font-mono tracking-tight">
                  {formatRiskPercent(patient.kfre5YearPercent)}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium mt-1 inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                Tangri 4-Variable KFRE
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Main Grid: Trajectory & GDMT Order Set */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (7 cols): Trajectory Chart + KDIGO Staging */}
        <div className="lg:col-span-7 space-y-5">
          <EgfrTrajectoryChart patient={patient} />
          <KdigoHeatmap patient={patient} />
        </div>

        {/* Right Column (5 cols): GDMT Prescribing Card + WhatsApp Activation */}
        <div className="lg:col-span-5 space-y-5">
          <GdmtPrescriptionCard patient={patient} />

          {/* Patient Activation Channel */}
          <Card className="border border-slate-200/80 shadow-xs">
            <CardContent className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                      Patient Activation Channel
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Asynchronous WhatsApp engagement to secure follow-up
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  shape="rounded"
                  onClick={() => setShowOutreachSimulator(!showOutreachSimulator)}
                  className="h-7 px-2 text-xs text-slate-500 hover:text-slate-900 gap-1"
                >
                  <span>{showOutreachSimulator ? 'Collapse' : 'Expand'}</span>
                  {showOutreachSimulator ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </Button>
              </div>

              {showOutreachSimulator && (
                <div className="pt-1">
                  <WhatsAppSimulator patient={patient} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
