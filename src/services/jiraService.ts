import axios, { AxiosInstance } from 'axios';
import { Logger } from '../utils/logger';

interface JiraIssue {
  key: string;
  fields: {
    summary: string;
    description: string;
    issuetype: {
      name: string;
    };
    status: {
      name: string;
    };
    assignee: {
      displayName: string;
    } | null;
  };
}

interface JiraServiceConfig {
  jiraUrl: string;
  jiraEmail: string;
  jiraApiToken: string;
}

export class JiraService {
  private client: AxiosInstance;
  private logger: Logger;

  constructor(config: JiraServiceConfig) {
    this.logger = new Logger('JiraService');

    // Create Axios instance with JIRA authentication
    this.client = axios.create({
      baseURL: config.jiraUrl,
      auth: {
        username: config.jiraEmail,
        password: config.jiraApiToken,
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.logger.info('JIRA Service initialized');
  }

  /**
   * Fetch a JIRA issue by issue key (e.g., "PROJ-123")
   */
  async getIssue(issueKey: string): Promise<JiraIssue | null> {
    try {
      this.logger.info(`Fetching JIRA issue: ${issueKey}`);
      
      const response = await this.client.get(`/rest/api/3/issues/${issueKey}`);
      this.logger.info(`Successfully fetched issue: ${issueKey}`);
      
      return response.data as JiraIssue;
    } catch (error) {
      this.logger.error(`Failed to fetch JIRA issue ${issueKey}:`, error);
      throw error;
    }
  }

  /**
   * Search for JIRA issues using JQL (JIRA Query Language)
   */
  async searchIssues(jql: string): Promise<JiraIssue[]> {
    try {
      this.logger.info(`Searching JIRA issues with JQL: ${jql}`);
      
      const response = await this.client.get('/rest/api/3/search', {
        params: {
          jql,
          maxResults: 50,
          fields: ['summary', 'description', 'issuetype', 'status', 'assignee'],
        },
      });

      const issues = response.data.issues as JiraIssue[];
      this.logger.info(`Found ${issues.length} issues`);
      
      return issues;
    } catch (error) {
      this.logger.error('Failed to search JIRA issues:', error);
      throw error;
    }
  }

  /**
   * Get all issues from a specific project
   */
  async getProjectIssues(projectKey: string): Promise<JiraIssue[]> {
    const jql = `project = "${projectKey}" AND type in (Story, Task, Bug)`;
    return this.searchIssues(jql);
  }

  /**
   * Extract requirement text from JIRA issue
   */
  formatIssueAsRequirement(issue: JiraIssue): string {
    const summary = issue.fields.summary;
    const description = issue.fields.description || 'No description provided';
    const issueType = issue.fields.issuetype.name;
    const key = issue.key;

    return `
Issue Key: ${key}
Type: ${issueType}
Summary: ${summary}

Description:
${description}
    `;
  }

  /**
   * Fetch issue and format as requirement
   */
  async getIssueAsRequirement(issueKey: string): Promise<string> {
    const issue = await this.getIssue(issueKey);
    if (!issue) {
      throw new Error(`Issue ${issueKey} not found`);
    }
    return this.formatIssueAsRequirement(issue);
  }

  /**
   * Get multiple issues and combine as requirements
   */
  async getMultipleIssuesAsRequirements(issueKeys: string[]): Promise<string> {
    const requirements: string[] = [];

    for (const key of issueKeys) {
      try {
        const requirement = await this.getIssueAsRequirement(key);
        requirements.push(requirement);
      } catch (error) {
        this.logger.error(`Failed to fetch issue ${key}`);
      }
    }

    return requirements.join('\n---\n');
  }

  /**
   * Test JIRA connection
   */
  async testConnection(): Promise<boolean> {
    try {
      this.logger.info('Testing JIRA connection...');
      await this.client.get('/rest/api/3/myself');
      this.logger.info('JIRA connection successful');
      return true;
    } catch (error) {
      this.logger.error('JIRA connection failed:', error);
      return false;
    }
  }
}
