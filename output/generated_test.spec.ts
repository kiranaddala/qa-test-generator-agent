import { test, expect } from '@playwright/test';

test.describe('User Registration', () => {
  test('Successful User Registration', async ({ page }) => {
    try {
      // Step 1: Navigate to the registration page
      await page.goto('https://example.com/registration');

      // Step 2: Fill in valid user details
      await page.fill('input[name="username"]', 'testuser');
      await page.fill('input[name="email"]', 'testuser@example.com');
      await page.fill('input[name="password"]', 'Password123!');
      await page.fill('input[name="confirmPassword"]', 'Password123!');

      // Step 3: Submit the registration form
      await page.click('button[type="submit"]');

      // Step 4: Verify redirection to the welcome page
      await expect(page).toHaveURL('https://example.com/welcome');

      // Step 5: Assert successful registration
      const welcomeMessage = await page.textContent('.welcome-message');
      expect(welcomeMessage).toContain('Welcome, testuser!');

      // Additional assertion to check user can access their profile
      await page.click('a[href="/profile"]');
      const profileHeader = await page.textContent('h1');
      expect(profileHeader).toBe('Your Profile');

    } catch (error) {
      console.error('Error during user registration test:', error);
      throw error; // Re-throw to fail the test
    }
  });
});
