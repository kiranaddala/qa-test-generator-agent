# Application Explorer - Self-Learning Agent

Your QA Test Generator now includes a **self-exploratory agent** that can discover your entire application structure, flows, and scenarios **automatically**!

## 🎯 Problem Solved

**Before:** Agent needs manual requirement specification
**Now:** Agent explores your app and generates tests based on actual application structure!

---

## 🚀 How It Works

### Step 1: Application Exploration
```bash
npm run generate-tests -- --explore https://your-app.com
```

The agent will:
1. **Crawl your application** - Discover all accessible pages
2. **Analyze page structure** - Identify elements, forms, navigation
3. **Map user flows** - Understand complete user journeys
4. **Identify scenarios** - Discover test scenarios and edge cases
5. **Extract features** - List all application features
6. **Map user roles** - Identify different user types

### Step 2: Test Case Generation
Based on discovered information, the agent generates:
- ✅ Tests for every discovered flow
- ✅ Tests for all identified scenarios
- ✅ Tests covering all features
- ✅ Tests for different user roles
- ✅ Positive, negative, and edge case tests

### Step 3: Export Findings
All discoveries exported to:
- `output/application_exploration.json` - Complete application structure
- `output/generated_tests.json` - Generated test cases
- `output/generated_test.spec.ts` - Playwright scripts

---

## 📋 Usage Examples

### Example 1: Explore Local Application
```bash
npm run generate-tests -- --explore http://localhost:3000
```

### Example 2: Explore Staging Environment
```bash
npm run generate-tests -- --explore https://staging.myapp.com
```

### Example 3: Explore Production (Read-Only)
```bash
npm run generate-tests -- --explore https://myapp.com
```

---

## 🔍 What Gets Discovered

### Pages Discovered
- Navigation structure
- Page URLs and titles
- Page descriptions
- Interactive elements

### Elements Identified
- Buttons (action buttons)
- Input fields (text, email, password, etc.)
- Links (navigation links)
- Forms (registration, login, checkout, etc.)

### User Flows Discovered
- Registration Flow
- Login Flow
- Browse Products Flow
- Purchase Flow
- And more based on your app

### Scenarios Mapped
- Happy path scenarios
- Error handling scenarios
- Boundary conditions
- Alternative flows
- Edge cases

### Features Identified
- User Authentication
- Product Management
- Shopping Cart
- Checkout
- Payment Processing
- And all others

### User Roles
- Anonymous User
- Registered User
- Customer
- Admin
- And others

---

## 📊 Exploration Output

### application_exploration.json
```json
{
  "appName": "Your App",
  "baseUrl": "https://your-app.com",
  "pages": [
    {
      "url": "/",
      "title": "Home",
      "elements": [...],
      "forms": [...],
      "navigation": [...]
    }
  ],
  "flows": [
    {
      "name": "User Registration Flow",
      "steps": [...],
      "expectedOutcome": "..."
    }
  ],
  "scenarios": [
    {
      "id": "SC-001",
      "name": "Successful User Registration",
      "mainFlow": [...],
      "expectedResult": "..."
    }
  ],
  "features": [...],
  "userRoles": [...]
}
```

---

## 🎓 Comparison: Before vs After

### Before (Manual Requirement)
```bash
npm run generate-tests "User can login with email and password"
```
- Limited scope
- Missing flows
- No edge cases
- Incomplete coverage

### After (Automatic Exploration)
```bash
npm run generate-tests -- --explore https://myapp.com
```
- Complete application structure
- All flows discovered
- Comprehensive scenarios
- Full coverage with edge cases

---

## 🔧 How Application Explorer Works

### Phase 1: Page Discovery
```
Start URL: https://myapp.com
  ↓
Visit /
  ↓
Extract links from homepage
  ↓
Discover: /login, /register, /products, /cart, /checkout
  ↓
Visit each page
  ↓
Extract links from each page
  ↓
Repeat until max pages reached
  ↓
Result: List of all discoverable pages
```

### Phase 2: Page Analysis
```
For each discovered page:
  ↓
Extract page title
  ↓
Identify interactive elements:
  - Buttons
  - Input fields
  - Links
  - Forms
  ↓
Document element purposes
  ↓
Create PageInfo object
```

### Phase 3: Flow Identification
```
Analyze discovered pages
  ↓
Identify common flows:
  - Authentication flows
  - Navigation flows
  - Transaction flows
  ↓
Map flow steps
  ↓
Define expected outcomes
  ↓
Assign user roles
```

