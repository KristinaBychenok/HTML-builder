const fs = require("fs");
const path = require("path");
const process = require("process");
const readline = require("readline");

const pathTXT = path.join(__dirname, "text.txt");
const myWriteFile = fs.createWriteStream(pathTXT, "utf8");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

var recursiveAsyncReadLine = function () {
  rl.question("Enter your text or 'exit': ", function (answer) {
    if (answer == "exit") {
      return rl.close();
    }
    myWriteFile.write(`${answer}\n`);
    recursiveAsyncReadLine();
  });
};

recursiveAsyncReadLine();

rl.on("close", function saveInput() {
  console.log("BYE BYE !!!");
  process.exit(0);
});
