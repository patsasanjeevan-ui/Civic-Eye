-- ====================================================================
-- CivicEye-Agent Database Initialization Script
-- PostgreSQL 16 + PostGIS Municipal Grievance & Violation Rules Schema
-- ====================================================================

-- 1. Create PostGIS extension if available in the environment
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Statutory Municipal Violation Rules Master Table
CREATE TABLE IF NOT EXISTS municipal_violation_rules (
    id SERIAL PRIMARY KEY,
    issue_type VARCHAR(64) UNIQUE NOT NULL,
    category_title VARCHAR(128) NOT NULL,
    governing_act TEXT NOT NULL,
    section_number VARCHAR(64) NOT NULL,
    enforcement_authority TEXT NOT NULL,
    designated_officer_title_en TEXT NOT NULL,
    designated_officer_title_te TEXT NOT NULL,
    sla_resolution_hours INT NOT NULL,
    statutory_penalty_clause TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Municipal Violation Rules
INSERT INTO municipal_violation_rules (
    issue_type,
    category_title,
    governing_act,
    section_number,
    enforcement_authority,
    designated_officer_title_en,
    designated_officer_title_te,
    sla_resolution_hours,
    statutory_penalty_clause
) VALUES 
(
    'LAND_ENCROACHMENT',
    'Illegal Encroachment of Public & Government Lands',
    'Telangana Land Encroachment Act, 1905 & Telangana Municipalities Act, 2019',
    'Section 178',
    'Mandal Revenue Officer (MRO / Tahsildar) & Municipal Commissioner',
    'Mandal Revenue Officer (MRO) / Tahsildar & Municipal Commissioner',
    'మండల రెవెన్యూ అధికారి (తహశీల్దార్) & పురపాలక సంఘ కమిషనర్',
    48,
    'Summary eviction under Section 6 of 1905 Act with forfeiture of structures and penal assessment under Section 7.'
),
(
    'UNAUTHORIZED_CONSTRUCTION',
    'Illegal & Deviated Structural Constructions Without Sanction Plan',
    'Telangana Municipalities Act, 2019 & TS-bPASS Act, 2020',
    'Section 180 & Section 181',
    'Town Planning Officer (TPO) & Municipal Commissioner',
    'Town Planning Officer (TPO) & Municipal Commissioner',
    'టౌన్ ప్లానింగ్ అధికారి & పురపాలక సంఘ కమిషనర్',
    72,
    'Immediate stop-work notice, demolition of deviations without notice under Section 180(2), and penalty of 25% property value.'
),
(
    'HAZARDOUS_WASTE',
    'Illegal Dumping of Toxic Industrial Effluents & Medical Waste in Public Waterways',
    'Environment (Protection) Act, 1986 & Telangana Municipalities Act, 2019',
    'Section 165 (Sanitation and Solid Waste Management)',
    'Municipal Health Officer & Telangana State Pollution Control Board (TSPCB)',
    'Municipal Health Officer (MHO) & Sanitary Inspector',
    'మున్సిపల్ ఆరోగ్య అధికారి & శానిటరీ ఇన్స్పెక్టర్',
    24,
    'Fines up to INR 1,00,000 under SWM Rules 2016, civil liability, and criminal prosecution under IPC Section 269.'
),
(
    'ROAD_DAMAGE',
    'Severe Pavement Crater, Culvert Collapse, or Unauthorized Trench Cutting',
    'Telangana Municipalities Act, 2019',
    'Section 152 (Maintenance and Protection of Public Streets)',
    'Executive Engineer (Municipal Engineering Division)',
    'Executive Engineer (Roads & Buildings / Municipal Engineering)',
    'కార్యనిర్వాహక ఇంజనీర్ (మున్సిపల్ ఇంజనీరింగ్ విభాగం)',
    48,
    'Mandatory emergency barricading within 6 hours and permanent restoration within 48 hours.'
)
ON CONFLICT (issue_type) DO UPDATE SET
    governing_act = EXCLUDED.governing_act,
    section_number = EXCLUDED.section_number,
    enforcement_authority = EXCLUDED.enforcement_authority,
    sla_resolution_hours = EXCLUDED.sla_resolution_hours;

-- 3. Civic Grievances Table for Multimodal AI Findings
CREATE TABLE IF NOT EXISTS civic_grievances (
    id SERIAL PRIMARY KEY,
    ticket_number VARCHAR(48) UNIQUE NOT NULL,
    issue_type VARCHAR(64) NOT NULL REFERENCES municipal_violation_rules(issue_type),
    severity VARCHAR(16) NOT NULL CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
    ward_number VARCHAR(32) NOT NULL,
    citizen_note TEXT,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    visual_evidence_summary TEXT,
    boundary_details TEXT,
    survey_number VARCHAR(64),
    statutory_act TEXT NOT NULL,
    enforcement_authority TEXT NOT NULL,
    sla_hours INT DEFAULT 48,
    petition_english TEXT NOT NULL,
    petition_telugu TEXT NOT NULL,
    reasoning_trace JSONB,
    model_used VARCHAR(64) DEFAULT 'gemma4:e4b',
    status VARCHAR(32) DEFAULT 'OFFICIALLY_REGISTERED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Spatial Indexing (if PostGIS geometry column is added)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') THEN
        ALTER TABLE civic_grievances ADD COLUMN IF NOT EXISTS geom GEOMETRY(Point, 4326);
        UPDATE civic_grievances SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326) WHERE geom IS NULL;
        CREATE INDEX IF NOT EXISTS idx_civic_grievances_geom ON civic_grievances USING GIST(geom);
    END IF;
