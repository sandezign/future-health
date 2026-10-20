#!/usr/bin/env python3
"""
AI Component Metadata Validator & Catalog Compiler

Validates that all shared UI components have structured AI metadata conforming
to the ai-component-metadata schema, enforces anti-pattern definitions,
and compiles a unified ai-catalog.json for AI agent context ingestion.
"""

import os
import sys
import json
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
METADATA_DIR = REPO_ROOT / "frontend" / "src" / "shared" / "ui" / "metadata"
UI_DIR = REPO_ROOT / "frontend" / "src" / "shared" / "ui"
OUTPUT_CATALOG_JSON = METADATA_DIR / "ai-catalog.json"
DATA_CATALOG_JSON = REPO_ROOT / "data" / "ai-component-catalog.json"

REQUIRED_SECTIONS = ["component", "usage", "composition", "behavior", "accessibility", "aiHints"]
REQUIRED_COMPONENT_FIELDS = ["name", "category", "description", "type"]
REQUIRED_USAGE_FIELDS = ["useCases", "requiredProps", "commonPatterns", "antiPatterns"]
REQUIRED_ACCESSIBILITY_FIELDS = ["role", "keyboardSupport", "screenReader", "focusManagement", "wcag"]
REQUIRED_AI_HINTS_FIELDS = ["priority", "keywords", "context"]

def extract_ts_object(file_path: Path):
    """
    Rudimentary parser for typescript metadata objects to ensure structural integrity
    without requiring node execution.
    """
    content = file_path.read_text(encoding="utf-8")
    
    # Check for required sections
    findings = []
    for section in REQUIRED_SECTIONS:
        if not re.search(rf"\b{section}\s*:\s*\{{", content):
            findings.append(f"Missing required section: '{section}'")

    for field in REQUIRED_COMPONENT_FIELDS:
        if not re.search(rf"\b{field}\s*:", content):
            findings.append(f"Missing component field: '{field}'")

    for field in REQUIRED_USAGE_FIELDS:
        if not re.search(rf"\b{field}\s*:", content):
            findings.append(f"Missing usage field: '{field}'")

    for field in REQUIRED_ACCESSIBILITY_FIELDS:
        if not re.search(rf"\b{field}\s*:", content):
            findings.append(f"Missing accessibility field: '{field}'")

    for field in REQUIRED_AI_HINTS_FIELDS:
        if not re.search(rf"\b{field}\s*:", content):
            findings.append(f"Missing aiHints field: '{field}'")

    # Verify anti-patterns are documented
    if "antiPatterns" in content:
        antipattern_matches = re.findall(r"scenario\s*:", content)
        if len(antipattern_matches) < 2:
            findings.append("Insufficient anti-patterns (minimum 2 recommended for AI guardrails)")

    # Verify common patterns
    if "commonPatterns" in content:
        pattern_matches = re.findall(r"composition\s*:", content)
        if len(pattern_matches) < 2:
            findings.append("Insufficient common patterns (minimum 2 recommended for AI code generation)")

    return findings

def validate_all_components():
    print("=" * 60)
    print("  RENAL-PULSE AI Component Metadata Verification")
    print("=" * 60)

    # 1. Discover all UI primitives in shared/ui/
    ui_files = [f for f in UI_DIR.glob("*.tsx") if f.is_file()]
    meta_files = [f for f in METADATA_DIR.glob("*.meta.ts") if f.is_file()]

    print(f"\n[1] Discovered {len(ui_files)} UI primitives in {UI_DIR.relative_to(REPO_ROOT)}:")
    for f in ui_files:
        print(f"    - {f.name}")

    print(f"\n[2] Discovered {len(meta_files)} AI Metadata specifications in {METADATA_DIR.relative_to(REPO_ROOT)}:")
    for f in meta_files:
        print(f"    - {f.name}")

    # 2. Check 1-to-1 parity between primitives and metadata
    errors = 0
    warnings = 0

    print("\n[3] Checking Primitive <-> Metadata Parity:")
    for ui_file in ui_files:
        base_name = ui_file.stem
        expected_meta = METADATA_DIR / f"{base_name}.meta.ts"
        if not expected_meta.exists():
            print(f"  ❌ ERROR: Component '{ui_file.name}' lacks AI metadata specification '{expected_meta.name}'")
            errors += 1
        else:
            print(f"  ✅ Parity OK: {ui_file.name} -> {expected_meta.name}")

    # 3. Validate structural schema of each metadata file
    print("\n[4] Validating Metadata Schema & AI Guardrails:")
    catalog = {}

    for meta_file in meta_files:
        comp_name = meta_file.stem.replace(".meta", "").capitalize()
        findings = extract_ts_object(meta_file)
        if findings:
            print(f"  ❌ Issues in {meta_file.name}:")
            for f in findings:
                print(f"     - {f}")
            errors += len(findings)
        else:
            print(f"  ✅ Validated: {meta_file.name} (All AI sections, patterns, and anti-patterns verified)")
            
        # Store summary for catalog
        content = meta_file.read_text(encoding="utf-8")
        desc_match = re.search(r"description:\s*['\"]([^'\"]+)['\"]", content)
        type_match = re.search(r"type:\s*['\"]([^'\"]+)['\"]", content)
        cat_match = re.search(r"category:\s*['\"]([^'\"]+)['\"]", content)
        wcag_match = re.search(r"wcag:\s*['\"]([^'\"]+)['\"]", content)

        catalog[comp_name] = {
            "file": f"src/shared/ui/{meta_file.stem.replace('.meta', '')}.tsx",
            "metaFile": f"src/shared/ui/metadata/{meta_file.name}",
            "description": desc_match.group(1) if desc_match else "",
            "category": cat_match.group(1) if cat_match else "",
            "type": type_match.group(1) if type_match else "",
            "wcag": wcag_match.group(1) if wcag_match else "AA",
        }

    # 4. Compile AI Catalog JSON
    print("\n[5] Compiling Machine-Readable AI Catalog:")
    compiled_catalog = {
        "version": "1.0.0",
        "designSystem": "mediora-clinical-design-system",
        "description": "Machine-readable component metadata and AI guardrails for RENAL-PULSE clinical copilot.",
        "components": catalog
    }

    OUTPUT_CATALOG_JSON.write_text(json.dumps(compiled_catalog, indent=2), encoding="utf-8")
    print(f"  ✅ Written to {OUTPUT_CATALOG_JSON.relative_to(REPO_ROOT)}")

    DATA_CATALOG_JSON.parent.mkdir(parents=True, exist_ok=True)
    DATA_CATALOG_JSON.write_text(json.dumps(compiled_catalog, indent=2), encoding="utf-8")
    print(f"  ✅ Written to {DATA_CATALOG_JSON.relative_to(REPO_ROOT)}")

    print("\n" + "=" * 60)
    if errors == 0:
        print("  🎉 ALL CHECKS PASSED: Design System is fully AI-Ready!")
        print("=" * 60)
        return 0
    else:
        print(f"  ⚠️ FAILED: {errors} error(s) detected.")
        print("=" * 60)
        return 1

if __name__ == "__main__":
    sys.exit(validate_all_components())
