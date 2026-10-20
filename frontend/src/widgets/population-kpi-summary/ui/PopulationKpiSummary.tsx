import { AnalyzedPatient } from '../../../entities/patient/model/types';
import { Card, CardContent } from '../../../shared/ui/card';
import { Users, TrendingDown, AlertTriangle, ShieldCheck } from 'lucide-react';
import { formatCurrencyIDR } from '../../../shared/lib/formatters';

interface Props {
  patients: AnalyzedPatient[];
}

export function PopulationKpiSummary({ patients }: Props) {
  const total = patients.length;
  const rapidCount = patients.filter((p) => p.isRapidProgressor).length;
  const highRiskCount = patients.filter(
    (p) => p.kdigoTier === 'high' || p.kdigoTier === 'very_high'
  ).length;

  // Health economic calculation:
  // Each intercepted rapid decliner delayed from dialysis saves ~Rp 92,000,000/year in BPJS hemodialysis claims
  const estimatedSavings = rapidCount * 92_000_000;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Surveillance Cohort */}
      <Card className="hover:border-slate-300 transition-colors group">
        <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Registry
            </span>
            <Users className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">{total}</span>
              <span className="text-xs font-semibold text-slate-400">Patients</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">T2D & Hypertension screening cohort</p>
          </div>
        </CardContent>
      </Card>

      {/* 2. Rapid Decliners Flagged */}
      <Card className="border-rose-200/80 hover:border-rose-300 transition-colors group bg-rose-50/20">
        <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">
              Rapid Decliners Flagged
            </span>
            <TrendingDown className="h-4 w-4 text-rose-500 group-hover:text-rose-600 transition-colors" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-rose-600 font-mono tracking-tight">{rapidCount}</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                {Math.round((rapidCount / (total || 1)) * 100)}% of cohort
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Annual slope &le; -3.0 mL/min/yr</p>
          </div>
        </CardContent>
      </Card>

      {/* 3. KDIGO High / Very High */}
      <Card className="border-amber-200/80 hover:border-amber-300 transition-colors group bg-amber-50/20">
        <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
              High / Very High Risk
            </span>
            <AlertTriangle className="h-4 w-4 text-amber-500 group-hover:text-amber-600 transition-colors" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-600 font-mono tracking-tight">{highRiskCount}</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                {Math.round((highRiskCount / (total || 1)) * 100)}%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">KDIGO 2024 Tier 3 & 4</p>
          </div>
        </CardContent>
      </Card>

      {/* 4. Projected BPJS Cost Avoidance */}
      <Card className="border-emerald-200/80 hover:border-emerald-300 transition-colors group bg-emerald-50/20">
        <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
              Dialysis Cost Avoidance
            </span>
            <ShieldCheck className="h-4 w-4 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-emerald-700 font-mono tracking-tight">
                {formatCurrencyIDR(estimatedSavings)}
              </span>
            </div>
            <p className="text-[11px] text-emerald-700/80 font-medium mt-1">Est. 1st year BPJS hemodialysis savings</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
