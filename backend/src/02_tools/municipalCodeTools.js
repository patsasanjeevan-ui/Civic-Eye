/**
 * Municipal Statutory Codebook and Gemma 4 Function Calling Tool Definitions
 * Cites Telangana Land Encroachment Act 1905, Telangana Municipalities Act 2019,
 * Environment Protection Act 1986, and Solid Waste Management Rules 2016.
 */

export const MUNICIPAL_LEGAL_DATABASE = {
  LAND_ENCROACHMENT: {
    issue_type: 'LAND_ENCROACHMENT',
    category_title: 'Illegal Encroachment on Government & Municipal Public Lands',
    governing_acts: [
      'Telangana Land Encroachment Act, 1905 (Act III of 1905)',
      'Telangana Municipalities Act, 2019 (Section 178)'
    ],
    primary_act_citation: 'Telangana Land Encroachment Act, 1905 & Telangana Municipalities Act, 2019 (Section 178)',
    section_number: 'Section 178 & Section 6',
    enforcement_authority: 'Mandal Revenue Officer (MRO / Tahsildar) & Municipal Commissioner',
    designated_officer_title_en: 'Mandal Revenue Officer (MRO) & Municipal Commissioner',
    designated_officer_title_te: 'మండల రెవెన్యూ అధికారి (తహశీల్దార్) & మున్సిపల్ కమిషనర్ గారు',
    sla_resolution_hours: 48,
    legal_provisions: [
      'Section 6 (1905 Act): Summary eviction of unauthorized occupants from land belonging to the Government.',
      'Section 7 (1905 Act): Prior notice requirement waived or expedited in urgent public road and drainage easement obstructions.',
      'Section 178 (2019 Act): Removal of encroachment on public streets, drains, water bodies, and open spaces without prior compensation.'
    ],
    statutory_penalty_clause: 'Summary eviction, seizure of building materials, forfeiture of crops or structures, and recovery of clearance costs from encroacher under the Revenue Recovery Act.',
    evidence_checklist: [
      'Site photograph with GPS stamp and visible physical encroachment',
      'Cadastral Revenue Village Map or Town Survey Register (TSR) extract',
      'Clear demarcation showing government/municipal buffer line'
    ]
  },

  UNAUTHORIZED_CONSTRUCTION: {
    issue_type: 'UNAUTHORIZED_CONSTRUCTION',
    category_title: 'Unauthorized Construction & Setback / Height Violations',
    governing_acts: [
      'Telangana Municipalities Act, 2019 (Section 180, 181)',
      'Telangana Building Permission Approval and Self-Certification System (TS-bPASS) Act, 2020'
    ],
    primary_act_citation: 'Telangana Municipalities Act, 2019 (Section 180 & Section 181)',
    section_number: 'Section 180',
    enforcement_authority: 'Town Planning Officer (TPO) & Municipal Commissioner',
    designated_officer_title_en: 'Town Planning Officer (TPO) & Municipal Commissioner',
    designated_officer_title_te: 'టౌన్ ప్లానింగ్ అధికారి & మున్సిపల్ కమిషనర్ గారు',
    sla_resolution_hours: 72,
    legal_provisions: [
      'Section 180(1): Obligation of municipal authorities to issue stop-work orders on any construction commenced without sanction plan.',
      'Section 180(2): Power of Municipal Commissioner to demolish unauthorized floors or setbacks without issuing a prolonged show-cause notice.',
      'Section 181: Penal action, disconnection of water/power utilities, and registration of criminal complaint against offending developer.'
    ],
    statutory_penalty_clause: 'Immediate cessation of work, forfeiture of TS-bPASS security deposit, demolition of deviant structures, and penalty of 25% of land registration value.',
    evidence_checklist: [
      'Photographic evidence of ongoing structural construction',
      'Approved sanction plan or proof of total absence of TS-bPASS sanction board',
      'Setback violation or floor height measurement discrepancy'
    ]
  },

  HAZARDOUS_WASTE: {
    issue_type: 'HAZARDOUS_WASTE',
    category_title: 'Hazardous Waste & Toxic Industrial Dumping in Public Waterways',
    governing_acts: [
      'Environment (Protection) Act, 1986 (Section 15)',
      'Solid Waste Management Rules, 2016',
      'Telangana Municipalities Act, 2019 (Section 165)'
    ],
    primary_act_citation: 'Environment (Protection) Act, 1986 & Telangana Municipalities Act, 2019 (Section 165)',
    section_number: 'Section 165',
    enforcement_authority: 'Municipal Health Officer (MHO) & Telangana State Pollution Control Board (TSPCB)',
    designated_officer_title_en: 'Municipal Health Officer (MHO) & Sanitary Inspector',
    designated_officer_title_te: 'మున్సిపల్ ఆరోగ్య అధికారి & శానిటరీ ఇన్స్పెక్టర్ గారు',
    sla_resolution_hours: 24,
    legal_provisions: [
      'Section 165 (2019 Act): Prohibition of throwing or depositing bio-medical, chemical, or hazardous litter in public streets or water courses.',
      'Solid Waste Management Rules 2016 Rule 15: Municipal responsibility for containment and safe neutralization.',
      'IPC Section 269/270: Negligent/malignant act likely to spread infection of disease dangerous to life.'
    ],
    statutory_penalty_clause: 'Civil penalty of up to INR 1,00,000, prosecution under Water (Prevention and Control of Pollution) Act, and criminal FIR.',
    evidence_checklist: [
      'Field photograph showing drums, chemical sludge, or hazardous medical waste',
      'GPS location pinpointing proximity to residential areas or public drains',
      'Visible danger markers or smoke/odor impact documentation'
    ]
  },

  ROAD_DAMAGE: {
    issue_type: 'ROAD_DAMAGE',
    category_title: 'Critical Public Road Cratering, Culvert Collapse, or Illegal Trenching',
    governing_acts: [
      'Telangana Municipalities Act, 2019 (Section 152)'
    ],
    primary_act_citation: 'Telangana Municipalities Act, 2019 (Section 152 - Maintenance and Protection of Public Streets)',
    section_number: 'Section 152',
    enforcement_authority: 'Executive Engineer (Municipal Engineering Division)',
    designated_officer_title_en: 'Executive Engineer (Roads & Buildings / Municipal Engineering)',
    designated_officer_title_te: 'కార్యనిర్వాహక ఇంజనీర్ (మున్సిపల్ ఇంజనీరింగ్ విభాగం) గారు',
    sla_resolution_hours: 48,
    legal_provisions: [
      'Section 152: Statutory duty of municipal council to maintain, repair, pave, and cleanse all public streets.',
      'Emergency Hazard Protocol: Obligation to install reflective hazard barricades within 6 hours of incident reporting.'
    ],
    statutory_penalty_clause: 'Departmental inquiry against contractor under defect liability clause; immediate emergency diversion and road restoration.',
    evidence_checklist: [
      'Clear photo of asphalt breach, open manhole, or collapsed culvert',
      'Context photo showing danger to two-wheeler and pedestrian traffic',
      'Exact street and landmark identification'
    ]
  }
};

