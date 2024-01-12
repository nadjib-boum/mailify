const fs = require('fs');


class FileUtil {

  read(filePath) {
    try {

      if (!filePath) throw new Error("No file path is provided");

      const data = fs.readFileSync(filePath, 'utf8');
      
      return data.toString();
      
    } catch (err) {
      return Promise.reject(err);
    }
  }

}

module.exports = {
  FileUtil: new FileUtil(),
}