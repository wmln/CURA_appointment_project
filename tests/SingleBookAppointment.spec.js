import { test, expect } from '@playwright/test';
import POManager from '../page_objects/POManager';


let page;
let poManager;

test.beforeAll(async ({ browser }) => {
    // Launch a new browser page
    page = await browser.newPage();
    poManager = new POManager(page);

    // Login steps
    const loginPage = poManager.getLoginPage();
    await loginPage.navigate();
    await expect(page).toHaveTitle("CURA Healthcare Service");
    await loginPage.clickMakeAppointment();
    const username = await page.getByPlaceholder("Username").first().inputValue();
    const password = await page.getByPlaceholder("Password").first().inputValue();
    await loginPage.login(username, password);

});

test('Book Appointment', async () => {
    // Book appointment
    const dropDownFacility = "Hongkong";
    const applyReadmission = "Yes";
    const healthcareProgram = "Medicaid";
    const date = { day: "1", month: "6", year: "2024" };
    const comment = "This is a comment about the patient";

    const bookAppointment = await poManager.getBookAppointment();
    await bookAppointment.selectDropDownFacility(dropDownFacility);
    await bookAppointment.selectCheckboxApplyReadmission(applyReadmission);
    await expect(page.locator("#chk_hospotal_readmission")).toBeChecked();
    await bookAppointment.selectRadioButtonHealthcareProgram(healthcareProgram);
    // padStart ensures the string is at least 2 characters long, even when date comes as a single digit, adding a leading zero
    const dateString = `${date.day.padStart(2, '0')}/${date.month.padStart(2, '0')}/${date.year}`;
    await bookAppointment.selectCalendarDate(dateString);
    await bookAppointment.inputTextComment(comment);
    await bookAppointment.confirmBookAppointment();

    // Confirmation page assertions
    const confirmationTitle = await page.locator(".text-center h2").textContent();
    expect(confirmationTitle.toLowerCase()).toContain("confirmation");
    const confirmationFacility = await page.locator("#facility").textContent();
    expect(confirmationFacility.toLowerCase()).toContain(dropDownFacility.toLowerCase());
    const confirmationReadmission = await page.locator("#hospital_readmission").textContent();
    expect(confirmationReadmission.toLowerCase()).toContain(applyReadmission.toLowerCase());
    const confirmationHealthCareProgram = await page.locator("#program").textContent();
    expect(confirmationHealthCareProgram.toLowerCase()).toContain(healthcareProgram.toLowerCase());
    const retrievedDate = await page.locator("#visit_date").textContent();
    expect(retrievedDate).toBe(dateString);
    const confirmationComment = await page.locator("#comment").textContent();
    expect(confirmationComment.toLocaleLowerCase().trim()).toBe(comment.toLowerCase().trim());
    await page.locator(".btn-default").click();

});
