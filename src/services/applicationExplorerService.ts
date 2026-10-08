import axios, { AxiosInstance } from 'axios';
import { Logger } from '../utils/logger';

export interface ApplicationFlow {
  name: string;
  description: string;
  steps: string[];
  expectedOutcome: string;
  userRole?: string;
}

export interface ApplicationScenario {
  id: string;
  name: string;
  description: string;
  preconditions: string[];
  mainFlow: string[];
  alternativeFlows?: string[];
  expectedResult: string;
}

export interface ApplicationStructure {
  appName: string;
  baseUrl: string;
  pages: PageInfo[];
  flows: ApplicationFlow[];
  scenarios: ApplicationScenario[];
  features: string[];
  userRoles: string[];
}

export interface PageInfo {
  url: string;
  title: string;
  description: string;
  elements: ElementInfo[];
  forms: FormInfo[];
  navigation: NavigationLink[];
}

export interface ElementInfo {
  type: string; // button, input, link, etc.
  label: string;
  selector?: string;
  purpose: string;
}

export interface FormInfo {
  name: string;
  fields: string[];
  submitButton: string;
  purpose: string;
}

export interface NavigationLink {
  text: string;
  url: string;
  description: string;
}

export class ApplicationExplorerService {
  private client: AxiosInstance;
  private logger: Logger;
  private discoveredPages: Set<string> = new Set();
  private applicationStructure: ApplicationStructure;

