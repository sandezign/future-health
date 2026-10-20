import { AnalyzedPatient } from '../../../entities/patient/model/types';
import { Card, CardContent } from '../../../shared/ui/card';
import { Activity, AlertTriangle, ShieldAlert, TrendingDown } from 'lucide-react';
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
      <Card className="border-l-4 border-l-slate-900">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Surveillance Cohort
            </p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{total}</p>
            <p className="text-xs text-slate-500 mt-0.5">High-risk T2D & HTN patients</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <Activity className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-rose-500">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
              Rapid Decliners Flagged
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-2xl font-extrabold text-rose-600">{rapidCount}</p>
              <span className="text-xs font-bold text-rose-500">
                ({Math.round((rapidCount / (total || 1)) * 100)}%)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Slope &le; -3.0 mL/min/yr</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
            <TrendingDown className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-amber-500">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              KDIGO High / Very High
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-2xl font-extrabold text-amber-600">{highRiskCount}</p>
              <span className="text-xs font-bold text-amber-600">
                ({Math.round((highRiskCount / (total || 1)) * 100)}%)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Qualify for immediate GDMT</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-emerald-500 bg-emerald-50/20">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Projected BPJS Savings
            </p>
            <p className="text-xl font-black text-emerald-700 mt-1">
              {formatCurrencyIDR(estimatedSavings)}
            </p>
            <p className="text-xs text-emerald-600 mt-0.5">Dialysis avoidance (1st yr)</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
