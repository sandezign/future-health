import React, { useState } from 'react';
import { Card } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { CoupleRecord } from '@/entities/genomics';
import {
  Search,
  Filter,
  ChevronRight,
} from 'lucide-react';

interface Props {
  couples: CoupleRecord[];
  onSelectCouple: (couple: CoupleRecord) => void;
  selectedCoupleId?: string;
}

export const GenoTriageTable: React.FC<Props> = ({
  couples,
  onSelectCouple,
  selectedCoupleId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const filteredCouples = couples.filter((c) => {
    const matchesSearch =
      c.couple_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.partner_a.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.partner_b.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.target_gene && c.target_gene.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRegion =
      selectedRegion === 'all' || c.region === selectedRegion;

    const matchesSeverity =
      severityFilter === 'all' ||
      (severityFilter === 'incompatible' && c.overall_status === 'INCOMPATIBLE') ||
      (severityFilter === 'urgent' && c.triage_priority === 'TIER_1_URGENT') ||
      (severityFilter === 'compatible' && c.overall_status === 'COMPATIBLE');

    return matchesSearch && matchesRegion && matchesSeverity;
  });

  return (
    <Card className="p-5 border-slate-200 bg-white shadow-sm">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Premarital Genomic Triage Queue
          </h3>
          <p className="text-xs text-slate-500">
            Categorized by Disease Severity (ACMG) and Wedding Proximity
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, gene, or name..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
        <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
          <Filter className="w-3 h-3" /> Filters:
        </span>
        {['all', 'urgent', 'incompatible', 'compatible'].map((f) => (
          <button
            key={f}
            onClick={() => setSeverityFilter(f)}
            className={`px-2.5 py-1 rounded-full transition-colors duration-150 ease-out active:scale-[0.96] cursor-pointer text-xs font-medium capitalize ${
              severityFilter === f
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f}
          </button>
        ))}

        <div className="h-4 w-px bg-slate-200 mx-1" />

        {['all', 'Abu Dhabi Central', 'Al Ain', 'Al Dhafra'].map((r) => (
          <button
            key={r}
            onClick={() => setSelectedRegion(r)}
            className={`px-2.5 py-1 rounded-full transition-colors duration-150 ease-out active:scale-[0.96] cursor-pointer text-xs font-medium ${
              selectedRegion === r
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {r === 'all' ? 'All Regions' : r}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-medium">
              <th className="pb-2.5 pl-2 font-semibold">Couple ID</th>
              <th className="pb-2.5 font-semibold">Partners</th>
              <th className="pb-2.5 font-semibold">Region</th>
              <th className="pb-2.5 font-semibold">Wedding In</th>
              <th className="pb-2.5 font-semibold">Gene Overlap</th>
              <th className="pb-2.5 font-semibold">Triage Priority</th>
              <th className="pb-2.5 pr-2 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCouples.map((c) => {
              const isSelected = c.couple_id === selectedCoupleId;
              return (
                <tr
                  key={c.couple_id}
                  onClick={() => onSelectCouple(c)}
                  className={`hover:bg-slate-50/80 cursor-pointer transition-colors duration-100 ease-out ${
                    isSelected ? 'bg-emerald-50/60 font-medium' : ''
                  }`}
                >
                  <td className="py-3 pl-2 font-mono font-semibold text-slate-800">
                    {c.couple_id}
                  </td>
                  <td className="py-3">
                    <div className="font-semibold text-slate-900">{c.partner_a.full_name}</div>
                    <div className="text-[11px] text-slate-500">& {c.partner_b.full_name}</div>
                  </td>
                  <td className="py-3 text-slate-600">{c.region}</td>
                  <td className="py-3">
                    <span
                      className={`font-semibold ${
                        c.days_until_wedding <= 30
                          ? 'text-rose-600'
                          : c.days_until_wedding <= 60
                          ? 'text-amber-600'
                          : 'text-slate-600'
                      }`}
                    >
                      {c.days_until_wedding} days
                    </span>
                    <div className="text-[10px] text-slate-400">{c.wedding_date}</div>
                  </td>
                  <td className="py-3">
                    {c.target_gene ? (
                      <div>
                        <span className="font-bold text-slate-900">{c.target_gene}</span>
                        <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
                          {c.condition_name}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">None (Cleared)</span>
                    )}
                  </td>
                  <td className="py-3">
                    {c.triage_priority === 'TIER_1_URGENT' && (
                      <Badge variant="danger" shape="pill" size="sm">
                        Tier 1 Urgent
                      </Badge>
                    )}
                    {c.triage_priority === 'TIER_1_ROUTINE' && (
                      <Badge variant="warning" shape="pill" size="sm">
                        Tier 1 Routine
                      </Badge>
                    )}
                    {c.triage_priority === 'TIER_2_MODERATE' && (
                      <Badge variant="subtle" shape="pill" size="sm">
                        Tier 2 Moderate
                      </Badge>
                    )}
                    {c.triage_priority === 'COMPATIBLE' && (
                      <Badge variant="success" shape="pill" size="sm">
                        Compatible
                      </Badge>
                    )}
                  </td>
                  <td className="py-3 pr-2 text-right">
                    <Button
                      variant={isSelected ? 'primary' : 'outline'}
                      size="sm"
                      className="h-7 text-xs px-2.5 transition-transform duration-75 active:scale-[0.96] cursor-pointer"
                    >
                      Brief <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
