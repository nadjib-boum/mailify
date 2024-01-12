const fs = require('fs');
const csv = require('csv-parser');


class CSVUtil {

  fetch(filePath, fields) {
    return new Promise((resolve, reject) => {
      if (!fields || !fields.length) reject(new Error("CSV fields are not provided"))
      if (!filePath) reject(new Error("CSV file is not provided"))
      const data = [];
      fs.createReadStream(filePath)
        .pipe(csv(fields))
        .on('data', (row) => {
          data.push(row);
        })
        .on('end', () => {
          resolve(data.splice(1));
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
}

module.exports = {
  CSVUtil: new CSVUtil(),
}