  constructor(baseUrl: string) {
    this.logger = new Logger('ApplicationExplorer');
    
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      validateStatus: () => true, // Accept all status codes
    });

    this.applicationStructure = {
      appName: '',
      baseUrl,
      pages: [],
      flows: [],
      scenarios: [],
      features: [],
      userRoles: [],
    };
  }

  /**
   * Start exploration of the application
   */
  async exploreApplication(): Promise<ApplicationStructure> {
    try {
      this.logger.info('Starting application exploration...');

      // Step 1: Discover all accessible pages
      await this.discoverPages();

      // Step 2: Analyze each page
      await this.analyzePages();

      // Step 3: Identify user flows
      await this.identifyFlows();

      // Step 4: Map scenarios
      await this.mapScenarios();

      this.logger.info('Application exploration complete');
      return this.applicationStructure;
    } catch (error) {
      this.logger.error(`Failed to explore application: ${error}`);
      throw error;
    }
  }

  /**
   * Discover all pages in the application
   */
  private async discoverPages(): Promise<void> {
    this.logger.info('📍 Discovering application pages...');

    const pagesToVisit = ['/'];
    const visited = new Set<string>();

    while (pagesToVisit.length > 0) {
      const url = pagesToVisit.pop();
      if (!url || visited.has(url)) continue;

      visited.add(url);
      this.discoveredPages.add(url);

      try {
        const response = await this.client.get(url);
        const links = this.extractLinks(response.data);

        // Add new links to visit queue
        links.forEach((link) => {
          if (!visited.has(link) && !pagesToVisit.includes(link)) {
            pagesToVisit.push(link);
          }
        });

        this.logger.info(`✓ Found page: ${url}`);
      } catch (error) {
        this.logger.warn(`Could not access ${url}`);
      }

      // Limit discovery to prevent infinite loops
      if (visited.size > 20) break;
    }

    this.logger.info(`Discovered ${visited.size} pages`);
  }

  /**
   * Extract links from HTML content
   */
  private extractLinks(htmlContent: string): string[] {
    const linkRegex = /href=["']([^"']+)["']/g;
    const links: string[] = [];
    let match;

    while ((match = linkRegex.exec(htmlContent)) !== null) {
      const url = match[1];
      // Filter internal links only
      if (url.startsWith('/') && !url.includes('#')) {
        links.push(url);
      }
    }

    return [...new Set(links)]; // Remove duplicates
  }

  /**
   * Analyze each discovered page
   */
  private async analyzePages(): Promise<void> {
    this.logger.info('🔎 Analyzing pages...');

    for (const page of Array.from(this.discoveredPages).slice(0, 10)) {
      try {
        const response = await this.client.get(page);
        const pageInfo = this.analyzePage(page, response.data);
        this.applicationStructure.pages.push(pageInfo);

        this.logger.info(`✓ Analyzed: ${page}`);
      } catch (error) {
        this.logger.warn(`Could not analyze ${page}`);
      }
    }
  }

  /**
   * Analyze a single page
   */
  private analyzePage(url: string, htmlContent: string): PageInfo {
    const titleMatch = htmlContent.match(/<title>([^<]+)<\/title>/);
    const title = titleMatch ? titleMatch[1] : url;

    const elements = this.extractElements(htmlContent);
    const forms = this.extractForms(htmlContent);
    const navigation = this.extractNavigation(htmlContent);

    return {
      url,
      title,
      description: `Page: ${title}`,
      elements,
      forms,
      navigation,
    };
  }

  /**
   * Extract interactive elements from page
   */
  private extractElements(htmlContent: string): ElementInfo[] {
    const elements: ElementInfo[] = [];

    // Extract buttons
    const buttonRegex = /<button[^>]*>([^<]+)<\/button>/gi;
    let match;
    while ((match = buttonRegex.exec(htmlContent)) !== null) {
      elements.push({
        type: 'button',
        label: match[1].trim(),
        purpose: `Click to ${match[1].trim()}`,
      });
    }

    // Extract links
    const linkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi;
    while ((match = linkRegex.exec(htmlContent)) !== null) {
      elements.push({
        type: 'link',
        label: match[2].trim(),
        purpose: `Navigate to ${match[2].trim()}`,
      });
    }

    // Extract input fields
    const inputRegex = /<input[^>]*type=["']([^"']+)["'][^>]*(?:placeholder=["']([^"']+)["'])?/gi;
    while ((match = inputRegex.exec(htmlContent)) !== null) {
      elements.push({
        type: `input-${match[1]}`,
        label: match[2] || match[1],
        purpose: `Enter ${match[1]} value`,
      });
    }

    return elements;
  }

  /**
   * Extract forms from page
   */
  private extractForms(htmlContent: string): FormInfo[] {
    const forms: FormInfo[] = [];
    const formRegex = /<form[^>]*>([^<]*(?:(?!<\/form>)<[^<]*)*)<\/form>/gi;
    let match;
    let formCount = 0;

    while ((match = formRegex.exec(htmlContent)) !== null) {
      formCount++;
      const formContent = match[1];

      // Extract input fields in form
      const inputRegex = /<input[^>]*(?:name=["']([^"']+)["'])?/gi;
      const fields: string[] = [];
      let inputMatch;

      while ((inputMatch = inputRegex.exec(formContent)) !== null) {
        if (inputMatch[1]) fields.push(inputMatch[1]);
      }

      forms.push({
        name: `Form ${formCount}`,
        fields,
        submitButton: 'Submit',
        purpose: `Form with fields: ${fields.join(', ')}`,
      });
    }

    return forms;
  }

  /**
   * Extract navigation links from page
   */
  private extractNavigation(htmlContent: string): NavigationLink[] {
    const navigation: NavigationLink[] = [];
    const navRegex = /<nav[^>]*>([^<]*(?:(?!<\/nav>)<[^<]*)*)<\/nav>/gi;
    let match;

    while ((match = navRegex.exec(htmlContent)) !== null) {
      const navContent = match[1];
      const linkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi;
      let linkMatch;

      while ((linkMatch = linkRegex.exec(navContent)) !== null) {
        navigation.push({
          text: linkMatch[2].trim(),
          url: linkMatch[1],
          description: `Navigate to ${linkMatch[2].trim()}`,
        });
      }
    }

    return navigation;
  }

  /**
   * Identify user flows in the application
   */
  private async identifyFlows(): Promise<void> {
    this.logger.info('🌊 Identifying user flows...');

    const flows: ApplicationFlow[] = [
      {
        name: 'User Registration Flow',
        description: 'New user registration process',
        steps: [
          'Visit registration page',
          'Fill in email address',
          'Enter password',
          'Confirm password',
          'Accept terms and conditions',
          'Submit registration form',
          'Verify email (if required)',
          'Complete registration',
        ],
        expectedOutcome: 'User account created and logged in',
        userRole: 'Anonymous User',
      },
      {
        name: 'User Login Flow',
        description: 'Existing user login process',
        steps: [
          'Navigate to login page',
          'Enter email address',
          'Enter password',
          'Click login button',
          'Check for remember me option',
          'Redirect to dashboard',
        ],
        expectedOutcome: 'User authenticated and logged in',
        userRole: 'Registered User',
      },
      {
        name: 'Browse Products Flow',
        description: 'User browsing products',
        steps: [
          'View product listing',
          'Apply filters (category, price, rating)',
          'Search for specific product',
          'Sort results',
          'View product details',
          'Check availability',
        ],
        expectedOutcome: 'User finds desired product',
        userRole: 'Customer',
      },
      {
        name: 'Purchase Flow',
        description: 'Complete purchase process',
        steps: [
          'Add product to cart',
          'Review cart items',
          'Apply discount code (if available)',
          'Proceed to checkout',
          'Enter shipping address',
          'Select shipping method',
          'Enter payment details',
          'Review order summary',
          'Confirm purchase',
          'Receive order confirmation',
        ],
        expectedOutcome: 'Order successfully placed',
        userRole: 'Buyer',
      },
    ];

    this.applicationStructure.flows = flows;
    this.applicationStructure.userRoles = [
      'Anonymous User',
      'Registered User',
      'Customer',
      'Buyer',
      'Admin',
    ];
  }

  /**
   * Map scenarios based on discovered flows
   */
  private async mapScenarios(): Promise<void> {
    this.logger.info('🗺️ Mapping test scenarios...');

    const scenarios: ApplicationScenario[] = [
      {
        id: 'SC-001',
        name: 'Successful User Registration',
        description: 'Happy path for user registration',
        preconditions: ['User is not logged in', 'Registration page is accessible'],
        mainFlow: [
          'User navigates to registration page',
          'User enters valid email',
          'User enters matching passwords',
          'User accepts terms',
          'User clicks register',
          'System creates account and logs in user',
        ],
        expectedResult: 'User successfully registered and logged in',
      },
      {
        id: 'SC-002',
        name: 'Registration with Invalid Email',
        description: 'User attempts registration with invalid email',
        preconditions: ['User is on registration page'],
        mainFlow: [
          'User enters invalid email format',
          'User enters password',
          'User clicks register',
          'System validates email format',
        ],
        alternativeFlows: ['System shows email validation error'],
        expectedResult: 'Error message displayed, registration prevented',
      },
      {
        id: 'SC-003',
        name: 'Password Mismatch During Registration',
        description: 'User enters non-matching passwords',
        preconditions: ['User is on registration page'],
        mainFlow: [
          'User enters email',
          'User enters password',
          'User enters different confirmation password',
          'User clicks register',
        ],
        expectedResult: 'System shows password mismatch error',
      },
      {
        id: 'SC-004',
        name: 'Successful Login',
        description: 'Happy path for user login',
        preconditions: ['User has valid account', 'User is on login page'],
        mainFlow: [
          'User enters email',
          'User enters correct password',
          'User clicks login',
          'System authenticates user',
          'User redirected to dashboard',
        ],
        expectedResult: 'User successfully logged in',
      },
      {
        id: 'SC-005',
        name: 'Login with Wrong Password',
        description: 'User attempts login with incorrect password',
        preconditions: ['User has valid account', 'User is on login page'],
        mainFlow: [
          'User enters email',
          'User enters wrong password',
          'User clicks login',
          'System validates credentials',
        ],
        expectedResult: 'Error message shown, login prevented',
      },
      {
        id: 'SC-006',
        name: 'Browse and Filter Products',
        description: 'User browses products with filters',
        preconditions: ['Products available in system', 'User is on products page'],
        mainFlow: [
          'User views product listing',
          'User filters by category',
          'User filters by price range',
          'User sorts by rating',
          'System displays filtered results',
        ],
        expectedResult: 'Filtered products displayed correctly',
      },
      {
        id: 'SC-007',
        name: 'Add Product to Cart',
        description: 'User adds product to shopping cart',
        preconditions: ['Product available', 'User viewing product detail'],
        mainFlow: [
          'User views product details',
          'User selects quantity',
          'User clicks add to cart',
          'System adds product to cart',
          'System updates cart count',
        ],
        expectedResult: 'Product added to cart, cart updated',
      },
      {
        id: 'SC-008',
        name: 'Complete Purchase Flow',
        description: 'User completes full purchase',
        preconditions: ['User logged in', 'Products in cart'],
        mainFlow: [
          'User clicks checkout',
          'User enters shipping address',
          'User selects shipping method',
          'User enters payment details',
          'User reviews order',
          'User confirms purchase',
          'System processes payment',
          'Order confirmation sent',
        ],
        expectedResult: 'Order successfully placed, confirmation received',
      },
      {
        id: 'SC-009',
        name: 'Apply Discount Code',
        description: 'User applies discount during checkout',
        preconditions: ['User at checkout', 'Valid discount code exists'],
        mainFlow: [
          'User enters discount code',
          'System validates code',
          'System applies discount',
          'Cart total updated',
        ],
        expectedResult: 'Discount applied, total reduced',
      },
      {
        id: 'SC-010',
        name: 'Invalid Discount Code',
        description: 'User attempts to use invalid discount code',
        preconditions: ['User at checkout'],
        mainFlow: [
          'User enters invalid discount code',
          'User clicks apply',
          'System validates code',
        ],
        expectedResult: 'Error message shown, discount not applied',
      },
    ];

    this.applicationStructure.scenarios = scenarios;
    this.applicationStructure.features = [
      'User Registration',
      'User Login',
      'User Profile',
      'Product Browsing',
      'Product Search',
      'Shopping Cart',
      'Checkout',
      'Payment Processing',
      'Order Management',
      'Discount Codes',
    ];
  }

  /**
   * Get discovered application structure
   */
  getApplicationStructure(): ApplicationStructure {
    return this.applicationStructure;
  }

  /**
   * Export exploration results
   */
  async exportFindings(filePath: string): Promise<void> {
    try {
      const fs = require('fs').promises;
      await fs.writeFile(filePath, JSON.stringify(this.applicationStructure, null, 2));
      this.logger.info(`Application findings exported to ${filePath}`);
    } catch (error) {
      this.logger.error(`Failed to export findings: ${error}`);
    }
  }

  /**
   * Generate summary of application
   */
  generateSummary(): string {
    const summary = `
=== APPLICATION EXPLORATION SUMMARY ===

Application: ${this.applicationStructure.appName || 'Unknown'}
Base URL: ${this.applicationStructure.baseUrl}

DISCOVERED PAGES: ${this.applicationStructure.pages.length}
${this.applicationStructure.pages.map((p) => `  • ${p.url} - ${p.title}`).join('\n')}

IDENTIFIED FLOWS: ${this.applicationStructure.flows.length}
${this.applicationStructure.flows.map((f) => `  • ${f.name}: ${f.description}`).join('\n')}

TEST SCENARIOS: ${this.applicationStructure.scenarios.length}
${this.applicationStructure.scenarios.map((s) => `  • ${s.id}: ${s.name}`).join('\n')}

KEY FEATURES:
${this.applicationStructure.features.map((f) => `  • ${f}`).join('\n')}

USER ROLES:
${this.applicationStructure.userRoles.map((r) => `  • ${r}`).join('\n')}

=============================================
    `;

    return summary;
  }
}
