# Clinical Formulas & Algorithms Reference
**Project:** RENAL-PULSE  
**Reference Standards:** KDIGO 2024 Clinical Practice Guideline, Tangri JAMA 2016 (KFRE), Inker NEJM 2021 (CKD-EPI)

---

## 1. CKD-EPI 2021 Refit Creatinine Equation (Race-Free)
*Reference: Inker LA, et al. "New Creatinine- and Cystatin C–Based Equations to Estimate GFR without Race." New England Journal of Medicine. 2021;385(19):1737-1749.*

The CKD-EPI 2021 equation estimates Glomerular Filtration Rate (eGFR in $\text{mL/min/1.73m}^2$) from serum creatinine ($S_{cr}$ in $\text{mg/dL}$), age (in years), and biological sex:

$$\text{eGFR} = 142 \times \min\left(\frac{S_{cr}}{\kappa}, 1\right)^\alpha \times \max\left(\frac{S_{cr}}{\kappa}, 1\right)^{-1.200} \times 0.9938^{\text{Age}} \times [1.012 \text{ if Female}]$$

### Parameter Constants
| Biological Sex | $\kappa$ | $\alpha$ | Female Multiplier |
| :--- | :---: | :---: | :---: |
| **Female** | $0.7$ | $-0.241$ | $1.012$ |
| **Male** | $0.9$ | $-0.302$ | $1.000$ |

---

## 2. Longitudinal eGFR Slope (Rate of Progression)
*Reference: KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of CKD.*

Calculated via Ordinary Least Squares (OLS) linear regression of serial eGFR observations over time ($t$ in years from first measurement):

$$\text{Slope} = \frac{\sum_{i=1}^n (t_i - \bar{t})(\text{eGFR}_i - \overline{\text{eGFR}})}{\sum_{i=1}^n (t_i - \bar{t})^2}$$

### Progression Classification
- **Normal Aging Decline:** $< 1.0\text{ mL/min/1.73m}^2/\text{year}$
- **Mild / Expected Decline:** $1.0 - 2.9\text{ mL/min/1.73m}^2/\text{year}$
- **Rapid Progression (Trigger Alert):** $\ge 3.0\text{ mL/min/1.73m}^2/\text{year}$ (sustained)
- **Catastrophic Progression:** $\ge 5.0\text{ mL/min/1.73m}^2/\text{year}$

---

## 3. Tangri 4-Variable Kidney Failure Risk Equation (KFRE)
*Reference: Tangri N, et al. "Multinational Assessment of Accuracy of Equations for Predicting Risk of Kidney Failure: A Meta-analysis." JAMA. 2016;315(2):164–174.*

Calculates the probability of progression to End-Stage Renal Disease (ESKD: dialysis or kidney transplantation) at 2 years and 5 years.

$$\text{Risk}(t) = 1 - S_0(t)^{\exp(\text{Linear Predictor})}$$

### Linear Predictor Formula:
$$\text{LP} = -0.2201 \times \left(\frac{\text{Age}}{10} - 7.036\right) + 0.2467 \times (\text{Male} - 0.5642) - 0.5567 \times \left(\frac{\text{eGFR}}{5} - 7.222\right) + 0.4510 \times (\ln(\text{uACR}) - 5.137)$$

*Note:*
- $\text{Male} = 1$ for biological male, $0$ for female.
- $\text{uACR}$ is in $\text{mg/g}$ (if in $\text{mg/mmol}$, multiply by $8.84$).

### Baseline Survival Probabilities ($S_0(t)$):
- **Non-North American Cohorts:**
  - 2-Year Baseline Survival $S_0(2) = 0.9832$
  - 5-Year Baseline Survival $S_0(5) = 0.9365$
- **North American Cohorts:**
  - 2-Year Baseline Survival $S_0(2) = 0.9750$
  - 5-Year Baseline Survival $S_0(5) = 0.9240$

### Clinical Action Thresholds
- **5-Year Risk $< 3\%$:** Low Risk (Manage in routine primary care).
- **5-Year Risk $3\% - 15\%$:** Intermediate Risk (Initiate SGLT2i + ARB; optimize blood pressure $< 120/80\text{ mmHg}$).
- **5-Year Risk $> 15\%$:** High Risk (Initiate GDMT; urgent secondary nephrology co-management; vascular access planning if $> 40\%$).

---

## 4. KDIGO 2024 Staging Grid & GDMT Prescribing Logic

### KDIGO Grid
| GFR Stage | eGFR ($\text{mL/min/1.73m}^2$) | A1: Normal ($<30\text{ mg/g}$) | A2: Microalbuminuria ($30-300\text{ mg/g}$) | A3: Macroalbuminuria ($>300\text{ mg/g}$) |
| :--- | :--- | :--- | :--- | :--- |
| **G1** | $\ge 90$ | Low Risk (Green) | Moderate Risk (Yellow) | High Risk (Orange) |
| **G2** | $60 - 89$ | Low Risk (Green) | Moderate Risk (Yellow) | High Risk (Orange) |
| **G3a** | $45 - 59$ | Moderate Risk (Yellow)| High Risk (Orange) | Very High Risk (Red) |
| **G3b** | $30 - 44$ | High Risk (Orange) | Very High Risk (Red) | Very High Risk (Red) |
| **G4** | $15 - 29$ | Very High Risk (Red) | Very High Risk (Red) | Very High Risk (Red) |
| **G5** | $< 15$ | Very High Risk (Red) | Very High Risk (Red) | Very High Risk (Red) |

### GDMT Prescribing Logic Matrix
1. **SGLT2 Inhibitor (Dapagliflozin 10 mg or Empagliflozin 10 mg daily):**
   - **Indication:** $\text{eGFR} \ge 20\text{ mL/min/1.73m}^2$ AND (Type 2 Diabetes OR $\text{uACR} \ge 200\text{ mg/g}$ OR High-Risk eGFR slope).
   - **Safety Alert:** Remind clinician that an initial acute eGFR reduction up to $30\%$ at 4 weeks is expected and reflects beneficial hemodynamic intraglomerular pressure drop, NOT drug toxicity.
2. **RAS Blockade (ACEi or ARB at maximum tolerated dose):**
   - **Indication:** Hypertension + $\text{uACR} \ge 30\text{ mg/g}$.
   - **Monitoring:** Serum potassium and creatinine at 4 weeks. Discontinue only if potassium $> 5.5\text{ mEq/L}$ or creatinine rise $> 30\%$.
3. **Non-Steroidal MRA (Finerenone 10–20 mg):**
   - **Indication:** Persistent albuminuria ($\text{uACR} \ge 30\text{ mg/g}$) in T2D already on maximum tolerated ACEi/ARB with serum potassium $\le 4.8\text{ mEq/L}$.
