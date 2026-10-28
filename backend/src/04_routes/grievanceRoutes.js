import express from 'express';
import { analyzeMunicipalGrievance } from '../03_services/gemmaMultimodalService.js';
import { saveGrievance, getAllGrievances, getDbStatus } from '../01_config/dbConfig.js';
import { checkOllamaHealth } from '../01_config/ollamaConfig.js';
import { MUNICIPAL_LEGAL_DATABASE } from '../02_tools/municipalCodeTools.js';

const router = express.Router();

/**
 * GET /api/health
 * Comprehensive health status for Ollama, Database, and Municipal Engine
 */
router.get('/health', async (req, res) => {
  try {
    const ollamaStatus = await checkOllamaHealth();
    const dbStatus = getDbStatus();

    res.json({
      status: 'ONLINE',
      system: 'CivicEye-Agent Municipal Action Engine',
      version: '1.0.0',
      hackathon: 'Hacktoberfest 2026 (DigitalOcean Best Open-Source AI Project & Best Use of Gemma 4)',
      ollama: ollamaStatus,
      database: dbStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'DEGRADED',
      error: error.message
    });
  }
});

/**
 * GET /api/grievances
 * Fetch all registered municipal complaints for the civic heatmap
 */
router.get('/grievances', async (req, res) => {
  try {
    const records = await getAllGrievances();
    res.json({
      success: true,
      count: records.length,
      grievances: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/tools
 * Expose municipal legal rules and statutory tool catalog
 */
router.get('/tools', (req, res) => {
  res.json({
    success: true,
    supportedViolations: Object.keys(MUNICIPAL_LEGAL_DATABASE),
    definitions: MUNICIPAL_LEGAL_DATABASE
  });
});

/**
 * POST /api/analyze
 * Ingest dual photos, citizen note, and GPS coordinates; trigger Gemma 4 multimodal analysis
 */
router.post('/analyze', async (req, res) => {
  try {
    const {
      sitePhotoBase64,
      noticePhotoBase64,
      citizenNote,
      latitude,
      longitude,
      ward,
      selectedModel
    } = req.body;

    const latNum = parseFloat(latitude) || 17.5150;
    const lngNum = parseFloat(longitude) || 78.8910;
    const wardName = ward || 'Ward 12 (Bhongiri Zone)';
    const modelToUse = selectedModel || 'gemma4:e4b';

    // Execute multimodal Gemma 4 service
    const analysisResult = await analyzeMunicipalGrievance({
      sitePhotoBase64,
      noticePhotoBase64,
      citizenNote,
      latitude: latNum,
      longitude: lngNum,
      ward: wardName,
      selectedModel: modelToUse
    });

    // Persist to PostGIS / In-Memory Database
    const persistedRecord = await saveGrievance({
      ticket_number: analysisResult.ticketNumber,
      issue_type: analysisResult.violationCategory,
      severity: analysisResult.severity,
      ward_number: wardName,
      citizen_note: citizenNote || '',
      latitude: latNum,
      longitude: lngNum,
      visual_evidence_summary: analysisResult.extractedFacts.visualEvidenceSummary,
      boundary_details: analysisResult.extractedFacts.noticeOrBoundaryDetails,
      survey_number: analysisResult.extractedFacts.surveyOrWardNumber,
      statutory_act: analysisResult.legalCitation.act,
      enforcement_authority: analysisResult.legalCitation.authority,
      sla_hours: analysisResult.legalCitation.slaHours,
      petition_english: analysisResult.petitions.english,
      petition_telugu: analysisResult.petitions.telugu,
      reasoning_trace: analysisResult.reasoningTrace,
      model_used: modelToUse
    });

    res.json({
      success: true,
      persistedRecord,
      analysis: analysisResult
    });
  } catch (error) {
    console.error('Error analyzing grievance:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process multimodal municipal analysis'
    });
  }
});

export default router;
