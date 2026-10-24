import React, { useState, useEffect } from 'react';
import {
  GenoBridgeDataAdapter,
  CoupleRecord,
  PopulationEpidemiology,
  SYNTHETIC_COUPLES,
  POPULATION_EPIDEMIOLOGY,
} from '@/entities/genomics';
import { GenoTriageTable } from '@/widgets/geno-triage-table/ui/GenoTriageTable';
import { GenoClinicalBriefModal } from '@/widgets/geno-clinical-brief-modal/ui/GenoClinicalBriefModal';
import { GenoPopulationHeatmap } from '@/widgets/geno-population-heatmap/ui/GenoPopulationHeatmap';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Activity,
  Layers,
  RefreshCw,
} from 'lucide-react';

export const GenoCounselorPage: React.FC = () => {
  const [couples, setCouples] = useState<CoupleRecord[]>(SYNTHETIC_COUPLES);
  const [epidemiology, setEpidemiology] = useState<PopulationEpidemiology>(POPULATION_EPIDEMIOLOGY);
  const [selectedCouple, setSelectedCouple] = useState<CoupleRecord>(SYNTHETIC_COUPLES[0]);
  const [activeView, setActiveView] = useState<'triage' | 'population'>('triage');
  const [engineMode, setEngineMode] = useState<'LIVE_API' | 'LOCAL_MOCK'>('LOCAL_MOCK');
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const [couplesData, epiData] = await Promise.all([
      GenoBridgeDataAdapter.getCouples(),
      GenoBridgeDataAdapter.getEpidemiology(),
    ]);
    setCouples(couplesData);
    setEpidemiology(epiData);
    setEngineMode(GenoBridgeDataAdapter.getMode());
    if (couplesData.length > 0) {
      setSelectedCouple(couplesData[0]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Top Banner / Portal Bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white shadow-xs">
              GB
            </div>
            <div>
              <h1 className="text-base font-bold text-white flex items-center gap-2">
                GENO-BRIDGE Clinical Genetics Workspace
                <Badge variant="subtle" size="sm" shape="pill" className="bg-slate-800 text-emerald-400 border-slate-700 text-[10px]">
                  DoH Abu Dhabi Certified
                </Badge>
              </h1>
              <p className="text-xs text-slate-400">
                Premarital Clinical Decision Support & Malaffi HIE Referral Gateway
              </p>
            </div>
          </div>

          {/* Engine Status & Switcher */}
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              size="sm"
              shape="pill"
              className="text-xs bg-slate-800/80 text-slate-300 border-slate-700"
            >
              Engine:{' '}
              <span className="text-emerald-400 font-semibold ml-1">
                {engineMode === 'LIVE_API' ? 'FastAPI :8000' : 'In-Memory FHIR Mirror'}
              </span>
            </Badge>

            <Button
              onClick={loadData}
              variant="outline"
              size="sm"
              className="h-8 text-xs border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-transform duration-75 active:scale-[0.96] cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveView('triage')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors duration-150 ease-out active:scale-[0.98] cursor-pointer ${
              activeView === 'triage'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            Prioritized Couple Triage & AI Brief
          </button>
          <button
            onClick={() => setActiveView('population')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors duration-150 ease-out active:scale-[0.98] cursor-pointer ${
              activeView === 'population'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-4 h-4" />
            Population Epidemiology & Health Economics
          </button>
        </div>

        {/* View 1: Triage Table + Active Couple Clinical Brief */}
        {activeView === 'triage' && (
          <div key="triage" className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-enter-smooth">
            {/* Triage Queue Table */}
            <div className="lg:col-span-7">
              <GenoTriageTable
                couples={couples}
                onSelectCouple={(c) => setSelectedCouple(c)}
                selectedCoupleId={selectedCouple.couple_id}
              />
            </div>

            {/* In-depth 1-Click AI Clinical Brief for Selected Couple */}
            <div className="lg:col-span-5">
              <GenoClinicalBriefModal couple={selectedCouple} />
            </div>
          </div>
        )}

        {/* View 2: Population Epidemiology & Savings */}
        {activeView === 'population' && (
          <div key="population" className="animate-enter-smooth">
            <GenoPopulationHeatmap data={epidemiology} />
          </div>
        )}
      </div>
    </div>
  );
};
