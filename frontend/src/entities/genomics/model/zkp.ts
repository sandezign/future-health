import { ZKPVerifyResult } from './types';

export const FILTER_BIT_SIZE = 512;
export const NUM_HASH_FUNCTIONS = 3;
export const PANEL_GENES = [
  'HBB',
  'SMN1',
  'CFTR',
  'CYP21A2',
  'PCDH15',
  'G6PD',
  'PAH',
  'HEXA',
  'MEFV',
  'GAA',
];

/**
 * Portable synchronous FNV/Murmur-style fast hash combined with salt
 * for deterministic in-browser Bloom filter indexing.
 */
function hashStringWithSalt(str: string, salt: string, seed: number): number {
  let h = 0x811c9dc5 ^ seed;
  const combined = `${salt}:${str.trim().toUpperCase()}:${seed}`;
  for (let i = 0; i < combined.length; i++) {
    h ^= combined.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return Math.abs(h);
}

export function computeGeneIndices(
  geneSymbol: string,
  saltHex: string,
  bitSize: number = FILTER_BIT_SIZE
): number[] {
  const indices: number[] = [];
  for (let i = 0; i < NUM_HASH_FUNCTIONS; i++) {
    const rawHash = hashStringWithSalt(geneSymbol, saltHex, i * 7919 + 31);
    indices.push(rawHash % bitSize);
  }
  return indices;
}

export function buildBloomFilterHex(
  genes: string[],
  saltHex: string,
  bitSize: number = FILTER_BIT_SIZE
): string {
  const byteCount = bitSize / 8;
  const bytes = new Uint8Array(byteCount);

  for (const gene of genes) {
    const indices = computeGeneIndices(gene, saltHex, bitSize);
    for (const idx of indices) {
      const byteIdx = Math.floor(idx / 8);
      const bitIdx = idx % 8;
      bytes[byteIdx] |= 1 << bitIdx;
    }
  }

  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function verifyBloomIntersection(
  filterHexA: string,
  filterHexB: string,
  saltHex: string,
  referencePanel: string[] = PANEL_GENES,
  bitSize: number = FILTER_BIT_SIZE
): ZKPVerifyResult {
  const byteCount = bitSize / 8;
  const bytesA = new Uint8Array(byteCount);
  const bytesB = new Uint8Array(byteCount);

  for (let i = 0; i < byteCount; i++) {
    bytesA[i] = parseInt(filterHexA.slice(i * 2, i * 2 + 2), 16) || 0;
    bytesB[i] = parseInt(filterHexB.slice(i * 2, i * 2 + 2), 16) || 0;
  }

  // Bitwise AND
  const intersection = new Uint8Array(byteCount);
  for (let i = 0; i < byteCount; i++) {
    intersection[i] = bytesA[i] & bytesB[i];
  }

  let matchDetected = false;
  for (const gene of referencePanel) {
    const indices = computeGeneIndices(gene, saltHex, bitSize);
    let allBitsSet = true;
    for (const idx of indices) {
      const byteIdx = Math.floor(idx / 8);
      const bitIdx = idx % 8;
      if (!(intersection[byteIdx] & (1 << bitIdx))) {
        allBitsSet = false;
        break;
      }
    }
    if (allBitsSet) {
      matchDetected = true;
      break;
    }
  }

  const verdict = matchDetected ? 'COUNSELING_RECOMMENDED' : 'COMPATIBLE';
  const dummyProof = `proof_${Math.random().toString(36).substring(2, 10)}`;

  return {
    session_id: `ZKP-LOCAL-${Date.now().toString(36).toUpperCase()}`,
    verdict,
    match_detected: matchDetected,
    proof_timestamp: new Date().toISOString(),
    verification_hash: dummyProof,
  };
}
