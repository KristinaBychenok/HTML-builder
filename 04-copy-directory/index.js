const { unlink } = require("fs");
const { mkdir, readdir, copyFile } = require("fs/promises");
const path = require("path");

const pathTXT = path.join(__dirname, "files");
const copyPathTXT = path.join(__dirname, "files-copy");

(async function copyFiles() {
  try {
    await mkdir(copyPathTXT, { recursive: true }, (err) => {
      if (err) throw err;
    });
    const files = await readdir(pathTXT, { withFileTypes: true });
    const copyFiles = await readdir(copyPathTXT, { withFileTypes: true });
    for (const copyFile of copyFiles) {
      unlink(path.join(copyPathTXT, copyFile.name), (err) => {
        if (err) throw err;
      });
    }
    for (const file of files) {
      await copyFile(
        `${pathTXT}\\${file.name}`,
        `${copyPathTXT}\\${file.name}`
      );
    }
  } catch {
    console.log("The file could not be copied");
  }
})();
