import { describe, it, expect } from 'vitest';
import { GenoCarrierSummaryCard } from '@/widgets/geno-carrier-summary/ui/GenoCarrierSummaryCard';
import { GenoMendelianSimulator } from '@/widgets/geno-mendelian-simulator/ui/GenoMendelianSimulator';
import { GenoSafeMatchCard } from '@/widgets/geno-safematch-card/ui/GenoSafeMatchCard';
import { GenoHalalRoadmap } from '@/widgets/geno-halal-roadmap/ui/GenoHalalRoadmap';
import { GenoTriageTable } from '@/widgets/geno-triage-table/ui/GenoTriageTable';
import { GenoClinicalBriefModal } from '@/widgets/geno-clinical-brief-modal/ui/GenoClinicalBriefModal';
import { GenoPopulationHeatmap } from '@/widgets/geno-population-heatmap/ui/GenoPopulationHeatmap';
import { GenoCitizenStartPage } from '@/widgets/geno-citizen-start';
import { GenoCitizenPage } from '@/pages/geno-citizen/ui/GenoCitizenPage';
import { GenoCounselorPage } from '@/pages/geno-counselor/ui/GenoCounselorPage';

describe('GENO-BRIDGE Component Integrity', () => {
  it('all widgets and pages import and define functional React components', () => {
    expect(typeof GenoCitizenStartPage).toBe('function');
    expect(typeof GenoCarrierSummaryCard).toBe('function');
    expect(typeof GenoMendelianSimulator).toBe('function');
    expect(typeof GenoSafeMatchCard).toBe('function');
    expect(typeof GenoHalalRoadmap).toBe('function');
    expect(typeof GenoTriageTable).toBe('function');
    expect(typeof GenoClinicalBriefModal).toBe('function');
    expect(typeof GenoPopulationHeatmap).toBe('function');
    expect(typeof GenoCitizenPage).toBe('function');
    expect(typeof GenoCounselorPage).toBe('function');
  });
});
