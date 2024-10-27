import { test, expect } from '@playwright/test';
let page;

test.beforeAll(async ({ browser }) => {
    // Launch a new browser page
    page = await browser.newPage();

    // Login steps
    await page.goto("https://katalon-demo-cura.herokuapp.com/");
    await expect(page).toHaveTitle("CURA Healthcare Service");
    await page.locator("#btn-make-appointment").click();
    const username = await page.getByPlaceholder("Username").first().inputValue();
    const password = await page.getByPlaceholder("Password").first().inputValue();
    await page.getByPlaceholder("Username").last().fill(username);
    await page.getByPlaceholder("Password").last().fill(password);
    await page.locator("button[id*='login']").click();
});

test('Book Appointment', async () => {
 
    const dropDownFacility = "Hongkong";
    const applyReadmission = "Yes";
    const healthcareProgram = "Medicaid";
    const radioButton = page.locator("input[type='radio']");
    const date = { day: "1", month: "6", year: "2024" };
    const comment = "This is a comment about the patient";
    const options = await page.locator('#combo_facility option').allTextContents();
    const matchedOption = options.find(option => option.toLowerCase().includes(dropDownFacility.toLowerCase()));

    if (matchedOption) {
        await page.selectOption('#combo_facility', { label: matchedOption });
    } else {
        console.log('No matching option found.');
    }

    if (applyReadmission.toLowerCase() === "yes") {
        await page.locator("#chk_hospotal_readmission").click();
        expect(page.locator("#chk_hospotal_readmission")).toBeChecked();
    }

    for (let i = 0; i < await radioButton.count(); i++) {
        // Traverse from child to parent
        const optionRadio = await radioButton.nth(i).locator("..").textContent();
        if (optionRadio.toLowerCase().trim().includes(healthcareProgram.toLowerCase())) {
            await radioButton.nth(i).click();
            break;
        }

    }

    // Calendar
    await page.locator("#txt_visit_date").click();
    await page.locator(".datepicker-days .datepicker-switch").click();
    await page.locator(".datepicker-months .datepicker-switch").click();
    await page.locator(".datepicker-years span").filter({ hasText: date.year }).click();
    await page.locator(".datepicker-months span").nth(Number(date.month) - 1).click();
    // Backticks(`) enable string interpolation, using ${expression}. No need to concatenate (+) and escape (\)
    await page.locator(`//td[text() = "${date.day}"]`).first().click(); 
    await page.locator("#txt_comment").fill(comment);
    await page.locator("#btn-book-appointment").click();

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
    // padStart ensures the string is at least 2 characters long, even when date comes as a single digit, adding a leading zero
    const expectedDate = `${date.day.padStart(2, '0')}/${date.month.padStart(2, '0')}/${date.year}`;
    expect(retrievedDate).toBe(expectedDate);
    const confirmationComment = await page.locator("#comment").textContent();
    expect(confirmationComment.toLocaleLowerCase().trim()).toBe(comment.toLowerCase().trim());
    await page.locator(".btn-default").click();

});
