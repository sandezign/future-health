import React, { useState } from 'react';
import { Card } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { CoupleRecord } from '@/entities/genomics';
import {
  ShieldCheck,
  Lock,
  HeartHandshake,
  Dna,
  FileText,
  Sparkles,
  ChevronRight,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  UserCheck,
} from 'lucide-react';

interface Props {
  couple: CoupleRecord;
  couples: CoupleRecord[];
  selectedCoupleId: string;
  onSelectCouple: (id: string) => void;
  onNavigate: (tab: 'results' | 'simulator' | 'safematch' | 'halal') => void;
  engineMode: 'LIVE_API' | 'LOCAL_MOCK';
}

export const GenoCitizenStartPage: React.FC<Props> = ({
  couple,
  couples,
  selectedCoupleId,
  onSelectCouple,
  onNavigate,
  engineMode,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const isIncompatible = couple.overall_status === 'INCOMPATIBLE';
  const isPreEngagement = couple.days_until_wedding > 90 || couple.couple_id === 'CPL-09';

  return (
    <div className="space-y-4 animate-enter-smooth pb-6">
      {/* 1. Welcoming Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 p-5 text-white shadow-md">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />
        <div className="absolute top-2 right-3 flex items-center gap-1.5">
          <Badge
            variant="subtle"
            size="sm"
            shape="pill"
            className="bg-emerald-900/60 text-emerald-200 text-[10px] border border-emerald-600/40"
          >
            {engineMode === 'LIVE_API' ? 'Live API' : 'WebCrypto ZKP'}
          </Badge>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Dna className="w-4 h-4 text-emerald-200" />
          </div>
          <div>
            <span className="text-[11px] font-medium tracking-wide uppercase text-emerald-200/90">
              Department of Health Abu Dhabi
            </span>
            <p className="text-[10px] text-emerald-300/80">Sahatna Preconception Health Portal</p>
          </div>
        </div>

        <h2 className="text-lg font-bold text-white tracking-tight mt-2 leading-snug">
          Premarital Wellness & Genetic Compatibility Hub
        </h2>
        <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
          Mandatory screening empowers your future family with scientific clarity, personal dignity, and complete medical privacy.
        </p>

        {/* Bioethics Guarantee Strip */}
        <div className="mt-4 pt-3 border-t border-emerald-600/50 grid grid-cols-2 gap-2 text-[10px] text-emerald-200">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <span>Zero Raw DNA Leakage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <span>UAE Fatwa Council Aligned</span>
          </div>
        </div>
      </div>

      {/* 2. Active Couple Status & Demo Scenario Switcher */}
      <Card className="p-4 border-slate-200/80 bg-white shadow-xs rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-slate-800">Active Prospective Couple</span>
          </div>
          <Badge
            variant="subtle"
            size="sm"
            shape="pill"
            className={
              isPreEngagement
                ? 'bg-purple-50 text-purple-700 border-purple-200 text-[10px]'
                : 'bg-blue-50 text-blue-700 border-blue-200 text-[10px]'
            }
          >
            {isPreEngagement ? 'Pre-Engagement Check' : 'Official Clinic Filing'}
          </Badge>
        </div>

        <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200/60 mb-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">
                {couple.partner_a.full_name} & {couple.partner_b.full_name}
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                <span>Region: {couple.region}</span>
                <span>•</span>
                <span>
                  {isPreEngagement
                    ? 'Exploring Engagement'
                    : `Wedding in ${couple.days_until_wedding} days`}
                </span>
              </div>
            </div>
            <div className="text-right">
              {isIncompatible ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-300/50">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  Action Suggested
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-300/50">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Compatible
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Evaluator Scenario Selector */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
          <span className="text-slate-500 text-[11px]">Explore Scenarios:</span>
          <select
            value={selectedCoupleId}
            onChange={(e) => onSelectCouple(e.target.value)}
            className="bg-slate-100 hover:bg-slate-200/80 transition-colors text-slate-800 text-[11px] font-medium rounded-md px-2 py-1 border border-slate-300 focus:outline-emerald-600 max-w-[240px] truncate"
          >
            {couples.map((c) => (
              <option key={c.couple_id} value={c.couple_id}>
                {c.couple_id === 'CPL-09' ? '★ CPL-09 (NEW): Tariq & Reem (PAH / Consanguineous)' : `${c.couple_id}: ${c.partner_a.full_name.split(' ')[0]} & ${c.partner_b.full_name.split(' ')[0]} (${c.target_gene || 'Compatible'})`}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* 3. Three Core Intent-Driven Journey Cards */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-slate-700 px-1 flex items-center justify-between">
          <span>Choose Your Health Pathway</span>
          <span className="text-[10px] text-slate-400 font-normal">Step-by-step guidance</span>
        </div>

        {/* Card A: Official Premarital Screening Report */}
        <div
          onClick={() => onNavigate('results')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('results')}
          className="group relative bg-white border border-slate-200 hover:border-emerald-500 rounded-xl p-4 shadow-2xs hover:shadow-sm transition-all duration-150 ease-out cursor-pointer active:scale-[0.98]"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-150">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Badge variant="subtle" size="sm" shape="pill" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[9px] py-0">
                    Official Report
                  </Badge>
                  <span className="text-[10px] text-slate-400">DoH Lab Certified</span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Review Premarital Screening Report
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed pr-2">
                  View individual carrier statuses across 570 genes, clinical risk explanations, and certified medical clearance.
                </p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center text-slate-400 group-hover:text-emerald-700 transition-colors shrink-0">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Card B: Confidential Pre-Engagement SafeMatch */}
        <div
          onClick={() => onNavigate('safematch')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('safematch')}
          className="group relative bg-white border border-slate-200 hover:border-emerald-500 rounded-xl p-4 shadow-2xs hover:shadow-sm transition-all duration-150 ease-out cursor-pointer active:scale-[0.98]"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-150">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Badge variant="subtle" size="sm" shape="pill" className="bg-teal-50 text-teal-700 border-teal-200 text-[9px] py-0">
                    Confidential ZKP
                  </Badge>
                  <span className="text-[10px] text-slate-400">Zero Cleartext DNA</span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  Private Pre-Engagement SafeMatch
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed pr-2">
                  Privately check genetic compatibility with a prospective partner via encrypted QR handshake before formal family talks.
                </p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-teal-100 flex items-center justify-center text-slate-400 group-hover:text-teal-700 transition-colors shrink-0">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Card C: Preconception Pathways & Halal PGT-M */}
        <div
          onClick={() => onNavigate('halal')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('halal')}
          className="group relative bg-white border border-slate-200 hover:border-emerald-500 rounded-xl p-4 shadow-2xs hover:shadow-sm transition-all duration-150 ease-out cursor-pointer active:scale-[0.98]"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-150">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Badge variant="subtle" size="sm" shape="pill" className="bg-purple-50 text-purple-700 border-purple-200 text-[9px] py-0">
                    UAE Fatwa Council
                  </Badge>
                  <span className="text-[10px] text-slate-400">100% Subsidized</span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                  Reproductive Options & Halal PGT-M
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed pr-2">
                  Learn how IVF with Pre-implantation Genetic Testing eliminates carrier recurrence risk with full Abu Dhabi government subsidy.
                </p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-purple-100 flex items-center justify-center text-slate-400 group-hover:text-purple-700 transition-colors shrink-0">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Card D: Interactive Mendelian Simulator */}
        <div
          onClick={() => onNavigate('simulator')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('simulator')}
          className="group relative bg-white border border-slate-200 hover:border-emerald-500 rounded-xl p-3 shadow-2xs hover:shadow-sm transition-all duration-150 ease-out cursor-pointer active:scale-[0.98] flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-900 group-hover:text-amber-700 transition-colors">
                Interactive Mendelian Simulator
              </div>
              <div className="text-[10px] text-slate-400">
                Visualize 25% recurrence probabilities in intuitive, plain language
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 transition-colors" />
        </div>
      </div>

      {/* 4. Bioethical FAQs & Patient Psychological Reassurance */}
      <Card className="p-4 border-slate-200 bg-white rounded-xl shadow-xs">
        <div className="flex items-center gap-2 mb-3 text-slate-800">
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          <h4 className="text-xs font-bold">Frequently Asked Questions & Bioethics</h4>
        </div>

        <div className="space-y-2 text-xs">
          {/* FAQ 1 */}
          <div className="border border-slate-100 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleFaq(1)}
              className="w-full text-left p-2.5 bg-slate-50/70 hover:bg-slate-100 flex items-center justify-between text-slate-800 font-medium text-[11px] transition-colors"
            >
              <span>Does being a carrier mean I am sick?</span>
              {openFaq === 1 ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
            </button>
            {openFaq === 1 && (
              <div className="p-2.5 bg-white text-[11px] text-slate-600 leading-relaxed border-t border-slate-100">
                <strong>No.</strong> Carriers of autosomal recessive conditions (like Thalassemia or PKU) are completely healthy and symptom-free. Risk to future children only arises if <em>both</em> partners carry mutations in the exact same gene.
              </div>
            )}
          </div>

          {/* FAQ 2 */}
          <div className="border border-slate-100 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleFaq(2)}
              className="w-full text-left p-2.5 bg-slate-50/70 hover:bg-slate-100 flex items-center justify-between text-slate-800 font-medium text-[11px] transition-colors"
            >
              <span>Can we still marry if we have matching carrier mutations?</span>
              {openFaq === 2 ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
            </button>
            {openFaq === 2 && (
              <div className="p-2.5 bg-white text-[11px] text-slate-600 leading-relaxed border-t border-slate-100">
                <strong>Yes, absolutely.</strong> UAE law and the Department of Health uphold complete patient autonomy. Screening is educational, not coercive. Incompatible couples are connected directly to DoH-funded IVF with Pre-implantation Genetic Testing (PGT-M) to ensure 100% healthy children.
              </div>
            )}
          </div>

          {/* FAQ 3 */}
          <div className="border border-slate-100 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleFaq(3)}
              className="w-full text-left p-2.5 bg-slate-50/70 hover:bg-slate-100 flex items-center justify-between text-slate-800 font-medium text-[11px] transition-colors"
            >
              <span>Is PGT-M permissible in Islamic law?</span>
              {openFaq === 3 ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
            </button>
            {openFaq === 3 && (
              <div className="p-2.5 bg-white text-[11px] text-slate-600 leading-relaxed border-t border-slate-100">
                <strong>Yes.</strong> The UAE Fatwa Council (Fatwa No. 2024/71) explicitly permits and encourages PGT-M prior to embryo implantation to prevent hereditary disease and protect lineage health.
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* 5. 24/7 Confidential Genetic Counselor Line */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 flex items-center justify-between text-xs text-emerald-950">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-xs">DoH Premarital Counselor Line</div>
            <div className="text-[10px] text-slate-600">Confidential guidance • Toll-Free 800-555</div>
          </div>
        </div>
        <Button
          size="sm"
          className="h-8 text-xs bg-emerald-700 hover:bg-emerald-800 text-white px-3"
        >
          Call Counselor
        </Button>
      </div>
    </div>
  );
};
