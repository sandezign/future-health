import { AnalyzedPatient } from '../../../entities/patient/model/types';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/ui/card';
import { Badge } from '../../../shared/ui/badge';

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

  // Calibrated, accessible color mapping for KDIGO risk matrix
  const getCellColor = (g: string, a: string) => {
    if (g === 'G1' || g === 'G2') {
      if (a === 'A1') return 'bg-emerald-50/80 text-emerald-900 border-emerald-200/70';
      if (a === 'A2') return 'bg-amber-50/80 text-amber-900 border-amber-200/70';
      return 'bg-orange-50/90 text-orange-950 border-orange-200/80';
    }
    if (g === 'G3a') {
      if (a === 'A1') return 'bg-amber-50/80 text-amber-900 border-amber-200/70';
      if (a === 'A2') return 'bg-orange-50/90 text-orange-950 border-orange-200/80';
      return 'bg-rose-50/90 text-rose-950 border-rose-200/80';
    }
    if (g === 'G3b') {
      if (a === 'A1') return 'bg-orange-50/90 text-orange-950 border-orange-200/80';
      return 'bg-rose-50/90 text-rose-950 border-rose-200/80';
    }
    // G4 & G5
    return 'bg-rose-100/90 text-rose-950 border-rose-300/80';
  };

  return (
    <Card className="overflow-hidden border border-slate-200/80 shadow-xs">
      <CardHeader className="p-4 sm:p-5 pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <CardTitle className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            KDIGO 2024 Clinical Staging Matrix
          </CardTitle>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Cross-tabulated cardiorenal prognosis: eGFR filtration loss vs. Albuminuria nephron barrier leakage.
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge variant="indigo" className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-md">
            Stage {patient.kdigoGStage} × {patient.kdigoAStage}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs">
            <thead>
              <tr>
                <th className="p-2.5 border border-slate-200/80 bg-slate-50/90 text-left font-semibold text-slate-700 text-[11px] w-44 rounded-tl-lg">
                  GFR Category (eGFR)
                </th>
                {aStages.map((a, idx) => (
                  <th
                    key={a.code}
                    className={`p-2.5 border border-slate-200/80 bg-slate-50/90 font-semibold text-slate-800 text-[11px] ${
                      idx === aStages.length - 1 ? 'rounded-tr-lg' : ''
                    }`}
                  >
                    <div className="font-bold">{a.code}: {a.label}</div>
                    <div className="text-[10px] text-slate-400 font-mono font-normal">{a.range}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gStages.map((g) => (
                <tr key={g.code}>
                  <td className="p-2 border border-slate-200/70 bg-slate-50/40 text-left">
                    <span className="font-bold font-mono text-slate-900">{g.code}</span>
                    <span className="text-[11px] text-slate-500 ml-1.5 font-mono">({g.range})</span>
                  </td>
                  {aStages.map((a) => {
                    const isCurrentPatient =
                      patient.kdigoGStage === g.code && patient.kdigoAStage === a.code;
                    const cellColor = getCellColor(g.code, a.code);

                    return (
                      <td
                        key={a.code}
                        className={`p-2.5 border transition-colors relative ${cellColor} ${
                          isCurrentPatient
                            ? 'ring-2 ring-indigo-600 bg-white text-indigo-950 font-black shadow-sm z-10'
                            : 'hover:brightness-95'
                        }`}
                      >
                        {isCurrentPatient ? (
                          <div className="flex items-center justify-center gap-1.5 text-indigo-950 font-black text-xs">
                            <span className="h-2 w-2 rounded-full bg-indigo-600" />
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

        <div className="mt-3.5 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2 border-t border-slate-100 pt-2.5">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-100 border border-emerald-300" />
              Low Risk
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-100 border border-amber-300" />
              Moderate
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-orange-100 border border-orange-300" />
              High
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-200 border border-rose-300" />
              Very High
            </span>
          </div>
          <span className="italic text-[10px] text-slate-400">Based on KDIGO 2024 Clinical Practice Guideline</span>
        </div>
      </CardContent>
    </Card>
  );
}
