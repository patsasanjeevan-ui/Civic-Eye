import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Initial in-memory mock storage seeded with realistic municipal complaints
const inMemoryGrievances = [
  {
    id: 1,
    ticket_number: 'CE-2026-HYD-0402',
    issue_type: 'LAND_ENCROACHMENT',
    severity: 'CRITICAL',
    ward_number: 'Ward 12 (Bhongiri Zone)',
    citizen_note: 'Illegal boundary wall and GI sheets installed encroaching government drainage buffer and public road easement.',
    latitude: 17.5150000,
    longitude: 78.8910000,
    visual_evidence_summary: 'Field photo reveals corrugated tin fence and newly dug foundation footings encroaching into 30ft revenue road buffer.',
    boundary_details: 'Revenue Village Map sheet 4 indicates Sy. No. 402 is classified as Government Sarkari Poramboke.',
    survey_number: 'Sy. No. 402/A',
    statutory_act: 'Telangana Land Encroachment Act, 1905 & Telangana Municipalities Act, 2019 (Section 178)',
    enforcement_authority: 'Mandal Revenue Officer (MRO) & Municipal Commissioner',
    sla_hours: 48,
    petition_english: `To:
The Mandal Revenue Officer & The Municipal Commissioner
Bhongiri Municipality, Telangana.

Subject: Formal Statutory Petition for Immediate Summary Eviction of Encroachment on Government Poramboke Land (Sy. No. 402/A, Ward 12) under Telangana Land Encroachment Act 1905 and Section 178 of Telangana Municipalities Act 2019.

Respected Sir/Madam,

We hereby bring to your urgent statutory attention an active, illegal encroachment currently underway on designated government poramboke road buffer at Sy. No. 402/A, Ward 12. Unidentified commercial parties have erected corrugated iron fencing and excavated deep foundation footings, obstructing public right of way.

As per Revenue Records, this parcel is strictly classified as Public Utility Land. Under Section 6 and 7 of the Telangana Land Encroachment Act 1905, and Section 178 of Telangana Municipalities Act 2019, the administration is legally bound to evict unauthorized occupants and restore public easement.

We request immediate site inspection, stoppage of unauthorized work, and summary removal within the stipulated 48-hour statutory SLA.

Respectfully submitted,
Civic Action Taskforce, Ward 12`,
    petition_telugu: `ఎవరికి:
గౌరవనీయులైన మండల రెవెన్యూ అధికారి (తహశీల్దార్) మరియు పురపాలక సంఘ కమిషనర్ గారు,
భువనగిరి పురపాలక సంఘం, తెలంగాణ.

విషయం: సర్వే నెం. 402/A, వార్డు నెం. 12 లోని ప్రభుత్వ పోరంబోకు స్థలంలో జరుగుతున్న అక్రమ ఆక్రమణలను తక్షణమే తొలగించాలని కోరుతూ తెలంగాణ భూ ఆక్రమణల నిరోధక చట్టం 1905 మరియు తెలంగాణ మున్సిపాలిటీల చట్టం 2019 (సెక్షన్ 178) ప్రకారం సమర్పించే చట్టబద్ధ వినతి పత్రం.

అయ్యా / అమ్మా,

భువనగిరి వార్డు నెం. 12 పరిధిలోని సర్వే నెం. 402/A ప్రభుత్వ స్థలంలో కొందరు వ్యక్తులు అక్రమంగా రేకుల కంచె వేసి, పునాదులు తవ్వుతూ ప్రజా రహదారిని మరియు కాలువ స్థలాన్ని ఆక్రమిస్తున్నారని మీ దృష్టికి తెస్తున్నాము.

రెవెన్యూ రికార్డుల ప్రకారం ఇది ప్రభుత్వ పోరంబోకు స్థలం. తెలంగాణ భూ ఆక్రమణల నిరోధక చట్టం 1905 (సెక్షన్ 6 & 7) మరియు తెలంగాణ మున్సిపాలిటీల చట్టం 2019 (సెక్షన్ 178) ప్రకారం ప్రభుత్వ భూమిని ఆక్రమించడం శిక్షార్హం. కనుక తక్షణమే క్షేత్రస్థాయి విచారణ జరిపి, అక్రమ నిర్మాణాన్ని తొలగించి, 48 గంటల గడువులోగా తగిన చర్యలు తీసుకోవాల్సిందిగా కోరుతున్నాము.

ఇట్లు,
బాధ్యతాయుత పౌరులు, వార్డు నెం. 12`,
    reasoning_trace: {
      mode: 'multimodal_thinking',
      steps: [
        'Ingested field photo: detected GI sheet fence and fresh trenching',
        'Ingested survey record: verified Sy. No. 402 is Government Poramboke',
        'Tool call: lookup_municipal_violation_code(issue_type="LAND_ENCROACHMENT", zone_code="ZONE_HYD_URBAN")',
        'Confirmed Section 178 of Telangana Municipalities Act 2019 and 1905 Land Encroachment Act',
        'Generated bilingual legal petition with 48h SLA'
      ]
    },
    model_used: 'gemma4:e4b',
    status: 'OFFICIALLY_REGISTERED',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 2,
    ticket_number: 'CE-2026-HYD-0180',
    issue_type: 'UNAUTHORIZED_CONSTRUCTION',
    severity: 'HIGH',
    ward_number: 'Ward 07 (Uppal Zone)',
    citizen_note: '4th floor slab being laid without building permission, exceeding permitted G+2 zoning.',
    latitude: 17.4022000,
    longitude: 78.5601000,
    visual_evidence_summary: 'Live visual evidence shows shuttering boards and wet cement pouring on the 4th floor slab with no building permit board displayed.',
    boundary_details: 'Town Planning Sanction order TP/2024/098 limits height to 10 meters (G+2 residential only).',
    survey_number: 'Plot No. 84, Sy. No. 112',
    statutory_act: 'Telangana Municipalities Act, 2019 (Section 180 & 181)',
    enforcement_authority: 'Town Planning Officer (TPO) & Municipal Commissioner',
    sla_hours: 72,
    petition_english: `To:
The Town Planning Officer & Municipal Commissioner
Uppal Circle, GHMC.

Subject: Notice under Section 180 of the Telangana Municipalities Act, 2019 for Unauthorized Construction Deviating Beyond Sanctioned G+2 Plan (Plot 84, Sy. No. 112).

Respected Authorities,

Notice is hereby served regarding gross illegal construction at Plot 84, Ward 7, where a 4th floor slab is actively being cast in direct violation of Sanction TP/2024/098. Under Section 180(2) of Telangana Municipalities Act 2019, you are empowered to seize construction equipment and order immediate demolition of non-compoundable deviations without further show-cause notice.

Filing date: Immediate statutory intervention required within 72 hours.

Citizen Vigilance Wing`,
    petition_telugu: `ఎవరికి:
గౌరవనీయులైన టౌన్ ప్లానింగ్ అధికారి మరియు కమిషనర్ గారు,
ఉప్పల్ సర్కిల్, జీహెచ్ఎంసి.

విషయం: ప్లాట్ నెం. 84, సర్వే నెం. 112 లో అనుమతి లేకుండా అక్రమంగా నిర్మిస్తున్న 4వ అంతస్తు స్లాబ్‌ను అడ్డుకోవాలని తెలంగాణ మున్సిపాలిటీల చట్టం 2019 (సెక్షన్ 180, 181) కింద చట్టపరమైన ఫిర్యాదు.

అయ్యా,

వార్డు నెం. 7 పరిధిలోని ప్లాట్ 84 లో కేవలం G+2 అనుమతి ఉండగా, నిబంధనలకు విరుద్ధంగా 4వ అంతస్తు స్లాబ్ వేస్తున్నారు. ఇది మున్సిపల్ చట్టం సెక్షన్ 180 ప్రకారం చట్టవిరుద్ధం. వెంటనే నిర్మాణ పనులను ఆపివేసి, అక్రమ నిర్మాణాన్ని సీజ్ చేయాల్సిందిగా ప్రార్థన.

ఇట్లు,
పౌర సంఘం`,
    reasoning_trace: {
      mode: 'multimodal_thinking',
      steps: [
        'Detected structural slab shuttering exceeding sanctioned G+2',
        'Matched with Municipal Act Sec 180',
        'Generated statutory stop-work notice petition'
      ]
    },
    model_used: 'gemma4:e4b',
    status: 'IN_REVIEW',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 3,
    ticket_number: 'CE-2026-HYD-0099',
    issue_type: 'HAZARDOUS_WASTE',
    severity: 'CRITICAL',
    ward_number: 'Ward 03 (Jeedimetla Zone)',
    citizen_note: 'Chemical drum dumping in stormwater canal leading to water contamination and toxic fumes.',
    latitude: 17.5210000,
    longitude: 78.4410000,
    visual_evidence_summary: 'Industrial barrels dumped along storm drain leaking blue toxic sludge into municipal nullah.',
    boundary_details: 'Industrial Area Drainage Channel demarcation, Ward 03.',
    survey_number: 'Drainage Segment N-3',
    statutory_act: 'Environment (Protection) Act, 1986 & Telangana Municipalities Act, 2019 (Section 165)',
    enforcement_authority: 'Municipal Health Officer & TSPCB',
    sla_hours: 24,
    petition_english: `To:
The Municipal Health Officer & Telangana State Pollution Control Board
Jeedimetla Industrial Zone.

Subject: Critical Emergency Report on Hazardous Chemical Dumping in Public Storm Drain under Section 165 of Municipalities Act 2019.

Emergency intervention requested: multiple barrels of toxic chemical solvent dumped along the public nala causing acute noxious fumes and groundwater jeopardy. 24-hour hazardous cleanup mandatory.

Immediate Action Requested.`,
    petition_telugu: `ఎవరికి:
మున్సిపల్ ఆరోగ్య అధికారి మరియు కాలుష్య నియంత్రణ మండలి అధికారులకు,
జీడిమెట్ల.

విషయం: మురుగు కాలువలో విష రసాయన వ్యర్థాలు డంపింగ్ చేయడంపై అత్యవసర ఫిర్యాదు - తెలంగాణ మున్సిపాలిటీల చట్టం సెక్షన్ 165 ప్రకారం తక్షణ చర్యలు తీసుకోవాలని విజ్ఞప్తి.

ప్రజల ఆరోగ్యానికి తీవ్ర హాని కలిగిస్తున్న రసాయన వ్యర్థాలను తక్షణమే శుభ్రం చేసి, దోషులపై క్రిమినల్ కేసులు నమోదు చేయాలని కోరుతున్నాము.`,
    reasoning_trace: {
      mode: 'multimodal_thinking',
      steps: [
        'Identified hazardous chemical drum leaks in stormwater channel',
        'Escalated to 24h CRITICAL status under Sec 165'
      ]
    },
    model_used: 'gemma4:e4b',
    status: 'ESCALATED_TO_AUTHORITY',
    created_at: new Date(Date.now() - 3600000 * 20).toISOString()
  }
];

