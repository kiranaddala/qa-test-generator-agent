# QA Test Generator Agent

🤖 AI-powered test case generator using **OpenAI GPT-4o Mini** and **Playwright**.

Generate comprehensive QA test cases in seconds with AI, supporting multiple input methods: manual requirements, JIRA issues, or automatic application exploration.

---

## ⚡ Quick Start (2 Minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup OpenAI API Key
Create `.env` file:
```env
OPENAI_API_KEY=sk-proj-your-key-here
```

### 3. Generate Tests
```bash
# From text requirement
npm run generate-tests "User login feature with email and password"

# From JIRA issue
npm run generate-tests -- --jira PROJ-123

# Auto-explore application
npm run generate-tests -- --explore https://your-app.com
```

---

## 🎯 Three Ways to Generate Tests

### Method 1: Text Requirement
```bash
npm run generate-tests "Your feature description"
```
✅ Quick & simple  
✅ Full control over requirement  
✅ Best for: Known features

### Method 2: JIRA Integration
```bash
npm run generate-tests -- --jira PROJ-123
```
✅ Fetches from JIRA automatically  
✅ Stays in sync with requirements  
✅ Best for: JIRA-based teams

Setup:
```env
JIRA_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-api-token
```

### Method 3: Auto-Explore Application
```bash
npm run generate-tests -- --explore https://your-app.com
```
✅ Discovers application structure  
✅ Maps user flows automatically  
✅ Best for: End-to-end testing

The explorer will:
- Crawl application pages
- Identify user flows (Login, Browse, Purchase, etc.)
- Extract features and UI elements
- Generate context-aware test cases

---

## 📂 Project Structure

```
qa-test-generator-agent/
├── src/
│   ├── index.ts                      # Main entry point (3 input methods)
│   ├── agents/
│   │   └── testGeneratorAgent.ts     # Test generation orchestrator
│   ├── services/
│   │   ├── openaiService.ts          # OpenAI API integration
│   │   ├── jiraService.ts            # JIRA API integration
│   │   └── applicationExplorerService.ts  # Auto-exploration
│   ├── utils/
│   │   ├── fileService.ts            # File operations
│   │   └── logger.ts                 # Logging utility
│   └── models/
│       └── types.ts                  # TypeScript interfaces
├── config/
│   └── playwright.config.ts          # Playwright configuration
├── output/
│   ├── generated_tests.json          # Test cases (structured)
│   ├── generated_test.spec.ts        # Playwright scripts (ready to run)
│   ├── TEST_CASES_PLAIN_ENGLISH.md   # Test cases (human-readable)
│   └── application_exploration.json  # Application structure (from --explore)
├── .env                              # API keys (never commit!)
└── README.md                         # This file
```

---

## 📊 Output Files

Generated in `./output/` directory:

| File | Format | Purpose |
|------|--------|---------|
| `generated_tests.json` | JSON | Structured test data (all details) |
| `generated_test.spec.ts` | TypeScript | Ready-to-run Playwright scripts |
| `TEST_CASES_PLAIN_ENGLISH.md` | Markdown | Human-readable test documentation |
| `application_exploration.json` | JSON | Discovered app structure (from --explore only) |

---

## 🎮 Using Generated Tests

### View Test Cases
```bash
# Human-readable format
cat output/TEST_CASES_PLAIN_ENGLISH.md

# JSON format (for parsing)
cat output/generated_tests.json | jq '.'
```

### Run Playwright Tests
```bash
# Run all tests
npx playwright test output/generated_test.spec.ts

# Run with browser visible
npx playwright test output/generated_test.spec.ts --headed

# View HTML report
npx playwright show-report
```

### Customize Tests
Edit `output/generated_test.spec.ts`:
- Update selectors for your app
- Replace URLs with your endpoints
- Modify test data as needed

---

## 📝 Commands Reference

```bash
npm run generate-tests       # Generate from text requirement
npm run dev                  # Same as above
npm test                     # Run Playwright tests
npm run test:headed          # Run with visible browser
npm run test:debug           # Debug mode
npm run test:report          # View HTML test report
npm run build                # Compile TypeScript
npm run lint                 # Run ESLint
npm run clean                # Remove build artifacts
```

