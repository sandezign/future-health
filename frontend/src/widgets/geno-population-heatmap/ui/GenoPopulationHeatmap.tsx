import React from 'react';
import { Card } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { PopulationEpidemiology } from '@/entities/genomics';
import {
  Users,
  MapPin,
  TrendingDown,
  DollarSign,
  Activity,
  HeartPulse,
} from 'lucide-react';

interface Props {
  data: PopulationEpidemiology;
}

export const GenoPopulationHeatmap: React.FC<Props> = ({ data }) => {
  const regions = Object.entries(data.regional_distribution);
  const genes = Object.entries(data.carrier_prevalence);

  return (
    <Card className="p-5 border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            Abu Dhabi Population Carrier Epidemiology
          </h3>
          <p className="text-xs text-slate-500">
            Real-Time Surveillance of Mandatory 570-Gene Premarital Screening Cohort
          </p>
        </div>
        <Badge variant="subtle" shape="pill" size="sm">
          {data.total_screened_couples.toLocaleString()} Screened Couples
        </Badge>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" /> Total Screened Pairs
          </div>
          <div className="text-xl font-bold text-slate-900">
            {data.total_screened_couples.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">
            {((data.compatible_couples / data.total_screened_couples) * 100).toFixed(1)}% Compatible (Cleared)
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
          <div className="text-xs text-amber-800 font-medium mb-1 flex items-center gap-1.5">
            <HeartPulse className="w-3.5 h-3.5 text-amber-600" /> Incompatible Carrier Pairs
          </div>
          <div className="text-xl font-bold text-amber-950">
            {data.incompatible_couples} Couples
          </div>
          <div className="text-[11px] text-amber-800 mt-1 font-medium">
            {((data.incompatible_couples / data.total_screened_couples) * 100).toFixed(1)}% High-Risk Recessive Overlap
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
          <div className="text-xs text-emerald-800 font-medium mb-1 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Projected 5-Year Healthcare Savings
          </div>
          <div className="text-xl font-bold text-emerald-950">
            AED {(data.economic_impact.projected_5yr_savings_aed / 1000000).toFixed(0)}M
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 font-medium">
            {data.economic_impact.projected_annual_averted_cases} Severe Pediatric Cases Averted
          </div>
        </div>
      </div>

      {/* Regional Carrier Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* District Distribution */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            Regional Incompatibility Breakdown
          </h4>
          <div className="space-y-3">
            {regions.map(([regionName, counts]) => {
              const rate = ((counts.incompatible / counts.total) * 100).toFixed(1);
              return (
                <div key={regionName} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700">{regionName}</span>
                    <span className="text-slate-500">
                      {counts.incompatible} / {counts.total} couples ({rate}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{ width: `${Math.min(parseFloat(rate) * 8, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carrier Prevalence by Gene */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-slate-500" />
            Top Carrier Frequencies (570-Gene Panel)
          </h4>
          <div className="space-y-2.5">
            {genes.map(([gene, prev]) => (
              <div
                key={gene}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 w-16">{gene}</span>
                  <span className="text-slate-500 text-[11px]">
                    {gene === 'HBB'
                      ? 'Beta-Thalassemia'
                      : gene === 'SMN1'
                      ? 'Spinal Muscular Atrophy'
                      : gene === 'CFTR'
                      ? 'Cystic Fibrosis'
                      : gene === 'CYP21A2'
                      ? 'Congenital Adrenal Hyp.'
                      : 'Usher Syndrome 1F'}
                  </span>
                </div>
                <Badge variant="subtle" size="sm" shape="pill" className="font-mono text-[11px]">
                  {(prev * 100).toFixed(1)}% Prevalence
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
