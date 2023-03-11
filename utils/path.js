const fs = require('node:fs');

module.exports = {
    /**
     * This function selectes a random file from the provided folder path with optional
     * extentions to filter the selected files
     * @param {string} folder - folder to pick a random file from
     * @param {string[]} [extentions] - a list of file extention for the randomly selected file
     * @returns {string|false} - path to a random file from the folder filtered by selected extentions or false if no relevant files found
     */
    pickRandomFile: function (folder, extentions) {
        if (typeof folder !== 'string') {
            throw new Error('folder must be a string');
        }
        if (extentions !== undefined && !Array.isArray(extentions)) {
            throw new Error('optional argument extentions must be a string array if set');
        }
        try {
            const folderFiles = fs.readdirSync(folder);
            if (folderFiles.length===0) {
                // no files found, nothing to do
                return false;
            }
            let filteredFiles;
            if (extentions) {
                filteredFiles = folderFiles.filter(file => {
                    return extentions.some(ext => file.toLowerCase().endsWith(ext.toLowerCase()));
                });
            } else {
                filteredFiles = folderFiles;
            }
            if (filteredFiles.length===0) {
                // no files left, nothing to do
                return false;
            }
            const randIndex = Math.floor(Math.random() * filteredFiles.length);
            const randFile = filteredFiles[randIndex];
            const randFileRelativePath = folder.slice(-1) == '/' ? folder + randFile : folder + '/' + randFile;
            return randFileRelativePath;
        } catch (err) {
            console.error(err);
            return false;
        }
    },
}