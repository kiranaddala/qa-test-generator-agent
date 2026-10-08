# Push QA Test Generator Agent to GitHub

Complete step-by-step guide to push your project to your own Git repository.

## Prerequisites

1. **Git installed** on your machine
   ```bash
   git --version
   ```

2. **GitHub account** (or GitLab/Bitbucket)
   - Sign up at https://github.com

3. **SSH key or Personal Access Token** configured
   - Follow: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

---

## Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Enter repository name: `qa-test-generator-agent`
3. Description: "AI-powered QA test case generator with Playwright and OpenAI"
4. Choose: **Private** (or Public if you want to share)
5. Do NOT initialize with README, .gitignore, or license
6. Click "Create repository"

**You'll see:**
```
Quick setup — if you've done this kind of thing before

or

https://github.com/YOUR_USERNAME/qa-test-generator-agent.git
```

Copy this URL.

---

## Step 2: Initialize Git Locally

Run these commands in your project directory:

```bash
# Navigate to project
cd /Users/kiranaddala/Learning/qa-test-generator-agent

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: QA Test Generator Agent with OpenAI, JIRA, and Application Explorer"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/qa-test-generator-agent.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## Step 3: Verify Push

Check GitHub:
1. Go to https://github.com/YOUR_USERNAME/qa-test-generator-agent
2. You should see all your files uploaded
3. Check that .env is NOT there (it's in .gitignore)

---

## Complete Script (Copy & Paste)

```bash
#!/bin/bash

# Navigate to project
cd /Users/kiranaddala/Learning/qa-test-generator-agent

# Initialize git
echo "Initializing Git repository..."
git init

# Configure git (if not already configured)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Add all files
echo "Adding files..."
git add .

# Create initial commit
echo "Creating initial commit..."
git commit -m "Initial commit: QA Test Generator Agent with OpenAI integration, JIRA support, and automatic application exploration"

# Add remote
echo "Adding remote repository..."
git remote add origin https://github.com/YOUR_USERNAME/qa-test-generator-agent.git

# Set main branch
echo "Setting up main branch..."
git branch -M main

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main

echo "Done! Visit https://github.com/YOUR_USERNAME/qa-test-generator-agent"
```

---

## What Gets Pushed

### PUSHED (Included)
```
qa-test-generator-agent/
├── src/                    (All source code)
├── config/                 (Configurations)
├── output/                 (Example outputs)
├── scripts/                (Shell scripts)
├── README.md               (Documentation)
├── JIRA_INTEGRATION.md     (Setup guide)
├── APPLICATION_EXPLORER.md (Feature guide)
├── COMPLETE_EXPLANATION.md (Technical docs)
├── BLOG_POST.md            (Blog article)
├── LINKEDIN_POST.md        (LinkedIn content)
├── package.json            (Dependencies)
├── tsconfig.json           (TypeScript config)
├── .gitignore              (Ignore patterns)
└── .env.example            (Template - no secrets)
```

### NOT PUSHED (Protected by .gitignore)
```
node_modules/              (Dependencies - can be installed)
dist/                      (Build output - can be regenerated)
.env                       (Your API keys - NEVER commit!)
test-results/              (Test artifacts)
.DS_Store                  (macOS files)
```

---

## Step 4: Add .env.example (Best Practice)

Create a template for others:

```bash
cat > /Users/kiranaddala/Learning/qa-test-generator-agent/.env.example << 'EOF'
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-key-here

# JIRA Configuration (Optional)
JIRA_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-api-token

# Test Configuration (Optional)
TEST_BASE_URL=https://your-app.com
TEST_TIMEOUT=30000
HEADLESS=true
LOG_LEVEL=info
EOF
```

Then add and commit:
```bash
git add .env.example
git commit -m "Add environment variables template"
git push
```

---

## Step 5: Update GitHub Repository Settings

1. Go to your repository
2. Click "Settings" tab
3. Under "About" section:
   - Add description
   - Add topics: `qa`, `testing`, `playwright`, `ai`, `openai`
   - Add website URL (if you have one)

---

## Common Git Commands After Setup

```bash
# Check status
git status

# See what changed
git diff

# Commit changes
git add .
git commit -m "Your commit message"

# Push to GitHub
git push

# Pull latest changes
git pull

# View commit history
git log --oneline

# Create a branch
git checkout -b feature/my-feature

# Switch branch
git checkout main

# Merge branch
git merge feature/my-feature
```

---

## Step 6: Make README GitHub-Friendly

Ensure your README.md has:
- Clear title
- Quick start instructions
- Features section
- Installation steps
- Usage examples
- Troubleshooting
- License info

Your current README.md is perfect!

---

## Step 7: Create GitHub Releases (Optional)

After pushing, create a release:

1. Go to your repository
2. Click "Releases" on the right
3. Click "Create a new release"
4. Tag version: `v1.0.0`
5. Title: "Initial Release"
6. Description: Copy from BLOG_POST.md
7. Click "Publish release"

---

## Troubleshooting

### Error: "fatal: not a git repository"
```bash
# Solution: You haven't run git init yet
git init
```

### Error: "Permission denied (publickey)"
```bash
# Solution: SSH key not configured
# Follow: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
```

### Error: "rejected (fetch first)"
```bash
# Solution: Remote has commits you don't have
git pull origin main
git push origin main
```

### .env file got pushed (DANGEROUS!)
```bash
# Solution: Remove it from history
git rm --cached .env
git commit -m "Remove .env from tracking"
git push
```

---

## After Push - Next Steps

1. **Share on LinkedIn**
   - Use content from LINKEDIN_POST.md
   - Include: "GitHub: github.com/YOUR_USERNAME/qa-test-generator-agent"

2. **Share on Dev.to/Medium**
   - Use content from BLOG_POST.md
   - Add GitHub link

3. **Add GitHub Stars Badge to README**
   ```markdown
   [![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/qa-test-generator-agent?style=social)](https://github.com/YOUR_USERNAME/qa-test-generator-agent)
   ```

4. **Enable GitHub Pages** (Optional)
   - Settings → Pages
   - Deploy from main branch

---

## Your Repository URL

After setup, your repo will be at:
```
https://github.com/YOUR_USERNAME/qa-test-generator-agent
```

Clone it anytime with:
```bash
git clone https://github.com/YOUR_USERNAME/qa-test-generator-agent.git
```

---

## Summary

| Step | Command | Time |
|------|---------|------|
| 1 | Create repo on GitHub | 2 min |
| 2 | Run git init + setup | 5 min |
| 3 | Verify on GitHub | 1 min |
| 4 | Add .env.example | 2 min |
| 5 | Update settings | 3 min |
| **Total** | | **~15 minutes** |

---

## Questions?

Refer to:
- GitHub Docs: https://docs.github.com
- Git Guide: https://git-scm.com/book/en/v2
- Git Cheat Sheet: https://github.github.com/training-kit/

**You're ready to go! Push that code! 🚀**
