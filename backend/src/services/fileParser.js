const { parse } = require('csv-parse/sync');
const XLSX = require('xlsx');
const path = require('path');

function parseFile(buffer, originalname) {
  const ext = path.extname(originalname).toLowerCase();

  if (ext === '.csv') {
    const records = parse(buffer.toString(), {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    if (records.length === 0) {
      throw new Error('The file is empty or has no valid data rows.');
    }

    const headers = Object.keys(records[0]);
    const rows = records.map((record) => headers.map((h) => record[h]));
    return { headers, rows };
  }

  if (ext === '.xlsx') {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    if (jsonData.length === 0) {
      throw new Error('The file is empty or has no valid data rows.');
    }

    const headers = Object.keys(jsonData[0]);
    const rows = jsonData.map((record) => headers.map((h) => record[h]));
    return { headers, rows };
  }

  throw new Error('Unsupported file format. Only .csv and .xlsx are allowed.');
}

module.exports = { parseFile };
