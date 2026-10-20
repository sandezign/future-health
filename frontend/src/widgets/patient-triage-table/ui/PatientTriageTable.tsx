import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnalyzedPatient, KdigoRiskTier } from '../../../entities/patient/model/types';
import { Badge } from '../../../shared/ui/badge';
import { Button } from '../../../shared/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/ui/card';
import { formatEgfr, formatSlope, formatRiskPercent, formatBP } from '../../../shared/lib/formatters';
import { ROUTES } from '../../../shared/config/routes';
import { Search, ChevronRight, AlertCircle, MessageSquare, X } from 'lucide-react';

export type TriageFilterType = 'all' | 'rapid' | 'very_high' | 'diabetes';

interface Props {
  patients: AnalyzedPatient[];
  activeFilter?: TriageFilterType;
  onFilterChange?: (filter: TriageFilterType) => void;
  onOpenOutreach?: (patient: AnalyzedPatient) => void;
}

export function PatientTriageTable({
  patients,
  activeFilter,
  onFilterChange,
  onOpenOutreach,
}: Props) {
  const [internalFilter, setInternalFilter] = useState<TriageFilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const currentFilter = activeFilter ?? internalFilter;
  const setFilter = (next: TriageFilterType) => {
    if (onFilterChange) onFilterChange(next);
    setInternalFilter(next);
  };

  const filtered = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patient_id.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (currentFilter === 'rapid') return p.isRapidProgressor;
    if (currentFilter === 'very_high') return p.kdigoTier === 'very_high';
    if (currentFilter === 'diabetes') return p.has_diabetes;
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
    <Card className="overflow-hidden border border-slate-200/80 shadow-xs">
      <CardHeader className="p-4 sm:p-5 border-b border-slate-100/90 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Cardiorenal Population Triage Registry
              </CardTitle>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60">
                {filtered.length} Patients
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              Stratified by historical eGFR decline rate (CKD-EPI 2021) and 5-year ESKD dialysis risk (Tangri KFRE).
            </p>
          </div>

          {/* Compact Inline Search Filter */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 rounded-lg border border-slate-200 bg-slate-50/70 pl-8 pr-7 text-xs text-slate-900 placeholder:text-slate-400 transition-all focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                title="Clear filter"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Chips / Segmented Control */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentFilter === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 border border-transparent'
            }`}
          >
            All Cohort ({patients.length})
          </button>
          <button
            onClick={() => setFilter('rapid')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentFilter === 'rapid'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/70'
            }`}
          >
            <AlertCircle className="h-3 w-3" />
            Rapid Decliners ({patients.filter((p) => p.isRapidProgressor).length})
          </button>
          <button
            onClick={() => setFilter('very_high')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentFilter === 'very_high'
                ? 'bg-orange-600 text-white shadow-2xs'
                : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200/70'
            }`}
          >
            KDIGO Very High ({patients.filter((p) => p.kdigoTier === 'very_high').length})
          </button>
          <button
            onClick={() => setFilter('diabetes')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentFilter === 'diabetes'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/70'
            }`}
          >
            Diabetic Kidney ({patients.filter((p) => p.has_diabetes).length})
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 text-slate-500 font-semibold border-b border-slate-200/80 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-4 text-left">Patient Profile</th>
                <th className="py-2.5 px-3 text-left">Vitals & Comorbidities</th>
                <th className="py-2.5 px-3 text-right">Current eGFR</th>
                <th className="py-2.5 px-3 text-right">eGFR Slope</th>
                <th className="py-2.5 px-3 text-right">uACR</th>
                <th className="py-2.5 px-3 text-right">5-Yr Dialysis Risk</th>
                <th className="py-2.5 px-3 text-center">KDIGO Tier</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No patients match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((patient) => (
                  <tr
                    key={patient.patient_id}
                    className="hover:bg-slate-50/75 transition-colors group"
                  >
                    {/* 1. Patient Profile */}
                    <td className="py-3 px-4">
                      <Link
                        to={ROUTES.PATIENT_DETAIL(patient.patient_id)}
                        className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors block text-xs sm:text-sm"
                      >
                        {patient.name}
                      </Link>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {patient.patient_id} • {patient.age}y {patient.sex.toUpperCase()}
                      </div>
                    </td>

                    {/* 2. Vitals & Comorbidities */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800 font-mono text-xs">
                        {formatBP(patient.systolic_bp, patient.diastolic_bp)}
                      </div>
                      <div className="flex gap-1 mt-1">
                        {patient.has_diabetes && (
                          <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 bg-blue-50 text-blue-700 rounded border border-blue-200/70">
                            T2D
                          </span>
                        )}
                        {patient.has_hypertension && (
                          <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 bg-amber-50 text-amber-700 rounded border border-amber-200/70">
                            HTN
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 3. Current eGFR (Right-aligned tabular) */}
                    <td className="py-3 px-3 text-right font-mono">
                      <span className="font-bold text-slate-900 text-xs">
                        {formatEgfr(patient.currentEgfr)}
                      </span>
                      <span className="text-[10px] ml-1.5 px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200/80 font-semibold">
                        {patient.kdigoGStage}
                      </span>
                    </td>

                    {/* 4. eGFR Slope (Right-aligned tabular) */}
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <span
                          className={`font-mono font-bold text-xs ${
                            patient.egfrSlopeAnnual <= -3.0 ? 'text-rose-600' : 'text-slate-700'
                          }`}
                        >
                          {formatSlope(patient.egfrSlopeAnnual)}
                        </span>
                        {patient.isRapidProgressor && (
                          <Badge variant="rapid" className="text-[10px] py-0 px-1.5 font-mono">
                            Rapid
                          </Badge>
                        )}
                      </div>
                    </td>

                    {/* 5. uACR (Right-aligned tabular) */}
                    <td className="py-3 px-3 text-right font-mono text-slate-700">
                      <span className="font-bold text-xs">{patient.uacr.toFixed(0)}</span>{' '}
                      <span className="text-slate-400 text-[10px]">mg/g ({patient.kdigoAStage})</span>
                    </td>

                    {/* 6. 5-Yr Dialysis Risk (Right-aligned tabular) */}
                    <td className="py-3 px-3 text-right font-mono">
                      <span
                        className={`font-bold text-xs ${
                          patient.kfre5YearPercent >= 15
                            ? 'text-rose-600'
                            : patient.kfre5YearPercent >= 5
                            ? 'text-amber-600'
                            : 'text-slate-800'
                        }`}
                      >
                        {formatRiskPercent(patient.kfre5YearPercent)}
                      </span>
                    </td>

                    {/* 7. KDIGO Tier (Centered) */}
                    <td className="py-3 px-3 text-center">
                      {getTierBadge(patient.kdigoTier)}
                    </td>

                    {/* 8. Actions (Right-aligned) */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onOpenOutreach && (
                          <Button
                            size="sm"
                            variant="ghost"
                            shape="rounded"
                            onClick={() => onOpenOutreach(patient)}
                            title="Simulate WhatsApp Outreach"
                            className="h-8 w-8 p-0 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        )}
                        <Link to={ROUTES.PATIENT_DETAIL(patient.patient_id)}>
                          <Button
                            size="sm"
                            variant="outline"
                            shape="rounded"
                            className="h-8 px-2.5 font-semibold text-xs gap-1 rounded-lg hover:border-indigo-300 hover:text-indigo-600"
                          >
                            <span>Copilot</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
