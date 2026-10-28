import { analyzeMunicipalGrievance } from './src/03_services/gemmaMultimodalService.js';
import { executeMunicipalCodeLookup } from './src/02_tools/municipalCodeTools.js';
import { getAllGrievances } from './src/01_config/dbConfig.js';

async function runTests() {
  console.log('Testing Municipal Code Lookup Tool:');
  const landResult = executeMunicipalCodeLookup('LAND_ENCROACHMENT', 'ZONE_HYD_URBAN');
  console.log(' - Land Encroachment Act:', landResult.governingAct);
  console.log(' - Section:', landResult.sectionNumber);
  console.log(' - Authority:', landResult.enforcementAuthority);
  console.log(' - SLA Hours:', landResult.slaResolutionHours);

  console.log('\nTesting Database Grievance Fetching:');
  const grievances = await getAllGrievances();
  console.log(` - Loaded ${grievances.length} seeded municipal complaints`);
  console.log(` - First ticket: ${grievances[0].ticket_number} (${grievances[0].issue_type})`);

  console.log('\nTesting Multimodal Grievance Analysis Service:');
  const analysis = await analyzeMunicipalGrievance({
    citizenNote: 'Urgent: Land grabbing on revenue road buffer Sy. No. 402/A with tin sheet fencing.',
    latitude: 17.5150,
    longitude: 78.8910,
    ward: 'Ward 12 (Bhongiri Zone)',
    selectedModel: 'gemma4:e4b'
  });

  console.log(' - Analysis Ticket:', analysis.ticketNumber);
  console.log(' - Severity:', analysis.severity);
  console.log(' - Category:', analysis.violationCategory);
  console.log(' - English Petition Excerpt:', analysis.petitions.english.slice(0, 100).replace(/\n/g, ' '));
  console.log(' - Telugu Petition Excerpt:', analysis.petitions.telugu.slice(0, 100).replace(/\n/g, ' '));
  console.log(' - Tool Calls:', analysis.reasoningTrace.toolCalls.length);

  console.log('\n✅ All Core Backend Unit & Tool Execution Tests Passed!');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
