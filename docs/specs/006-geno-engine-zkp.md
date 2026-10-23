# Feature Specification: Core Genomic Matching Engine & Cryptographic ZKP Simulator

**Feature Identifier**: `006-geno-engine-zkp`  
**Created**: 2026-10-23  
**Status**: Ready for Implementation  
**Specification Owner**: GENO-BRIDGE Clinical Genomics & Security Engineering  
**Primary Standards**: 
- ACMG/AMP 2015 Standards and Guidelines for the Interpretation of Sequence Variants (Richards et al., *Genet Med* 2015)
- HL7 FHIR Release 4 (R4) Clinical Genomics Implementation Guide
- Client-Side Cryptographic Private Set Intersection (PSI) via SHA-256 Bloom Filter Matching

---

## 1. Summary & Objectives

The **Core Genomic Matching Engine & Cryptographic ZKP Simulator** serves as the computational heart of GENO-BRIDGE. It ingests standardized HL7 FHIR R4 genomic sequences from Abu Dhabi’s mandatory 570-gene premarital screening program, identifies pathogenic carrier overlaps in autosomal recessive conditions, and provides a privacy-preserving client-side cryptographic Zero-Knowledge Proof (ZKP) protocol for pre-engagement compatibility verification.

This engine addresses the clinical and social challenges of carrier screening by:
1. Parsing HL7 FHIR R4 `MolecularSequence` and `DiagnosticReport` resources containing pathogenic variants across target high-prevalence Emirati recessive conditions (*HBB, SMN1, CFTR, CYP21A2, PCDH15*).
2. Implementing an autosomal recessive incompatibility detection algorithm that distinguishes benign carriers from compound heterozygous/homozygous risks.
3. Filtering and shielding Variants of Uncertain Significance (VUS) from consumer-facing outputs while preserving clinical visibility.
4. Delivering a client-side SHA-256 Bloom Filter Private Set Intersection (PSI) protocol that computes binary compatibility (`Compatible` vs `Counseling Advised`) without transmitting or exposing unmasked genomic variants.
5. Providing typed FastAPI endpoints (`/api/v1/genomics/*`) with an offline-compatible client-side TypeScript mirroring engine for zero-server standalone demo capability.

---

## 2. User Scenarios & Prioritized User Stories

### User Story 1 - HL7 FHIR R4 Genomic Ingestion & Variant Extraction (Priority: P0)
As the GENO-BRIDGE backend and client data adapter,  
I want to parse HL7 FHIR R4 `MolecularSequence` and `DiagnosticReport` JSON payloads,  
So that clinical variant data (gene symbol, HGVS notation, zygosity, ClinVar clinical significance) is normalized into structured schemas.

- **Why this priority:** Ingestion is the entry gate for all genetic calculations and clinical workflows.
- **Independent Test:** Feed synthetic FHIR R4 bundles for individual patients and verify extracted variant attributes match benchmark inputs.
- **Acceptance Scenarios:**
  1. **Given** a FHIR R4 `DiagnosticReport` containing *HBB* `c.93-21G>A` with `clinvar_status = "Pathogenic"` and `allelic_state = "heterozygous"`, **When** parsed, **Then** return a normalized `GenomicVariant` object with gene `HBB`, transmission `autosomal_recessive`, and severity `Tier 1`.
  2. **Given** a variant classified as `VUS` (Variant of Uncertain Significance), **When** parsed, **Then** flag with `is_vus = True` so it is routed exclusively to clinician views and withheld from patient copilot views (per Rule BR-05).
  3. **Given** a malformed or empty FHIR bundle, **When** processed, **Then** raise a typed `FHIRValidationError` with actionable error context rather than an unhandled 500.

---

### User Story 2 - Autosomal Recessive Carrier Overlap Detection (Priority: P0)
As a clinical genomics decision engine,  
I want to cross-match dual consented partner genomic profiles to detect identical or compound heterozygous recessive carrier mutations,  
So that couples at a 25% per-pregnancy risk of severe pediatric illness are reliably flagged.

- **Why this priority:** Core clinical safety requirement preventing birth of infants with severe untreated genetic disorders.
- **Independent Test:** Execute unit tests with partner matrix: (A carrier + B carrier same gene), (A carrier + B carrier different gene), (A homozygous + B wildtype), and (Neither carrier).
- **Acceptance Scenarios:**
  1. **Given** Partner A carries *HBB:c.93-21G>A* (heterozygous) and Partner B carries *HBB:c.118C>T* (heterozygous), **When** evaluated, **Then** return `compatibility_status = "INCOMPATIBLE"`, affected gene `HBB`, condition `Beta-Thalassemia Major`, disease severity `TIER_1_INFANTILE_LETHAL`, and recurrence risk `0.25`.
  2. **Given** Partner A carries *SMN1* variant and Partner B carries *CFTR* variant, **When** evaluated, **Then** return `compatibility_status = "COMPATIBLE"` with carrier advisory notes for individual non-overlapping traits.
  3. **Given** neither partner carries any pathogenic variant in the 570-gene panel, **When** evaluated, **Then** return `compatibility_status = "COMPATIBLE"` with cleared premarital status.

