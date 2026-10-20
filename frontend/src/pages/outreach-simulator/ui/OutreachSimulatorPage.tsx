import { useState } from 'react';
import { usePatients } from '../../../entities/patient/api/usePatients';
import { WhatsAppSimulator } from '../../../widgets/whatsapp-simulator/ui/WhatsAppSimulator';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/ui/card';
import { Badge } from '../../../shared/ui/badge';
import { MessageSquare, Users, Sparkles, Brain, CheckCircle2 } from 'lucide-react';
import { formatSlope } from '../../../shared/lib/formatters';

export function OutreachSimulatorPage() {
  const { data: patients, isLoading } = usePatients();
  const [selectedId, setSelectedId] = useState<string>('PT-1001');

  if (isLoading || !patients) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  const currentPatient = patients.find((p) => p.patient_id === selectedId) ?? patients[0]!;

  return (
    <div className="space-y-6">
      {/* Mediora-Styled Header Banner */}
      <div className="relative rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-white to-indigo-50/40 p-6 sm:p-7 shadow-[0_1px_3px_0_rgba(0,0,0,0.04),0_6px_16px_-4px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Behavioral Activation Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Conversational WhatsApp Outreach Simulator
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Demonstrating how automated, culturally adapted WhatsApp dialogues defeat the asymptomatic &ldquo;silent killer&rdquo; denial, demystify filtration damage, and convert ignored risk signals into clinic attendance.
            </p>
          </div>

          <div className="bg-white/90 p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3 shrink-0">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div className="text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Channel Integration</span>
              <span className="font-bold text-slate-900">Meta WhatsApp Cloud API</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side (7 cols): Behavioral Science Context & Patient Selector */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100/80">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-600" />
                Select Patient Vignette for Simulation
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <label className="text-xs font-semibold text-slate-600 block">
                Choose a patient from the primary care triage registry:
              </label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
              >
                {patients.map((p) => (
                  <option key={p.patient_id} value={p.patient_id}>
                    {p.name} ({p.patient_id}) — {p.age}y, Slope: {formatSlope(p.egfrSlopeAnnual)}, KDIGO: {p.kdigoTier.toUpperCase()}
                  </option>
                ))}
              </select>

              <div className="mt-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{currentPatient.name}</span>
                  <Badge variant={currentPatient.isRapidProgressor ? 'rapid' : 'secondary'}>
                    {currentPatient.isRapidProgressor ? 'Rapid Decliner' : 'Moderate Progression'}
                  </Badge>
                </div>
                <div className="text-xs text-slate-600 grid grid-cols-2 gap-2 pt-1 font-mono">
                  <div>Current eGFR: <strong className="text-slate-900">{currentPatient.currentEgfr} mL/min</strong></div>
                  <div>eGFR Slope: <strong className="text-slate-900">{formatSlope(currentPatient.egfrSlopeAnnual)}</strong></div>
                  <div>uACR: <strong className="text-slate-900">{currentPatient.uacr} mg/g</strong></div>
                  <div>5-Yr Dialysis: <strong className="text-slate-900">{(currentPatient.kfre5YearPercent * 100).toFixed(1)}%</strong></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Behavioral Science Principles Card */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100/80">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Brain className="h-4 w-4 text-indigo-600" />
                Behavioral Architecture: Overcoming the &ldquo;Asymptomatic Trap&rdquo;
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-xs text-slate-600 leading-relaxed">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">The Perception Problem (Silent Damage)</h4>
                  <p className="mt-0.5 text-slate-500">
                    70–80% of patients flagged with moderate-to-high chronic kidney risk never attend clinic follow-ups because they feel physically healthy. Merely stating that &ldquo;creatinine is elevated&rdquo; fails to trigger action.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">The Cognitive Reframing (Kitchen Filter Analogy)</h4>
                  <p className="mt-0.5 text-slate-500">
                    RENAL-PULSE uses an audio note explaining the kidney as a delicate filter. Just as water keeps flowing through a straining filter before tearing permanently, kidneys mask damage until it is too late.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Frictionless 1-Click Action Loop</h4>
                  <p className="mt-0.5 text-slate-500">
                    Rather than telling patients to &ldquo;call the clinic,&rdquo; the bot offers a single button to confirm a dedicated 10-minute checkup with their pre-loaded GDMT order set.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-emerald-900 flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span className="font-medium text-[11px] leading-relaxed">
                  Real-world trials show conversational WhatsApp reminders increase primary care chronic disease attendance by <strong>28% to 42%</strong> (Lancet Digital Health 2022).
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side (5 cols): Live WhatsApp Interactive Simulation */}
        <div className="lg:col-span-5 flex justify-center">
          <WhatsAppSimulator patient={currentPatient} />
        </div>
      </div>
    </div>
  );
}
