class AppointmentHistoryPage {
    constructor(page) {
        this.page = page;
    }

    async navigate() {
        await this.page.click('#menu-toggle');
        await this.page.getByRole('link', { name: 'History' }).click();
    }

    async retrieveFacility(historyPageAppointmentsIndex){
        return this.page.locator("#facility").nth(historyPageAppointmentsIndex);
    }

    async retrieveApplyReadmission(historyPageAppointmentsIndex){
        return this.page.locator("#hospital_readmission").nth(historyPageAppointmentsIndex);
    }

    async retrieveHealthcareProgram(historyPageAppointmentsIndex){
        return this.page.locator("#program").nth(historyPageAppointmentsIndex);
    }

    async retrieveHistoryDate(historyPageAppointmentsIndex){
        return this.page.locator(".panel-heading").nth(historyPageAppointmentsIndex);
    }

    async retrieveComment(historyPageAppointmentsIndex){
        return this.page.locator("#comment").nth(historyPageAppointmentsIndex);

    }
}
export default AppointmentHistoryPage;
