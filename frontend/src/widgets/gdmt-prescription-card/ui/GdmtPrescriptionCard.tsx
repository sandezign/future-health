import { useState } from 'react';
import { AnalyzedPatient } from '../../../entities/patient/model/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../../shared/ui/card';
import { Button } from '../../../shared/ui/button';
import { Badge } from '../../../shared/ui/badge';
import { Pill, ShieldCheck, CheckCircle2, FileText, Info } from 'lucide-react';

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
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Card className={`border-2 transition-all ${prescribed ? 'border-emerald-500 bg-emerald-50/10' : 'border-indigo-100'}`}>
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
            <Pill className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold text-slate-900">
                1-Click GDMT Clinical Prescribing Copilot
              </CardTitle>
              <Badge variant="green" className="text-[10px]">KDIGO 2024 Class 1A</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated organ-protective order set to overcome primary care therapeutic inertia.
            </p>
          </div>
        </div>

        {prescribed && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Order Set Authorized
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-4 space-y-4 text-xs">
        {/* Medication 1: SGLT2 Inhibitor */}
        <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{gdmt.sglt2iDrug}</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-mono text-[11px] rounded font-bold">
                  {gdmt.sglt2iDose}
                </span>
                <Badge variant="secondary" className="text-[10px]">SGLT2 Inhibitor</Badge>
              </div>
              <p className="text-slate-600 text-xs">{gdmt.sglt2iRationale}</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
              NNT = 19 (DAPA-CKD)
            </span>
          </div>
        </div>

        {/* Medication 2: RAS Blockade (ARB) */}
        <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{gdmt.arbDrug}</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-mono text-[11px] rounded font-bold">
                  {gdmt.arbDose}
                </span>
                <Badge variant="secondary" className="text-[10px]">ARB / RAS Blockade</Badge>
              </div>
              <p className="text-slate-600 text-xs">{gdmt.arbRationale}</p>
            </div>
            <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
              Standard of Care
            </span>
          </div>
        </div>

        {/* Reassurance Safeguard Banner */}
        <div className="p-3.5 rounded-lg border border-amber-300 bg-amber-50/70 flex items-start gap-2.5">
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
        <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center gap-2 text-slate-700">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="font-medium text-xs">
              Bundled 4-Week Safety Protocol: <strong>Serum Potassium + Creatinine Lab Order</strong>
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">Auto-Scheduled</span>
        </div>
      </CardContent>

      <CardFooter className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyOrderSet}
          className="gap-1.5 text-xs"
        >
          <FileText className="h-3.5 w-3.5" />
          {copied ? 'Copied to Clipboard!' : 'Copy Order Set to EHR'}
        </Button>

        <Button
          variant={prescribed ? 'secondary' : 'primary'}
          size="md"
          onClick={handleAuthorize}
          className="gap-2 font-bold shadow-md shadow-emerald-600/20"
        >
          {prescribed ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Order Transmitted to Puskesmas Pharmacy
            </>
          ) : (
            <>
              <Pill className="h-4 w-4" />
              1-Click Authorize GDMT Protocol
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
