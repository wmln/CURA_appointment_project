import LoginPage from '../page_objects/LoginPage';
import BookAppointment from '../page_objects/BookAppointment';
import AppointmentHistoryPage from '../page_objects/AppointmentHistoryPage';

class POManager {
    constructor(page){
        this.loginPage = new LoginPage(page);
        this.bookAppointment = new BookAppointment(page);
        this.appointmentHistoryPage = new AppointmentHistoryPage(page);
    }
    
    getLoginPage(){
        return this.loginPage;
    }

    getBookAppointment(){
        return this.bookAppointment;
    }

    getAppointmentHistoryPage(){
        return this.appointmentHistoryPage;
    }

}

export default POManager;
