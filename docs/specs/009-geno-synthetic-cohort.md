# Feature Specification: Synthetic Genomic Cohort & Dual-Mode FHIR Fixtures

**Feature Identifier**: `009-geno-synthetic-cohort`  
**Created**: 2026-10-23  
**Status**: Ready for Implementation  
**Specification Owner**: GENO-BRIDGE Data Engineering & Architecture  
**Primary Standards**: 
- HL7 FHIR Release 4 (R4) Genomics Reporting Implementation Guide
- Abu Dhabi Health Information Exchange (Malaffi) Premarital Screening Payload Specs
- Dual-Mode Client Architecture (Zero-Dependency In-Memory Engine + FastAPI REST Backend)

---

## 1. Summary & Objectives

To enable rigorous automated verification, benchmark clinical testing, and instant standalone prototype demonstration without requiring external database provisioning or live hospital network connectivity, GENO-BRIDGE requires a comprehensive **Synthetic Genomic Cohort** coupled with a **Dual-Mode Data Adapter**.

Key deliverables:
1. **Clinical Archetype Cohort (12 Couples / 24 Individual Profiles):** A medically realistic dataset of Emirati premarital screening participants modeling diverse clinical presentations across Abu Dhabi, Al Ain, and Al Dhafra.
2. **HL7 FHIR R4 Standard Conformance:** Synthetic records packaged as valid FHIR R4 `Bundle` objects containing `Patient`, `DiagnosticReport`, and `Observation` (genomic-variant) resources with authentic LOINC (`81247-9`), HGVS, ClinVar, and OMIM codes.
3. **Dual-Mode Data Adapter (`GenoBridgeDataAdapter`):** A frontend networking layer that detects API server availability on `:8000`. If unavailable, it falls back seamlessly to an in-memory client-side engine with zero disruption to the user experience.

---

## 2. Synthetic Patient Archetypes Matrix

