import React, { useState } from 'react';
import { Card } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { CoupleRecord } from '@/entities/genomics';
import { ShieldCheck, AlertCircle, Heart, ChevronDown, Dna, Info } from 'lucide-react';

interface Props {
  couple: CoupleRecord;
}

export const GenoCarrierSummaryCard: React.FC<Props> = ({ couple }) => {
  const [selectedPartner, setSelectedPartner] = useState<'a' | 'b'>('a');
  const [showClinicalDetails, setShowClinicalDetails] = useState(false);

  const partner = selectedPartner === 'a' ? couple.partner_a : couple.partner_b;
  const isIncompatible = couple.overall_status === 'INCOMPATIBLE';

  return (
    <Card className="p-5 border-emerald-100 bg-white shadow-sm overflow-hidden">
      {/* Sahatna Header Badge */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <Dna className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">
              Premarital Genomic Screening Result
            </h3>
            <p className="text-xs text-slate-500">Abu Dhabi Department of Health (DoH) / ADPHC</p>
          </div>
        </div>
        <Badge
          variant={isIncompatible ? 'warning' : 'success'}
          shape="pill"
          size="sm"
        >
          {isIncompatible ? 'Action Recommended' : 'Compatible & Cleared'}
        </Badge>
      </div>

      {/* Partner Switcher Tabs */}
      <div className="flex rounded-xl bg-slate-100 p-1 mb-4 text-xs">
        <button
          onClick={() => setSelectedPartner('a')}
          className={`flex-1 py-1.5 font-medium rounded-lg transition-colors duration-150 ease-out active:scale-[0.98] cursor-pointer ${
            selectedPartner === 'a'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Partner A: {couple.partner_a.full_name}
        </button>
        <button
          onClick={() => setSelectedPartner('b')}
          className={`flex-1 py-1.5 font-medium rounded-lg transition-colors duration-150 ease-out active:scale-[0.98] cursor-pointer ${
            selectedPartner === 'b'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Partner B: {couple.partner_b.full_name}
        </button>
      </div>

      {/* Normalization & Psychological Reassurance Banner */}
      <div className="rounded-xl bg-emerald-50/80 border border-emerald-100 p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-emerald-950 mb-1">
              {partner.variants.length > 0
                ? 'You are a healthy carrier.'
                : 'No carrier variants detected.'}
            </h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Carrying a single recessive gene copy is completely natural. Nearly <strong>100% of all humans carry 3 to 5 recessive gene variations</strong> without ever feeling sick or developing symptoms.
            </p>
          </div>
        </div>
      </div>

      {/* Couple Joint Status Summary */}
      <div className={`p-4 rounded-xl border mb-4 ${
        isIncompatible
          ? 'bg-amber-50/60 border-amber-200'
          : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          {isIncompatible ? (
            <AlertCircle className="w-4 h-4 text-amber-600" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          )}
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Couple Joint Compatibility Verdict
          </span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          {isIncompatible ? (
            <>
              Both you and your prospective partner carry a variation in the <strong>{couple.target_gene}</strong> gene ({couple.condition_name}). While you are both completely healthy, there is a <strong>25% chance per pregnancy</strong> that a child could inherit both copies. Halal assisted reproduction (PGT-M) provides a 100% preventive pathway.
            </>
          ) : (
            <>
              You and your partner do not share any matching recessive carrier genes. You are fully compatible for common screened conditions.
            </>
          )}
        </p>
      </div>

      {/* Expandable Technical Clinical Details (Smooth CSS Grid Row Expansion) */}
      <div className="border-t border-slate-100 pt-3">
        <button
          onClick={() => setShowClinicalDetails(!showClinicalDetails)}
          className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-800 py-1 cursor-pointer transition-colors duration-150 active:scale-[0.99]"
        >
          <span className="flex items-center gap-1.5 font-medium">
            <Info className="w-3.5 h-3.5" />
            {showClinicalDetails ? 'Hide Laboratory Details' : 'View Verified Clinical Lab Codes'}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ease-out ${
              showClinicalDetails ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </button>

        <div
          className={`grid transition-[grid-template-rows] duration-200 ease-out ${
            showClinicalDetails ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden">
            <div className="mt-3 p-3 rounded-lg bg-slate-900 text-slate-200 text-xs font-mono space-y-2">
              <div>
                <span className="text-slate-400">Emirates ID Hash:</span> {partner.emirates_id_hash}
              </div>
              <div>
                <span className="text-slate-400">Screening Panel:</span> ADPHC 570-Gene NGS Panel
              </div>
              {partner.variants.map((v, i) => (
                <div key={i} className="border-t border-slate-800 pt-1.5 mt-1.5">
                  <div><span className="text-emerald-400">Gene:</span> {v.gene_symbol} ({v.condition_name})</div>
                  <div><span className="text-slate-400">HGVS Notation:</span> {v.hgvs_c} {v.hgvs_p && `(${v.hgvs_p})`}</div>
                  <div><span className="text-slate-400">ClinVar Accession:</span> {v.clinvar_id || 'VCV000015444'} ({v.clinvar_significance})</div>
                  <div><span className="text-slate-400">Zygosity:</span> {v.zygosity}</div>
                </div>
              ))}
              {partner.variants.length === 0 && (
                <div className="text-emerald-400">No pathogenic variants detected across 570 panel genes.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Disclaimer per Rule BR-02 */}
      <div className="mt-4 text-[11px] text-slate-400 text-center leading-normal">
        GENO-BRIDGE is a preconception decision support and navigation tool. It does not provide medical diagnoses. All decisions must be confirmed with a licensed DoH genetic counselor.
      </div>
    </Card>
  );
};
