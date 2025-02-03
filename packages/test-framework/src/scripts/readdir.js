/* eslint-disable no-console */
const fs = require('fs');

function readdir(directoryPath) {
    console.log('\n\n');
    console.log({ directoryPath });

    fs.readdirSync(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            console.log(file);
        });
    });

    console.log('\n\n');
}

module.exports = readdir;
