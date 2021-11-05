const fs = require("fs");
const { readdir } = require("fs/promises");
const path = require("path");

const pathTXT = path.join(__dirname, "secret-folder");

(async function readFiles() {
  try {
    const files = await readdir(pathTXT, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        let extname = path.extname(file.name);

        fs.stat(`${pathTXT}\\${file.name}`, (error, stats) => {
          if (error) {
            console.log(error);
          } else {
            console.log(
              `${path.basename(file.name, extname)} - ${extname.slice(1)} - ${
                stats.size
              }b`
            );
          }
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
})();
