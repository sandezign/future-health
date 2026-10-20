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
import { AlertCircle, Clock } from 'lucide-react';
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
    // SGLT2i reduces slope loss by ~40% after initial hemodynamic dip
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
    <Card className="overflow-hidden border border-slate-200/80 shadow-xs">
      <CardHeader className="p-4 sm:p-5 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <CardTitle className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              Longitudinal eGFR Filtration Trajectory
            </CardTitle>
            {patient.isRapidProgressor && (
              <Badge variant="rapid" className="text-[10px] py-0 px-2 font-mono">
                Rapid Decline ({formatSlope(patient.egfrSlopeAnnual)})
              </Badge>
            )}
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Serial serum creatinine modeled via OLS regression. Projected dialysis threshold at eGFR &lt; 15 mL/min.
          </p>
        </div>

        {patient.projectedYearsToDialysis !== null && (
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-200/90 px-3 py-1.5 rounded-lg text-rose-800 shrink-0">
            <Clock className="h-4 w-4 text-rose-600 shrink-0" />
            <div className="text-right">
              <span className="text-[9px] uppercase font-bold text-rose-500 block leading-none tracking-wider">
                Dialysis Horizon
              </span>
              <span className="text-xs font-black text-rose-700 font-mono">
                ~{patient.projectedYearsToDialysis} Years without Action
              </span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-4">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                dy={8}
              />
              <YAxis
                stroke="#94a3b8"
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
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-800 font-sans">
                        <p className="font-bold text-slate-200 border-b border-slate-800 pb-1">{label}</p>
                        {data.historicalEgfr !== null && (
                          <p className="text-slate-300">
                            Historical eGFR: <span className="font-bold font-mono text-emerald-400">{data.historicalEgfr}</span> mL/min
                          </p>
                        )}
                        {data.creatinine !== null && (
                          <p className="text-slate-400">
                            Creatinine: <span className="font-mono text-slate-200">{data.creatinine}</span> mg/dL
                          </p>
                        )}
                        {data.projectedUntreated !== null && (
                          <p className="text-rose-400">
                            Untreated Trajectory: <span className="font-bold font-mono">{data.projectedUntreated}</span> mL/min
                          </p>
                        )}
                        {data.projectedWithGdmt !== null && (
                          <p className="text-indigo-300">
                            With SGLT2i + ARB: <span className="font-bold font-mono text-indigo-400">{data.projectedWithGdmt}</span> mL/min
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Clinical reference lines */}
              <ReferenceLine
                y={60}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                label={{ value: 'Stage G3a (60)', fill: '#d97706', fontSize: 10, position: 'insideTopRight' }}
              />
              <ReferenceLine
                y={15}
                stroke="#ef4444"
                strokeWidth={1.5}
                label={{ value: 'Dialysis Threshold (15)', fill: '#dc2626', fontSize: 10, position: 'insideBottomRight' }}
              />

              {/* Historical curve */}
              <Line
                type="monotone"
                dataKey="historicalEgfr"
                stroke="#0f172a"
                strokeWidth={2.5}
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
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#f43f5e' }}
                name="Projected (Untreated)"
              />

              {/* Intercepted trajectory */}
              <Line
                type="monotone"
                dataKey="projectedWithGdmt"
                stroke="#4f46e5"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#4f46e5' }}
                name="Interception (With GDMT)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Legend & Clinical interpretation */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-900" />
              <span className="text-slate-700 font-medium text-[11px]">Historical Labs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1 w-3.5 bg-rose-500 rounded-full" />
              <span className="text-slate-700 font-medium text-[11px]">Untreated Projection</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1 w-3.5 bg-indigo-600 rounded-full" />
              <span className="text-indigo-700 font-semibold text-[11px]">GDMT Protective Horizon (+5–8 yrs)</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
            <span>Target: annual loss &lt; 1.0 mL/min/1.73m²/yr</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