---

### User Story 3 - Client-Side Cryptographic SafeMatch (ZKP Simulator) (Priority: P0)
As an unmarried prospective couple exploring compatibility prior to formal family engagement,  
I want to execute a client-side cryptographic Private Set Intersection protocol via SHA-256 Bloom filter matching,  
So that we learn whether we share a recessive carrier risk without either of us seeing the other's raw genetic variants or disease list.

- **Why this priority:** Eliminates social stigma and fear of community gossip by enabling private pre-engagement checks.
- **Independent Test:** Run browser-side Web Crypto and Python cryptographic test vectors with identical vs non-overlapping secret variant sets; verify no raw gene names leak across payload boundaries.
- **Acceptance Scenarios:**
  1. **Given** Partner A creates a SafeMatch session and shares a 6-digit session code / QR token with Partner B, **When** Partner B joins, **Then** both clients compute a 256-bit salted Bloom filter locally using Web Crypto SHA-256.
  2. **Given** both partners carry a common recessive gene token, **When** the intersection bitmask is computed ($\text{Mask}_A \land \text{Mask}_B$), **Then** the result displays `"PRE_ENGAGEMENT_COUNSELING_RECOMMENDED"` without revealing which gene matched.
  3. **Given** no overlapping carrier genes exist, **When** the intersection bitmask is computed, **Then** the result displays `"COMPATIBLE_NO_SHARED_RISK"`.
  4. **Given** any network inspection or memory dump of the peer exchange payload, **When** verified, **Then** only cryptographic hashes/filters exist; zero cleartext HGVS, VCF, or gene strings are transmitted.

---

### User Story 4 - REST API Endpoints with Dual-Mode Offline Mirroring (Priority: P1)
As a developer implementing the frontend citizen and clinician interfaces,  
I want unified REST API endpoints `/api/v1/genomics/*` mirrored by a client-side TypeScript engine,  
So that the web application functions identically in connected server mode and standalone offline mode.

- **Acceptance Scenarios:**
  1. `POST /api/v1/genomics/match`: Accepts dual FHIR sequence IDs or inline payloads, returns structured `CoupleCompatibilityResult`.
  2. `POST /api/v1/genomics/zkp/challenge`: Initiates an ephemeral SafeMatch session token with 15-minute TTL.
  3. `POST /api/v1/genomics/zkp/verify`: Accepts blinded Bloom filters, computes bitwise intersection, returns binary verdict.
  4. In offline demo mode, frontend invokes `mockGenomicEngine` in `@/entities/genomics` without network requests.

---

## 3. Mathematical & Cryptographic Specifications

### 3.1 Mendelian Autosomal Recessive Probability Model
For a prospective couple where Partner A genotype is $G_A = \{m_{A1}, m_{A2}\}$ and Partner B genotype is $G_B = \{m_{B1}, m_{B2}\}$ for gene $g \in \text{RecessivePanel}$:
$$\text{Carrier}(P) = \exists m \in G_P : \text{ClinVar}(m) \in \{\text{"Pathogenic"}, \text{"Likely Pathogenic"}\}$$

$$\text{Incompatible}(A, B) = \exists g \in \text{Panel} : \text{Carrier}_g(A) \land \text{Carrier}_g(B)$$

When $\text{Incompatible}(A, B) = \text{True}$ and both are heterozygous carriers ($Aa \times Aa$):
$$\begin{aligned}
P(\text{Affected Child } [aa]) &= 0.25 \quad (25\% \text{ per pregnancy}) \\
P(\text{Carrier Child } [Aa]) &= 0.50 \quad (50\% \text{ per pregnancy}) \\
P(\text{Unaffected Non-Carrier Child } [AA]) &= 0.25 \quad (25\% \text{ per pregnancy})
\end{aligned}$$

*Clinical Guidance Note:* The engine must explicitly emit a flag `is_independent_per_pregnancy = True` to mandate UI disclaimers against the Gambler's Fallacy.

---

### 3.2 Private Set Intersection via Salted Bloom Filter
To simulate Zero-Knowledge Proof (ZKP) set intersection on mobile web browsers:
1. **Session Setup:**
   - Server or initiator generates ephemeral session salt $S \in \{0, 1\}^{256}$ and session ID.
2. **Local Token Hashing:**
   - For each pathogenic gene $g_i \in \text{Genes}(P)$:
     $$T_i = \text{HMAC-SHA256}(K = S, \text{data} = \text{Norm}(g_i))$$
3. **Bloom Filter Insertion:**
   - Filter size $m = 512\text{ bits}$, $k = 3$ independent hash functions derived from $T_i$:
     $$h_1(T_i) = T_i[0..15] \pmod m$$
     $$h_2(T_i) = T_i[16..31] \pmod m$$
     $$h_3(T_i) = T_i[32..47] \pmod m$$
   - Vector $B_P[j] = 1$ for $j \in \{h_1, h_2, h_3\}$.
