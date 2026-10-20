import { AnalyzedPatient } from '../../../entities/patient/model/types';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/ui/card';
import { Badge } from '../../../shared/ui/badge';
import { MapPin } from 'lucide-react';

interface Props {
  patient: AnalyzedPatient;
}

export function KdigoHeatmap({ patient }: Props) {
  const gStages = [
    { code: 'G1', label: 'Normal / High', range: '≥ 90' },
    { code: 'G2', label: 'Mild Decrease', range: '60 - 89' },
    { code: 'G3a', label: 'Mild to Moderate', range: '45 - 59' },
    { code: 'G3b', label: 'Moderate to Severe', range: '30 - 44' },
    { code: 'G4', label: 'Severely Decreased', range: '15 - 29' },
    { code: 'G5', label: 'Kidney Failure', range: '< 15' },
  ];

  const aStages = [
    { code: 'A1', label: 'Normal to Mild', range: '< 30 mg/g' },
    { code: 'A2', label: 'Moderate (Micro)', range: '30 - 300 mg/g' },
    { code: 'A3', label: 'Severe (Macro)', range: '> 300 mg/g' },
  ];

  // Helper to determine background color of cell in KDIGO matrix
  const getCellColor = (g: string, a: string) => {
    if (g === 'G1' || g === 'G2') {
      if (a === 'A1') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      if (a === 'A2') return 'bg-amber-100 text-amber-800 border-amber-200';
      return 'bg-orange-200 text-orange-900 border-orange-300';
    }
    if (g === 'G3a') {
      if (a === 'A1') return 'bg-amber-100 text-amber-800 border-amber-200';
      if (a === 'A2') return 'bg-orange-200 text-orange-900 border-orange-300';
      return 'bg-rose-200 text-rose-900 border-rose-300';
    }
    if (g === 'G3b') {
      if (a === 'A1') return 'bg-orange-200 text-orange-900 border-orange-300';
      return 'bg-rose-300 text-rose-950 border-rose-400';
    }
    // G4 & G5
    return 'bg-rose-300 text-rose-950 border-rose-400';
  };

  return (
    <Card>
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-slate-900">
            KDIGO 2024 Clinical Staging Matrix
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Composite prognosis based on filtration (GFR) and structural nephron leak (Albuminuria).
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className="text-[11px] font-mono">
            {patient.kdigoGStage} × {patient.kdigoAStage}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs">
            <thead>
              <tr>
                <th className="p-2 border border-slate-200 bg-slate-50 text-left font-semibold text-slate-600 text-[11px] w-40">
                  GFR Category (eGFR)
                </th>
                {aStages.map((a) => (
                  <th key={a.code} className="p-2 border border-slate-200 bg-slate-50 font-semibold text-slate-700 text-[11px]">
                    <div>{a.code}: {a.label}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{a.range}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gStages.map((g) => (
                <tr key={g.code}>
                  <td className="p-2 border border-slate-200 bg-slate-50/70 text-left">
                    <span className="font-bold font-mono text-slate-800">{g.code}</span>
                    <span className="text-[11px] text-slate-500 ml-1.5">({g.range})</span>
                  </td>
                  {aStages.map((a) => {
                    const isCurrentPatient =
                      patient.kdigoGStage === g.code && patient.kdigoAStage === a.code;
                    const cellColor = getCellColor(g.code, a.code);

                    return (
                      <td
                        key={a.code}
                        className={`p-2.5 border transition-all relative ${cellColor} ${
                          isCurrentPatient
                            ? 'ring-2 ring-slate-900 shadow-md font-bold scale-[1.02] z-10'
                            : 'opacity-85 hover:opacity-100'
                        }`}
                      >
                        {isCurrentPatient ? (
                          <div className="flex items-center justify-center gap-1 text-slate-950 font-black">
                            <MapPin className="h-3.5 w-3.5 text-rose-600 fill-rose-600 animate-bounce" />
                            <span>PATIENT</span>
                          </div>
                        ) : (
                          <span className="text-[10px] uppercase font-bold tracking-tight opacity-75">
                            {cellColor.includes('rose')
                              ? 'Very High'
                              : cellColor.includes('orange')
                              ? 'High'
                              : cellColor.includes('amber')
                              ? 'Moderate'
                              : 'Low'}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded bg-emerald-200 border border-emerald-300" />
              Low Risk
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded bg-amber-200 border border-amber-300" />
              Moderate
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded bg-orange-200 border border-orange-300" />
              High
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded bg-rose-300 border border-rose-400" />
              Very High
            </span>
          </div>
          <span className="italic">Based on KDIGO 2024 Clinical Practice Guideline</span>
        </div>
      </CardContent>
    </Card>
  );
}
