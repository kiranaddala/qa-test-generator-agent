import OpenAI from 'openai';
import { Logger } from '../utils/logger';
import { ConversationMessage, TestCase } from '../models/types';

const logger = new Logger('OpenAIService');

export class OpenAIService {
  private client: OpenAI;
  private conversationHistory: ConversationMessage[] = [];

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
    });
  }

  async generateTestCases(requirementText: string): Promise<TestCase[]> {
    const systemPrompt = 'You are an expert QA automation engineer. Generate comprehensive, practical test cases in JSON format only.';

    const userPrompt = `You are an expert QA automation engineer. Analyze the following requirement and generate comprehensive test cases.

REQUIREMENT:
${requirementText}

Generate test cases covering:
1. Positive Test Cases - Happy path scenarios
2. Negative Test Cases - Error handling and edge cases
3. Boundary Test Cases - Limits and boundary conditions
4. Performance Test Cases - Load and response time validation
5. Security Test Cases - Input validation, XSS, CSRF prevention
6. UI Test Cases - Visual regression and cross-browser compatibility

For each test case, provide in JSON format:
{
  "testCaseId": "TC-XXX",
  "name": "Test case name",
  "description": "Detailed description",
  "type": "Positive|Negative|Boundary|Performance|Security|UI",
  "preconditions": ["condition1", "condition2"],
  "steps": [
    {"step": 1, "action": "Action description", "expectedResult": "Expected result"}
  ],
  "expectedResult": "Overall expected result",
  "automationType": "UI|API|Unit|Integration",
  "priority": "High|Medium|Low",
  "tags": ["tag1", "tag2"]
}

Return ONLY valid JSON array of test cases, no additional text.`;

    try {
      this.conversationHistory.push({
        role: 'user',
        content: userPrompt,
      });

      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          ...this.conversationHistory.map((msg) => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
          })),
        ],
        temperature: 0.7,
        max_tokens: 4096,
      });

      const assistantMessage = response.choices[0].message.content || '';

      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage,
      });

      // Parse JSON from response
      const jsonMatch = assistantMessage.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const testCases = JSON.parse(jsonMatch[0]) as TestCase[];
      logger.info(`Generated ${testCases.length} test cases`);
      return testCases;
    } catch (error) {
      logger.error(`Failed to generate test cases ${error}`);
      throw error;
    }
  }

  async generatePlaywrightScript(testCase: TestCase): Promise<string> {
    const prompt = `Convert this test case into a Playwright test script:

Test Case:
${JSON.stringify(testCase, null, 2)}

Requirements:
1. Use TypeScript syntax
2. Follow Playwright best practices
3. Include proper assertions
4. Add error handling
5. Make it executable

Return ONLY the test code, no explanations.`;

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      });

      const responseText = response.choices[0].message.content || '';

      // Extract code from response
      const codeMatch = responseText.match(/\`\`\`(?:typescript|ts)?\n([\s\S]*?)\`\`\`/);
      const code = codeMatch ? codeMatch[1] : responseText;

      logger.info(`Generated Playwright script for ${testCase.testCaseId}`);
      return code;
    } catch (error) {
      logger.error(`Failed to generate Playwright script ${error}`);
      throw error;
    }
  }

  async refineTestCases(feedback: string): Promise<TestCase[]> {
    try {
      this.conversationHistory.push({
        role: 'user',
        content: feedback,
      });

      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          ...this.conversationHistory.map((msg) => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
          })),
        ],
        temperature: 0.7,
        max_tokens: 4096,
      });

      const assistantMessage = response.choices[0].message.content || '';

      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage,
      });

      // Parse JSON from response
      const jsonMatch = assistantMessage.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const testCases = JSON.parse(jsonMatch[0]) as TestCase[];
      logger.info(`Refined ${testCases.length} test cases`);
      return testCases;
    } catch (error) {
      logger.error(`Failed to refine test cases ${error}`);
      throw error;
    }
  }

  getConversationHistory(): ConversationMessage[] {
    return this.conversationHistory;
  }

  clearHistory(): void {
    this.conversationHistory = [];
    logger.info('Conversation history cleared');
  }
}
