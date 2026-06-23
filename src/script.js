const readline = require("readline");
const fs = require("fs");
const { RECENTS_PATH, ARCHIVE_PATH } = require("./config/config.js");
const logger = require("./util/logger.js");

try {

    const startPath = process.argv[2];
    const recursion = process.argv[3];
    const toReplace = process.argv[4];
    const replaceWith = process.argv[5];

    // Human error handling

    if (!fs.existsSync(startPath)) {
        logger.error("The entered path does not exist." + "\n" + "Der angegebene Pfad existiert nicht.");
        return;
    }

    if (!toReplace) {
        logger.error("You did not enter a RegEx" + "\n" + "Du hast keine RegEx angegeben.");
        return;
    }

    // Loop through files and log every planned rename

    logger.warn("The following files will be renamed:" + "\n" + "Folgende Dateien werden umbenannt:");

    loopThroughFiles(startPath, (originalName, newName) => {
        logger.warn(`${originalName} -> ${newName}`);
    });

    // Ask if the renaming should be started

    const readLine = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readLine.question("Are you sure? | Bist du dir sicher? < 1 (yes) | 0 (no) >: ", (answer) => {

        // Case of cancellation

        if (answer.trim() != "1") {
            logger.error("Input aborted." + "\n" + "Die Eingabe wurde abgebrochen.");
            return;
        }

        // Storing every file name change here

        const data = {};

        // Renaming process: Create folder

        if (!fs.existsSync("../data"))
            fs.mkdirSync("../data");

        // Create json file to store every rename (for undo)

        if (!fs.existsSync(RECENTS_PATH))
            fs.writeFileSync(RECENTS_PATH, JSON.stringify({}));

        // Archive old json if existing

        if (Object.keys(require(RECENTS_PATH)).length) {

            if (!fs.existsSync(ARCHIVE_PATH))
                fs.mkdirSync(ARCHIVE_PATH);

            fs.renameSync(RECENTS_PATH, `${ARCHIVE_PATH}/${new Date().getTime()}.json`);

        }

        // Renaming block

        loopThroughFiles(startPath, (originalName, newName, target) => {

            const targetsFolder = target.substr(0, target.lastIndexOf("\\"));

            // Array for each file

            if (!data[targetsFolder])
                data[targetsFolder] = [];

            // Array contains an object with previous name and new name

            data[targetsFolder].push({
                originalName: originalName,
                newName: newName,
            });

            // Actual renaming

            fs.renameSync(target, `${targetsFolder}/${newName}`);
            fs.writeFileSync(RECENTS_PATH, JSON.stringify(data, null, "\t"), () => { });

            // Logging

            logger.success(`${originalName} -> ${newName}`);

        });

        logger.success("Renamed all files successfully." + "\n" + "Dateien wurden allesamt erfolgreich umbenannt.");
        readLine.close();

    });

    /**
     * @description Loops (recursively) trough the entered path and executes a function
     * @author ItsLeMax
     * @param { String } path Path with files and potentially folders
     * @param { Function } fn Function, which is supposed to be executed
     */
    function loopThroughFiles(path, fn) {

        // Loop through files of path

        for (const originalName of fs.readdirSync(path)) {

            const target = `${path}\\${originalName}`;

            // If the file is a folder, loop through that aswell

            if (recursion == 1 && fs.statSync(target).isDirectory())
                loopThroughFiles(target, fn);

            const newName = originalName.replace(new RegExp(toReplace, "g"), replaceWith);

            if (originalName == newName)
                continue;

            // Mostly an individual arrow function that gets executed here

            fn(originalName, newName, target);

        }

    }

} catch (error) {
    logger.error("An error occured." + "\n" + "Ein Fehler ist aufgetreten." + error);
}