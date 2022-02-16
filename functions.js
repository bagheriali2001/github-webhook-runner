const path = require('path');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const folderChecker = async (pathDir) => {
    let files = [];
    const directoryPath = path.join(__dirname, pathDir);
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        files.forEach(function (file) {
            console.log(file)
            files.push(file);
        });
    });
    return files
}

const doesFolderHave = async (repo, branch, folderPath) => {
    const files = await folderChecker(folderPath)
    if(files.includes(`${repo}-${branch}.sh`)) {
        return true
    }
    return false
}

const runScript = async (command) => {
    const { stdout, stderr } = await exec(command);
    if(stdout) console.log('stdout:', stdout);
    if(stderr) console.log('stderr:', stderr);
    return {stdout, stderr}
}

module.exports = {
    doesFolderHave,
    runScript
};