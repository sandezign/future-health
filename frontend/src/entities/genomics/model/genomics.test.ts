import { describe, it, expect } from 'vitest';
import {
  evaluateCoupleCompatibility,
  buildBloomFilterHex,
  verifyBloomIntersection,
  SYNTHETIC_COUPLES,
} from '../index';

describe('GENO-BRIDGE Frontend Clinical Genomics Engine', () => {
  it('correctly classifies HBB incompatible couple with 25% recurrence risk', () => {
    const couple01 = SYNTHETIC_COUPLES[0]; // CPL-01 (HBB)
    const result = evaluateCoupleCompatibility(
      couple01.partner_a,
      couple01.partner_b,
      couple01.days_until_wedding
    );

    expect(result.compatibility_status).toBe('INCOMPATIBLE');
    expect(result.target_gene).toBe('HBB');
    expect(result.recurrence_risk).toBe(0.25);
    expect(result.triage_priority).toBe('TIER_1_URGENT');
    expect(result.requires_counselor_triage).toBe(true);
  });

  it('correctly classifies CPL-09 consanguineous couple with PAH carrier overlap as INCOMPATIBLE', () => {
    const couple09 = SYNTHETIC_COUPLES.find((c) => c.couple_id === 'CPL-09')!;
    expect(couple09).toBeDefined();

    const result = evaluateCoupleCompatibility(
      couple09.partner_a,
      couple09.partner_b,
      couple09.days_until_wedding
    );

    expect(result.compatibility_status).toBe('INCOMPATIBLE');
    expect(result.target_gene).toBe('PAH');
    expect(result.condition_name).toBe('Phenylketonuria (PKU)');
    expect(result.recurrence_risk).toBe(0.25);
    expect(result.requires_counselor_triage).toBe(true);
  });

  it('correctly classifies disparate carrier couple as COMPATIBLE with zero risk', () => {
    const couple06 = SYNTHETIC_COUPLES[5]; // CPL-06 (HBB vs CFTR)
    const result = evaluateCoupleCompatibility(
      couple06.partner_a,
      couple06.partner_b,
      couple06.days_until_wedding
    );

    expect(result.compatibility_status).toBe('COMPATIBLE');
    expect(result.target_gene).toBeNull();
    expect(result.recurrence_risk).toBe(0.0);
    expect(result.triage_priority).toBe('COMPATIBLE');
    expect(result.requires_counselor_triage).toBe(false);
  });

  it('executes client-side Bloom filter ZKP intersection detecting carrier overlap without cleartext gene leakage', () => {
    const salt = 'a1b2c3d4e5f60718293a4b5c6d7e8f90';
    // Both carry HBB
    const filterA = buildBloomFilterHex(['HBB', 'G6PD'], salt);
    const filterB = buildBloomFilterHex(['HBB', 'CFTR'], salt);

    const result = verifyBloomIntersection(filterA, filterB, salt);
    expect(result.match_detected).toBe(true);
    expect(result.verdict).toBe('COUNSELING_RECOMMENDED');
  });

  it('evaluates non-overlapping filters as COMPATIBLE in ZKP simulation', () => {
    const salt = 'a1b2c3d4e5f60718293a4b5c6d7e8f90';
    const filterA = buildBloomFilterHex(['HBB'], salt);
    const filterB = buildBloomFilterHex(['SMN1'], salt);

    const result = verifyBloomIntersection(filterA, filterB, salt);
    expect(result.match_detected).toBe(false);
    expect(result.verdict).toBe('COMPATIBLE');
  });
});
