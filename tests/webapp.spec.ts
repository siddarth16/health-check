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
    await expect(page.locator('label:has-text("Height")')).toBeVisible();
    await expect(page.locator('label:has-text("Weight")')).toBeVisible();
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
    await expect(page.locator('label:has-text("Sex")')).toBeVisible();
    await expect(page.locator('label:has-text("Activity Level")')).toBeVisible();
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
    await expect(page.locator('text=Target Calories')).toBeVisible();
    await expect(page.locator('text=Macro Distribution')).toBeVisible();
  });

  test('should navigate to Health Check page', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Click on Health Check link
    await page.locator('a:has-text("Health Check")').click();
    
    // Check URL and content
    await expect(page).toHaveURL(`${BASE_URL}/health-check`);
    await expect(page.locator('h1')).toContainText('Health Check');
    await expect(page.locator('text=comprehensive overview')).toBeVisible();
    await expect(page.locator('text=Health Check Assessment')).toBeVisible();
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

  test('all calculator pages should have functional forms', async ({ page }) => {
    const calculatorTests = [
      { path: '/calculators/bmi', selector: 'label:has-text("Height")' },
      { path: '/calculators/calories', selector: 'label:has-text("Activity Level")' },
      { path: '/calculators/macros', selector: 'label:has-text("Target Calories")' },
      { path: '/health-check', selector: 'text=Health Check Assessment' }
    ];

    for (const test of calculatorTests) {
      await page.goto(`${BASE_URL}${test.path}`);
      await expect(page.locator(test.selector)).toBeVisible();
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

  test('should complete health-check flow and display results', async ({ page }) => {
    // Navigate to health check page
    await page.goto(`${BASE_URL}/health-check`);
    
    // Verify the form is visible
    await expect(page.locator('text=Health Check Assessment')).toBeVisible();
    await expect(page.locator('text=Step 1 of 4: Basics')).toBeVisible();
    
    // Step 1: Fill out basic information
    await page.locator('button:has-text("Male")').click();
    await page.locator('input[placeholder="30"]').fill('25');
    await page.locator('input[placeholder="175"]').fill('180');
    await page.locator('input[placeholder="70"]').fill('75');
    
    // Go to next step
    await page.locator('button:has-text("Next")').click();
    await expect(page.locator('text=Step 2 of 4: Activity')).toBeVisible();
    
    // Step 2: Select activity level
    await page.locator('button:has-text("Moderately Active")').click();
    
    // Go to next step
    await page.locator('button:has-text("Next")').click();
    await expect(page.locator('text=Step 3 of 4: Goal')).toBeVisible();
    
    // Step 3: Select goal
    await page.locator('button:has-text("Lose Weight")').click();
    
    // Go to review step
    await page.locator('button:has-text("Next")').click();
    await expect(page.locator('text=Step 4 of 4: Review')).toBeVisible();
    
    // Verify review information
    await expect(page.locator('text=Sex: Male')).toBeVisible();
    await expect(page.locator('text=Age: 25 years')).toBeVisible();
    await expect(page.locator('text=Height: 180 cm')).toBeVisible();
    
    // Submit and navigate to results
    await page.locator('button:has-text("Calculate Results")').click();
    
    // Should be redirected to results page with query params
    await expect(page).toHaveURL(/\/results\?.*height=180.*weight=75.*age=25.*sex=male.*activityLevel=moderately_active.*goalType=lose/);
    
    // Verify results are displayed
    await expect(page.locator('h1')).toContainText('Your Health Check Results');
    await expect(page.locator('text=Male, 25 years old')).toBeVisible();
    
    // Check that metrics are calculated and displayed
    await expect(page.locator('text=Body Mass Index')).toBeVisible();
    await expect(page.locator('text=Basal Metabolic Rate')).toBeVisible();
    await expect(page.locator('text=Daily Energy Needs')).toBeVisible();
    await expect(page.locator('text=Target Calories')).toBeVisible();
    
    // Check macro breakdown is displayed
    await expect(page.locator('text=Recommended Macro Distribution')).toBeVisible();
    await expect(page.locator('text=Carbohydrates')).toBeVisible();
    await expect(page.locator('text=Protein')).toBeVisible();
    await expect(page.locator('text=Fat')).toBeVisible();
    
    // Check share actions are present
    await expect(page.locator('button:has-text("Copy URL")')).toBeVisible();
    await expect(page.locator('button:has-text("Print")')).toBeVisible();
  });
});