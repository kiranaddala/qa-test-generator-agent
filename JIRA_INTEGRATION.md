# JIRA Integration Guide

This guide explains how to fetch requirements from JIRA and automatically generate test cases.

## 🔌 Prerequisites

1. **JIRA Cloud Account** with API access
2. **API Token** from your JIRA account
3. **JIRA URL** (e.g., https://your-company.atlassian.net)
4. **Email address** associated with your JIRA account

## 📋 Setup Steps

### Step 1: Generate JIRA API Token

1. Go to https://id.atlassian.com/manage/api-tokens
2. Click **Create API token**
3. Give it a name (e.g., "QA Test Generator")
4. Click **Create**
5. Copy the token (you'll only see it once!)

### Step 2: Update .env File

Add your JIRA credentials to `.env`:

```bash
OPENAI_API_KEY=sk-proj-your-openai-key

# JIRA Configuration
JIRA_URL=https://your-company.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-api-token-here
```

**Example:**
```bash
JIRA_URL=https://acme.atlassian.net
JIRA_EMAIL=john@acme.com
JIRA_API_TOKEN=ATATT3xFfGF0_abc123...
```

### Step 3: Test JIRA Connection

```bash
# The system will test the connection automatically
npm run generate-tests --jira PROJ-123
```

If connection fails, you'll see an error message like:
```
❌ JIRA connection failed: Invalid credentials
```

## 🎯 Usage

### Generate Tests from JIRA Issue

```bash
# Fetch requirement from JIRA issue and generate tests
npm run generate-tests --jira PROJ-123
```

Replace `PROJ-123` with your actual issue key.

**What happens:**
1. Connects to your JIRA instance
2. Fetches the issue details (summary, description)
3. Formats it as a requirement
4. Sends to OpenAI for test case generation
5. Exports results to `output/`

### Generate Tests for Multiple Issues

For multiple issues, you can run sequentially:

```bash
npm run generate-tests --jira PROJ-123
npm run generate-tests --jira PROJ-124
npm run generate-tests --jira PROJ-125
```

Or create a script to generate tests for multiple issues.

### Without JIRA (Standard Mode)

```bash
# Use text requirement
npm run generate-tests "Your feature description"

# Or use default
npm run generate-tests
```

## 📚 Example Workflows

### Example 1: Test a Story

```bash
npm run generate-tests --jira PROJECT-42
```

**JIRA Issue:**
- Key: PROJECT-42
- Summary: "User can edit their profile information"
- Description: "As a user, I should be able to edit my name, email, and profile picture..."

**Output:**
- Test cases for profile editing functionality
- Playwright scripts for automation
- JSON export for CI/CD

### Example 2: Test a Bug Fix

```bash
npm run generate-tests --jira BUG-156
```

Generates test cases specifically for the bug scenario and edge cases.

### Example 3: Batch Generate Tests

Create a script to generate tests for all open issues:

```bash
#!/bin/bash
# scripts/generate-all-tests.sh

ISSUES=(
  "PROJ-101"
  "PROJ-102"
  "PROJ-103"
  "PROJ-104"
)

for issue in "${ISSUES[@]}"; do
  echo "Generating tests for $issue..."
  npm run generate-tests --jira "$issue"
  echo "✅ Completed $issue"
  echo "---"
done

echo "🎉 All tests generated!"
```

Run it:
```bash
chmod +x scripts/generate-all-tests.sh
./scripts/generate-all-tests.sh
```

## 🔍 JIRA Service Methods

The `JiraService` class provides several useful methods:

### Get Single Issue

```typescript
const requirement = await jiraService.getIssueAsRequirement('PROJ-123');
```

### Get Multiple Issues

```typescript
const requirements = await jiraService.getMultipleIssuesAsRequirements([
  'PROJ-123',
  'PROJ-124',
  'PROJ-125'
]);
```

### Search Issues with JQL

```typescript
const issues = await jiraService.searchIssues(
  'project = "PROJ" AND type = Story AND status = Open'
);
```

### Get All Project Issues

```typescript
const issues = await jiraService.getProjectIssues('PROJ');
```

### Test Connection

```typescript
const isConnected = await jiraService.testConnection();
if (isConnected) {
  console.log('✅ JIRA is accessible');
}
```

## 🐛 Troubleshooting

### Issue: "Invalid API token"

**Cause:** API token is incorrect or expired
**Solution:**
1. Go to https://id.atlassian.com/manage/api-tokens
2. Delete the old token
3. Create a new one
4. Update `.env` with the new token

### Issue: "Invalid email address"

**Cause:** Email doesn't match JIRA account
**Solution:**
1. Check your JIRA account email
2. Update `JIRA_EMAIL` in `.env` to match

### Issue: "JIRA URL not found"

**Cause:** URL is incorrect (wrong instance name)
**Solution:**
1. Verify your JIRA URL format: `https://your-company.atlassian.net`
2. Check for typos
3. Make sure you're using JIRA Cloud (not Data Center)

### Issue: "Issue not found"

**Cause:** Issue key doesn't exist
**Solution:**
1. Verify the issue key is correct
2. Check that the issue is in the JIRA instance
3. Ensure you have access to the issue

### Issue: "Connection timeout"

**Cause:** Network issues or JIRA is unavailable
**Solution:**
1. Check your internet connection
2. Verify JIRA is running
3. Try again after a few moments

## 🔐 Security Best Practices

1. **Never commit `.env` to version control**
   - Already protected by `.gitignore`

2. **Rotate API tokens regularly**
   - Create new tokens every 90 days
   - Delete old tokens

3. **Use minimal permissions**
   - API token should only have read access
   - Don't use admin tokens

4. **Monitor token usage**
   - Check JIRA audit logs occasionally
   - Revoke tokens if compromised

## 📊 Example Output

When you run with JIRA integration:

```
[Main] [INFO] 🚀 QA Test Generator Agent started
[JiraService] [INFO] ✅ JIRA Service initialized
[JiraService] [INFO] 🔌 Testing JIRA connection...
[JiraService] [INFO] ✅ JIRA connection successful
[JiraService] [INFO] 📝 Fetching JIRA issue: PROJ-123
[JiraService] [INFO] ✅ Successfully fetched issue: PROJ-123
[Main] [INFO] ✅ Requirement fetched from JIRA
[Main] [INFO] 📝 Generating test cases...
[OpenAIService] [INFO] Generated 12 test cases
[Main] [INFO] ✅ Test cases generated successfully
[Main] [INFO] 💾 Test cases exported to output/generated_tests.json
[Main] [INFO] 🎭 Generating Playwright script...
[Main] [INFO] ✅ Playwright script exported to output/generated_test.spec.ts
```

## 🎯 Advanced: Programmatic Usage

Use JIRA Service in your own code:

```typescript
import { JiraService } from './services/jiraService';

const jiraService = new JiraService({
  jiraUrl: 'https://your-company.atlassian.net',
  jiraEmail: 'your-email@example.com',
  jiraApiToken: 'your-api-token',
});

// Fetch and format requirement
const requirement = await jiraService.getIssueAsRequirement('PROJ-123');

// Or fetch and process custom
const issue = await jiraService.getIssue('PROJ-123');
console.log(issue.fields.summary);
console.log(issue.fields.description);
```

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Generate QA Tests from JIRA

on:
  schedule:
    - cron: '0 9 * * MON'  # Every Monday at 9am
  workflow_dispatch:
    inputs:
      jira_issue:
        description: 'JIRA Issue Key'
        required: true

jobs:
  generate-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm install
      
      - name: Generate tests from JIRA
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          JIRA_URL: ${{ secrets.JIRA_URL }}
          JIRA_EMAIL: ${{ secrets.JIRA_EMAIL }}
          JIRA_API_TOKEN: ${{ secrets.JIRA_API_TOKEN }}
        run: npm run generate-tests --jira ${{ github.event.inputs.jira_issue }}
      
      - name: Run tests
        run: npm test
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: output/
```

---

## ✅ Quick Checklist

- [ ] Generated JIRA API token
- [ ] Added credentials to `.env`
- [ ] Tested connection with a sample issue
- [ ] Generated test cases successfully
- [ ] Reviewed output files
- [ ] Updated CI/CD pipeline (optional)
- [ ] Shared with team

---

**Ready to automate test generation from JIRA!** 🚀
