# CivicEye-Agent: Dual-Language Multimodal Municipal Action Engine
**Submitted for Hacktoberfest 2026 — DigitalOcean Best Open-Source AI Project & Best Use of Gemma 4**

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Gemma 4 Powered](https://img.shields.io/badge/Engine-Ollama%20Gemma%204-7952B3.svg)](https://ollama.com)
[![DigitalOcean Ready](https://img.shields.io/badge/Deploy-DigitalOcean%20App%20Platform-0080FF.svg)](.do/app.yaml)
[![Telugu & English](https://img.shields.io/badge/Language-English%20%7C%20%E0%B0%A4%E0%B1%86%E0%B0%B2%E0%B1%81%E0%B0%97%E0%B1%81-emerald.svg)](#)

---

## 🏛️ Executive Summary

In Indian municipalities, millions of civic violations—such as government land encroachment, illegal multi-story construction, and toxic waste dumping—go unaddressed because citizens lack the legal vocabulary and procedural know-how to lodge legally binding formal complaints. Grievances written in vague language are systematically ignored or routed to the wrong administrative offices.

**CivicEye-Agent** is an autonomous municipal action engine powered by Google's **Gemma 4** (`gemma4:e4b` / `gemma4:26b` via local Ollama). It takes **interleaved dual-image multimodal inputs** (Field Hazard Photo + Boundary Survey Map / Notice Document), invokes municipal code lookup tools, verifies statutory jurisdictions, and generates **procedurally compliant, twin-language formal legal petitions** in both English and high-register Telugu (`తెలుగు అధికారిక ఫిర్యాదు పత్రం`), complete with Section references, SLA accountability countdowns, and geo-spatial heatmapping.

---

## 🚀 Key Architectural Highlights

```
 ┌────────────────────────────────────────────────────────┐
 │                   CIVIC CITIZEN / FIELD AGENT           │
 └──────────────────────────┬─────────────────────────────┘
                            │ Dual Upload + GPS + Ward
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │           React 18 + Tailwind Civic Command Center     │
 │  • Box 1: Field Evidence Photo (Encroachment/Hazard)    │
 │  • Box 2: Survey Map / Town Planning Notice Document   │
 │  • Live Model Switcher (Gemma 4: e4b / e2b / 26b)      │
 └──────────────────────────┬─────────────────────────────┘
                            │ REST /api/analyze
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │         Node.js (ESM) Express Backend Controller       │
 └─────────────┬────────────────────────────┬─────────────┘
               │                            │
               ▼                            ▼
 ┌──────────────────────────┐  ┌──────────────────────────┐
 │    Local Ollama Engine   │  │   PostgreSQL + PostGIS   │
 │  • Gemma 4 Multimodal    │  │  • Spatial Grievance Log │
 │  • Thinking Mode Trace   │  │  • In-Memory Fallback    │
 │  • Tool: lookup_violation│  │  • SLA Tracking Table    │
 └─────────────┬────────────┘  └──────────────────────────┘
               │
               ▼
 ┌────────────────────────────────────────────────────────┐
 │             Bilingual Formal Legal Petitions           │
 │  • English: Mandal Revenue Officer (MRO) / Commissioner│
 │  • Telugu: తహశీల్దార్ / మున్సిపల్ కమిషనర్ గారికి వినతి పత్రం   │
 │  • Statutory References: Telangana Land Encroachment   │
 │    Act 1905 & Municipalities Act 2019 (Sec 178 / 180)  │
 └────────────────────────────────────────────────────────┘
```

1. **Interleaved Multimodal Dual-Image Reasoning**:
   Simultaneously analyzes physical reality (Image 1: field hazard, construction markers, encroachment flags) against legal record documents (Image 2: survey maps, municipal demarcations, stop-work notices) using Gemma 4's vision-language tokens.
2. **Deterministic Function Calling (`lookup_municipal_violation_code`)**:
   Eliminates legal hallucination by grounding Gemma 4's reasoning through native tool execution against statutory municipal codes (Telangana Land Encroachment Act 1905, Telangana Municipalities Act 2019 Sections 178 & 180).
3. **High-Register Telugu Legal Synthesis (`తెలుగు చట్టబద్ధ పత్రం`)**:
   Produces authoritative petitions addressed to designated officers (Mandal Revenue Officer - MRO, Town Planning Officer, Municipal Commissioner) in formal administrative Telugu, bridging the linguistic divide for local tehsils.
4. **Live PostGIS Geospatial Heatmap**:
   Pinpoints violations on an interactive Leaflet map color-coded by severity (`CRITICAL`, `HIGH`, `MEDIUM`) with OpenStreetMap tiles, ward statistics, and instantaneous PDF export capability.
5. **Zero-Friction Zero-Config Startup**:
   Runs out of the box with zero external dependencies via built-in in-memory fallback storage, automatic Ollama auto-detection, and pre-bundled land encroachment test cases.

---

## 🛠️ Tech Stack & Open-Source Components

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Multimodal LLM** | **Gemma 4 (`gemma4:e4b`)** via **Ollama** | Local vision reasoning, thinking trace, tool loop, legal translation |
| **Model Variants** | `gemma4:e4b`, `gemma4:e2b`, `gemma4:26b` | Configurable lightweight edge to high-parameter reasoning |
| **Backend** | Node.js (ES Modules), Express.js | REST API, Ollama SDK connector, tool execution engine |
| **Spatial Database** | PostgreSQL 16 + PostGIS | Geo-tagged grievance records, SLA indices (with in-memory fallback) |
| **Frontend** | React 18, Vite, Tailwind CSS | High-polish dark/emerald Civic Command Center UI |
| **Mapping Engine** | Leaflet + React-Leaflet | OpenStreetMap geospatial grievance clustering and heat pin display |
| **Cloud Target** | DigitalOcean App Platform (`.do/app.yaml`) | Production containerization & Managed Database deployment |

---

## 📋 Directory Structure

```
civiceye-agent/
├── LICENSE                                  # Apache 2.0 Open-Source License
├── README.md                                # Setup, architecture & hackathon pitch docs
├── skills.md                                # Open-Standard Agent Skill definition for CivicEye
├── Modelfile                                # Custom Ollama Modelfile for civiceye-gemma4
├── .do/
│   └── app.yaml                             # DigitalOcean App Platform + Managed PostgreSQL spec
├── database/
│   └── 01_init_postgis_schema.sql           # PostgreSQL + PostGIS schema & municipal violation rules seed
├── backend/
│   ├── package.json                         # Express, ollama, pg, cors, dotenv
│   ├── .env.example                         # Environment configuration template
│   └── src/
│       ├── 01_config/
│       │   ├── dbConfig.js                  # PostgreSQL pool + automatic local JSON/memory fallback
│       │   └── ollamaConfig.js              # Ollama client connection & health-check helper
│       ├── 02_tools/
│       │   └── municipalCodeTools.js        # Gemma 4 Function Calling tool definitions & legal lookup
│       ├── 03_services/
│       │   └── gemmaMultimodalService.js    # Dual-image interleaved analysis + Thinking Mode + Tool loop
│       ├── 04_routes/
│       │   └── grievanceRoutes.js           # POST /api/analyze, GET /api/grievances, GET /api/health
│       └── 05_server.js                     # Express entry point on port 5000
└── frontend/
    ├── package.json                         # React 18, Vite, Tailwind, Leaflet, Lucide icons
    ├── vite.config.js                       # Vite bundler configuration with backend proxy
    ├── tailwind.config.js                   # Tailwind CSS configuration
    ├── postcss.config.js                    # PostCSS autoprefixer
    ├── index.html                           # Single page application entry HTML
    └── src/
        ├── 01_api/
        │   └── civicApi.js                  # Axios/Fetch wrapper for backend endpoints
        ├── 02_components/
        │   ├── 01_Navbar.jsx                # Header with Ollama status badge & Gemma 4 model selector
        │   ├── 02_DualImageUploader.jsx     # Upload Box 1: Field Hazard | Box 2: Notice/Boundary Map
        │   ├── 03_ReasoningTraceCard.jsx    # Displays Gemma 4 Thinking trace & invoked Municipal Tool calls
        │   ├── 04_BilingualPetitionView.jsx # Side-by-side formal English & Telugu legal petition + Print/Copy
        │   └── 05_CivicHeatmap.jsx          # Interactive Leaflet map showing geo-tagged grievances
        ├── App.jsx                          # Main dashboard layout & state orchestration
        ├── main.jsx                         # React DOM mount point
        └── index.css                        # Leaflet & Tailwind styles
```

---

## ⚡ Quick Start (Local Setup in 3 Minutes)

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **Ollama**: Installed from [ollama.com](https://ollama.com)
- Optional: PostgreSQL with PostGIS extension (an automatic in-memory fallback runs seamlessly if PostgreSQL is not installed!)

### Step 1: Clone and Configure Environment

```bash
git clone https://github.com/your-username/civiceye-agent.git
cd civiceye-agent
```

### Step 2: Launch Ollama and Pull Gemma 4

```bash
# Start the Ollama local daemon (if not already running)
ollama serve

# Pull the Gemma 4 multimodal model
ollama pull gemma4:e4b

# (Optional: Build the custom CivicEye tuned model)
ollama create civiceye-gemma4 -f Modelfile
```

### Step 3: Install and Start Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
*Backend runs on `http://localhost:5000` with live health-check at `http://localhost:5000/api/health`.*

### Step 4: Install and Start Frontend

In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`. Open in your browser.*

---

## 🎯 Testing with Pre-loaded Sample Land Encroachment Case

1. Open `http://localhost:5173`.
2. Notice the live Ollama status indicator in the top navbar.
3. Click the amber **"Load Sample Land Encroachment Case"** button.
   - Automatically loads **Image 1**: Field Evidence (illegal boundary fence on public buffer).
   - Automatically loads **Image 2**: Survey Map (Revenue Survey No. 402, Public Grazing Poramboke).
   - Fills GPS Coordinates: `17.5150, 78.8910` (Bhongiri / Hyderabad Peri-Urban Ward 12).
4. Click **"Analyze with Gemma 4 (Ollama)"**.
5. Watch the **Live Thinking Mode** step tracker:
   - Step 1: Multimodal image parsing extracts survey markings and physical obstruction.
   - Step 2: Autonomous Tool Call invokes `lookup_municipal_violation_code('LAND_ENCROACHMENT', 'ZONE_HYD_URBAN')`.
   - Step 3: Statutory grounds verified under *Telangana Land Encroachment Act, 1905* & *Telangana Municipalities Act, 2019 (Sec 178)*.
   - Step 4: Side-by-side formal petitions generated in English and high-register Telugu.
6. Click **"Copy to Clipboard"** or **"Download / Print Official PDF Filing"** for instant administrative submission.
7. Inspect the **Civic Heatmap** below to view the new grievance pinned with a severity flag.

---

## 🌐 DigitalOcean Deployment (`.do/app.yaml`)

CivicEye-Agent is fully optimized for **DigitalOcean App Platform**:
- Automated build packs for Node.js API and Vite static frontend.
- Attached DigitalOcean Managed PostgreSQL database with automatic PostGIS schema initialization via `database/01_init_postgis_schema.sql`.
- Configurable environment variable for remote Ollama GPU droplet or Gemini API endpoint fallback.

To deploy via the `doctl` CLI:
```bash
doctl apps create --spec .do/app.yaml
```

---

## 📄 License

CivicEye-Agent is licensed under the **Apache License 2.0**. See [LICENSE](LICENSE) for details.
Proudly built for **Hacktoberfest 2026** by the CivicEye Open-Source Team.
#   C i v i c - E y e  
 