const fs = require("fs");
const { mkdir, readdir, copyFile } = require("fs/promises");
const path = require("path");
const process = require("process");

const pathProjectDist = path.join(__dirname, "project-dist");
const pathAssets = path.join(__dirname, "assets");
const pathAssetsCoppy = path.join(pathProjectDist, "assets");

(async function addNewFolders() {
  try {
    await mkdir(pathProjectDist, { recursive: true }, (err) => {
      if (err) throw err;
    });
    await mkdir(pathAssetsCoppy, { recursive: true }, (err) => {
      if (err) throw err;
    });
  } catch (err) {
    console.error(err);
  }
})();

let nameDirectory;

(async function copyFilesToAssets() {
  try {
    const filesAssets = await readdir(pathAssets, { withFileTypes: true });

    for (const fileDir of filesAssets) {
      await mkdir(
        `${pathAssetsCoppy}\\${fileDir.name}`,
        { recursive: true },
        (err) => {
          if (err) throw err;
        }
      );
      const filesInDerictory = await readdir(`${pathAssets}\\${fileDir.name}`, {
        withFileTypes: true,
      });
      for (const file of filesInDerictory) {
        await copyFile(
          `${pathAssets}\\${fileDir.name}\\${file.name}`,
          `${pathAssetsCoppy}\\${fileDir.name}\\${file.name}`
        );
      }
    }
    // async function copyAssets(directory) {
    //   try {
    //     for await (const file of directory) {
    //       if (file.isDirectory()) {
    //         await mkdir(
    //           `${pathAssetsCoppy}\\${file.name}`,
    //           { recursive: true },
    //           (err) => {
    //             if (err) throw err;
    //           }
    //         );
    //         nameDirectory = file.name;
    //         let files = await readdir(`${pathAssets}\\${nameDirectory}`, {
    //           withFileTypes: true,
    //         });
    //         copyAssets(files);
    //       } else {
    //         await copyFile(
    //           `${pathAssets}\\${nameDirectory}\\${file.name}`,
    //           `${pathAssetsCoppy}\\${nameDirectory}\\${file.name}`
    //         );
    //       }
    //     }
    //   } catch (err) {
    //     console.error(err);
    //   }
    // }
    // copyAssets(filesAssets);
  } catch (err) {
    console.error(err);
  }
})();

const pathStyles = path.join(__dirname, "styles");
const pathNewCss = path.join(pathProjectDist, "style.css");

(async function copyToStyleCss() {
  try {
    const cssWriteFile = fs.createWriteStream(pathNewCss, "utf8");
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
            cssWriteFile.write(arr.join(""));
          }
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
})();

const pathNewHTML = path.join(pathProjectDist, "index.html");
const pathTemplate = path.join(__dirname, "template.html");
const pathComponents = path.join(__dirname, "components");

(function addHTMLFile() {
  const htmlWriteFile = fs.createWriteStream(pathNewHTML, "utf8");
  const templateReadFile = fs.createReadStream(`${pathTemplate}`, "utf8");

  templateReadFile.on("data", function (text) {
    htmlWriteFile.write(text);
  });
  copyToHTML();
})();

async function copyToHTML() {
  try {
    let arr = [];

    const componentsDir = await readdir(pathComponents, {
      withFileTypes: true,
    });
    for (const file of componentsDir) {
      let extname = path.extname(file.name);
      let name = path.basename(file.name, extname);
      arr.push(name);
    }

    const newHtmlReadFile = fs.createReadStream(`${pathNewHTML}`, "utf8");

    newHtmlReadFile.on("data", function (texthtml) {
      let htmlArr = texthtml.split(`\n`);
      let trasformHTML;

      arr.forEach((componentItem) => {
        htmlArr.forEach((stringInHtml, index) => {
          if (stringInHtml.includes(`{{${componentItem}}}`)) {
            const componentRead = fs.createReadStream(
              `${pathComponents}\\${componentItem}.html`,
              "utf8"
            );
            componentRead.on("data", function (textComponent) {
              htmlArr[index] = `${textComponent}`;
              trasformHTML = htmlArr.join(`\n`);
              fs.writeFile(pathNewHTML, `${trasformHTML}`, function (error) {
                if (error) throw error;
              });
            });
          }
        });
      });
    });
  } catch (err) {
    console.error(err);
  }
}
