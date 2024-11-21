import { test, expect } from '@playwright/test';
import POManager from '../page_objects/POManager';

let page;
let poManager;
let loginPage;
let username;
let password;

test.beforeAll(async ({ browser }) => {
    // Launch a new browser page
    page = await browser.newPage();
    poManager = new POManager(page);
    loginPage = poManager.getLoginPage();
    await loginPage.navigate();
    await loginPage.clickMakeAppointment();
    username = await page.getByPlaceholder("Username").first().inputValue();
    password = await page.getByPlaceholder("Password").first().inputValue();
});

test('Wrong Login validations', async () => {

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

});

test('Correct Login validations', async () => {
    // Correct username and password
    await page.getByPlaceholder("Username").last().clear();
    await page.getByPlaceholder("Password").last().clear();
    await loginPage.login(username, password);
    expect(await page.locator(".col-sm-12 h2").textContent()).toBe("Make Appointment");

});