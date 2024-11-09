const ExcelJS = require('exceljs');

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
module.exports = { readExcelData };