4. **Intersection & Verdict Evaluation:**
   $$I = B_A \land B_B$$
   $$\text{MatchFound} = \exists g \in \text{ReferencePanel} : (B_A \land B_B)[h_{1,2,3}(T_g)] == 1$$
   - The returned payload contains strictly:
     $$\text{Verdict} = \begin{cases} \text{"COUNSELING_RECOMMENDED"} & \text{if MatchFound} \\ \text{"COMPATIBLE"} & \text{otherwise} \end{cases}$$
   - Zero gene names, variant strings, or counts of non-matching bits are emitted.

---

## 4. Target Gene Panel Reference (High-Prevalence UAE Cohort)

| Gene Symbol | Full Name | OMIM ID | Inheritance | Target Condition | Clinical Severity Tier |
| :--- | :--- | :---: | :---: | :--- | :---: |
| **HBB** | Hemoglobin Subunit Beta | 603902 | AR | Beta-Thalassemia Major / Sickle Cell | **Tier 1 (Lethal / Severe)** |
| **SMN1** | Survival Motor Neuron 1 | 600354 | AR | Spinal Muscular Atrophy (SMA Type 1/2) | **Tier 1 (Infantile Lethal)** |
| **CFTR** | CF Transmembrane Conductance Reg. | 602421 | AR | Cystic Fibrosis | **Tier 2 (Chronic Debilitating)** |
| **CYP21A2**| Cytochrome P450 Family 21 Subfamily A | 613815 | AR | Congenital Adrenal Hyperplasia (CAH) | **Tier 1 (Neonatal Crisis)** |
| **PCDH15** | Protocadherin-Related 15 | 605514 | AR | Usher Syndrome Type 1F (Deafness-Blindness) | **Tier 2 (Severe Sensory)** |

---

## 5. Data Schemas & API Contracts

### 5.1 Python / Pydantic v2 Models (`backend/app/models/genomics.py`)

```python
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field

class ClinVarSignificance(str, Enum):
    PATHOGENIC = "Pathogenic"
    LIKELY_PATHOGENIC = "Likely Pathogenic"
    VUS = "Variant of Uncertain Significance"
    BENIGN = "Benign"

class SeverityTier(str, Enum):
    TIER_1_LETHAL = "TIER_1_LETHAL"
    TIER_2_DEBILITATING = "TIER_2_DEBILITATING"
    TIER_3_MILD = "TIER_3_MILD"

class GenomicVariant(BaseModel):
    gene_symbol: str
    hgvs_c: str
    hgvs_p: Optional[str] = None
    allelic_state: str  # heterozygous / homozygous
    clinvar_significance: ClinVarSignificance
    condition_name: str
    omim_id: str
    severity_tier: SeverityTier
    is_vus: bool = False

class PartnerGenomicProfile(BaseModel):
    partner_id: str
    full_name: str
    emirates_id_hash: str
    screening_date: str
    variants: List[GenomicVariant]

class CompatibilityStatus(str, Enum):
    COMPATIBLE = "COMPATIBLE"
    INCOMPATIBLE = "INCOMPATIBLE"
    INCONCLUSIVE = "INCONCLUSIVE"

class CoupleCompatibilityResult(BaseModel):
    couple_id: str
    partner_a_id: str
    partner_b_id: str
    compatibility_status: CompatibilityStatus
    matched_gene: Optional[str] = None
    condition_name: Optional[str] = None
    severity_tier: Optional[SeverityTier] = None
    recurrence_risk: float = 0.0  # 0.25 if incompatible
    carrier_recurrence_risk: float = 0.50
    unaffected_non_carrier_risk: float = 0.25
    clinical_recommendation: str
    requires_counselor_triage: bool = False

class ZKPSessionInitRequest(BaseModel):
    initiator_id: str

class ZKPSessionInitResponse(BaseModel):
    session_id: str
    session_salt: str
    qr_token: str
    expires_at: str

class ZKPVerifyRequest(BaseModel):
    session_id: str
    bloom_filter_hex_a: str
    bloom_filter_hex_b: str

class ZKPVerifyResponse(BaseModel):
    session_id: str
    verdict: str  # "COMPATIBLE" | "COUNSELING_RECOMMENDED"
    proof_timestamp: str
    verification_hash: str
```

---

## 6. Acceptance Criteria & Verification Strategy

- [ ] **AC-006-1 (FHIR Ingestion):** Unit test passes parsing synthetic FHIR `MolecularSequence` JSON for *HBB*, *SMN1*, *CFTR*, and extracts HGVS and ClinVar annotations in $<50\text{ms}$.
- [ ] **AC-006-2 (Carrier Match TDD):** Given dual profiles with identical recessive genes, matching engine strictly returns `INCOMPATIBLE` with `recurrence_risk = 0.25`.
- [ ] **AC-006-3 (Non-Overlapping Match):** Given dual profiles with different carrier genes (*HBB* vs *CFTR*), matching engine returns `COMPATIBLE`.
- [ ] **AC-006-4 (ZKP Privacy Invariant):** Web Crypto and backend ZKP verification functions evaluate to `COUNSELING_RECOMMENDED` on overlap and reveal zero cleartext strings.
- [ ] **AC-006-5 (VUS Protection):** VUS variants are never propagated into patient-facing response payloads.
