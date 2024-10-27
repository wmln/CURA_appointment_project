import { test, expect } from '@playwright/test';
const ExcelJS = require('exceljs');

let page;

// Read data from the Excel file using exceljs
async function readExcelData(filePath) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.worksheets[0]; // Assuming you want the first worksheet
    const data = [];

    // Iterate through rows starting from the second row
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber > 1) { // Skip header row 
            data.push({
                dropDownFacility: row.getCell(1).value,
                applyReadmission: row.getCell(2).value,
                healthcareProgram: row.getCell(3).value,
                date: String(row.getCell(4).value).trim(), // Ensure date is a trimmed string
                comment: row.getCell(5).value,
            });
        }
    });

    return data;
}

test.beforeAll(async ({ browser }) => {
    // Create a new browser context with specified properties 
    // Piece of code included to avoid firefox issue on --headed mode
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        isMobile: false,
    });

    // Launch a new browser page
    page = await context.newPage();

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

test('Multiple Book Appointments', async () => {
    // Read data from the Excel file
    const filePath =  "YOUR/FILE/PATH/HERE"; // Update with your Excel file path
    const appointments = await readExcelData(filePath);

    for (const { dropDownFacility, applyReadmission, healthcareProgram, date, comment } of appointments) {
        await page.locator("#btn-make-appointment").click(); // Click to make a new appointment
        await page.locator("#combo_facility").waitFor({ state: 'visible' });
        const radioButton = page.locator("input[type='radio']");
        const options = await page.locator("#combo_facility option").allTextContents();
        const matchedOption = options.find(option => option.toLowerCase().includes(dropDownFacility.toLowerCase()));

        if (matchedOption) {
            await page.selectOption("#combo_facility", { label: matchedOption });
        } else {
            console.log("No matching option found for facility:", dropDownFacility);
            continue;
        }

        if (applyReadmission.toLowerCase() === "yes") {
            await page.locator("#chk_hospotal_readmission").check();
            expect(await page.locator("#chk_hospotal_readmission").isChecked()).toBe(true);
        }


        for (let i = 0; i < await radioButton.count(); i++) {
            const optionRadio = await radioButton.nth(i).locator("..").textContent();
            if (optionRadio.toLowerCase().trim().includes(healthcareProgram.toLowerCase())) {
                await radioButton.nth(i).click();
                break;
            }
        }

        // Calendar
        const dateString = String(date).trim(); // Convert and trim the date string
        const [dayStr, monthStr, yearStr] = dateString.split('/'); // Split the date string into day, month, and year
        // Convert all 3 to integer and decimal base
        const day = parseInt(dayStr, 10);  
        const month = parseInt(monthStr, 10); 
        const year = parseInt(yearStr, 10); 
        await page.locator("#txt_visit_date").click();
        await page.locator(".datepicker-days .datepicker-switch").click();
        await page.locator(".datepicker-months .datepicker-switch").click();
        await page.locator(`.datepicker-years span:has-text("${year}")`).click();
        await page.locator(".datepicker-months span").nth(month - 1).click(); // Months are 0-indexed
        await page.locator(`//td[text() = '${day}']`).first().click();
        await page.locator("#txt_comment").fill(comment);
        await page.locator("#btn-book-appointment").click();
        await page.waitForSelector(".text-center h2", { state: 'visible' }); // Wait for the title to be visible

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
        const expectedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
        expect(retrievedDate).toBe(expectedDate);
        const confirmationComment = await page.locator("#comment").textContent();
        expect(confirmationComment.toLowerCase().trim()).toBe(comment.toLowerCase().trim());

        await page.locator(".btn-default").click(); // Click on the default button to return to the appointment page
    }

    // Verify Appointment History
    await page.locator("#menu-toggle").click();
    await page.getByRole('link', { name: 'History' }).click();
    await page.locator(".panel-heading").first().waitFor({ state: 'visible' });
    let appointmentsCount = 0;

    for (const { dropDownFacility: historyDropDownFacility, applyReadmission: historyApplyReadmission, healthcareProgram: historyHealthcareProgram, date, comment: historyComment } of appointments) {
        expect(await page.locator("#facility").nth(appointmentsCount).textContent()).toContain(historyDropDownFacility);
        expect(await page.locator("#hospital_readmission").nth(appointmentsCount).textContent()).toContain(historyApplyReadmission);
        expect(await page.locator("#program").nth(appointmentsCount).textContent()).toContain(historyHealthcareProgram);

        // Parse the date for comparison
        const retrievedHistoryDate = await page.locator(".panel-heading").nth(appointmentsCount).textContent();
        const [day, month, year] = date.split('/'); // Split the date 
        const expectedHistoryDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
        expect(retrievedHistoryDate).toBe(expectedHistoryDate);

        expect(await page.locator("#comment").nth(appointmentsCount).textContent()).toContain(historyComment);
        appointmentsCount++;
    }
});



