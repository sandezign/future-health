import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnalyzedPatient, KdigoRiskTier } from '../../../entities/patient/model/types';
import { Badge } from '../../../shared/ui/badge';
import { Button } from '../../../shared/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/ui/card';
import { formatEgfr, formatSlope, formatRiskPercent, formatBP } from '../../../shared/lib/formatters';
import { ROUTES } from '../../../shared/config/routes';
import { Search, ChevronRight, AlertCircle, MessageSquare } from 'lucide-react';

interface Props {
  patients: AnalyzedPatient[];
  onOpenOutreach?: (patient: AnalyzedPatient) => void;
}

export function PatientTriageTable({ patients, onOpenOutreach }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'rapid' | 'very_high' | 'diabetes'>('all');

  const filtered = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patient_id.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'rapid') return p.isRapidProgressor;
    if (filter === 'very_high') return p.kdigoTier === 'very_high';
    if (filter === 'diabetes') return p.has_diabetes;
    return true;
  });

  const getTierBadge = (tier: KdigoRiskTier) => {
    switch (tier) {
      case 'low':
        return <Badge variant="green">Low (G1/2 A1)</Badge>;
      case 'moderate':
        return <Badge variant="yellow">Moderate</Badge>;
      case 'high':
        return <Badge variant="orange">High Risk</Badge>;
      case 'very_high':
        return <Badge variant="red">Very High</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">
              Cardiorenal Population Triage Registry
            </CardTitle>
            <p className="text-xs text-slate-500 mt-1">
              Active primary care cohort ranked by eGFR slope decline and 5-year dialysis risk.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 pt-3 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Patients ({patients.length})
          </button>
          <button
            onClick={() => setFilter('rapid')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 ${
              filter === 'rapid'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <AlertCircle className="h-3 w-3" />
            Rapid Decliners ({patients.filter((p) => p.isRapidProgressor).length})
          </button>
          <button
            onClick={() => setFilter('very_high')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              filter === 'very_high'
                ? 'bg-orange-600 text-white'
                : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
            }`}
          >
            KDIGO Very High ({patients.filter((p) => p.kdigoTier === 'very_high').length})
          </button>
          <button
            onClick={() => setFilter('diabetes')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              filter === 'diabetes'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Diabetic Kidney ({patients.filter((p) => p.has_diabetes).length})
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200/80 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Patient Profile</th>
                <th className="py-3 px-4">Vitals & Disease</th>
                <th className="py-3 px-4">Current eGFR</th>
                <th className="py-3 px-4">Annual eGFR Slope</th>
                <th className="py-3 px-4">uACR</th>
                <th className="py-3 px-4">5-Yr Dialysis Risk</th>
                <th className="py-3 px-4">KDIGO Tier</th>
                <th className="py-3 px-4 text-right">Clinical Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((patient) => (
                <tr
                  key={patient.patient_id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="py-3.5 px-4">
                    <Link
                      to={ROUTES.PATIENT_DETAIL(patient.patient_id)}
                      className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors"
                    >
                      {patient.name}
                    </Link>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {patient.patient_id} • {patient.age}y {patient.sex}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-700">
                      {formatBP(patient.systolic_bp, patient.diastolic_bp)}
                    </div>
                    <div className="flex gap-1 mt-0.5">
                      {patient.has_diabetes && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-50 text-blue-700 rounded border border-blue-200">
                          T2D
                        </span>
                      )}
                      {patient.has_hypertension && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-amber-50 text-amber-700 rounded border border-amber-200">
                          HTN
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <span className="font-bold text-slate-900">
                      {formatEgfr(patient.currentEgfr)}
                    </span>
                    <span className="text-[10px] ml-1.5 px-1 py-0.2 bg-slate-100 text-slate-600 rounded">
                      {patient.kdigoGStage}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-mono font-bold ${
                          patient.egfrSlopeAnnual <= -3.0 ? 'text-rose-600' : 'text-slate-700'
                        }`}
                      >
                        {formatSlope(patient.egfrSlopeAnnual)}
                      </span>
                      {patient.isRapidProgressor && (
                        <Badge variant="rapid">Rapid</Badge>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    {patient.uacr.toFixed(0)} mg/g
                    <span className="text-[10px] ml-1 text-slate-400">
                      ({patient.kdigoAStage})
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {formatRiskPercent(patient.kfre5YearPercent)}
                  </td>

                  <td className="py-3.5 px-4">
                    {getTierBadge(patient.kdigoTier)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {onOpenOutreach && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onOpenOutreach(patient)}
                          title="Simulate WhatsApp Outreach"
                          className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Link to={ROUTES.PATIENT_DETAIL(patient.patient_id)}>
                        <Button size="sm" variant="outline" className="font-semibold gap-1">
                          Copilot
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
