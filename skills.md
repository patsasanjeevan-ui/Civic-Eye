---
name: civiceye-municipal-action-agent
description: Autonomous Dual-Language Multimodal Municipal Grievance Action Engine powered by Gemma 4. Ingests dual field photos and survey records, performs statutory municipal code lookup, and produces legally actionable petitions in English and Telugu.
version: 1.0.0
author: CivicEye Open-Source Team
license: Apache-2.0
compatibility:
  model_family: gemma4
  runtime: ollama
  required_tools:
    - lookup_municipal_violation_code
---

# CivicEye Municipal Action Agent Skill

This skill defines the autonomous pipeline for analyzing civic violations, verifying statutory jurisdictions, and generating twin-language municipal petitions.

## 1. Capabilities & Triggers

- **Trigger**: Submission of one or two field evidence images, citizen notes, and geospatial coordinates.
- **Multimodal Perception**:
  - Image 1: Field Hazard / Encroachment / Structural Violation evidence.
  - Image 2: Cadastral Survey Map, Revenue Record, or Town Planning Stop-Work Notice.
- **Deterministic Tool Calling**:
  - Invokes `lookup_municipal_violation_code(issue_type, zone_code)` to retrieve authoritative statutes.
- **Bilingual Legal Synthesis**:
  - English petition formatted for District Collector / Municipal Commissioner / Mandal Revenue Officer (MRO).
  - Telugu petition (`అధికారిక వినతి పత్రం`) drafted in official administrative Telugu with proper honorifics, acts, and SLA mandates.

## 2. Tool Definition: `lookup_municipal_violation_code`

```json
{
  "name": "lookup_municipal_violation_code",
  "description": "Searches municipal statutory codebooks to retrieve the exact governing act, section number, enforcement authority, and mandatory resolution SLA.",
  "parameters": {
    "type": "object",
    "properties": {
      "issue_type": {
        "type": "string",
        "enum": ["LAND_ENCROACHMENT", "UNAUTHORIZED_CONSTRUCTION", "HAZARDOUS_WASTE", "ROAD_DAMAGE"],
        "description": "Category of municipal infraction detected from multimodal visual evidence."
      },
      "zone_code": {
        "type": "string",
        "description": "Municipal or revenue zone code (e.g., ZONE_HYD_URBAN, REVENUE_RURAL_TELANGANA)."
      }
    },
    "required": ["issue_type"]
  }
}
```

## 3. Statutory Grounding Matrix

| Issue Type | Primary Statute | Designated Authority | SLA Target |
| :--- | :--- | :--- | :--- |
| `LAND_ENCROACHMENT` | Telangana Land Encroachment Act, 1905 & Telangana Municipalities Act, 2019 (Section 178) | Mandal Revenue Officer (MRO) / Tahsildar & Municipal Commissioner | 48 Hours |
| `UNAUTHORIZED_CONSTRUCTION` | Telangana Municipalities Act, 2019 (Section 180 & 181) | Town Planning Officer (TPO) & Municipal Commissioner | 72 Hours |
| `HAZARDOUS_WASTE` | Solid Waste Management Rules, 2016 & Telangana Municipalities Act, 2019 (Section 165) | Municipal Health Officer & Sanitary Inspector | 24 Hours |
| `ROAD_DAMAGE` | Telangana Municipalities Act, 2019 (Section 152 - Maintenance of Public Streets) | Executive Engineer (Municipal Engineering Division) | 48 Hours |

## 4. Execution Workflow

1. **Interleaved Image Inspection**:
   - Extract physical artifacts (excavators, steel girders, debris, fence posts, drain blockage).
   - Extract document text (Survey Number, Ward, Cadastral boundary markers, stamp dates).
2. **Autonomous Tool Call**:
   - Classify primary infraction and invoke `lookup_municipal_violation_code`.
   - Ingest returned statutory authority and time limits into model context.
3. **Structured Bilingual Generation**:
   - Structure output according to standard municipal grievance schemas.
   - Produce pristine Telugu translation avoiding phonetic anglicisms.
   - Emit geo-tagged record for PostGIS heatmap persistence.
