import React, { useState } from 'react';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  geneSymbol?: string;
  conditionName?: string;
}

export const GenoMendelianSimulator: React.FC<Props> = ({
  geneSymbol = 'HBB',
  conditionName = 'Beta-Thalassemia Major',
}) => {
  const [selectedQuadrant, setSelectedQuadrant] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<('unaffected' | 'carrier' | 'affected')[]>([]);

  const handleSimulateRoll = () => {
    if (isRolling) return;
    setIsRolling(true);

    // Natural physical deceleration sequence (steps slow down as it settles)
    const delays = [60, 70, 90, 120, 160, 220, 300];
    let currentStep = 0;

    const runStep = () => {
      setSelectedQuadrant(Math.floor(Math.random() * 4));
      currentStep++;

      if (currentStep < delays.length) {
        setTimeout(runStep, delays[currentStep]);
      } else {
        // True random 25% / 50% / 25%
        const rand = Math.random();
        let outcome: 'unaffected' | 'carrier' | 'affected';
        let quadIdx: number;
        if (rand < 0.25) {
          outcome = 'unaffected';
          quadIdx = 0;
        } else if (rand < 0.75) {
          outcome = 'carrier';
          quadIdx = Math.random() < 0.5 ? 1 : 2;
        } else {
          outcome = 'affected';
          quadIdx = 3;
        }
        setSelectedQuadrant(quadIdx);
        setHistory((prev) => [outcome, ...prev].slice(0, 8));
        setIsRolling(false);
      }
    };

    setTimeout(runStep, delays[0]);
  };

  const resetHistory = () => {
    setHistory([]);
    setSelectedQuadrant(null);
  };

  return (
    <Card className="p-5 border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            4-Quadrant Mendelian Risk Simulator
          </h3>
          <p className="text-xs text-slate-500">
            Target Gene: <strong>{geneSymbol}</strong> ({conditionName})
          </p>
        </div>
        <Badge variant="outline" shape="pill" size="sm">
          25% Risk Per Pregnancy
        </Badge>
      </div>

      <p className="text-xs text-slate-600 mb-4 leading-relaxed">
        When both partners carry one recessive variant ($Aa \times Aa$), every pregnancy has independent odds. Tap to simulate how odds operate across pregnancies.
      </p>

      {/* 4-Quadrant Punnett Grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {/* Q1: Unaffected Non-Carrier (25%) */}
        <div
          className={`p-3.5 rounded-xl border text-center transition-[transform,box-shadow,background-color] duration-150 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
            selectedQuadrant === 0
              ? 'ring-2 ring-emerald-500 bg-emerald-50 border-emerald-300 scale-[1.02] shadow-sm'
              : 'bg-emerald-50/50 border-emerald-100 hover:border-emerald-200'
          }`}
        >
          <div className="w-6 h-6 mx-auto mb-1 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
            AA
          </div>
          <div className="text-xs font-semibold text-emerald-900">Unaffected</div>
          <div className="text-[11px] text-emerald-700 font-medium">25% Probability</div>
          <div className="text-[10px] text-emerald-600 mt-1">Zero variant copies inherited</div>
        </div>

        {/* Q2: Carrier Partner A allele (25%) */}
        <div
          className={`p-3.5 rounded-xl border text-center transition-[transform,box-shadow,background-color] duration-150 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
            selectedQuadrant === 1
              ? 'ring-2 ring-indigo-500 bg-indigo-50 border-indigo-300 scale-[1.02] shadow-sm'
              : 'bg-indigo-50/40 border-indigo-100 hover:border-indigo-200'
          }`}
        >
          <div className="w-6 h-6 mx-auto mb-1 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
            Aa
          </div>
          <div className="text-xs font-semibold text-indigo-900">Healthy Carrier</div>
          <div className="text-[11px] text-indigo-700 font-medium">25% (Total 50%)</div>
          <div className="text-[10px] text-indigo-600 mt-1">One copy from father</div>
        </div>

        {/* Q3: Carrier Partner B allele (25%) */}
        <div
          className={`p-3.5 rounded-xl border text-center transition-[transform,box-shadow,background-color] duration-150 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
            selectedQuadrant === 2
              ? 'ring-2 ring-indigo-500 bg-indigo-50 border-indigo-300 scale-[1.02] shadow-sm'
              : 'bg-indigo-50/40 border-indigo-100 hover:border-indigo-200'
          }`}
        >
          <div className="w-6 h-6 mx-auto mb-1 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
            aA
          </div>
          <div className="text-xs font-semibold text-indigo-900">Healthy Carrier</div>
          <div className="text-[11px] text-indigo-700 font-medium">25% (Total 50%)</div>
          <div className="text-[10px] text-indigo-600 mt-1">One copy from mother</div>
        </div>

        {/* Q4: Affected Child (25%) */}
        <div
          className={`p-3.5 rounded-xl border text-center transition-[transform,box-shadow,background-color] duration-150 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
            selectedQuadrant === 3
              ? 'ring-2 ring-rose-500 bg-rose-50 border-rose-300 scale-[1.02] shadow-sm'
              : 'bg-rose-50/50 border-rose-100 hover:border-rose-200'
          }`}
        >
          <div className="w-6 h-6 mx-auto mb-1 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold">
            aa
          </div>
          <div className="text-xs font-semibold text-rose-900">Affected Condition</div>
          <div className="text-[11px] text-rose-700 font-medium">25% Probability</div>
          <div className="text-[10px] text-rose-600 mt-1">Both copies inherited</div>
        </div>
      </div>

      {/* Action Simulation Controls */}
      <div className="flex items-center gap-2 mb-4">
        <Button
          onClick={handleSimulateRoll}
          disabled={isRolling}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white transition-transform duration-75 active:scale-[0.98] cursor-pointer"
          size="sm"
        >
          <Sparkles className="w-3.5 h-3.5 mr-1" />
          {isRolling ? 'Simulating Pregnancy...' : 'Simulate Pregnancy Outcome'}
        </Button>
        {history.length > 0 && (
          <Button
            onClick={resetHistory}
            variant="outline"
            size="sm"
            className="text-slate-500 hover:text-slate-700 transition-transform duration-75 active:scale-[0.96] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      {/* Simulated Outcomes Tracker */}
      {history.length > 0 && (
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 mb-3">
          <div className="text-[11px] font-semibold text-slate-700 mb-2">
            Simulated Pregnancies History ({history.length} trials):
          </div>
          <div className="flex flex-wrap gap-1.5">
            {history.map((outcome, idx) => (
              <span
                key={idx}
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  outcome === 'unaffected'
                    ? 'bg-emerald-100 text-emerald-800'
                    : outcome === 'carrier'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                #{history.length - idx}: {outcome}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Gambler's Fallacy Reassurance Alert */}
      <div className="rounded-xl bg-amber-50/70 border border-amber-200 p-3 text-xs text-amber-900 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold">Independent Event Invariant:</strong> Having an affected child in one pregnancy does <em>not</em> protect the next child. Every single pregnancy carries the exact same independent 25% risk.
        </div>
      </div>
    </Card>
  );
};