/**
 * Function Calling definition for Ollama / Gemma 4 tool invocation
 */
export const municipalToolsDefinition = [
  {
    type: 'function',
    function: {
      name: 'lookup_municipal_violation_code',
      description: 'Searches the statutory municipal legal codebooks of Telangana and India to retrieve governing acts, sections, enforcement officers, penalties, and mandatory SLA resolution timeframes.',
      parameters: {
        type: 'object',
        properties: {
          issue_type: {
            type: 'string',
            enum: ['LAND_ENCROACHMENT', 'UNAUTHORIZED_CONSTRUCTION', 'HAZARDOUS_WASTE', 'ROAD_DAMAGE'],
            description: 'The type of municipal violation identified from the dual visual evidence and citizen notes.'
          },
          zone_code: {
            type: 'string',
            description: 'The municipal zone, revenue circle, or urban local body code (e.g. ZONE_HYD_URBAN, BHONGIRI_MUNICIPALITY).'
          }
        },
        required: ['issue_type']
      }
    }
  }
];

/**
 * Execute the tool call directly against the legal database
 */
export function executeMunicipalCodeLookup(issueType, zoneCode = 'DEFAULT_URBAN') {
  const normalizedType = (issueType || '').trim().toUpperCase();
  const rule = MUNICIPAL_LEGAL_DATABASE[normalizedType] || MUNICIPAL_LEGAL_DATABASE.LAND_ENCROACHMENT;

  return {
    success: true,
    zoneCode: zoneCode || 'ZONE_TELANGANA_URBAN',
    issueType: rule.issue_type,
    categoryTitle: rule.category_title,
    governingAct: rule.primary_act_citation,
    sectionNumber: rule.section_number,
    enforcementAuthority: rule.enforcement_authority,
    officerTitleEnglish: rule.designated_officer_title_en,
    officerTitleTelugu: rule.designated_officer_title_te,
    slaResolutionHours: rule.sla_resolution_hours,
    legalProvisions: rule.legal_provisions,
    penaltyClause: rule.statutory_penalty_clause,
    evidenceChecklist: rule.evidence_checklist
  };
}
