import React, { useState, useEffect } from 'react';
import Navbar from './02_components/01_Navbar.jsx';
import DualImageUploader from './02_components/02_DualImageUploader.jsx';
import ReasoningTraceCard from './02_components/03_ReasoningTraceCard.jsx';
import BilingualPetitionView from './02_components/04_BilingualPetitionView.jsx';
import CivicHeatmap from './02_components/05_CivicHeatmap.jsx';
import {
  checkBackendHealth,
  fetchGrievances,
  submitGrievanceAnalysis
} from './01_api/civicApi.js';
import { AlertCircle, CheckCircle, ShieldAlert, Heart, Github } from 'lucide-react';

export default function App() {
  // Input State
  const [siteImage, setSiteImage] = useState(null);
  const [noticeImage, setNoticeImage] = useState(null);
  const [citizenNote, setCitizenNote] = useState('');
  const [latitude, setLatitude] = useState(17.5150);
  const [longitude, setLongitude] = useState(78.8910);
  const [ward, setWard] = useState('Ward 14 (Bhongiri)');

  // Model & System Configuration
  const [selectedModel, setSelectedModel] = useState('gemma4:e4b');
  const [cloudBurstEnabled, setCloudBurstEnabled] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState(null);
  const [isRefreshingHealth, setIsRefreshingHealth] = useState(false);

  // Analysis & Grievances State
  const [analysisData, setAnalysisData] = useState(null);
  const [grievances, setGrievances] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successNotice, setSuccessNotice] = useState(null);

  // Load initial health status and grievance records
  const loadSystemStatus = async () => {
    setIsRefreshingHealth(true);
    try {
      const health = await checkBackendHealth();
      setOllamaStatus(health.ollama);
      const records = await fetchGrievances();
      setGrievances(records);
    } catch (err) {
      console.warn('Initial load warning:', err.message);
    } finally {
      setIsRefreshingHealth(false);
    }
  };

  useEffect(() => {
    loadSystemStatus();
  }, []);

  // Submit Multimodal Grievance for Gemma 4 Reasoning
  const handleAnalyze = async () => {
    setErrorMessage(null);
    setSuccessNotice(null);
    setIsLoading(true);

    try {
      const response = await submitGrievanceAnalysis({
        sitePhotoBase64: siteImage,
        noticePhotoBase64: noticeImage,
        citizenNote,
        latitude,
        longitude,
        ward,
        selectedModel
      });

      if (response && response.analysis) {
        setAnalysisData(response.analysis);
        setSuccessNotice(
          `Analysis Complete! Rendered Output 1 (Violation Summary), Output 2 (English Petition), Output 3 (Telugu Petition), and Output 4 (Geo Pin on Map).`
        );

        // Refresh grievances list to show the new pin on the Leaflet map
        const updatedRecords = await fetchGrievances();
        setGrievances(updatedRecords);
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      setErrorMessage(err.message || 'Analysis failed. Please ensure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  // Instant Demo Execution
  const handleRunDemo = async (demoParams) => {
    setErrorMessage(null);
    setSuccessNotice(null);
    setIsLoading(true);

    try {
      const response = await submitGrievanceAnalysis({
        sitePhotoBase64: demoParams.siteImage,
        noticePhotoBase64: demoParams.noticeImage,
        citizenNote: demoParams.citizenNote,
        latitude: demoParams.latitude,
        longitude: demoParams.longitude,
        ward: demoParams.ward,
        selectedModel
      });

      if (response && response.analysis) {
        setAnalysisData(response.analysis);
        setSuccessNotice(
          `Demo Case Successfully Processed! All 4 Outputs (Summary, English Petition, Telugu Petition, and Map Pin) are now live.`
        );
        const updatedRecords = await fetchGrievances();
        setGrievances(updatedRecords);
      }
    } catch (err) {
      console.error('Demo run failed:', err);
      setErrorMessage(err.message || 'Demo execution failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col">
      
      {/* Top Sticky Header */}
      <Navbar
        ollamaStatus={ollamaStatus}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        cloudBurstEnabled={cloudBurstEnabled}
        onToggleCloudBurst={() => setCloudBurstEnabled(!cloudBurstEnabled)}
        onRefreshHealth={loadSystemStatus}
        isRefreshing={isRefreshingHealth}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Banner Alert if any error occurs */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-sm flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-2.5">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-white font-bold ml-4 text-xs"
            >
              DISMISS
            </button>
          </div>
        )}

        {/* Success Notice */}
        {successNotice && (
          <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-sm flex items-center justify-between shadow-lg animate-fade-in">
            <div className="flex items-center space-x-2.5">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>{successNotice}</span>
            </div>
            <button
              onClick={() => setSuccessNotice(null)}
              className="text-emerald-400 hover:text-white font-bold ml-4 text-xs"
            >
              DISMISS
            </button>
          </div>
        )}

        {/* Primary 2-Column Command Center Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Multimodal Dual Uploader (5 cols) */}
          <div className="lg:col-span-5 w-full">
            <DualImageUploader
              siteImage={siteImage}
              setSiteImage={setSiteImage}
              noticeImage={noticeImage}
              setNoticeImage={setNoticeImage}
              citizenNote={citizenNote}
              setCitizenNote={setCitizenNote}
              latitude={latitude}
              setLatitude={setLatitude}
              longitude={longitude}
              setLongitude={setLongitude}
              ward={ward}
              setWard={setWard}
              onAnalyze={handleAnalyze}
              onRunDemo={handleRunDemo}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column: OUTPUT 1 (Violation Summary) & OUTPUT 2 & 3 (Bilingual Petitions) (7 cols) */}
          <div className="lg:col-span-7 w-full flex flex-col space-y-8">
            {/* OUTPUT 1: The Violation Summary & Reasoning Box */}
            <ReasoningTraceCard
              analysisData={analysisData}
              isLoading={isLoading}
            />

            {/* OUTPUT 2 & 3: Ready-to-Sign Bilingual Petitions */}
            <BilingualPetitionView
              analysisData={analysisData}
            />
          </div>

        </div>

        {/* Bottom Section: OUTPUT 4 (Live Red Pin on City Map) */}
        <section className="w-full pt-4">
          <CivicHeatmap
            grievances={grievances}
            activeGeoPin={analysisData?.output_4_geo_pin}
          />
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0B0F19]/80 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold text-slate-300">CivicEye-Agent</span>
            <span>• Hacktoberfest 2026 Submission</span>
          </div>

          <div className="flex items-center space-x-6">
            <span>DigitalOcean App Platform Ready</span>
            <span>•</span>
            <span>Powered by Gemma 4 Multimodal</span>
            <span>•</span>
            <span className="text-emerald-400">Apache-2.0 Open Source</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
