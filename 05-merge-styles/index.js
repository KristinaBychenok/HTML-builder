const fs = require("fs");
const path = require("path");
const { readdir } = require("fs/promises");

const pathStyles = path.join(__dirname, "styles");
const pathNewCss = path.join(__dirname, "project-dist\\bundle.css");

(async function bundleCSS() {
  try {
    const myWriteFile = fs.createWriteStream(pathNewCss, "utf8");
    const files = await readdir(pathStyles, { withFileTypes: true });
    let arr = [];
    let countOfCssFiles = 0;
    let count = 0;

    for (const file of files) {
      let extname = path.extname(file.name);
      if (extname === ".css" && file.isFile()) {
        countOfCssFiles++;
      }
    }

    for (const file of files) {
      let extname = path.extname(file.name);
      if (extname === ".css" && file.isFile()) {
        const stream = fs.createReadStream(
          `${pathStyles}\\${file.name}`,
          "utf8"
        );

        stream.on("data", function (text) {
          arr.push(text);
          count++;

          if (count === countOfCssFiles) {
            myWriteFile.write(arr.join(""));
          }
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
})();
