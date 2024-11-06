class LoginPage {
    constructor(page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto("https://katalon-demo-cura.herokuapp.com/");  
    }

    async clickMakeAppointment(){
        await this.page.locator("#btn-make-appointment").click();
    }

    async login(username, password) {
        const userNameField = this.page.getByPlaceholder("Username").last();
        const passwordField = this.page.getByPlaceholder("Password").last();
        await userNameField.fill(username);
        await passwordField.fill(password);
        await this.page.locator("button[id*='login']").click(); // Xpath would be //button[contains(@id, 'login')] 
    }
}

export default LoginPage;
