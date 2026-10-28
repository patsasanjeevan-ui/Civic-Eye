import React from 'react';
import {
  ShieldAlert,
  Search,
  Scale,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileCheck2,
  Layers,
  Sparkles
} from 'lucide-react';

export default function ReasoningTraceCard({ analysisData, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col space-y-5 animate-pulse">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400 animate-spin" />
            </div>
            <div>
              <div className="h-4 w-48 bg-slate-700 rounded mb-1.5" />
              <div className="h-3 w-32 bg-slate-800 rounded" />
            </div>
          </div>
          <div className="h-6 w-24 bg-slate-800 rounded-full" />
        </div>
        <div className="space-y-3">
          <div className="h-12 bg-slate-900/80 rounded-xl border border-slate-800" />
          <div className="h-12 bg-slate-900/80 rounded-xl border border-slate-800" />
          <div className="h-12 bg-slate-900/80 rounded-xl border border-slate-800" />
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center text-center space-y-3 min-h-[300px]">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500">
          <Layers className="w-8 h-8 text-slate-600" />
        </div>
        <h3 className="text-sm font-bold text-slate-300">Awaiting Municipal Grievance Ingestion</h3>
        <p className="text-xs text-slate-500 max-w-sm">
          Upload dual evidence photos or click "Run Sample Land Encroachment Demo" to generate Output 1: Violation Summary & Reasoning Trace.
        </p>
      </div>
    );
  }

  // Extract Output 1 structure (with safe fallbacks)
  const summary = analysisData.output_1_violation_summary || {};
  const severity = (summary.severity || analysisData.severity || 'CRITICAL').toUpperCase();
  const category = summary.category || analysisData.violationCategory || 'LAND_ENCROACHMENT';
  const findings = summary.findings || [
    analysisData.extractedFacts?.visualEvidenceSummary || 'Visual evidence indicates unapproved physical obstruction on public buffer.',
    analysisData.extractedFacts?.noticeOrBoundaryDetails || 'Survey Record confirms public government poramboke classification.'
  ];
  const citation = summary.statute_citation || {
    acts: analysisData.legalCitation?.act || 'Telangana Land Encroachment Act, 1905 & Telangana Municipalities Act, 2019 (Section 178)',
    authority: analysisData.legalCitation?.authority || 'Mandal Revenue Officer (MRO / Tahsildar) & Municipal Commissioner',
    sla_timeline: '48 Hours Statutory Notice Period'
  };

  // Severity Badge Styling with beacon dot
  const severityBadgeConfig = {
    CRITICAL: {
      pill: 'bg-red-500/20 text-red-400 border border-red-500/40',
      dot: 'bg-red-500'
    },
    HIGH: {
      pill: 'bg-amber-500/20 text-amber-400 border border-amber-500/40',
      dot: 'bg-amber-500'
    },
    MEDIUM: {
      pill: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
      dot: 'bg-emerald-500'
    }
  }[severity] || {
    pill: 'bg-red-500/20 text-red-400 border border-red-500/40',
    dot: 'bg-red-500'
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col space-y-6">
      
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                OUTPUT 1
              </span>
              <h2 className="text-base font-bold text-white">Violation Summary & Reasoning Box</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Ref: {analysisData.ticketNumber || 'CE-2026-HYD-412'}
            </p>
          </div>
        </div>

        {/* Severity Badge & Monospace Category Badge */}
        <div className="flex items-center space-x-2">
          {/* Category Badge */}
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-emerald-300">
            {category}
          </span>

          {/* Severity Badge with Pulsing Beacon Dot */}
          <span className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wide ${severityBadgeConfig.pill}`}>
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${severityBadgeConfig.dot}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${severityBadgeConfig.dot}`} />
            </span>
            <span>{severity}</span>
          </span>
        </div>
      </div>

      {/* What the AI Found: Bulleted List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Search className="w-4 h-4 text-emerald-400" />
          What the AI Found (Multimodal Vision Findings)
        </h3>

        <div className="space-y-2.5">
          {findings.map((finding, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="mt-0.5 p-1 rounded-lg bg-emerald-500/10 text-emerald-400 flex-shrink-0">
                <FileCheck2 className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {finding}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* The Exact Law & Deadline: Statutory Banner */}
      <div className="rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/20 border border-slate-800 p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              The Exact Law & Enforcement Mandate
            </h4>
          </div>
          
          {/* 48-Hour SLA Countdown Badge */}
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-red-950/60 border border-red-800/60 text-red-300 text-[11px] font-bold">
            <Clock className="w-3.5 h-3.5 text-red-400" />
            <span>{citation.sla_timeline || '48 Hours Statutory Notice Period'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Governing Statutes & Sections
            </span>
            <p className="text-xs text-slate-200 font-medium font-sans">
              {citation.acts}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Designated Enforcement Authority
            </span>
            <p className="text-xs text-emerald-300 font-semibold font-sans">
              {citation.authority}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
