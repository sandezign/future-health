import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { AnalyzedPatient } from '../../../entities/patient/model/types';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/ui/card';
import { Badge } from '../../../shared/ui/badge';
import { AlertTriangle, Clock } from 'lucide-react';
import { formatSlope } from '../../../shared/lib/formatters';

interface Props {
  patient: AnalyzedPatient;
}

export function EgfrTrajectoryChart({ patient }: Props) {
  // Build chart points: historical + projected points (without GDMT vs with GDMT)
  const historical = patient.trajectoryPoints.map((p) => ({
    label: p.date,
    historicalEgfr: p.egfr,
    projectedUntreated: null as number | null,
    projectedWithGdmt: null as number | null,
    creatinine: p.creatinine,
    isProjected: false,
  }));

  const lastPoint = patient.trajectoryPoints[patient.trajectoryPoints.length - 1];
  const currentGfr = patient.currentEgfr;
  const slope = patient.egfrSlopeAnnual; // e.g. -4.2

  // Add projection for Year +1, Year +2, Year +3, Year +5
  const projectedYears = [1, 2, 3, 5];
  const projected = projectedYears.map((yr) => {
    const untreatedGfr = Math.max(5, Math.round((currentGfr + slope * yr) * 10) / 10);
    // SGLT2i reduces slope loss by ~40% after initial 10% dip
    const gdmtSlope = slope * 0.6;
    const treatedGfr = Math.max(10, Math.round((currentGfr - 3 + gdmtSlope * yr) * 10) / 10);

    return {
      label: `+${yr} yr`,
      historicalEgfr: null as number | null,
      projectedUntreated: untreatedGfr,
      projectedWithGdmt: treatedGfr,
      creatinine: null as number | null,
      isProjected: true,
    };
  });

  // Stitch current point into projection line for continuous rendering
  if (lastPoint) {
    historical[historical.length - 1] = {
      ...historical[historical.length - 1]!,
      projectedUntreated: currentGfr,
      projectedWithGdmt: currentGfr,
    };
  }

  const chartData = [...historical, ...projected];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-center justify-between border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-bold text-slate-900">
              Longitudinal eGFR Filtration Trajectory
            </CardTitle>
            {patient.isRapidProgressor && (
              <Badge variant="rapid">Rapid Decline ({formatSlope(patient.egfrSlopeAnnual)})</Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Serial serum creatinine modeled via OLS regression. Projected dialysis horizon at eGFR &lt; 15 mL/min.
          </p>
        </div>

        {patient.projectedYearsToDialysis !== null && (
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg text-rose-700">
            <Clock className="h-4 w-4 text-rose-600 animate-pulse" />
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-rose-500 block leading-none">
                Dialysis Horizon
              </span>
              <span className="text-xs font-extrabold text-rose-700">
                ~{patient.projectedYearsToDialysis} Years without Action
              </span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-4">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                dy={8}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                domain={[0, 120]}
                tickLine={false}
                unit=" mL"
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0]?.payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs space-y-1">
                        <p className="font-bold text-slate-200">{label}</p>
                        {data.historicalEgfr !== null && (
                          <p className="text-emerald-400">
                            Historical eGFR: <span className="font-bold font-mono">{data.historicalEgfr}</span> mL/min
                          </p>
                        )}
                        {data.creatinine !== null && (
                          <p className="text-slate-300">
                            Creatinine: <span className="font-mono">{data.creatinine}</span> mg/dL
                          </p>
                        )}
                        {data.projectedUntreated !== null && (
                          <p className="text-rose-400">
                            Without GDMT: <span className="font-bold font-mono">{data.projectedUntreated}</span> mL/min
                          </p>
                        )}
                        {data.projectedWithGdmt !== null && (
                          <p className="text-emerald-300">
                            With SGLT2i + ARB: <span className="font-bold font-mono">{data.projectedWithGdmt}</span> mL/min
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Clinical reference lines */}
              <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Stage G3a (60)', fill: '#f59e0b', fontSize: 10, position: 'insideTopRight' }} />
              <ReferenceLine y={15} stroke="#ef4444" strokeWidth={1.5} label={{ value: 'Dialysis Threshold (15)', fill: '#ef4444', fontSize: 10, position: 'insideBottomRight' }} />

              {/* Historical curve */}
              <Line
                type="monotone"
                dataKey="historicalEgfr"
                stroke="#0f172a"
                strokeWidth={3}
                dot={{ r: 4, fill: '#0f172a' }}
                activeDot={{ r: 6 }}
                name="Historical eGFR"
              />

              {/* Untreated trajectory */}
              <Line
                type="monotone"
                dataKey="projectedUntreated"
                stroke="#f43f5e"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3, fill: '#f43f5e' }}
                name="Projected (Untreated)"
              />

              {/* Intercepted trajectory */}
              <Line
                type="monotone"
                dataKey="projectedWithGdmt"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#10b981' }}
                name="Interception (With GDMT)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Legend & Clinical interpretation */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-slate-900" />
              <span className="text-slate-600 font-medium">Historical Labs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-4 bg-rose-500 rounded" />
              <span className="text-slate-600 font-medium">Untreated Slope (-4.2/yr)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-4 bg-emerald-500 rounded" />
              <span className="text-emerald-700 font-semibold">With GDMT Protection (+5-8 yrs)</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            <span>KDIGO 2024: Target rate of decline &lt; 1.0 mL/min/1.73m²/yr</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
