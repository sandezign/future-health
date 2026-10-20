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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  const currentPatient = patients.find((p) => p.patient_id === selectedId) ?? patients[0]!;

  return (
    <div className="space-y-6">
      {/* Page Title Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-900 to-slate-900 p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <Badge variant="green" className="bg-emerald-400/20 text-emerald-200 border-emerald-400/30">
              <Sparkles className="h-3 w-3" />
              Behavioral Intervention Layer
            </Badge>
            <h1 className="text-2xl font-black text-white sm:text-3xl">
              Conversational WhatsApp Outreach Simulator
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Demonstrating how automated, culturally adapted WhatsApp dialogues defeat the asymptomatic &ldquo;silent killer&rdquo; denial, demystify filtration damage, and convert ignored risk signals into clinic attendance.
            </p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/15 flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-emerald-400" />
            <div className="text-xs">
              <span className="text-slate-300 block text-[10px] uppercase font-bold">Channel</span>
              <span className="font-bold text-white">Meta WhatsApp Cloud API</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side (7 cols): Behavioral Science Context & Patient Selector */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-600" />
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
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {patients.map((p) => (
                  <option key={p.patient_id} value={p.patient_id}>
                    {p.name} ({p.patient_id}) — {p.age}y, Slope: {formatSlope(p.egfrSlopeAnnual)}, KDIGO: {p.kdigoTier.toUpperCase()}
                  </option>
                ))}
              </select>

              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{currentPatient.name}</span>
                  <Badge variant={currentPatient.isRapidProgressor ? 'rapid' : 'secondary'}>
                    {currentPatient.isRapidProgressor ? 'Rapid Decliner' : 'Moderate Progression'}
                  </Badge>
                </div>
                <div className="text-xs text-slate-600 grid grid-cols-2 gap-2 pt-1 font-mono">
                  <div>Current eGFR: <strong>{currentPatient.currentEgfr} mL/min</strong></div>
                  <div>eGFR Slope: <strong>{formatSlope(currentPatient.egfrSlopeAnnual)}</strong></div>
                  <div>uACR: <strong>{currentPatient.uacr} mg/g</strong></div>
                  <div>5-Yr Dialysis Risk: <strong>{(currentPatient.kfre5YearPercent * 100).toFixed(1)}%</strong></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Behavioral Science Principles Card */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Brain className="h-4 w-4 text-indigo-600" />
                Behavioral Architecture: Overcoming the &ldquo;Asymptomatic Trap&rdquo;
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-xs text-slate-600 leading-relaxed">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">The Perception Problem (Silent Disease)</h4>
                  <p className="mt-0.5 text-slate-500">
                    70–80% of patients flagged with moderate-to-high chronic kidney risk never attend clinic follow-ups because they feel physically healthy. Telling them their &ldquo;creatinine is elevated&rdquo; means nothing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">The Cognitive Reframing (Kitchen Filter Metaphor)</h4>
                  <p className="mt-0.5 text-slate-500">
                    RENAL-PULSE uses an audio note explaining the kidney as a delicate filter. Just as water keeps flowing through a straining filter before tearing permanently, kidneys mask damage until it is too late.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Frictionless 1-Click Action Loop</h4>
                  <p className="mt-0.5 text-slate-500">
                    Rather than telling patients to &ldquo;call the hospital,&rdquo; the bot offers a single button to confirm a dedicated 10-minute checkup with their pre-loaded GDMT order set.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span className="font-medium text-[11px]">
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