---

## 💡 How It Works

```
User Input (Requirement/JIRA/URL)
         ↓
Application Explorer (if using --explore)
    - Crawls pages
    - Discovers features
    - Maps flows
         ↓
OpenAI GPT-4o Mini
    - Analyzes input
    - Generates test cases
    - Creates edge cases
         ↓
Test Generator Agent
    - Formats test cases
    - Creates Playwright scripts
    - Exports multiple formats
         ↓
Output Files (3 formats)
    - JSON (machine-readable)
    - TypeScript (automation-ready)
    - Markdown (human-readable)
```

---

## 💰 Pricing

- **Cost**: ~$0.003 per 30 test cases
- **Free Tier**: OpenAI $5 free trial = ~2,500 generations
- **Production**: ~$0.60/month for heavy testing

---

## 🔒 Security

✅ API keys stored in `.env` (never in code)  
✅ `.env` in `.gitignore` (never committed)  
✅ Safe to share code on GitHub  
✅ Enterprise-grade OpenAI encryption  

---

## 🚀 Integration with Your Project

### Copy Framework to Your Project
```bash
# Copy source code
cp -r src/ your-project/qa-generator/

# Copy configuration
cp config/playwright.config.ts your-project/qa-generator/config/

# Copy dependencies
cp package.json your-project/qa-generator/

# Install and setup
cd your-project/qa-generator
npm install
echo "OPENAI_API_KEY=your-key" > .env
```

### Use in Your Workflow
```bash
# Generate tests for your feature
npm run generate-tests "Login with OAuth"

# Review in output/
ls -la output/

# Add to CI/CD
npm test
```

---

## 📚 Complete Examples

### Example 1: E-Commerce Login
```bash
npm run generate-tests "E-commerce login feature with email/password, remember me, forgot password, and OAuth social login"
```

### Example 2: Auto-Explore Real Website
```bash
npm run generate-tests -- --explore https://www.example-ecommerce.com
```

### Example 3: JIRA Integration
```bash
npm run generate-tests -- --jira ECOM-1234
```

---

## 🤔 FAQ

**Q: How do I customize generated tests?**  
A: Edit `output/generated_test.spec.ts` - update selectors, URLs, and test data.

**Q: Can I use this with existing Playwright tests?**  
A: Yes! Generate tests and merge with your existing suite.

**Q: What if generated tests don't match my app?**  
A: Review the plain English version and edit the spec file or regenerate with better requirements.

**Q: Does it support headless testing?**  
A: Yes! Default is headless. Use `--headed` flag to see browser.

**Q: Can I integrate with CI/CD?**  
A: Yes! Run `npm run generate-tests` in your pipeline, then `npm test`.

---

## 📚 Documentation

- **[JIRA Integration Guide](./JIRA_INTEGRATION.md)** - Setup and usage for JIRA
- **[Application Explorer Guide](./APPLICATION_EXPLORER.md)** - Auto-discovery features

---

## 🎓 Architecture

- **Service-Oriented**: Each capability is a separate service
- **Type-Safe**: Full TypeScript with strict mode
- **Modular**: Easy to extend and customize
- **Production-Ready**: Error handling, logging, validation

---

## 📞 Support

- **OpenAI Issues**: https://help.openai.com/
- **Playwright Docs**: https://playwright.dev/
- **JIRA API**: https://developer.atlassian.com/cloud/jira/

---

## 📄 License

MIT - Free for personal and commercial use

---

## ✨ Next Steps

1. ✅ Install: `npm install`
2. ✅ Configure: Add `OPENAI_API_KEY` to `.env`
3. ✅ Generate: `npm run generate-tests "your feature"`
4. ✅ Review: Check `output/TEST_CASES_PLAIN_ENGLISH.md`
5. ✅ Run: `npm test`
6. ✅ Deploy: Use in CI/CD pipeline

**Happy Testing! 🚀**
