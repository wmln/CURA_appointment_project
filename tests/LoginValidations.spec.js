import { test, expect } from '@playwright/test';
import POManager from '../page_objects/POManager';

let page;
let poManager;
let loginPage;

test.beforeAll(async ({ browser }) => {
    // Launch a new browser page
    page = await browser.newPage();
    poManager = new POManager(page);
    loginPage = poManager.getLoginPage();
});

test('Wrong Login validations', async () => {

    await loginPage.navigate();
    await expect(page).toHaveTitle("CURA Healthcare Service");
    await loginPage.clickMakeAppointment();
    const username = await page.getByPlaceholder("Username").first().inputValue();
    const password = await page.getByPlaceholder("Password").first().inputValue();

    // Both blank
    await loginPage.login("", "");
    expect(await page.locator(".col-sm-12 p").last().textContent()).toContain("Login failed");

    // Username blank
    await page.getByPlaceholder("Username").last().clear();
    await page.getByPlaceholder("Password").last().clear();
    await loginPage.login("", password);
    expect(await page.locator(".col-sm-12 p").last().textContent()).toContain("Login failed");

    // Password blank
    await page.getByPlaceholder("Username").last().clear();
    await page.getByPlaceholder("Password").last().clear();
    await loginPage.login(username, "");
    expect(await page.locator(".col-sm-12 p").last().textContent()).toContain("Login failed");

    // Wrong username and password
    await page.getByPlaceholder("Username").last().clear();
    await page.getByPlaceholder("Password").last().clear();
    await loginPage.login("JohnDoe", "ThisIsNotAPasswor");
    expect(await page.locator(".col-sm-12 p").last().textContent()).toContain("Login failed");

    // Wrong username
    await page.getByPlaceholder("Username").last().clear();
    await page.getByPlaceholder("Password").last().clear();
    await loginPage.login("JohnDoe", password);
    expect(await page.locator(".col-sm-12 p").last().textContent()).toContain("Login failed");

    // Wrong password
    await page.getByPlaceholder("Username").last().clear();
    await page.getByPlaceholder("Password").last().clear();
    await loginPage.login(username, "ThisIsNotAPasswor");
    expect(await page.locator(".col-sm-12 p").last().textContent()).toContain("Login failed");

    // Correct username and password
    await page.getByPlaceholder("Username").last().clear();
    await page.getByPlaceholder("Password").last().clear();
    await loginPage.login(username, password);
    expect(await page.locator(".col-sm-12 h2").textContent()).toBe("Make Appointment");

});
