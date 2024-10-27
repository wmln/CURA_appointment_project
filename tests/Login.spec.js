import { test, expect } from '@playwright/test';

test('Correct Login', async ({ page }) => {

    await page.goto("https://katalon-demo-cura.herokuapp.com/");
    await expect(page).toHaveTitle("CURA Healthcare Service");
    await page.locator("#btn-make-appointment").click();
    const username = await page.getByPlaceholder("Username").first().inputValue();
    const password = await page.getByPlaceholder("Password").first().inputValue();
    await page.getByPlaceholder("Username").last().fill(username);
    await page.getByPlaceholder("Password").last().fill(password);
    await page.locator("button[id*='login']").click(); // Xpath would be //button[contains(@id, 'login')] 
    expect(await page.locator(".col-sm-12 h2").textContent()).toBe("Make Appointment");

});

test('Wrong Login validations', async ({ page }) => {

    await page.goto("https://katalon-demo-cura.herokuapp.com/");
    await expect(page).toHaveTitle("CURA Healthcare Service");
    await page.locator("#btn-make-appointment").click();
    const username = await page.getByPlaceholder("Username").first().inputValue();
    const password = await page.getByPlaceholder("Password").first().inputValue();

    // Both blank
    await page.getByPlaceholder("Username").last().fill("");
    await page.getByPlaceholder("Password").last().fill("");
    await page.locator("button[id*='login']").click();
    expect(await page.locator(".col-sm-12 p").last().textContent()).toContain("Login failed");

    // Username blank
    await page.getByPlaceholder("Username").last().clear();
    await page.getByPlaceholder("Password").last().clear();
    await page.getByPlaceholder("Username").last().fill("");
    await page.getByPlaceholder("Password").last().fill(password);
    await page.locator("button[id*='login']").click();
    expect(await page.locator(".col-sm-12 p").last().textContent()).toContain("Login failed");

    // Password blank
    await page.getByPlaceholder("Username").last().clear();
    await page.getByPlaceholder("Password").last().clear();
    await page.getByPlaceholder("Username").last().fill(username);
    await page.getByPlaceholder("Password").last().fill("");
    await page.locator("button[id*='login']").click();
    expect(await page.locator(".col-sm-12 p").last().textContent()).toContain("Login failed");

    // Wrong username and password
    await page.getByPlaceholder("Username").last().clear();
    await page.getByPlaceholder("Password").last().clear();
    await page.getByPlaceholder("Username").last().fill("JohnDoe");
    await page.getByPlaceholder("Password").last().fill("ThisIsNotAPasswor");
    await page.locator("button[id*='login']").click();
    expect(await page.locator(".col-sm-12 p").last().textContent()).toContain("Login failed");

    // Wrong username
    await page.getByPlaceholder("Username").last().clear();
    await page.getByPlaceholder("Password").last().clear();
    await page.getByPlaceholder("Username").last().fill("JohnDoe");
    await page.getByPlaceholder("Password").last().fill(password);
    await page.locator("button[id*='login']").click();
    expect(await page.locator(".col-sm-12 p").last().textContent()).toContain("Login failed");

    // Wrong password
    await page.getByPlaceholder("Username").last().clear();
    await page.getByPlaceholder("Password").last().clear();
    await page.getByPlaceholder("Username").last().fill(username);
    await page.getByPlaceholder("Password").last().fill("ThisIsNotAPasswor");
    await page.locator("button[id*='login']").click();
    expect(await page.locator(".col-sm-12 p").last().textContent()).toContain("Login failed");

    // Correct username and password
    await page.getByPlaceholder("Username").last().clear();
    await page.getByPlaceholder("Password").last().clear();
    await page.getByPlaceholder("Username").last().fill(username);
    await page.getByPlaceholder("Password").last().fill(password);
    await page.locator("button[id*='login']").click();
    expect(await page.locator(".col-sm-12 h2").textContent()).toBe("Make Appointment");

});
