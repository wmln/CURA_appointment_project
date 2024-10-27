# Automation Project: CURA Healthcare Service

## Overview
This automation project demonstrates testing capabilities using Playwright with JavaScript and ExcelJS to enhance my portfolio. The project focuses on automating the appointment booking process for the CURA Healthcare Service application.

## Technologies Used
- **Playwright**: A Node.js library for browser automation.
- **JavaScript**: The programming language used for writing the test scripts.
- **ExcelJS**: A library for reading data from Excel files, utilized to manage appointment data.

## Project Structure
```plaintext
/tests
├── Login.spec.js
├── SingleBookAppointment.spec.js
└── MultipleBookAppointments.spec.js
```

## Test Files
### Login.spec.js
- Tests the login functionality of the CURA application.
- Validates both successful and failed login scenarios.

### SingleBookAppointment.spec.js
- Automates the booking of a single appointment.
- Validates the confirmation page and details of the booked appointment.

### MultipleBookAppointments.spec.js
- Reads appointment data from an Excel file.
- Automates the booking process for multiple appointments based on the data.
- Validates that all appointments are successfully booked and recorded in the appointment history.

## Getting Started

### Prerequisites
1. Install Node.js on your machine.
2. Set up a new Playwright project by running:
   ```bash
   npm init playwright
3. Install the required packages:
   ```bash
   npm install exceljs

### Running the Tests
1. Clone this repository or download the project files.
2. Navigate to the project directory in your terminal.
3. Run the tests using Playwright's test runner with the --headed flag to avoid issues, especially due to Firefox inconsistencies:
   ```bash
   npx playwright test --headed

## Excel Data Format
The Excel file used for multiple bookings should have the following structure:

| Facility | Readmission | Healthcare Program | Date       | Comment                    |
|----------|-------------|--------------------|------------|----------------------------|
| Hongkong | Yes         | Medicare            | 01/06/2024 | First appointment comment   |
| Tokyo    | No          | Medicaid            | 15/06/2024 | Second appointment comment  |
| Seoul    | Yes         | None                | 20/06/2024 | Third appointment comment   |

Ensure the file path in `MultipleBookAppointments.spec.js` points to your actual Excel file.
