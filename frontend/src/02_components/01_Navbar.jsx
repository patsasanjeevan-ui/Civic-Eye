import React from 'react';
import { ShieldAlert, Cpu, Cloud, CheckCircle2, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

export default function Navbar({
  ollamaStatus,
  selectedModel,
  onModelChange,
  cloudBurstEnabled,
  onToggleCloudBurst,
  onRefreshHealth,
  isRefreshing
}) {
  const isOnline = ollamaStatus?.isOnline;
  const hasGemma4 = ollamaStatus?.hasGemma4;

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand & Mission Tag */}
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-900/30 flex items-center justify-center">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                CivicEye<span className="text-emerald-400">-Agent</span>
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Hacktoberfest 2026
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Dual-Language Multimodal Municipal Action Engine • Powered by <span className="text-emerald-300 font-semibold">Gemma 4</span>
            </p>
          </div>
        </div>

        {/* Right Controls: Ollama Status, Model Selector & Cloud Burst Toggle */}
        <div className="flex items-center space-x-3">
          
          {/* Ollama Connection Pill */}
          <div 
            className={`hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              isOnline
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
            }`}
            title={ollamaStatus?.message || 'Checking Ollama status...'}
          >
            {isOnline ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            )}
            <span>
              {isOnline ? 'Ollama 11434: Online' : 'Ollama: Autonomous Fallback'}
            </span>
            <button
              onClick={onRefreshHealth}
              disabled={isRefreshing}
              className="ml-1 text-slate-400 hover:text-white transition-colors"
              title="Re-check connection"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Gemma 4 Model Selector */}
          <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5">
            <Cpu className="w-4 h-4 text-emerald-400 hidden sm:block" />
            <label htmlFor="model-select" className="text-xs text-slate-400 font-medium hidden sm:block">
              Model:
            </label>
            <select
              id="model-select"
              value={selectedModel}
              onChange={(e) => onModelChange(e.target.value)}
              className="bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="gemma4:e4b" className="bg-slate-900 text-white">gemma4:e4b (Default 4B Multimodal)</option>
              <option value="gemma4:e2b" className="bg-slate-900 text-white">gemma4:e2b (Lightweight Edge 2B)</option>
              <option value="gemma4:26b" className="bg-slate-900 text-white">gemma4:26b (Heavy Legal 26B)</option>
              <option value="civiceye-gemma4" className="bg-slate-900 text-white">civiceye-gemma4 (Custom Modelfile)</option>
            </select>
          </div>

          {/* DigitalOcean Cloud Burst Toggle */}
          <button
            onClick={onToggleCloudBurst}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              cloudBurstEnabled
                ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-900/30'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
            title="DigitalOcean Cloud Burst Mode: Leverages DO Droplet GPU cluster when local hardware is saturated"
          >
            <Cloud className={`w-3.5 h-3.5 ${cloudBurstEnabled ? 'text-white' : 'text-blue-400'}`} />
            <span className="hidden lg:inline">DO Cloud Burst</span>
            <span className={`w-2 h-2 rounded-full ${cloudBurstEnabled ? 'bg-emerald-300 animate-ping' : 'bg-slate-500'}`}></span>
          </button>
        </div>

      </div>
    </header>
  );
}
