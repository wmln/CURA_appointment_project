class BookAppointmentPage {
    constructor(page) {
        this.page = page;
    }

    async selectDropDownFacility(dropDownFacility) {
        const options = await this.page.locator('#combo_facility option').allTextContents();
        const matchedOption = options.find(option => option.toLowerCase().includes(dropDownFacility.toLowerCase()));
        if (matchedOption) {
            await this.page.selectOption('#combo_facility', { label: matchedOption });
        } else {
            console.log('No matching option found.');
        }

    }

    async selectCheckboxApplyReadmission(applyReadmission) {
        if (applyReadmission.toLowerCase().trim() === "yes") {
            await this.page.locator("#chk_hospotal_readmission").click();
        }
    }

    async selectRadioButtonHealthcareProgram(healthcareProgram) {
        const radioButton = this.page.locator("input[type='radio']");
        for (let i = 0; i < await radioButton.count(); i++) {
            // Traverse from child to parent
            const optionRadio = await radioButton.nth(i).locator("..").textContent();
            if (optionRadio.toLowerCase().trim().includes(healthcareProgram.toLowerCase())) {
                await radioButton.nth(i).click();
                break;
            }

        }

    }

    async selectCalendarDate(date){
        const dateString = String(date).trim(); // Convert and trim the date string
        const [dayStr, monthStr, yearStr] = dateString.split('/'); // Split the date string into day, month, and year
        // Convert all 3 to integer and decimal base
        const day = parseInt(dayStr, 10);  
        const month = parseInt(monthStr, 10); 
        const year = parseInt(yearStr, 10); 
        await this.page.locator("#txt_visit_date").click();
        await this.page.locator(".datepicker-days .datepicker-switch").click();
        await this.page.locator(".datepicker-months .datepicker-switch").click();
        await this.page.locator(`.datepicker-years span:has-text("${year}")`).click();
        await this.page.locator(".datepicker-months span").nth(month - 1).click(); // Months are 0-indexed
        await this.page.locator(`//td[text() = '${day}']`).first().click();
        // Backticks(`) enable string interpolation, using ${expression}. No need to concatenate (+) and escape (\)
    }

    async inputTextComment(comment){
        await this.page.locator("#txt_comment").fill(comment);
    }

    async confirmBookAppointment(){
        await this.page.locator("#btn-book-appointment").click();
    }

}
export default BookAppointmentPage;
