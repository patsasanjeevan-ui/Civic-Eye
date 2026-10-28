import React, { useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  MapPin,
  Compass,
  FileText,
  Sparkles,
  X,
  Layers,
  PlayCircle
} from 'lucide-react';

// Self-contained high-detail SVG base64 evidence images for the instant demo case
const SAMPLE_FIELD_PHOTO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%231e293b"/><rect y="240" width="600" height="160" fill="%23334155"/><line x1="0" y1="240" x2="600" y2="240" stroke="%23475569" stroke-width="4"/><rect x="60" y="140" width="160" height="100" fill="%23eab308" rx="8"/><rect x="180" y="100" width="14" height="90" fill="%23ca8a04" transform="rotate(25 180 100)"/><text x="75" y="195" fill="%230f172a" font-family="sans-serif" font-weight="900" font-size="14">YELLOW EXCAVATOR</text><rect x="280" y="80" width="260" height="160" fill="%23475569" stroke="%23ef4444" stroke-width="3"/><text x="300" y="130" fill="%23fee2e2" font-family="sans-serif" font-weight="bold" font-size="15">UNAPPROVED RCC PILLARS</text><text x="300" y="160" fill="%23fca5a5" font-family="sans-serif" font-size="12">12-Meter Encroachment into Road Buffer</text><rect x="20" y="20" width="230" height="36" rx="6" fill="%230f172a" fill-opacity="0.9"/><text x="32" y="43" fill="%2338bdf8" font-family="monospace" font-size="12">GPS: 17.5150 N, 78.8910 E</text><rect x="420" y="20" width="160" height="36" rx="6" fill="%23b91c1c"/><text x="435" y="43" fill="%23ffffff" font-family="sans-serif" font-weight="bold" font-size="12">FIELD EVIDENCE #1</text></svg>`;

const SAMPLE_NOTICE_MAP = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23062316"/><path d="M 50,50 L 550,50 L 550,350 L 50,350 Z" fill="none" stroke="%23059669" stroke-width="3"/><path d="M 80,90 L 290,90 L 290,310 L 80,310 Z" fill="%23064e3b" stroke="%2334d399" stroke-width="2"/><text x="100" y="180" fill="%23a7f3d0" font-family="sans-serif" font-weight="bold" font-size="18">SURVEY NO. 412/A</text><text x="100" y="205" fill="%236ee7b7" font-family="sans-serif" font-size="13">GOVT SARKARI PORAMBOKE</text><text x="100" y="225" fill="%2334d399" font-family="sans-serif" font-size="11">Road Margin & Public Drainage Buffer</text><line x1="290" y1="70" x2="290" y2="330" stroke="%23ef4444" stroke-width="4" stroke-dasharray="8,6"/><text x="210" y="340" fill="%23f87171" font-family="sans-serif" font-weight="bold" font-size="12">12M PUBLIC EASEMENT BOUNDARY</text><rect x="420" y="20" width="160" height="36" rx="6" fill="%23047857"/><text x="435" y="43" fill="%23ffffff" font-family="sans-serif" font-weight="bold" font-size="12">SURVEY MAP #2</text></svg>`;

