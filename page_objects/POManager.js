import LoginPage from '../page_objects/LoginPage';
import BookAppointmentPage from '../page_objects/BookAppointmentPage';
import AppointmentHistoryPage from '../page_objects/AppointmentHistoryPage';

class POManager {
    constructor(page){
        this.loginPage = new LoginPage(page);
        this.bookAppointmentPage = new BookAppointmentPage(page);
        this.appointmentHistoryPage = new AppointmentHistoryPage(page);
    }
    
    getLoginPage(){
        return this.loginPage;
    }

    getBookAppointmentPage(){
        return this.bookAppointmentPage;
    }

    getAppointmentHistoryPage(){
        return this.appointmentHistoryPage;
    }

}

export default POManager;