let pool = null;
let isPostgresAvailable = false;

// Attempt PostgreSQL initialization gracefully
try {
  const connectionString = process.env.DATABASE_URL;
  if (connectionString && !connectionString.includes('dummy')) {
    pool = new Pool({
      connectionString,
      connectionTimeoutMillis: 2500,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    pool.on('error', (err) => {
      console.warn('⚠️ Idle PostgreSQL pool client error (using in-memory fallback):', err.message);
    });

    pool.query('SELECT NOW()')
      .then(() => {
        isPostgresAvailable = true;
        console.log('✅ PostgreSQL connected successfully with PostGIS spatial store.');
      })
      .catch((err) => {
        isPostgresAvailable = false;
        console.warn('⚠️ PostgreSQL unavailable. Activating resilient in-memory fallback store:', err.message);
        if (pool) {
          pool.end().catch(() => {});
          pool = null;
        }
      });
  } else {
    console.log('ℹ️ No active DATABASE_URL provided. Running with high-performance in-memory store.');
  }
} catch (error) {
  isPostgresAvailable = false;
  console.warn('⚠️ Error initializing PostgreSQL pool, falling back to in-memory:', error.message);
}

/**
 * Universal query runner with fallback to in-memory store
 */
export async function query(text, params = []) {
  if (isPostgresAvailable && pool) {
    try {
      return await pool.query(text, params);
    } catch (err) {
      console.warn('⚠️ PostgreSQL query failed, using in-memory handler:', err.message);
    }
  }
  return { rows: [] };
}

/**
 * Save new civic grievance record
 */
export async function saveGrievance(data) {
  const newRecord = {
    id: inMemoryGrievances.length + 1,
    ticket_number: data.ticket_number || `CE-2026-HYD-${Math.floor(1000 + Math.random() * 9000)}`,
    issue_type: data.issue_type || 'LAND_ENCROACHMENT',
    severity: data.severity || 'HIGH',
    ward_number: data.ward_number || 'Ward 12',
    citizen_note: data.citizen_note || '',
    latitude: parseFloat(data.latitude) || 17.5150,
    longitude: parseFloat(data.longitude) || 78.8910,
    visual_evidence_summary: data.visual_evidence_summary || '',
    boundary_details: data.boundary_details || '',
    survey_number: data.survey_number || 'Sy. No. Unspecified',
    statutory_act: data.statutory_act || 'Telangana Municipalities Act, 2019',
    enforcement_authority: data.enforcement_authority || 'Municipal Commissioner',
    sla_hours: data.sla_hours || 48,
    petition_english: data.petition_english || '',
    petition_telugu: data.petition_telugu || '',
    reasoning_trace: data.reasoning_trace || {},
    model_used: data.model_used || 'gemma4:e4b',
    status: 'OFFICIALLY_REGISTERED',
    created_at: new Date().toISOString()
  };

  // Add to in-memory storage first to guarantee instant availability
  inMemoryGrievances.unshift(newRecord);

  // If Postgres is online, persist as well
  if (isPostgresAvailable && pool) {
    try {
      const sql = `
        INSERT INTO civic_grievances (
          ticket_number, issue_type, severity, ward_number, citizen_note,
          latitude, longitude, visual_evidence_summary, boundary_details,
          survey_number, statutory_act, enforcement_authority, sla_hours,
          petition_english, petition_telugu, reasoning_trace, model_used, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING *;
      `;
      const values = [
        newRecord.ticket_number,
        newRecord.issue_type,
        newRecord.severity,
        newRecord.ward_number,
        newRecord.citizen_note,
        newRecord.latitude,
        newRecord.longitude,
        newRecord.visual_evidence_summary,
        newRecord.boundary_details,
        newRecord.survey_number,
        newRecord.statutory_act,
        newRecord.enforcement_authority,
        newRecord.sla_hours,
        newRecord.petition_english,
        newRecord.petition_telugu,
        JSON.stringify(newRecord.reasoning_trace),
        newRecord.model_used,
        newRecord.status
      ];
      const result = await pool.query(sql, values);
      if (result.rows.length > 0) {
        return result.rows[0];
      }
    } catch (pgError) {
      console.warn('⚠️ Could not insert to PostgreSQL, saved in memory:', pgError.message);
    }
  }

  return newRecord;
}

/**
 * Retrieve all registered civic grievances
 */
export async function getAllGrievances() {
  if (isPostgresAvailable && pool) {
    try {
      const result = await pool.query('SELECT * FROM civic_grievances ORDER BY created_at DESC LIMIT 100;');
      if (result.rows && result.rows.length > 0) {
        return result.rows;
      }
    } catch (err) {
      console.warn('⚠️ Fetching from Postgres failed, using in-memory list:', err.message);
    }
  }
  return inMemoryGrievances;
}

/**
 * Health check on database status
 */
export function getDbStatus() {
  return {
    isPostgresConnected: isPostgresAvailable,
    storageType: isPostgresAvailable ? 'PostgreSQL+PostGIS' : 'Resilient In-Memory',
    totalRecords: inMemoryGrievances.length
  };
}
