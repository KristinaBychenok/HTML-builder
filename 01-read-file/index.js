const fs = require('fs');
const path = require('path');

const pathTXT = path.join(__dirname, 'text.txt')

const stream = fs.createReadStream(pathTXT, 'utf8');
stream.on('data', function(text){
    console.log(text)
})