import { useState } from 'react';
import { AnalyzedPatient } from '../../../entities/patient/model/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../../shared/ui/card';
import { Button } from '../../../shared/ui/button';
import { Badge } from '../../../shared/ui/badge';
import { Pill, ShieldCheck, CheckCircle2, Copy, Check, Info } from 'lucide-react';

interface Props {
  patient: AnalyzedPatient;
}

export function GdmtPrescriptionCard({ patient }: Props) {
  const [prescribed, setPrescribed] = useState(false);
  const [copied, setCopied] = useState(false);
  const { gdmt } = patient;

  const handleAuthorize = () => {
    setPrescribed(true);
  };

  const handleCopyOrderSet = () => {
    const text = `RENAL-PULSE GDMT Order Set for ${patient.name} (${patient.patient_id}):
1. Rx: ${gdmt.sglt2iDrug} ${gdmt.sglt2iDose}
2. Rx: ${gdmt.arbDrug} ${gdmt.arbDose}
3. Lab Order: Serum Potassium + Creatinine (Due in 4 weeks)
4. Note: As per KDIGO 2024, initial eGFR dip up to 30% is expected and reflects intraglomerular pressure drop.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card
      className={`border transition-all shadow-xs ${
        prescribed
          ? 'border-emerald-300 bg-emerald-50/20'
          : 'border-slate-200/80 bg-white'
      }`}
    >
      <CardHeader className="p-4 sm:p-5 pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Pill className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                1-Click GDMT Clinical Copilot
              </CardTitle>
              <Badge variant="green" className="text-[10px] font-semibold py-0 px-2 rounded">
                KDIGO 2024 Class 1A
              </Badge>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              Overcomes primary care therapeutic inertia with organ-protective orders.
            </p>
          </div>
        </div>

        {prescribed && (
          <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-[11px] font-bold shrink-0">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Authorized</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-3.5 space-y-3 text-xs">
        {/* Medication 1: SGLT2 Inhibitor */}
        <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-colors">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 text-xs sm:text-sm">{gdmt.sglt2iDrug}</span>
                <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 font-mono text-[10px] rounded font-bold border border-indigo-100">
                  {gdmt.sglt2iDose}
                </span>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded border border-slate-200">
                  SGLT2i
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">{gdmt.sglt2iRationale}</p>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80 shrink-0">
              NNT = 19
            </span>
          </div>
        </div>

        {/* Medication 2: RAS Blockade (ARB) */}
        <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-colors">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 text-xs sm:text-sm">{gdmt.arbDrug}</span>
                <span className="px-1.5 py-0.5 bg-amber-50 text-amber-800 font-mono text-[10px] rounded font-bold border border-amber-100">
                  {gdmt.arbDose}
                </span>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded border border-slate-200">
                  ARB
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">{gdmt.arbRationale}</p>
            </div>
            <span className="text-[10px] font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60 shrink-0">
              Standard
            </span>
          </div>
        </div>

        {/* Reassurance Safeguard Banner */}
        <div className="p-3 rounded-xl border border-amber-200/90 bg-amber-50/60 flex items-start gap-2.5">
          <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-900 text-xs">
              Clinical Inertia Breaker: Expected Hemodynamic eGFR Dip
            </p>
            <p className="text-amber-800 text-[11px] leading-relaxed mt-0.5">
              {gdmt.hemodynamicDipReassurance}
            </p>
          </div>
        </div>

        {/* Automated Follow-Up Safety Plan */}
        <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200/80 bg-white">
          <div className="flex items-center gap-2 text-slate-700">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="text-[11px] text-slate-700">
              Bundled 4-Week Safety Protocol: <strong className="text-slate-900">Serum Potassium + Creatinine</strong>
            </span>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60 shrink-0">
            Auto-Scheduled
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 sm:p-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
        <Button
          variant="outline"
          size="sm"
          shape="rounded"
          onClick={handleCopyOrderSet}
          className="gap-1.5 text-xs text-slate-600 hover:text-slate-900 rounded-lg h-8"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? 'Copied Order Set' : 'Copy Order Set'}</span>
        </Button>

        <Button
          variant={prescribed ? 'secondary' : 'primary'}
          size="sm"
          shape="rounded"
          onClick={handleAuthorize}
          className="gap-1.5 font-bold text-xs rounded-lg h-8"
        >
          {prescribed ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Order Sent to Puskesmas Pharmacy</span>
            </>
          ) : (
            <>
              <Pill className="h-3.5 w-3.5" />
              <span>1-Click Authorize GDMT Protocol</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
