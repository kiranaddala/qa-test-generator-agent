import { Logger } from '../utils/logger';
import { FileService } from '../utils/fileService';
import { OpenAIService } from '../services/openaiService';
import { TestCase, AgentConfig } from '../models/types';

const logger = new Logger('TestGeneratorAgent');

export class TestGeneratorAgent {
  private openaiService: OpenAIService;
  private fileService: FileService;

  constructor(config: AgentConfig) {
    if (!config.openaiApiKey) {
      throw new Error('OPENAI_API_KEY is required in config');
    }

    this.openaiService = new OpenAIService(config.openaiApiKey);
    this.fileService = new FileService();

    logger.info('TestGeneratorAgent initialized with OpenAI');
  }

  /**
   * Generate test cases from requirement text
   */
  async generateTestCases(requirementText: string): Promise<TestCase[]> {
    logger.info('Generating test cases from requirement...');

    try {
      const testCases = await this.openaiService.generateTestCases(requirementText);

      // Add Playwright scripts to test cases
      for (let i = 0; i < Math.min(testCases.length, 3); i++) {
        logger.info(`Generating Playwright script for ${testCases[i].name}...`);
        const script = await this.openaiService.generatePlaywrightScript(testCases[i]);
        testCases[i].playwrightScript = script;
      }

      logger.info(`Generated ${testCases.length} test cases`);
      return testCases;
    } catch (error) {
      logger.error('Failed to generate test cases', error);
      throw error;
    }
  }

  /**
   * Generate Playwright script for a specific test case
   */
  async generatePlaywrightScript(testCase: TestCase): Promise<string> {
    logger.info(`Generating Playwright script for: ${testCase.name}`);

    try {
      const script = await this.openaiService.generatePlaywrightScript(testCase);
      return script;
    } catch (error) {
      logger.error('Failed to generate Playwright script', error);
      throw error;
    }
  }

  /**
   * Refine test cases based on feedback
   */
  async refineTestCases(feedback: string): Promise<TestCase[]> {
    logger.info('Refining test cases based on feedback...');

    try {
      const refinedTestCases = await this.openaiService.refineTestCases(feedback);
      logger.info(`Refined ${refinedTestCases.length} test cases`);
      return refinedTestCases;
    } catch (error) {
      logger.error('Failed to refine test cases', error);
      throw error;
    }
  }

  /**
   * Export test cases to JSON file
   */
  async exportTestCases(testCases: TestCase[], filePath: string): Promise<void> {
    logger.info(`Exporting ${testCases.length} test cases to ${filePath}...`);

    try {
      await this.fileService.exportTestCases(testCases, filePath);
      logger.info(`Test cases exported successfully`);
    } catch (error) {
      logger.error('Failed to export test cases', error);
      throw error;
    }
  }

  /**
   * Export Playwright script to file
   */
  async exportPlaywrightScript(script: string, filePath: string): Promise<void> {
    logger.info(`Exporting Playwright script to ${filePath}...`);

    try {
      await this.fileService.exportPlaywrightScript(script, filePath);
      logger.info(`Playwright script exported successfully`);
    } catch (error) {
      logger.error('Failed to export Playwright script', error);
      throw error;
    }
  }

  /**
   * Get test cases by type
   */
  getTestCasesByType(testCases: TestCase[], type: string): TestCase[] {
    return testCases.filter((tc) => tc.type === type);
  }

  /**
   * Get test cases by priority
   */
  getTestCasesByPriority(testCases: TestCase[], priority: string): TestCase[] {
    return testCases.filter((tc) => tc.priority === priority);
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.openaiService.clearHistory();
  }
}
