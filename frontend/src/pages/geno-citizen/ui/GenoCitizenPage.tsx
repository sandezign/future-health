import React, { useState, useEffect } from 'react';
import {
  GenoBridgeDataAdapter,
  CoupleRecord,
  SYNTHETIC_COUPLES,
} from '@/entities/genomics';
import { GenoCitizenStartPage } from '@/widgets/geno-citizen-start';
import { GenoCarrierSummaryCard } from '@/widgets/geno-carrier-summary/ui/GenoCarrierSummaryCard';
import { GenoMendelianSimulator } from '@/widgets/geno-mendelian-simulator/ui/GenoMendelianSimulator';
import { GenoSafeMatchCard } from '@/widgets/geno-safematch-card/ui/GenoSafeMatchCard';
import { GenoHalalRoadmap } from '@/widgets/geno-halal-roadmap/ui/GenoHalalRoadmap';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Dna,
  Sparkles,
  Lock,
  HeartHandshake,
  PhoneCall,
  ArrowLeft,
  Compass,
} from 'lucide-react';

export const GenoCitizenPage: React.FC = () => {
  const [couples, setCouples] = useState<CoupleRecord[]>(SYNTHETIC_COUPLES);
  // Default to the new pre-engagement scenario CPL-09 or CPL-01
  const [selectedCoupleId, setSelectedCoupleId] = useState<string>('CPL-09');
  const [activeTab, setActiveTab] = useState<'hub' | 'results' | 'simulator' | 'safematch' | 'halal'>('hub');
  const [engineMode, setEngineMode] = useState<'LIVE_API' | 'LOCAL_MOCK'>('LOCAL_MOCK');

  useEffect(() => {
    GenoBridgeDataAdapter.getCouples().then((data) => {
      setCouples(data);
      setEngineMode(GenoBridgeDataAdapter.getMode());
    });
  }, []);

  const activeCouple = couples.find((c) => c.couple_id === selectedCoupleId) || couples[0];

  return (
    <div className="min-h-screen bg-slate-100/70 py-6 px-3 flex flex-col items-center">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-[430px] flex flex-col gap-4">
        {/* Top Header / Sahatna App Shell */}
        <header className="bg-emerald-800 text-white p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-700 flex items-center justify-center font-bold text-xs">
                GB
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight">GENO-BRIDGE Mobile</h1>
                <p className="text-[10px] text-emerald-200">Sahatna Preconception Portal</p>
              </div>
            </div>
            <Badge
              variant="subtle"
              size="sm"
              shape="pill"
              className="bg-emerald-900/60 text-emerald-200 text-[10px] border-emerald-700"
            >
              {engineMode === 'LIVE_API' ? 'Live API :8000' : 'Local WebCrypto ZKP'}
            </Badge>
          </div>

          {/* Quick Scenario Picker (for Reviewers / Demo) */}
          <div className="mt-2 pt-2 border-t border-emerald-700/60 flex items-center justify-between text-xs">
            <span className="text-emerald-200 text-[11px] font-medium">Scenario:</span>
            <select
              value={selectedCoupleId}
              onChange={(e) => setSelectedCoupleId(e.target.value)}
              className="bg-emerald-900/90 text-white text-xs rounded-lg px-2 py-1 border border-emerald-600 focus:outline-none max-w-[270px] truncate"
            >
              {couples.map((c) => (
                <option key={c.couple_id} value={c.couple_id}>
                  {c.couple_id === 'CPL-09'
                    ? '★ CPL-09 (NEW): Tariq & Reem (PAH Consanguineous)'
                    : `${c.couple_id}: ${c.partner_a.full_name.split(' ')[0]} & ${c.partner_b.full_name.split(' ')[0]} (${c.target_gene || 'Compatible'})`}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* If user is inside a specific sub-feature, show "Back to Hub" Breadcrumb */}
        {activeTab !== 'hub' && (
          <div className="flex items-center justify-between bg-white border border-slate-200/80 px-3 py-2 rounded-xl shadow-2xs">
            <button
              onClick={() => setActiveTab('hub')}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Premarital Hub</span>
            </button>
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
              {activeTab}
            </span>
          </div>
        )}

        {/* Tab Navigation Pill Bar */}
        <nav aria-label="Section tabs" className="flex rounded-xl bg-white p-1 shadow-xs border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('hub')}
            className={`flex-1 py-1.5 font-medium rounded-lg transition-colors duration-150 ease-out active:scale-[0.96] cursor-pointer flex flex-col items-center gap-1 ${
              activeTab === 'hub'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span className="text-[10px]">Hub</span>
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex-1 py-1.5 font-medium rounded-lg transition-colors duration-150 ease-out active:scale-[0.96] cursor-pointer flex flex-col items-center gap-1 ${
              activeTab === 'results'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Dna className="w-4 h-4" />
            <span className="text-[10px]">Results</span>
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex-1 py-1.5 font-medium rounded-lg transition-colors duration-150 ease-out active:scale-[0.96] cursor-pointer flex flex-col items-center gap-1 ${
              activeTab === 'simulator'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px]">Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab('safematch')}
            className={`flex-1 py-1.5 font-medium rounded-lg transition-colors duration-150 ease-out active:scale-[0.96] cursor-pointer flex flex-col items-center gap-1 ${
              activeTab === 'safematch'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span className="text-[10px]">SafeMatch</span>
          </button>
          <button
            onClick={() => setActiveTab('halal')}
            className={`flex-1 py-1.5 font-medium rounded-lg transition-colors duration-150 ease-out active:scale-[0.96] cursor-pointer flex flex-col items-center gap-1 ${
              activeTab === 'halal'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span className="text-[10px]">Halal PGT-M</span>
          </button>
        </nav>

        {/* Active Tab Content (Smooth Entry Elevation) */}
        <main key={activeTab} className="space-y-4 animate-enter-smooth">
          {activeTab === 'hub' && (
            <GenoCitizenStartPage
              couple={activeCouple}
              couples={couples}
              selectedCoupleId={selectedCoupleId}
              onSelectCouple={setSelectedCoupleId}
              onNavigate={(tab) => setActiveTab(tab)}
              engineMode={engineMode}
            />
          )}

          {activeTab === 'results' && (
            <GenoCarrierSummaryCard couple={activeCouple} />
          )}

          {activeTab === 'simulator' && (
            <GenoMendelianSimulator
              geneSymbol={activeCouple.target_gene || 'HBB'}
              conditionName={activeCouple.condition_name || 'Beta-Thalassemia Major'}
            />
          )}

          {activeTab === 'safematch' && (
            <GenoSafeMatchCard couple={activeCouple} />
          )}

          {activeTab === 'halal' && (
            <GenoHalalRoadmap />
          )}
        </main>

        {/* Emergency Counselor Helpline Footer */}
        {activeTab !== 'hub' && (
          <footer className="rounded-xl border border-slate-200 bg-white p-3 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <div>
                <div className="font-semibold text-slate-800">DoH Premarital Counselor Line</div>
                <div className="text-[10px] text-slate-400">Toll-free 800-555 (Confidential)</div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="h-7 text-xs text-emerald-700">
              Call
            </Button>
          </footer>
        )}
      </div>
    </div>
  );
};