END $$;

-- 5. Seed Initial Spatial Municipal Grievances in Telangana State
INSERT INTO civic_grievances (
    ticket_number,
    issue_type,
    severity,
    ward_number,
    citizen_note,
    latitude,
    longitude,
    visual_evidence_summary,
    boundary_details,
    survey_number,
    statutory_act,
    enforcement_authority,
    sla_hours,
    petition_english,
    petition_telugu,
    reasoning_trace,
    model_used,
    status
) VALUES
(
    'CE-2026-HYD-0402',
    'LAND_ENCROACHMENT',
    'CRITICAL',
    'Ward 12 (Bhongiri Zone)',
    'Illegal boundary wall and GI sheets installed encroaching government drainage buffer and public road easement.',
    17.5150000,
    78.8910000,
    'Field photo reveals corrugated tin fence and newly dug foundation footings encroaching into 30ft revenue road buffer.',
    'Revenue Village Map sheet 4 indicates Sy. No. 402 is classified as Government Sarkari Poramboke.',
    'Sy. No. 402/A',
    'Telangana Land Encroachment Act, 1905 & Telangana Municipalities Act, 2019 (Section 178)',
    'Mandal Revenue Officer (MRO) & Municipal Commissioner',
    48,
    'To:\nThe Mandal Revenue Officer & The Municipal Commissioner\nBhongiri Municipality, Telangana.\n\nSubject: Formal Statutory Petition for Immediate Summary Eviction of Encroachment on Government Poramboke Land (Sy. No. 402/A, Ward 12) under Telangana Land Encroachment Act 1905 and Section 178 of Telangana Municipalities Act 2019.\n\nRespected Sir/Madam,\n\nWe hereby bring to your urgent statutory attention an active, illegal encroachment currently underway on designated government poramboke road buffer at Sy. No. 402/A, Ward 12. Unidentified commercial parties have erected corrugated iron fencing and excavated deep foundation footings, obstructing public right of way.\n\nAs per Revenue Records, this parcel is strictly classified as Public Utility Land. Under Section 6 and 7 of the Telangana Land Encroachment Act 1905, and Section 178 of Telangana Municipalities Act 2019, the administration is legally bound to evict unauthorized occupants and restore public easement.\n\nWe request immediate site inspection, stoppage of unauthorized work, and summary removal within the stipulated 48-hour statutory SLA.\n\nRespectfully submitted,\nCivic Action Taskforce, Ward 12',
    'ఎవరికి:\nగౌరవనీయులైన మండల రెవెన్యూ అధికారి (తహశీల్దార్) మరియు పురపాలక సంఘ కమిషనర్ గారు,\nభువనగిరి పురపాలక సంఘం, తెలంగాణ.\n\nవిషయం: సర్వే నెం. 402/A, వార్డు నెం. 12 లోని ప్రభుత్వ పోరంబోకు స్థలంలో జరుగుతున్న అక్రమ ఆక్రమణలను తక్షణమే తొలగించాలని కోరుతూ తెలంగాణ భూ ఆక్రమణల నిరోధక చట్టం 1905 మరియు తెలంగాణ మున్సిపాలిటీల చట్టం 2019 (సెక్షన్ 178) ప్రకారం సమర్పించే చట్టబద్ధ వినతి పత్రం.\n\nఅయ్యా / అమ్మా,\n\nభువనగిరి వార్డు నెం. 12 పరిధిలోని సర్వే నెం. 402/A ప్రభుత్వ స్థలంలో కొందరు వ్యక్తులు అక్రమంగా రేకుల కంచె వేసి, పునాదులు తవ్వుతూ ప్రజా రహదారిని మరియు కాలువ స్థలాన్ని ఆక్రమిస్తున్నారని మీ దృష్టికి తెస్తున్నాము.\n\nరెవెన్యూ రికార్డుల ప్రకారం ఇది ప్రభుత్వ పోరంబోకు స్థలం. తెలంగాణ భూ ఆక్రమణల నిరోధక చట్టం 1905 (సెక్షన్ 6 & 7) మరియు తెలంగాణ మున్సిపాలిటీల చట్టం 2019 (సెక్షన్ 178) ప్రకారం ప్రభుత్వ భూమిని ఆక్రమించడం శిక్షార్హం. కనుక తక్షణమే క్షేత్రస్థాయి విచారణ జరిపి, అక్రమ నిర్మాణాన్ని తొలగించి, 48 గంటల గడువులోగా తగిన చర్యలు తీసుకోవాల్సిందిగా కోరుతున్నాము.\n\nఇట్లు,\nబాధ్యతాయుత పౌరులు, వార్డు నెం. 12',
    '{"mode": "multimodal_thinking", "steps": ["Ingested field photo: detected GI sheet fence and fresh trenching", "Ingested survey record: verified Sy. No. 402 is Government Poramboke", "Tool call: lookup_municipal_violation_code(issue_type=\"LAND_ENCROACHMENT\", zone_code=\"ZONE_HYD_URBAN\")", "Confirmed Section 178 of Telangana Municipalities Act 2019 and 1905 Land Encroachment Act", "Generated bilingual legal petition with 48h SLA"]}'::jsonb,
    'gemma4:e4b',
    'OFFICIALLY_REGISTERED'
),
(
    'CE-2026-HYD-0180',
    'UNAUTHORIZED_CONSTRUCTION',
    'HIGH',
    'Ward 07 (Uppal Zone)',
    '4th floor slab being laid without building permission, exceeding permitted G+2 zoning.',
    17.4022000,
    78.5601000,
    'Live visual evidence shows shuttering boards and wet cement pouring on the 4th floor slab with no building permit board displayed.',
    'Town Planning Sanction order TP/2024/098 limits height to 10 meters (G+2 residential only).',
    'Plot No. 84, Sy. No. 112',
    'Telangana Municipalities Act, 2019 (Section 180 & 181)',
    'Town Planning Officer (TPO) & Municipal Commissioner',
    72,
    'To:\nThe Town Planning Officer & Municipal Commissioner\nUppal Circle, GHMC.\n\nSubject: Notice under Section 180 of the Telangana Municipalities Act, 2019 for Unauthorized Construction Deviating Beyond Sanctioned G+2 Plan (Plot 84, Sy. No. 112).\n\nRespected Authorities,\n\nNotice is hereby served regarding gross illegal construction at Plot 84, Ward 7, where a 4th floor slab is actively being cast in direct violation of Sanction TP/2024/098. Under Section 180(2) of Telangana Municipalities Act 2019, you are empowered to seize construction equipment and order immediate demolition of non-compoundable deviations without further show-cause notice.\n\nFiling date: Immediate statutory intervention required within 72 hours.\n\nCitizen Vigilance Wing',
    'ఎవరికి:\nగౌరవనీయులైన టౌన్ ప్లానింగ్ అధికారి మరియు కమిషనర్ గారు,\nఉప్పల్ సర్కిల్, జీహెచ్ఎంసి.\n\nవిషయం: ప్లాట్ నెం. 84, సర్వే నెం. 112 లో అనుమతి లేకుండా అక్రమంగా నిర్మిస్తున్న 4వ అంతస్తు స్లాబ్‌ను అడ్డుకోవాలని తెలంగాణ మున్సిపాలిటీల చట్టం 2019 (సెక్షన్ 180, 181) కింద చట్టపరమైన ఫిర్యాదు.\n\nఅయ్యా,\n\nవార్డు నెం. 7 పరిధిలోని ప్లాట్ 84 లో కేవలం G+2 అనుమతి ఉండగా, నిబంధనలకు విరుద్ధంగా 4వ అంతస్తు స్లాబ్ వేస్తున్నారు. ఇది మున్సిపల్ చట్టం సెక్షన్ 180 ప్రకారం చట్టవిరుద్ధం. వెంటనే నిర్మాణ పనులను ఆపివేసి, అక్రమ నిర్మాణాన్ని సీజ్ చేయాల్సిందిగా ప్రార్థన.\n\nఇట్లు,\nపౌర సంఘం',
    '{"mode": "multimodal_thinking", "steps": ["Detected structural slab shuttering exceeding sanctioned G+2", "Matched with Municipal Act Sec 180", "Generated statutory stop-work notice petition"]}'::jsonb,
    'gemma4:e4b',
    'IN_REVIEW'
),
(
    'CE-2026-HYD-0099',
    'HAZARDOUS_WASTE',
    'CRITICAL',
    'Ward 03 (Jeedimetla Zone)',
    'Chemical drum dumping in stormwater canal leading to water contamination and toxic fumes.',
    17.5210000,
    78.4410000,
    'Industrial barrels dumped along storm drain leaking blue toxic sludge into municipal nullah.',
    'Industrial Area Drainage Channel demarcation, Ward 03.',
    'Drainage Segment N-3',
    'Environment (Protection) Act, 1986 & Telangana Municipalities Act, 2019 (Section 165)',
    'Municipal Health Officer & TSPCB',
    24,
    'To:\nThe Municipal Health Officer & Telangana State Pollution Control Board\nJeedimetla Industrial Zone.\n\nSubject: Critical Emergency Report on Hazardous Chemical Dumping in Public Storm Drain under Section 165 of Municipalities Act 2019.\n\nEmergency intervention requested: multiple barrels of toxic chemical solvent dumped along the public nala causing acute noxious fumes and groundwater jeopardy. 24-hour hazardous cleanup mandatory.\n\nImmediate Action Requested.',
    'ఎవరికి:\nమున్సిపల్ ఆరోగ్య అధికారి మరియు కాలుష్య నియంత్రణ మండలి అధికారులకు,\nజీడిమెట్ల.\n\nవిషయం: మురుగు కాలువలో విష రసాయన వ్యర్థాలు డంపింగ్ చేయడంపై అత్యవసర ఫిర్యాదు - తెలంగాణ మున్సిపాలిటీల చట్టం సెక్షన్ 165 ప్రకారం తక్షణ చర్యలు తీసుకోవాలని విజ్ఞప్తి.\n\nప్రజల ఆరోగ్యానికి తీవ్ర హాని కలిగిస్తున్న రసాయన వ్యర్థాలను తక్షణమే శుభ్రం చేసి, దోషులపై క్రిమినల్ కేసులు నమోదు చేయాలని కోరుతున్నాము.',
    '{"mode": "multimodal_thinking", "steps": ["Identified hazardous chemical drum leaks in stormwater channel", "Escalated to 24h CRITICAL status under Sec 165"]}'::jsonb,
    'gemma4:e4b',
    'ESCALATED_TO_AUTHORITY'
)
ON CONFLICT (ticket_number) DO NOTHING;
