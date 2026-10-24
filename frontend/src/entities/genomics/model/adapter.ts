import { CoupleRecord, CoupleMatchResponse, ZKPVerifyResult } from './types';
import { SYNTHETIC_COUPLES, POPULATION_EPIDEMIOLOGY, PopulationEpidemiology } from './cohort';
import { evaluateCoupleCompatibility } from './matcher';
import { verifyBloomIntersection } from './zkp';

const API_BASE = 'http://localhost:8000/api/v1';

export class GenoBridgeDataAdapter {
  private static isBackendAvailable: boolean | null = null;

  static async checkBackend(): Promise<boolean> {
    try {
      const res = await fetch('http://localhost:8000/health', {
        method: 'GET',
        signal: AbortSignal.timeout(1000),
      });
      this.isBackendAvailable = res.ok;
      return res.ok;
    } catch {
      this.isBackendAvailable = false;
      return false;
    }
  }

  static getMode(): 'LIVE_API' | 'LOCAL_MOCK' {
    return this.isBackendAvailable ? 'LIVE_API' : 'LOCAL_MOCK';
  }

  static async getCouples(): Promise<CoupleRecord[]> {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE}/genomics/cohort`);
        if (res.ok) {
          const data = await res.json();
          return data.couples || SYNTHETIC_COUPLES;
        }
      } catch {
        // Fallback to local
      }
    }
    return SYNTHETIC_COUPLES;
  }

  static async getEpidemiology(): Promise<PopulationEpidemiology> {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE}/genomics/cohort`);
        if (res.ok) {
          const data = await res.json();
          return data.population_epidemiology || POPULATION_EPIDEMIOLOGY;
        }
      } catch {
        // Fallback
      }
    }
    return POPULATION_EPIDEMIOLOGY;
  }

  static async matchCouple(
    couple: CoupleRecord,
    daysUntilWedding?: number
  ): Promise<CoupleMatchResponse> {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE}/genomics/match`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            partner_a: couple.partner_a,
            partner_b: couple.partner_b,
            wedding_date: couple.wedding_date,
          }),
        });
        if (res.ok) {
          return await res.json();
        }
      } catch {
        // Fallback to local evaluation
      }
    }
    return evaluateCoupleCompatibility(
      couple.partner_a,
      couple.partner_b,
      daysUntilWedding ?? couple.days_until_wedding
    );
  }

  static async verifyZKP(
    filterA: string,
    filterB: string,
    salt: string
  ): Promise<ZKPVerifyResult> {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE}/genomics/zkp/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: `ZKP-${Date.now()}`,
            filter_hex_a: filterA,
            filter_hex_b: filterB,
            salt,
          }),
        });
        if (res.ok) {
          return await res.json();
        }
      } catch {
        // Fallback
      }
    }
    return verifyBloomIntersection(filterA, filterB, salt);
  }
}
