import { test, expect } from '@playwright/test';

const BASE_URL = 'https://health-check-sepia.vercel.app';

test.describe('HealthCheck Web App', () => {
  test('should load homepage with correct title and content', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check title
    await expect(page).toHaveTitle(/HealthCheck/);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Know your numbers');
    await expect(page.locator('h1')).toContainText('Plan your goal');
    
    // Check feature cards
    await expect(page.locator('text=BMI Calculator')).toBeVisible();
    await expect(page.locator('text=Calorie Calculator')).toBeVisible();
    await expect(page.locator('text=Macro Calculator')).toBeVisible();
    
    // Check navbar
    await expect(page.locator('text=HealthCheck').first()).toBeVisible();
    await expect(page.locator('header button:has-text("Calculators")')).toBeVisible();
    await expect(page.locator('header a:has-text("Health Check")')).toBeVisible();
    await expect(page.locator('header a:has-text("Pricing")')).toBeVisible();
    
    // Check footer
    await expect(page.locator('text=© 2024 HealthCheck')).toBeVisible();
    await expect(page.locator('text=Disclaimer')).toBeVisible();
  });

  test('should navigate to BMI calculator page', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Click on Calculators dropdown
    await page.locator('header button:has-text("Calculators")').click();
    
    // Click on BMI link
    await page.locator('role=menuitem[name="BMI"]').click();
    
    // Check URL and content
    await expect(page).toHaveURL(`${BASE_URL}/calculators/bmi`);
    await expect(page.locator('h1')).toContainText('BMI Calculator');
    await expect(page.locator('text=Body Mass Index')).toBeVisible();
    await expect(page.locator('#form-root')).toBeVisible();
  });

  test('should navigate to Calories calculator page', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Click on Calculators dropdown
    await page.locator('header button:has-text("Calculators")').click();
    
    // Click on Calories link
    await page.locator('role=menuitem[name="Calories"]').click();
    
    // Check URL and content
    await expect(page).toHaveURL(`${BASE_URL}/calculators/calories`);
    await expect(page.locator('h1')).toContainText('Calorie (TDEE) Calculator');
    await expect(page.locator('text=Total Daily Energy Expenditure')).toBeVisible();
    await expect(page.locator('#form-root')).toBeVisible();
  });

  test('should navigate to Macros calculator page', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Click on Calculators dropdown
    await page.locator('header button:has-text("Calculators")').click();
    
    // Click on Macros link
    await page.locator('role=menuitem[name="Macros"]').click();
    
    // Check URL and content
    await expect(page).toHaveURL(`${BASE_URL}/calculators/macros`);
    await expect(page.locator('h1')).toContainText('Macro Calculator');
    await expect(page.locator('text=Macronutrients')).toBeVisible();
    await expect(page.locator('#form-root')).toBeVisible();
  });

  test('should navigate to Health Check page', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Click on Health Check link
    await page.locator('a:has-text("Health Check")').click();
    
    // Check URL and content
    await expect(page).toHaveURL(`${BASE_URL}/health-check`);
    await expect(page.locator('h1')).toContainText('Health Check');
    await expect(page.locator('text=comprehensive overview')).toBeVisible();
    await expect(page.locator('#form-root')).toBeVisible();
  });

  test('should navigate to Results page', async ({ page }) => {
    await page.goto(`${BASE_URL}/results`);
    
    // Check URL and content
    await expect(page).toHaveURL(`${BASE_URL}/results`);
    await expect(page.locator('h1')).toContainText('Results');
    await expect(page.locator('text=Provide inputs to see results')).toBeVisible();
  });

  test('should navigate to Pricing page', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Click on Pricing link
    await page.locator('a:has-text("Pricing")').click();
    
    // Check URL and content
    await expect(page).toHaveURL(`${BASE_URL}/pricing`);
    await expect(page.locator('h1')).toContainText('Choose Your Plan');
    await expect(page.locator('[data-slot="card-title"]:has-text("Free")')).toBeVisible();
    await expect(page.locator('[data-slot="card-title"]:has-text("Pro")')).toBeVisible();
  });

  test('should navigate to Disclaimer page', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Click on Disclaimer link in footer
    await page.locator('a:has-text("Disclaimer")').click();
    
    // Check URL and content
    await expect(page).toHaveURL(`${BASE_URL}/disclaimer`);
    await expect(page.locator('h1')).toContainText('Disclaimer');
    await expect(page.locator('text=Medical Disclaimer')).toBeVisible();
  });

  test('should have proper SSR - check view source', async ({ page }) => {
    // Test that content is in the initial HTML (SSR)
    const response = await page.goto(BASE_URL);
    const html = await response?.text();
    
    // Check that critical content is in the HTML source
    expect(html).toContain('Know your numbers');
    expect(html).toContain('Plan your goal');
    expect(html).toContain('BMI Calculator');
    expect(html).toContain('Calorie Calculator');
    expect(html).toContain('Macro Calculator');
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check meta tags
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /health calculators/i);
    
    // Check canonical URL (accept any valid production URL)
    const canonicalLink = page.locator('link[rel="canonical"]');
    await expect(canonicalLink).toHaveAttribute('href', /https:\/\/health-check.*\.vercel\.app\//);
  });

  test('all calculator pages should have form-root placeholder', async ({ page }) => {
    const calculatorPages = [
      '/calculators/bmi',
      '/calculators/calories', 
      '/calculators/macros',
      '/health-check'
    ];

    for (const pagePath of calculatorPages) {
      await page.goto(`${BASE_URL}${pagePath}`);
      await expect(page.locator('#form-root')).toBeVisible();
    }
  });

  test('should not have React hydration warnings', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto(BASE_URL);
    
    // Wait a bit for any hydration issues to surface
    await page.waitForTimeout(2000);
    
    // Check for hydration warnings
    const hydrationErrors = consoleErrors.filter(error => 
      error.includes('hydration') || 
      error.includes('Hydration') ||
      error.includes('client-side') ||
      error.includes('server-side')
    );
    
    expect(hydrationErrors).toHaveLength(0);
  });
});