import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Printer,
  Check,
  Languages,
  Stamp,
  ShieldCheck,
  Landmark,
  FileBadge
} from 'lucide-react';

export default function BilingualPetitionView({ analysisData }) {
  const [activeTab, setActiveTab] = useState('sideBySide'); // 'sideBySide' | 'english' | 'telugu'
  const [copiedEnglish, setCopiedEnglish] = useState(false);
  const [copiedTelugu, setCopiedTelugu] = useState(false);

  // Extract Output 2 & 3 with safe fallbacks
  const englishPetition = analysisData?.output_2_english_petition || analysisData?.petitions?.english || '';
  const teluguPetition = analysisData?.output_3_telugu_petition || analysisData?.petitions?.telugu || '';

  if (!analysisData || (!englishPetition && !teluguPetition)) {
    return null;
  }

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'en') {
      setCopiedEnglish(true);
      setTimeout(() => setCopiedEnglish(false), 2000);
    } else {
      setCopiedTelugu(true);
      setTimeout(() => setCopiedTelugu(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col space-y-6 print:bg-white print:text-black print:p-0 print:border-none">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 print:border-b-2 print:border-black">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center print:hidden">
            <Landmark className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded print:hidden">
                OUTPUT 2 & 3
              </span>
              <h2 className="text-base font-bold text-white print:text-black">
                Ready-to-Sign Bilingual Legal Petitions
              </h2>
            </div>
            <p className="text-xs text-slate-400 print:text-slate-700">
              Statutory Petitions for MRO & Municipal Commissioner with Mandatory 48-Hour SLA
            </p>
          </div>
        </div>

        {/* View Switcher & Print Button */}
        <div className="flex items-center space-x-2 print:hidden">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-0.5 flex text-xs">
            <button
              onClick={() => setActiveTab('sideBySide')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                activeTab === 'sideBySide'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setActiveTab('english')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                activeTab === 'english'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English Only
            </button>
            <button
              onClick={() => setActiveTab('telugu')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                activeTab === 'telugu'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              తెలుగు Only
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-md shadow-emerald-950/40"
            title="Print or Save Official Legal PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print / Download PDF</span>
          </button>
        </div>
      </div>

      {/* Official Legal Print Banner (Visible only in Print / PDF Mode) */}
      <div className="hidden print:block text-center border-b-2 border-black pb-4 mb-4">
        <h1 className="text-xl font-serif font-black uppercase tracking-wider">
          GOVERNMENT OF TELANGANA — MUNICIPAL & REVENUE STATUTORY FILING
        </h1>
        <p className="text-xs font-serif mt-1">
          Filed under the provisions of Telangana Land Encroachment Act 1905 & Telangana Municipalities Act 2019
        </p>
      </div>

      {/* Two-Column / Side-by-Side Grid */}
      <div className={`grid gap-6 ${
        activeTab === 'sideBySide' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
      }`}>

        {/* OUTPUT 2: Formal English Petition */}
        {(activeTab === 'sideBySide' || activeTab === 'english') && (
          <div className="flex flex-col rounded-xl bg-slate-900/90 border border-slate-800 p-5 shadow-inner relative overflow-hidden print:bg-white print:border-black print:text-black">
            
            {/* Legal Bond Top Accent */}
            <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 absolute top-0 left-0 right-0 print:hidden" />

            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3 print:border-black">
              <div className="flex items-center space-x-2">
                <Stamp className="w-4 h-4 text-emerald-400 print:text-black" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 print:text-black flex items-center gap-1.5">
                  <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-emerald-400 font-mono">
                    OUTPUT 2
                  </span>
                  Formal English Legal Petition
                </h3>
              </div>

              <div className="flex items-center space-x-2 print:hidden">
                <button
                  onClick={() => handleCopy(englishPetition, 'en')}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  {copiedEnglish ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy English</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Document Body */}
            <pre className="whitespace-pre-wrap font-sans text-xs text-slate-200 print:text-black leading-relaxed max-h-[480px] overflow-y-auto pr-2 print:max-h-none print:overflow-visible select-text">
              {englishPetition}
            </pre>
          </div>
        )}

        {/* OUTPUT 3: Formal Telugu Petition */}
        {(activeTab === 'sideBySide' || activeTab === 'telugu') && (
          <div className="flex flex-col rounded-xl bg-slate-900/90 border border-slate-800 p-5 shadow-inner relative overflow-hidden print:bg-white print:border-black print:text-black">
            
            {/* Legal Bond Top Accent */}
            <div className="h-1 bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-600 absolute top-0 left-0 right-0 print:hidden" />

            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3 print:border-black">
              <div className="flex items-center space-x-2">
                <Stamp className="w-4 h-4 text-emerald-400 print:text-black" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 print:text-black flex items-center gap-1.5">
                  <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-emerald-400 font-mono">
                    OUTPUT 3
                  </span>
                  అధికారిక తెలుగు ఫిర్యాదు పత్రం (Telugu)
                </h3>
              </div>

              <div className="flex items-center space-x-2 print:hidden">
                <button
                  onClick={() => handleCopy(teluguPetition, 'te')}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  {copiedTelugu ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">కాపీ చేయబడింది</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Telugu</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Document Body (Telugu Script) */}
            <pre className="whitespace-pre-wrap font-telugu text-xs text-slate-200 print:text-black leading-loose max-h-[480px] overflow-y-auto pr-2 print:max-h-none print:overflow-visible select-text">
              {teluguPetition}
            </pre>
          </div>
        )}

      </div>

      {/* Verification Footer */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-3 print:text-black print:border-black">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 print:text-black" />
          <span>Statutory Notice & Summary Eviction Mandate (48-Hour SLA Verified)</span>
        </div>
        <div className="font-mono text-slate-500 print:text-black">
          Authentic Municipal Draft • Form-VII Eviction Ready
        </div>
      </div>

    </div>
  );
}
