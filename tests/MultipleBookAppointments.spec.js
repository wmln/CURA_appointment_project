import { test, expect } from '@playwright/test';
import POManager from '../page_objects/POManager';
import { readExcelData } from '../utils/excelReader';


let page;
let poManager;
let loginPage;
let appointmentHistoryPage;

test.beforeAll(async ({ browser }) => {
    // Create a new browser context with specified properties 
    // Piece of code included to avoid firefox issue on --headed mode
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        isMobile: false,
    });

    // Launch a new browser page
    page = await context.newPage();
    poManager = new POManager(page);

    // Login steps
    loginPage = poManager.getLoginPage();
    await loginPage.navigate();
    await expect(page).toHaveTitle("CURA Healthcare Service");
    await loginPage.clickMakeAppointment();
    const username = await page.getByPlaceholder("Username").first().inputValue();
    const password = await page.getByPlaceholder("Password").first().inputValue();
    await loginPage.login(username, password);

});

test('Multiple Book Appointments', async () => {
<<<<<<< HEAD
    // Read data from the Excel file 
    const appointments = await readExcelData("./data/cura_project_appointments.xlsx"); // Update with your Excel file path
    const bookAppointmentPage = await poManager.getBookAppointmentPage();
=======
    // Read data from the Excel file
    const filePath = "YOUR/FILE/PATH/HERE"; // Update with your Excel file path
    const appointments = await readExcelData(filePath);
    const bookAppointment = await poManager.getBookAppointment();
>>>>>>> c5557765b3be7a1ec0b41194bfacf9ed7f3fc684

    for (const { dropDownFacility, applyReadmission, healthcareProgram, date, comment } of appointments) {
        await loginPage.clickMakeAppointment(); // Click to make a new appointment
        await page.locator("#combo_facility").waitFor({ state: 'visible' });
        await bookAppointmentPage.selectDropDownFacility(dropDownFacility);
        await bookAppointmentPage.selectCheckboxApplyReadmission(applyReadmission);
        if (applyReadmission.toLowerCase() === 'yes') {
            await expect(page.locator("#chk_hospotal_readmission")).toBeChecked();
        } else {
            await expect(page.locator("#chk_hospotal_readmission")).not.toBeChecked();
        }
        await bookAppointmentPage.selectRadioButtonHealthcareProgram(healthcareProgram);
        await bookAppointmentPage.selectCalendarDate(date);
        await bookAppointmentPage.inputTextComment(comment);
        await bookAppointmentPage.confirmBookAppointment();
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
        const [day, month, year] = date.split('/'); // Split date into components
        const expectedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
        expect(retrievedDate).toBe(expectedDate);
        const confirmationComment = await page.locator("#comment").textContent();
        expect(confirmationComment.toLowerCase().trim()).toBe(comment.toLowerCase().trim());
        await page.locator(".btn-default").click(); // Click on the Go to Homepage button to return to the appointment page
    }

    // Verify Appointment History
    appointmentHistoryPage = await poManager.getAppointmentHistoryPage();
    await appointmentHistoryPage.navigate();
    await page.locator(".panel-heading").first().waitFor({ state: 'visible' });
    let historyPageAppointmentsCount = 0;

    for (const { dropDownFacility: historyDropDownFacility, applyReadmission: historyApplyReadmission, healthcareProgram: historyHealthcareProgram, date: historyDate, comment: historyComment } of appointments) {
        const facilityLocator = await appointmentHistoryPage.retrieveFacility(historyPageAppointmentsCount);
        expect(await facilityLocator.textContent()).toContain(historyDropDownFacility);

        const applyReadmissionLocator = await appointmentHistoryPage.retrieveApplyReadmission(historyPageAppointmentsCount);
        expect(await applyReadmissionLocator.textContent()).toContain(historyApplyReadmission);

        const healthcareProgramLocator = await appointmentHistoryPage.retrieveHealthcareProgram(historyPageAppointmentsCount);
        expect(await healthcareProgramLocator.textContent()).toContain(historyHealthcareProgram);

        const historyDateLocator = await appointmentHistoryPage.retrieveHistoryDate(historyPageAppointmentsCount);
        // Parse the date for comparison
        const [day, month, year] = historyDate.split('/'); // Split the date 
        const expectedHistoryDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
        expect(await historyDateLocator.textContent()).toBe(expectedHistoryDate);

        const commentLocator = await appointmentHistoryPage.retrieveComment(historyPageAppointmentsCount);
        expect(await commentLocator.textContent()).toContain(historyComment);
        historyPageAppointmentsCount++;
    }
});



