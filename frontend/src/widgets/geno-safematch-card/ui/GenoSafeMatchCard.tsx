import React, { useState, useEffect } from 'react';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { ShieldCheck, Lock, QrCode, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { buildBloomFilterHex, GenoBridgeDataAdapter, CoupleRecord } from '@/entities/genomics';

interface Props {
  couple?: CoupleRecord;
}

export const GenoSafeMatchCard: React.FC<Props> = ({ couple }) => {
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionCode, setSessionCode] = useState('749-218');
  const initialGene = couple?.target_gene || 'HBB';
  const [partnerAGenes, setPartnerAGenes] = useState<string[]>([initialGene]);
  const [partnerBGenes, setPartnerBGenes] = useState<string[]>([initialGene]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<{
    verdict: string;
    matchDetected: boolean;
    proofHash: string;
    timestamp: string;
  } | null>(null);

  useEffect(() => {
    if (couple) {
      const gA = couple.partner_a.variants.map((v) => v.gene_symbol);
      const gB = couple.partner_b.variants.map((v) => v.gene_symbol);
      setPartnerAGenes(gA.length > 0 ? gA : ['HBB']);
      setPartnerBGenes(gB.length > 0 ? gB : (couple.target_gene ? [couple.target_gene] : ['CFTR']));
      setResult(null);
    }
  }, [couple]);

  const startSession = () => {
    const randomCode = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`;
    setSessionCode(randomCode);
    setSessionActive(true);
    setResult(null);
  };

  const handleExecuteSafeMatch = async () => {
    setIsVerifying(true);
    const salt = 'ae_safematch_' + Date.now().toString(16);

    // Compute client-side Bloom filters
    const filterA = buildBloomFilterHex(partnerAGenes, salt);
    const filterB = buildBloomFilterHex(partnerBGenes, salt);

    // Call adapter (online API or local Web Crypto engine)
    const verification = await GenoBridgeDataAdapter.verifyZKP(filterA, filterB, salt);

    setTimeout(() => {
      setResult({
        verdict: verification.verdict,
        matchDetected: verification.match_detected,
        proofHash: verification.verification_hash,
        timestamp: new Date().toLocaleTimeString(),
      });
      setIsVerifying(false);
    }, 700);
  };

  return (
    <Card className="p-5 border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Pre-Engagement SafeMatch (ZKP)
            </h3>
            <p className="text-xs text-slate-500">Zero-Knowledge Compatibility Verification</p>
          </div>
        </div>
        <Badge variant="subtle" shape="pill" size="sm">
          Privacy Protected
        </Badge>
      </div>

      <p className="text-xs text-slate-600 mb-4 leading-relaxed">
        Verify carrier compatibility privately with a prospective partner <strong>before involving families or announcing an engagement</strong>. Uses client-side cryptographic hashing—neither partner sees the other&apos;s genetic data or unshared traits.
      </p>

      {!sessionActive ? (
        <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center bg-slate-50">
          <QrCode className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h4 className="text-xs font-semibold text-slate-800 mb-1">
            Initiate a Confidential Pairing Session
          </h4>
          <p className="text-[11px] text-slate-500 mb-4 max-w-xs mx-auto">
            Generates a private 15-minute pairing code. Both mobile devices compute local salted filters before comparing.
          </p>
          <Button
            onClick={startSession}
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white transition-transform duration-75 active:scale-[0.98] cursor-pointer"
          >
            Create SafeMatch Session
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Active Pairing Badge */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/70 border border-indigo-100">
            <div>
              <div className="text-[10px] text-indigo-700 font-medium uppercase tracking-wider">
                Active Session Pairing Code
              </div>
              <div className="text-lg font-mono font-bold text-indigo-950">
                {sessionCode}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="subtle" size="sm" shape="pill">
                14:48 remaining
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={startSession}
                className="h-7 px-2 text-xs text-slate-600"
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Interactive Scenario Presets for Testing */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-semibold text-slate-700 block mb-2">
              Simulate Match Scenario:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setPartnerAGenes(['PAH']);
                  setPartnerBGenes(['PAH']);
                  setResult(null);
                }}
                className={`py-1.5 px-2 rounded-lg border text-left transition-colors duration-150 ease-out active:scale-[0.98] cursor-pointer ${
                  partnerAGenes.includes('PAH') && partnerBGenes.includes('PAH')
                    ? 'border-indigo-400 bg-indigo-50/50 font-medium text-indigo-900'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                ★ Both PAH (PKU Match)
              </button>
              <button
                onClick={() => {
                  setPartnerAGenes(['HBB']);
                  setPartnerBGenes(['HBB']);
                  setResult(null);
                }}
                className={`py-1.5 px-2 rounded-lg border text-left transition-colors duration-150 ease-out active:scale-[0.98] cursor-pointer ${
                  partnerAGenes.includes('HBB') && partnerBGenes.includes('HBB')
                    ? 'border-indigo-400 bg-indigo-50/50 font-medium text-indigo-900'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                Both HBB (Thalassemia)
              </button>
              <button
                onClick={() => {
                  setPartnerAGenes(['HBB']);
                  setPartnerBGenes(['CFTR']);
                  setResult(null);
                }}
                className={`py-1.5 px-2 rounded-lg border text-left transition-colors duration-150 ease-out active:scale-[0.98] cursor-pointer ${
                  partnerAGenes.includes('HBB') && partnerBGenes.includes('CFTR')
                    ? 'border-indigo-400 bg-indigo-50/50 font-medium text-indigo-900'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                Disparate (Compatible)
              </button>
              <button
                onClick={() => {
                  setPartnerAGenes([]);
                  setPartnerBGenes([]);
                  setResult(null);
                }}
                className={`py-1.5 px-2 rounded-lg border text-left transition-colors duration-150 ease-out active:scale-[0.98] cursor-pointer ${
                  partnerAGenes.length === 0 && partnerBGenes.length === 0
                    ? 'border-indigo-400 bg-indigo-50/50 font-medium text-indigo-900'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                Wild-Type (Clean)
              </button>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleExecuteSafeMatch}
            disabled={isVerifying}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-transform duration-75 active:scale-[0.98] cursor-pointer"
            size="sm"
          >
            {isVerifying ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Computing Client Bloom Filter Intersection...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Authorize & Verify SafeMatch
              </span>
            )}
          </Button>

          {/* Result Card */}
          {result && (
            <div
              className={`p-4 rounded-xl border animate-enter-smooth ${
                result.matchDetected
                  ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                  : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {result.matchDetected ? (
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-1">
                    {result.matchDetected
                      ? 'Pre-Engagement Genetic Counseling Recommended'
                      : 'Compatible — No Shared Carrier Risk'}
                  </h4>
                  <p className="text-xs leading-relaxed mb-2">
                    {result.matchDetected
                      ? 'An overlapping recessive carrier condition was mathematically detected. Specific gene and disease names are shielded to protect mutual privacy. We encourage scheduling a confidential clinical consultation to explore safe modern family planning options.'
                      : 'No overlapping recessive carrier risk was found across the panel. You can proceed with peace of mind.'}
                  </p>
                  <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200/60">
                    Proof Token: {result.proofHash.slice(0, 24)}... (Zero cleartext DNA transmitted)
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
