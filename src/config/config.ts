/**
 * Configuration management
 */
import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
  },
  jira: {
    url: process.env.JIRA_URL || '',
    email: process.env.JIRA_EMAIL || '',
    apiToken: process.env.JIRA_API_TOKEN || '',
  },
  test: {
    baseUrl: process.env.TEST_BASE_URL || 'https://demo.applitools.com',
    timeout: parseInt(process.env.TEST_TIMEOUT || '30000'),
    headless: process.env.HEADLESS !== 'false',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

// Validate required configuration
export function validateConfig(): void {
  if (!config.anthropic.apiKey) {
    throw new Error('ANTHROPIC_API_KEY is required. Please set it in .env file');
  }
}
