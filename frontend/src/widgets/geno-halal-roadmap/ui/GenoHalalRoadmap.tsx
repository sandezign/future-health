import React, { useState } from 'react';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import {
  CheckCircle2,
  Building2,
  FileCheck,
} from 'lucide-react';

export const GenoHalalRoadmap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'fatwa' | 'clinics'>('roadmap');
  const [bookingConfirmed, setBookingConfirmed] = useState<string | null>(null);

  const steps = [
    {
      num: 1,
      title: 'Premarital Genetic Consultation',
      desc: 'Meet with a DoH certified genetic counselor to confirm variant details and plan your timeline.',
      duration: 'Week 1',
    },
    {
      num: 2,
      title: 'Ovarian Stimulation & Fertilization (ICSI)',
      desc: 'Standard IVF protocol ensuring fertilization takes place strictly with husband and wife gametes.',
      duration: 'Weeks 2–4',
    },
    {
      num: 3,
      title: 'Day-5 Blastocyst Biopsy & PGT-M Analysis',
      desc: 'Cell biopsy testing for the specific familial recessive variant (e.g. HBB/SMN1).',
      duration: 'Week 5',
    },
    {
      num: 4,
      title: 'Transfer of Genetically Healthy Embryo',
      desc: 'Implantation of an unaffected embryo into the biological mother’s uterus.',
      duration: 'Week 6',
    },
    {
      num: 5,
      title: 'Healthy Full-Term Pregnancy',
      desc: 'Complete elimination of the targeted monogenic disorder for your newborn.',
      duration: 'Ongoing',
    },
  ];

  const clinics = [
    {
      name: 'Cleveland Clinic Abu Dhabi',
      specialty: 'Department of Medical Genomics & Reproductive Medicine',
      location: 'Al Maryah Island, Abu Dhabi',
      thiqaStatus: '100% Thiqa Network Partner',
    },
    {
      name: 'Fakih IVF Fertility Center',
      specialty: 'Center of Excellence in PGT-M / Pre-implantation Genetics',
      location: 'Al Bateen, Abu Dhabi',
      thiqaStatus: '100% Thiqa Network Partner',
    },
    {
      name: 'HealthPlus Fertility Center',
      specialty: 'Comprehensive Preconception & IVF Care',
      location: 'Al Karamah, Abu Dhabi',
      thiqaStatus: '100% Thiqa Network Partner',
    },
  ];

  return (
    <Card className="p-5 border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Halal PGT-M & Reproductive Navigator
          </h3>
          <p className="text-xs text-slate-500">
            Pre-implantation Genetic Testing under UAE Bioethical Standards
          </p>
        </div>
        <Badge variant="success" shape="pill" size="sm">
          Thiqa Fully Funded
        </Badge>
      </div>

      {/* Sub Tabs */}
      <div className="flex rounded-xl bg-slate-100 p-1 mb-4 text-xs">
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex-1 py-1.5 font-medium rounded-lg transition-colors duration-150 ease-out active:scale-[0.98] cursor-pointer ${
            activeTab === 'roadmap'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Clinical Roadmap
        </button>
        <button
          onClick={() => setActiveTab('fatwa')}
          className={`flex-1 py-1.5 font-medium rounded-lg transition-colors duration-150 ease-out active:scale-[0.98] cursor-pointer ${
            activeTab === 'fatwa'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          UAE Fatwa Clearance
        </button>
        <button
          onClick={() => setActiveTab('clinics')}
          className={`flex-1 py-1.5 font-medium rounded-lg transition-colors duration-150 ease-out active:scale-[0.98] cursor-pointer ${
            activeTab === 'clinics'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Accredited Centers
        </button>
      </div>

      {/* Tab 1: Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="space-y-3 animate-enter-smooth">
          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            Incompatible carrier couples can achieve healthy, biologically related children without risk of severe genetic disease through standard PGT-M.
          </p>
          <div className="space-y-2.5">
            {steps.map((st) => (
              <div
                key={st.num}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {st.num}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-slate-900">{st.title}</h4>
                    <span className="text-[10px] text-slate-400 font-medium">{st.duration}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: UAE Fatwa Bioethics */}
      {activeTab === 'fatwa' && (
        <div className="space-y-4 animate-enter-smooth">
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center gap-2 mb-2 text-emerald-950 font-semibold text-xs">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              General Authority of Islamic Affairs & Endowments (AWQAF)
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              Under official UAE Fatwa Council guidance, Pre-implantation Genetic Testing for Monogenic Diseases (PGT-M) is <strong>fully permissible (Halal)</strong> to prevent severe hereditary childhood disability, subject to four strict bioethical conditions:
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-100 bg-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Exclusivity of Gametes:</strong> The sperm and ovum must come solely from the legally wedded husband and wife. No third-party donors are permitted.
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-100 bg-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Maternal Uterus Transfer:</strong> The fertilized healthy embryo must be transferred exclusively into the biological wife’s uterus during a valid marriage.
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-100 bg-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Medical Prevention Necessity:</strong> Testing is conducted strictly to avoid serious, incurable genetic illnesses (e.g. Thalassemia, SMA). Non-medical sex selection is prohibited.
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-100 bg-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Ethical Handling:</strong> Unselected affected embryos are handled in accordance with authorized DoH bioethics standards.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Accredited Clinics */}
      {activeTab === 'clinics' && (
        <div className="space-y-3 animate-enter-smooth">
          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            The following DoH-licensed fertility centers offer specialized PGT-M programs covered 100% under Thiqa for eligible UAE citizens.
          </p>

          <div className="space-y-3">
            {clinics.map((c, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-all space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900">{c.name}</h4>
                    <p className="text-[11px] text-slate-500">{c.specialty}</p>
                  </div>
                  <Badge variant="subtle" size="sm" shape="pill" className="text-[10px]">
                    {c.thiqaStatus}
                  </Badge>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" /> {c.location}
                  </span>
                  {bookingConfirmed === c.name ? (
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Priority Intake Requested
                    </span>
                  ) : (
                    <Button
                      onClick={() => setBookingConfirmed(c.name)}
                      size="sm"
                      className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-transform duration-75 active:scale-[0.97] cursor-pointer"
                    >
                      Book Thiqa Intake
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
