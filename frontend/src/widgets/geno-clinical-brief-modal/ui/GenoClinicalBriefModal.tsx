import React, { useState } from 'react';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { CoupleRecord } from '@/entities/genomics';
import {
  FileText,
  Copy,
  Check,
  Send,
  X,
} from 'lucide-react';

interface Props {
  couple: CoupleRecord;
  onClose?: () => void;
}

export const GenoClinicalBriefModal: React.FC<Props> = ({ couple, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [referred, setReferred] = useState(false);

  const isIncompatible = couple.overall_status === 'INCOMPATIBLE';

  const briefMarkdown = `
# MALAFFI HIE CLINICAL GENETICS BRIEF
Couple ID: ${couple.couple_id} | Region: ${couple.region}
Target Condition: ${couple.condition_name || 'None'} (Gene: ${couple.target_gene || 'N/A'})
Wedding Date: ${couple.wedding_date} (${couple.days_until_wedding} days)
Triage Status: ${couple.triage_priority}

## 1. PARTNER GENOMIC PROFILES (ACMG 2015)
- Partner A: ${couple.partner_a.full_name} (${couple.partner_a.emirates_id_hash})
  ${couple.partner_a.variants.map((v) => `• Variant: ${v.gene_symbol}:${v.hgvs_c} (${v.clinvar_significance}, Zygosity: ${v.zygosity}, ClinVar: ${v.clinvar_id})`).join('\n') || '• No pathogenic variants detected'}

- Partner B: ${couple.partner_b.full_name} (${couple.partner_b.emirates_id_hash})
  ${couple.partner_b.variants.map((v) => `• Variant: ${v.gene_symbol}:${v.hgvs_c} (${v.clinvar_significance}, Zygosity: ${v.zygosity}, ClinVar: ${v.clinvar_id})`).join('\n') || '• No pathogenic variants detected'}

## 2. RECURRENCE RISK ASSESSMENT
- Per-Pregnancy Affected Risk (aa): ${couple.recurrence_risk * 100}%
- Per-Pregnancy Carrier Risk (Aa): 50%
- Per-Pregnancy Unaffected Non-Carrier (AA): 25%

## 3. RECOMMENDED CLINICAL COUNSELING SCRIPT
1. Emphasize that both partners are completely healthy carriers.
2. Dispel Gambler's Fallacy: The 25% risk applies independently to every pregnancy.
3. Present Halal PGT-M / IVF pathway under UAE Fatwa Council clearance with Thiqa full coverage.
4. Issue anonymous cascade risk alert for siblings and first cousins.
`.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(briefMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDispatchReferral = () => {
    setReferred(true);
  };

  return (
    <Card className="p-6 border-slate-200 bg-white shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
              {couple.couple_id}
            </span>
            <Badge
              variant={isIncompatible ? 'danger' : 'success'}
              shape="pill"
              size="sm"
            >
              {couple.triage_priority.replace(/_/g, ' ')}
            </Badge>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Automated Clinical Counseling Brief
          </h2>
          <p className="text-xs text-slate-500">
            Synthesized ACMG / ClinVar / OMIM Decision Support Summary
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="text-xs gap-1.5 transition-transform duration-75 active:scale-[0.97] cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied to Clipboard' : 'Copy for Malaffi HIE'}
          </Button>
          {isIncompatible && (
            <Button
              onClick={handleDispatchReferral}
              disabled={referred}
              size="sm"
              className="text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white transition-transform duration-75 active:scale-[0.97] cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              {referred ? 'PGT-M Referral Dispatched' : '1-Click PGT-M Referral'}
            </Button>
          )}
          {onClose && (
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-xs p-1.5 h-8 w-8 text-slate-400 hover:text-slate-700 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Case Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <span className="text-slate-400 block mb-0.5 font-medium">Screened Condition</span>
          <div className="font-bold text-slate-900 text-sm">
            {couple.condition_name || 'No Shared Recessive Overlap'}
          </div>
          {couple.target_gene && (
            <span className="text-[11px] text-emerald-700 font-mono font-semibold">
              Gene: {couple.target_gene} (OMIM #{couple.omim_id})
            </span>
          )}
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <span className="text-slate-400 block mb-0.5 font-medium">Wedding Proximity</span>
          <div className="font-bold text-slate-900 text-sm">
            {couple.days_until_wedding} days until ceremony
          </div>
          <span className="text-[11px] text-slate-500">Date: {couple.wedding_date}</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <span className="text-slate-400 block mb-0.5 font-medium">Per-Pregnancy Recurrence</span>
          <div className="font-bold text-slate-900 text-sm">
            {couple.recurrence_risk * 100}% Affected Risk
          </div>
          <span className="text-[11px] text-slate-500">50% Carrier | 25% Wild-type</span>
        </div>
      </div>

      {/* Dual Partner Genomic Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Partner A */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-800">
              Partner A: {couple.partner_a.full_name}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {couple.partner_a.emirates_id_hash}
            </span>
          </div>
          {couple.partner_a.variants.length > 0 ? (
            couple.partner_a.variants.map((v, i) => (
              <div key={i} className="text-xs space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="font-mono font-semibold text-emerald-800">
                  {v.gene_symbol}:{v.hgvs_c}
                </div>
                <div className="text-[11px] text-slate-600">
                  {v.clinvar_significance} • {v.zygosity} • ClinVar ID: {v.clinvar_id}
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-500 italic p-2.5 bg-slate-50 rounded-lg">
              Wild-type normal across 570 panel genes.
            </div>
          )}
        </div>

        {/* Partner B */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-800">
              Partner B: {couple.partner_b.full_name}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {couple.partner_b.emirates_id_hash}
            </span>
          </div>
          {couple.partner_b.variants.length > 0 ? (
            couple.partner_b.variants.map((v, i) => (
              <div key={i} className="text-xs space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="font-mono font-semibold text-emerald-800">
                  {v.gene_symbol}:{v.hgvs_c}
                </div>
                <div className="text-[11px] text-slate-600">
                  {v.clinvar_significance} • {v.zygosity} • ClinVar ID: {v.clinvar_id}
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-500 italic p-2.5 bg-slate-50 rounded-lg">
              Wild-type normal across 570 panel genes.
            </div>
          )}
        </div>
      </div>

      {/* Suggested Counselor Discussion Script */}
      <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 mb-4">
        <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-emerald-700" />
          Evidence-Based Counseling Discussion Points (NSGC Guidelines)
        </h4>
        <ul className="text-xs text-emerald-900 space-y-1.5 list-disc list-inside leading-relaxed">
          <li>
            <strong>Reassure Healthy Carrier Status:</strong> Clarify immediately that carrier status is completely normal, asymptomatic, and not an illness.
          </li>
          <li>
            <strong>Mendelian Independence:</strong> Explain that 25% risk resets with every pregnancy, disproving the misconception that prior healthy children insulate future pregnancies.
          </li>
          <li>
            <strong>Halal Assisted Reproduction (PGT-M):</strong> Offer Cleveland Clinic Abu Dhabi / Fakih IVF intake. Reassure couple of full UAE Fatwa Council clearance and 100% Thiqa coverage.
          </li>
          <li>
            <strong>Cascade Relatives Alert:</strong> Suggest sharing the anonymous cascade alert token with siblings and first cousins to encourage early preconception screening.
          </li>
        </ul>
      </div>

      {/* Referral Notification */}
      {referred && (
        <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-medium flex items-center gap-2 mb-2 animate-enter-smooth">
          <Check className="w-4 h-4 text-emerald-700" />
          Electronic PGT-M referral transmitted to Cleveland Clinic Abu Dhabi Fertility Center under Thiqa fast-track pre-authorization.
        </div>
      )}
    </Card>
  );
};