| Couple ID | Partner A Name & Variant | Partner B Name & Variant | Gene | ClinVar / Condition | Clinical Status & Triage |
| :--- | :--- | :--- | :---: | :--- | :---: |
| **CPL-01** | **Rashid Al-Falasi**<br>*HBB:c.93-21G>A* (Het) | **Mariam Al-Maktoum**<br>*HBB:c.118C>T* (Het) | **HBB** | Beta-Thalassemia Major<br>(OMIM #603902) | **Tier 1 Urgent**<br>(Wedding in 14 days) |
| **CPL-02** | **Sultan Al-Nuaimi**<br>*SMN1:c.840C>T* (Het) | **Fatima Al-Kaabi**<br>*SMN1:c.840C>T* (Het) | **SMN1** | Spinal Muscular Atrophy Type 1<br>(OMIM #253300) | **Tier 1 Routine**<br>(Wedding in 45 days) |
| **CPL-03** | **Zayed Al-Hamed**<br>*CFTR:c.1521_1523delCTT* | **Noora Al-Shamsi**<br>*CFTR:c.1521_1523delCTT* | **CFTR** | Cystic Fibrosis<br>(OMIM #219700) | **Tier 2 Moderate**<br>(Wedding in 75 days) |
| **CPL-04** | **Hamdan Al-Zaabi**<br>*CYP21A2:c.518T>A* (Het) | **Salama Al-Mazrouei**<br>*CYP21A2:c.518T>A* (Het) | **CYP21A2**| Congenital Adrenal Hyperplasia<br>(OMIM #201910) | **Tier 1 Urgent**<br>(Wedding in 21 days) |
| **CPL-05** | **Mansoor Al-Rumaithi**<br>*PCDH15:c.733C>T* (Het) | **Sheikha Al-Qasimi**<br>*PCDH15:c.733C>T* (Het) | **PCDH15**| Usher Syndrome Type 1F<br>(OMIM #602083) | **Tier 2 Moderate**<br>(Wedding in 90 days) |
| **CPL-06** | **Khalid Al-Dhaheri**<br>*HBB:c.93-21G>A* (Het) | **Ayesha Al-Suwaidi**<br>*CFTR:c.1521_1523delCTT* | None<br>(Disparate) | Different Recessive Genes | **Compatible / Cleared**<br>(Carrier Advice Only) |
| **CPL-07** | **Omar Al-Breiki**<br>*SMN1:c.840C>T* (Het) | **Hessa Al-Marzooqi**<br>Wild-type (No variants) | None<br>(Single) | Single Partner Carrier | **Compatible / Cleared**<br>(Carrier Advice Only) |
| **CPL-08** | **Mohamed Al-Khaja**<br>Wild-type | **Reem Al-Mansoori**<br>Wild-type | None | Wild-type Normal | **Compatible / Cleared**<br>(Full Certificate Issued) |
| **CPL-09–12**| **Emirati Control Couples**<br>(Wild-type negative controls) | **Emirati Control Couples**<br>(Wild-type negative controls) | None | Negative across 570 Genes | **Compatible / Cleared**<br>(Population Baseline) |

---

## 3. HL7 FHIR R4 Representation Specification

Each screening subject's data is encoded as an HL7 FHIR R4 JSON Bundle structured as follows:

```json
{
  "resourceType": "Bundle",
  "id": "bundle-screening-rashid-01",
  "type": "collection",
  "entry": [
    {
      "resource": {
        "resourceType": "Patient",
        "id": "pat-ae-001",
        "identifier": [
          {
            "system": "https://doh.gov.ae/emirates-id-hash",
            "value": "784-1996-8472911-3"
          }
        ],
        "name": [{ "family": "Al-Falasi", "given": ["Rashid"] }],
        "gender": "male",
        "birthDate": "1996-05-14"
      }
    },
    {
      "resource": {
        "resourceType": "DiagnosticReport",
        "id": "dr-seq-001",
        "status": "final",
        "category": [
          {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "81247-9",
                "display": "Master HL7 Genetic variant panel"
              }
            ]
          }
        ],
        "code": {
          "text": "Abu Dhabi Mandatory 570-Gene Premarital NGS Panel"
        },
        "subject": { "reference": "Patient/pat-ae-001" },
        "effectiveDateTime": "2026-10-15T09:30:00Z",
        "result": [
          { "reference": "Observation/obs-var-hbb-01" }
        ]
      }
    },
    {
      "resource": {
        "resourceType": "Observation",
        "id": "obs-var-hbb-01",
        "status": "final",
        "category": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "code": "laboratory"
              }
            ]
          }
        ],
        "code": {
          "coding": [
            {
              "system": "http://loinc.org",
              "code": "69548-6",
              "display": "Genetic variant assessment"
            }
          ]
        },
        "valueCodeableConcept": {
          "coding": [
            {
              "system": "http://varnomen.hgvs.org",
              "code": "NM_000518.5:c.93-21G>A",
              "display": "HBB:c.93-21G>A"
            }
          ],
          "text": "Heterozygous Pathogenic Carrier in HBB"
        },
        "component": [
          {
            "code": { "text": "Gene Symbol" },
            "valueString": "HBB"
          },
          {
            "code": { "text": "ClinVar Classification" },
            "valueString": "Pathogenic"
          },
          {
            "code": { "text": "Inheritance Mode" },
            "valueString": "Autosomal Recessive"
          },
          {
            "code": { "text": "Zygosity" },
            "valueString": "heterozygous"
          }
        ]
      }
    }
  ]
}
```

---

## 4. Dual-Mode Client Architecture

```
                    ┌────────────────────────────────────────────────────────┐
                    │               GenoBridgeDataAdapter                   │
                    └──────────────────────────┬─────────────────────────────┘
                                               │
                                 Is Backend Server Reachable?
                                         (GET /health)
                                               │
                      ┌────────────────────────┴────────────────────────┐
                 YES (Connected)                                   NO (Offline Fallback)
                      ▼                                                 ▼
        [ Axios / Fetch REST API ]                             [ In-Memory Local Engine ]
        • POST /api/v1/genomics/match                          • clientGenomicMatcher()
        • POST /api/v1/genomics/zkp/verify                     • clientBloomZkpSimulator()
        • GET /api/v1/genomics/cohort                          • SYNTHETIC_COHORT_REGISTRY
```

### Benefits:
- **Instant Demo Resiliency:** Reviewers or judges can launch `npm run dev` and explore the full platform immediately without needing Python environments or virtual environments running.
- **Identical Contracts:** The in-memory client engine adheres to the exact same TypeScript interfaces and return structures as the FastAPI backend.
- **Visual Engine Badge:** Displays a non-intrusive status pill in the UI header/footer indicating whether the app is running in **"Live API Engine"** or **"Local Cryptographic Engine"** mode.

---

## 5. Acceptance Criteria & Verification Strategy

- [ ] **AC-009-1 (Fixture Completeness):** All 12 synthetic couples are encoded with valid JSON structures and placed in `data/synthetic/geno_bridge_cohort.json`.
- [ ] **AC-009-2 (Dual-Mode Verification):** When the backend server is stopped, frontend automatically falls back to in-memory fixtures with zero uncaught network errors.
- [ ] **AC-009-3 (Archetype Coverage):** Automated tests verify that each of the 5 priority disease phenotypes (*HBB*, *SMN1*, *CFTR*, *CYP21A2*, *PCDH15*) produces the expected clinical classification.