export default function DualImageUploader({
  siteImage,
  setSiteImage,
  noticeImage,
  setNoticeImage,
  citizenNote,
  setCitizenNote,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  ward,
  setWard,
  onAnalyze,
  onRunDemo,
  isLoading
}) {
  const siteInputRef = useRef(null);
  const noticeInputRef = useRef(null);

  // File to base64 converter
  const handleFileChange = (e, setImage) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Browser Geolocation auto-detect
  const handleDetectLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(Number(position.coords.latitude.toFixed(6)));
          setLongitude(Number(position.coords.longitude.toFixed(6)));
        },
        (error) => {
          alert(`Location detection unavailable (${error.message}). Using default Bhongiri coordinates.`);
        }
      );
    } else {
      alert('Geolocation not supported by this browser.');
    }
  };

  // Run the instant demo with pre-populated values
  const handleTriggerInstantDemo = () => {
    setSiteImage(SAMPLE_FIELD_PHOTO);
    setNoticeImage(SAMPLE_NOTICE_MAP);
    setLatitude(17.5150);
    setLongitude(78.8910);
    setWard('Ward 14 (Bhongiri)');
    const demoNote = 'Urgent: Active heavy yellow excavator and unapproved RCC pillars erecting foundation encroaching 12 meters into the government poramboke road margin and drainage buffer on Survey No. 412/A.';
    setCitizenNote(demoNote);

    if (onRunDemo) {
      onRunDemo({
        siteImage: SAMPLE_FIELD_PHOTO,
        noticeImage: SAMPLE_NOTICE_MAP,
        citizenNote: demoNote,
        latitude: 17.5150,
        longitude: 78.8910,
        ward: 'Ward 14 (Bhongiri)'
      });
    }
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col space-y-6">
      
      {/* Box Header & Instant Demo Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            Multimodal Municipal Grievance Ingestion
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ingest interleaved visual evidence (Field Photo + Survey Map) for Gemma 4 statutory grounding
          </p>
        </div>

        {/* Highlighted Instant Demo Action Button */}
        <button
          type="button"
          onClick={handleTriggerInstantDemo}
          disabled={isLoading}
          className="self-start sm:self-auto flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 border border-amber-500/50 text-xs font-bold transition-all shadow-md shadow-amber-950/20 active:scale-95 cursor-pointer"
        >
          <PlayCircle className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Run Sample Land Encroachment Demo</span>
        </button>
      </div>

      {/* Dual Upload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Upload Box 1: Field Hazard / Physical Obstruction */}
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
            <span>Box 1: Field Evidence Photo</span>
            <span className="text-[10px] text-emerald-400 font-normal">Physical Reality</span>
          </label>
          <div
            onClick={() => siteInputRef.current?.click()}
            className={`relative h-44 rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-3 text-center ${
              siteImage
                ? 'border-emerald-500/50 bg-slate-900/40'
                : 'border-slate-700 hover:border-emerald-500/50 bg-slate-900/60 hover:bg-slate-900'
            }`}
          >
            <input
              type="file"
              ref={siteInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, setSiteImage)}
            />
            {siteImage ? (
              <>
                <img
                  src={siteImage}
                  alt="Field Evidence Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSiteImage(null);
                  }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/70 hover:bg-red-600 text-white transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-emerald-300 font-mono">
                  Field Photo Attached
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center space-y-2 text-slate-400">
                <div className="p-3 rounded-full bg-slate-800 text-slate-300">
                  <Upload className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-xs font-medium text-slate-200">
                  Click or drag field hazard photo
                </div>
                <div className="text-[10px] text-slate-400">
                  Excavator, RCC slab, tin fence, open trench, chemical dump
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upload Box 2: Survey Map / Town Planning Document */}
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
            <span>Box 2: Notice / Survey Map</span>
            <span className="text-[10px] text-emerald-400 font-normal">Legal Record</span>
          </label>
          <div
            onClick={() => noticeInputRef.current?.click()}
            className={`relative h-44 rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-3 text-center ${
              noticeImage
                ? 'border-emerald-500/50 bg-slate-900/40'
                : 'border-slate-700 hover:border-emerald-500/50 bg-slate-900/60 hover:bg-slate-900'
            }`}
          >
            <input
              type="file"
              ref={noticeInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, setNoticeImage)}
            />
            {noticeImage ? (
              <>
                <img
                  src={noticeImage}
                  alt="Survey Notice Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNoticeImage(null);
                  }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/70 hover:bg-red-600 text-white transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-emerald-300 font-mono">
                  Cadastral Map Attached
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center space-y-2 text-slate-400">
                <div className="p-3 rounded-full bg-slate-800 text-slate-300">
                  <FileText className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-xs font-medium text-slate-200">
                  Click or drag official document
                </div>
                <div className="text-[10px] text-slate-400">
                  Revenue map, Town Planning notice, survey sketch, stop-work order
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Citizen Context & Description */}
      <div className="flex flex-col space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          Citizen Description & Grievance Context
        </label>
        <textarea
          rows={3}
          value={citizenNote}
          onChange={(e) => setCitizenNote(e.target.value)}
          placeholder="Describe the municipal grievance (e.g., Unlawful fence and excavation on Survey No. 412/A encroaching into the public drainage buffer)..."
          className="w-full rounded-xl bg-slate-900 border border-slate-700/80 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
        />
      </div>

      {/* Ward & Geospatial Coordinate Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Ward / Area */}
        <div className="flex flex-col space-y-1">
          <label className="text-[11px] font-semibold text-slate-400">Ward / Circle</label>
          <input
            type="text"
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            placeholder="e.g. Ward 14 (Bhongiri)"
            className="w-full rounded-lg bg-slate-900 border border-slate-700/80 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Latitude */}
        <div className="flex flex-col space-y-1">
          <label className="text-[11px] font-semibold text-slate-400">Latitude (GPS)</label>
          <input
            type="number"
            step="0.0001"
            value={latitude}
            onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg bg-slate-900 border border-slate-700/80 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Longitude + Detect Button */}
        <div className="flex flex-col space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-slate-400">Longitude (GPS)</label>
            <button
              type="button"
              onClick={handleDetectLocation}
              className="text-[10px] text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-0.5"
            >
              <Compass className="w-3 h-3" /> Detect
            </button>
          </div>
          <input
            type="number"
            step="0.0001"
            value={longitude}
            onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg bg-slate-900 border border-slate-700/80 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
          />
        </div>

      </div>

      {/* Action Execution Button */}
      <div>
        <button
          type="button"
          onClick={onAnalyze}
          disabled={isLoading}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide text-white shadow-lg transition-all flex items-center justify-center space-x-2 ${
            isLoading
              ? 'bg-slate-700 cursor-not-allowed opacity-80'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-950/50 hover:shadow-emerald-900/50 cursor-pointer active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Gemma 4 Multimodal Reasoning in Progress...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Analyze with Gemma 4 (Ollama)</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
