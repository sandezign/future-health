#!/usr/bin/env python3
"""
Generate realistic synthetic cardiorenal patient cohorts for RENAL-PULSE testing and demonstration.
Aligned with NHANES and BPJS chronic disease epidemiology.
"""

import json
import random
from datetime import datetime, timedelta

random.seed(42)

def generate_cohort(n_patients=100):
    cohort = []
    
    # Cohort breakdown:
    # 40% Diabetic with silent CKD progression
    # 30% Hypertensive with early microalbuminuria
    # 15% Rapid cardiorenal progressor (catastrophic slope)
    # 15% Stable / well-controlled baseline
    
    for i in range(1, n_patients + 1):
        patient_id = f"PT-{1000 + i}"
        age = random.randint(42, 75)
        sex = random.choice(["male", "female"])
        
        archetype = random.choices(
            ["diabetic_progressor", "hypertensive_early", "rapid_progressor", "stable"],
            weights=[40, 30, 15, 15]
        )[0]
        
        # Base vitals and conditions
        if archetype == "diabetic_progressor":
            has_diabetes = True
            has_hypertension = random.choice([True, False])
            systolic_bp = random.randint(132, 155)
            diastolic_bp = random.randint(82, 95)
            uacr = round(random.uniform(45.0, 320.0), 1)
            dipstick = random.choice(["trace", "1+", "2+"])
            initial_creat = round(random.uniform(0.9, 1.3), 2)
            slope_annual_decline = random.uniform(3.2, 5.5)  # mL/min/yr loss
            
        elif archetype == "hypertensive_early":
            has_diabetes = False
            has_hypertension = True
            systolic_bp = random.randint(140, 165)
            diastolic_bp = random.randint(88, 102)
            uacr = round(random.uniform(25.0, 120.0), 1)
            dipstick = random.choice(["negative", "trace", "1+"])
            initial_creat = round(random.uniform(0.8, 1.1), 2)
            slope_annual_decline = random.uniform(1.8, 3.5)
            
        elif archetype == "rapid_progressor":
            has_diabetes = True
            has_hypertension = True
            systolic_bp = random.randint(155, 180)
            diastolic_bp = random.randint(95, 110)
            uacr = round(random.uniform(350.0, 1200.0), 1)
            dipstick = random.choice(["2+", "3+"])
            initial_creat = round(random.uniform(1.2, 1.8), 2)
            slope_annual_decline = random.uniform(5.5, 9.0)  # Severe decline
            
        else:  # Stable
            has_diabetes = random.choice([True, False])
            has_hypertension = random.choice([True, False])
            systolic_bp = random.randint(118, 130)
            diastolic_bp = random.randint(75, 84)
            uacr = round(random.uniform(5.0, 28.0), 1)
            dipstick = "negative"
            initial_creat = round(random.uniform(0.7, 1.0), 2)
            slope_annual_decline = random.uniform(0.2, 1.0)
            
        # Generate 4 longitudinal creatinine measurements over 2 years
        now = datetime.now()
        history = []
        
        # Creatinine increases as GFR drops:
        # Approximate: eGFR drops by slope_annual_decline * years
        # Let's create realistic timestamps: -24 mo, -16 mo, -8 mo, 0 mo
        months_ago = [24, 16, 8, 0]
        current_creat = initial_creat
        
        for idx, m in enumerate(months_ago):
            t = now - timedelta(days=m * 30.5)
            if idx > 0:
                # Add incremental rise reflecting eGFR decline
                noise = random.uniform(-0.03, 0.05)
                increment = (slope_annual_decline / 25.0) * (8 / 12) + noise
                current_creat = max(0.5, round(current_creat + increment, 2))
                
            history.append({
                "timestamp": t.strftime("%Y-%m-%dT%H:%M:%SZ"),
                "serum_creatinine": current_creat
            })
            
        cohort.append({
            "patient_id": patient_id,
            "name": f"Patient {patient_id.replace('PT-', '')}",
            "age": age,
            "sex": sex,
            "has_diabetes": has_diabetes,
            "has_hypertension": has_hypertension,
            "systolic_bp": systolic_bp,
            "diastolic_bp": diastolic_bp,
            "uacr": uacr,
            "dipstick_protein": dipstick,
            "creatinine_history": history
        })
        
    return cohort

if __name__ == "__main__":
    data = generate_cohort(100)
    output_path = "data/synthetic/patients.json"
    with open(output_path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"Generated {len(data)} synthetic patient records saved to {output_path}")