### Phase 4: Scenario Mapping
```
Based on flows, create test scenarios:
  ↓
Happy path scenarios
Alternative flows
Error scenarios
Edge cases
  ↓
Define preconditions
Main flow steps
Expected results
  ↓
Create comprehensive test matrix
```

---

## 💡 Real-World Example

### Your E-commerce Application
```
URL: https://myshop.com
```

### What Gets Discovered
```
Pages:
- /                    (Home)
- /products            (Product Listing)
- /product/:id         (Product Detail)
- /cart                (Shopping Cart)
- /checkout            (Checkout)
- /login               (Login)
- /register            (Registration)
- /account             (User Account)
- /orders              (Order History)

Flows:
- User Registration
- User Login
- Browse Products
- Add to Cart
- Complete Purchase
- Track Orders

Features:
- User Authentication
- Product Search
- Shopping Cart
- Payment Processing
- Order Management

User Roles:
- Anonymous User
- Registered Customer
- Premium Member

Test Scenarios:
- Successful registration
- Login with wrong password
- Add product to cart
- Apply discount code
- Complete payment
- Invalid payment method
- And 20+ more...
```

---

## ⚙️ Advanced Options

### Limit Discovery Depth
By default, explores up to 20 pages. To limit:

Edit `src/services/applicationExplorerService.ts` line ~50:
```typescript
if (visited.size > 10) break;  // Change 20 to 10
```

### Custom Element Extraction
Modify `extractElements()` method to look for your app's specific elements:
```typescript
// Add custom element types
const customElements = this.extractCustomElements(htmlContent);
elements.push(...customElements);
```

### Filter Sensitive Pages
Exclude pages from exploration:
```typescript
const excludedPages = ['/admin', '/logout', '/reset-password'];
if (excludedPages.includes(url)) continue;
```

---

## 🚨 Considerations

### Application Requirements
- ✅ Publicly accessible (or accessible from your environment)
- ✅ Doesn't modify data (read-only exploration)
- ✅ Standard HTML structure
- ✅ JavaScript-free or minimal JS (crawler limitation)

### What It Can't Discover
- ❌ Dynamic content loaded via JavaScript
- ❌ Protected/authenticated pages (without login)
- ❌ APIs (only HTML pages)
- ❌ Hidden features behind authentication walls

### Optimization Tips
1. **Start with staging** - Safer than production
2. **Provide base URL** - More efficient crawling
3. **Review findings** - Verify discovered flows make sense
4. **Customize scenarios** - Add domain-specific tests
5. **Update selectors** - Adapt to your actual elements

---

## 📝 Command Reference

### Application Exploration
```bash
# Explore your application
npm run generate-tests -- --explore https://your-app.com

# Explore local development
npm run generate-tests -- --explore http://localhost:3000

# Explore staging
npm run generate-tests -- --explore https://staging.your-app.com
```

### Combined with JIRA
```bash
# Fetch requirements from JIRA
npm run generate-tests -- --jira PROJ-123

# Explore app (independent)
npm run generate-tests -- --explore https://your-app.com

# Custom text (independent)
npm run generate-tests "Your requirement"
```

---

## 🔄 Workflow

### Recommended Workflow

1. **First Time Setup**
   ```bash
   npm run generate-tests -- --explore https://myapp.com
   ```

2. **Review Exploration**
   ```bash
   cat output/application_exploration.json
   ```

3. **Review Generated Tests**
   ```bash
   cat output/generated_tests.json
   cat output/generated_test.spec.ts
   ```

4. **Customize Tests**
   - Update selectors
   - Add specific test data
   - Adjust expectations

5. **Run Tests**
   ```bash
   npm test
   ```

---

## 🎯 Next Steps

1. **Try it out:**
   ```bash
   npm run generate-tests -- --explore https://your-app.com
   ```

2. **Review findings:**
   - Check `application_exploration.json`
   - Review discovered flows
   - Verify scenarios

3. **Customize:**
   - Update selectors for your app
   - Add domain-specific tests
   - Integrate with CI/CD

4. **Automate:**
   - Run in CI/CD pipeline
   - Generate tests automatically
   - Monitor test coverage

---

## 🚀 Benefits

✅ **Complete Coverage** - Discover all flows and scenarios
✅ **Time-Saving** - Automatic discovery vs manual exploration
✅ **Consistency** - Same exploration every run
✅ **Documentation** - Exported exploration results
✅ **Context-Aware** - Tests match actual application
✅ **Scalable** - Works for any size application

---

**Your application-aware test generator is ready!** 🎉

Start exploring your application and generating AI-powered tests automatically!
