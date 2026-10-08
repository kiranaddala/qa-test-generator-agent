import * as dotenv from 'dotenv';
import { TestGeneratorAgent } from './agents/testGeneratorAgent';
import { JiraService } from './services/jiraService';
import { ApplicationExplorerService } from './services/applicationExplorerService';
import { Logger } from './utils/logger';

dotenv.config();

const logger = new Logger('Main');

async function main() {
  try {
    logger.info('QA Test Generator Agent started');

    const agent = new TestGeneratorAgent({
      openaiApiKey: process.env.OPENAI_API_KEY!,
    });

    let requirement = '';

    // Check if JIRA integration is requested
    const args = process.argv.slice(2);
    const useJira = args[0] === '--jira';
    const useExplorer = args[0] === '--explore';
    const issueKeyOrQuery = args[useJira || useExplorer ? 1 : 0];

    if (useExplorer && issueKeyOrQuery) {
      // Explore application and then generate tests
      logger.info(`Starting application exploration for: ${issueKeyOrQuery}`);
      
      const explorer = new ApplicationExplorerService(issueKeyOrQuery);
      const appStructure = await explorer.exploreApplication();
      
      // Export exploration findings
      await explorer.exportFindings('./output/application_exploration.json');
      
      // Display exploration summary
      const summary = explorer.generateSummary();
      console.log(summary);
      
      // Create requirement based on discovered flows and scenarios
      requirement = `
Based on application exploration of ${issueKeyOrQuery}:

DISCOVERED FLOWS:
${appStructure.flows.map((f) => `- ${f.name}: ${f.description}`).join('\n')}

IDENTIFIED SCENARIOS:
${appStructure.scenarios.map((s) => `- ${s.id}: ${s.name} - ${s.description}`).join('\n')}

KEY FEATURES:
${appStructure.features.map((f) => `- ${f}`).join('\n')}

USER ROLES:
${appStructure.userRoles.map((r) => `- ${r}`).join('\n')}

Generate comprehensive test cases covering all discovered flows, scenarios, features, and user roles.
Include positive, negative, boundary, and edge case tests.
`;

      logger.info('Application exploration complete. Generating tests based on discovered flows...');

    } else if (useJira && issueKeyOrQuery) {
      // Fetch requirement from JIRA
      try {
        logger.info('Connecting to JIRA...');
        
        const jiraService = new JiraService({
          jiraUrl: process.env.JIRA_URL || '',
          jiraEmail: process.env.JIRA_EMAIL || '',
          jiraApiToken: process.env.JIRA_API_TOKEN || '',
        });

        // Test JIRA connection
        const isConnected = await jiraService.testConnection();
        if (!isConnected) {
          throw new Error('Failed to connect to JIRA. Check your credentials.');
        }

        logger.info(`Fetching requirement from JIRA issue: ${issueKeyOrQuery}`);
        requirement = await jiraService.getIssueAsRequirement(issueKeyOrQuery);
        logger.info('Requirement fetched from JIRA');
      } catch (error) {
        logger.error('Failed to fetch from JIRA:', error);
        process.exit(1);
      }
    } else if (issueKeyOrQuery) {
      // Use command line argument as requirement
      requirement = issueKeyOrQuery;
    } else {
      // Use default requirement
      requirement = `
      Feature: Product Search and Filtering
      
      As a customer,
      I want to search and filter products
      So that I can find what I'm looking for easily
      
      Acceptance Criteria:
      1. Search box should filter products by name
      2. Filter by price range should work correctly
      3. Filter by category should display only selected category products
      4. Multiple filters should work together
      5. Search should be case-insensitive
      6. Results should display within 2 seconds
      7. Filter should handle empty results gracefully
    `;
    }

    logger.info('Generating test cases...');
    const testCases = await agent.generateTestCases(requirement);

    logger.info('Test cases generated successfully');
    console.log('\n=== Generated Test Cases ===\n');
    console.log(JSON.stringify(testCases, null, 2));

    // Export test cases
    await agent.exportTestCases(testCases, './output/generated_tests.json');
    logger.info('Test cases exported to output/generated_tests.json');

    // Generate Playwright script for first test case
    if (testCases.length > 0) {
      logger.info('Generating Playwright script...');
      const script = await agent.generatePlaywrightScript(testCases[0]);
      await agent.exportPlaywrightScript(script, './output/generated_test.spec.ts');
      logger.info('Playwright script exported to output/generated_test.spec.ts');
    }
  } catch (error) {
    logger.error('Error:', error);
    process.exit(1);
  }
}

main();
