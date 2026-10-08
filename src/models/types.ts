export interface Requirement {
  title: string;
  description: string;
  acceptanceCriteria: string[];
  priority?: 'High' | 'Medium' | 'Low';
  issueKey?: string;
  estimatedEffort?: number;
}

export interface TestStep {
  step: number;
  action: string;
  expectedResult: string;
}

export interface TestCase {
  testCaseId: string;
  name: string;
  description?: string;
  type: 'Positive' | 'Negative' | 'Boundary' | 'Performance' | 'Security' | 'UI';
  preconditions: string[];
  steps: TestStep[];
  expectedResult: string;
  postConditions?: string[];
  automationType: 'UI' | 'API' | 'Unit' | 'Integration';
  priority: 'High' | 'Medium' | 'Low';
  estimatedTime?: number;
  tags?: string[];
  relatedRequirement?: string;
  playwrightScript?: string;
}

export interface AgentConfig {
  anthropicApiKey?: string;
  geminiApiKey?: string;
  openaiApiKey?: string;
  jiraUrl?: string;
  jiraEmail?: string;
  jiraApiToken?: string;
  baseUrl?: string;
  timeout?: number;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface TestGenerationRequest {
  requirement?: Requirement;
  requirementText?: string;
  jiraIssueKey?: string;
  includeTypes?: string[];
  numberOfTestsPerType?: number;
}

export interface JiraIssue {
  key: string;
  summary: string;
  description: string;
  acceptanceCriteria?: string;
  priority: string;
  status: string;
}
