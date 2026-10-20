import { useParams, Link } from 'react-router-dom';
import { usePatient } from '../../../entities/patient/api/usePatients';
import { EgfrTrajectoryChart } from '../../../widgets/egfr-trajectory-chart/ui/EgfrTrajectoryChart';
import { GdmtPrescriptionCard } from '../../../widgets/gdmt-prescription-card/ui/GdmtPrescriptionCard';
import { KdigoHeatmap } from '../../../widgets/kdigo-heatmap/ui/KdigoHeatmap';
import { WhatsAppSimulator } from '../../../widgets/whatsapp-simulator/ui/WhatsAppSimulator';
import { Badge } from '../../../shared/ui/badge';
import { Button } from '../../../shared/ui/button';
import { Card, CardContent } from '../../../shared/ui/card';
import { ROUTES } from '../../../shared/config/routes';
import { formatEgfr, formatSlope, formatBP, formatRiskPercent } from '../../../shared/lib/formatters';
import { ChevronLeft, HeartPulse, Stethoscope } from 'lucide-react';

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { patient, isLoading } = usePatient(id ?? '');

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-base font-bold text-slate-800">Patient Record Not Found</p>
        <Link to={ROUTES.HOME}>
          <Button variant="outline">Back to Triage Registry</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Triage Registry
        </Link>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono font-bold">
            {patient.patient_id}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Puskesmas Primary Care ID
          </Badge>
        </div>
      </div>

      {/* Patient Profile Banner */}
      <Card className="bg-slate-900 text-white border-0 shadow-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md">
                {patient.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black text-white">{patient.name}</h1>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                    {patient.age}y • {patient.sex.toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <HeartPulse className="h-3.5 w-3.5 text-rose-400" />
                    BP: <strong>{formatBP(patient.systolic_bp, patient.diastolic_bp)}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Diabetes: <strong>{patient.has_diabetes ? 'Type 2' : 'None'}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Hypertension: <strong>{patient.has_hypertension ? 'Yes' : 'No'}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Critical Cardiorenal Metrics Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <div className="text-center sm:text-left px-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Current eGFR
                </span>
                <span className="text-base font-extrabold text-white font-mono">
                  {formatEgfr(patient.currentEgfr)}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  Stage {patient.kdigoGStage}
                </span>
              </div>

              <div className="text-center sm:text-left px-2 border-l border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  eGFR Slope
                </span>
                <span
                  className={`text-base font-extrabold font-mono ${
                    patient.egfrSlopeAnnual <= -3.0 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {formatSlope(patient.egfrSlopeAnnual)}
                </span>
                {patient.isRapidProgressor && (
                  <span className="text-[10px] font-bold text-rose-400 block">
                    Rapid Decline
                  </span>
                )}
              </div>

              <div className="text-center sm:text-left px-2 border-l border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  uACR (Albumin)
                </span>
                <span className="text-base font-extrabold text-amber-300 font-mono">
                  {patient.uacr.toFixed(0)} mg/g
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {patient.kdigoAStage}
                </span>
              </div>

              <div className="text-center sm:text-left px-2 border-l border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  5-Yr Dialysis Risk
                </span>
                <span className="text-base font-extrabold text-rose-300 font-mono">
                  {formatRiskPercent(patient.kfre5YearPercent)}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Tangri KFRE
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid: Trajectory & GDMT Order Set */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Trajectory Chart + KDIGO Staging */}
        <div className="lg:col-span-8 space-y-6">
          <EgfrTrajectoryChart patient={patient} />
          <KdigoHeatmap patient={patient} />
        </div>

        {/* Right Column (4 cols): GDMT Prescribing Card + WhatsApp Activation */}
        <div className="lg:col-span-4 space-y-6">
          <GdmtPrescriptionCard patient={patient} />

          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Patient Communication Status
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Asymptomatic patients frequently skip follow-up visits. RENAL-PULSE automates conversational WhatsApp outreach to secure appointment booking.
              </p>
              <WhatsAppSimulator patient={patient} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
