---
trigger: all
description: Clinical safety guidelines and algorithmic boundaries for RENAL-PULSE
---

# Clinical Safety & Algorithmic Guardrails

1. **Guideline Authority:**
   - All diagnostic and staging categories must strictly adhere to the **KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease**.
   - Risk prediction algorithms must implement the **Tangri 4-Variable Kidney Failure Risk Equation (KFRE)** as validated in JAMA 2016.
   - eGFR calculations must use the **CKD-EPI 2021 race-free refit equation** (Inker et al., NEJM 2021).

2. **Prescribing Safety Safeguards:**
   - **SGLT2 Inhibitors:**
     - Must NOT be initiated if eGFR $< 20\text{ mL/min/1.73m}^2$ (unless under specialist supervision).
     - Contraindicated in Type 1 Diabetes (euglycemic DKA risk) or history of severe ketoacidosis.
   - **RAS Blockade (ACEi / ARB):**
     - Must NOT be initiated or escalated if serum potassium $> 5.5\text{ mEq/L}$.
     - Routine 4-week safety follow-up panel (serum potassium + creatinine) is mandatory in the generated order set.
   - **Acute Hemodynamic eGFR Dip:**
     - The clinical decision support system must explain that a decline in eGFR $\le 30\%$ from baseline at 4 weeks is an anticipated hemodynamic effect of intraglomerular pressure reduction. Discontinuation is only advised if creatinine rises $>30\%$ or persistent hyperkalemia occurs.

3. **Patient-Facing Communication Safeguards:**
   - Avoid alarmist language ("Your kidneys are failing", "You are going to need dialysis").
   - Frame communication around organ preservation and proactive protection ("Protecting your natural kidney filters", "Keeping your energy and filtration strong").
   - Always route medical questions to qualified healthcare professionals.
