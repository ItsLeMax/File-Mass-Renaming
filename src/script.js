const readline = require("readline");
const fs = require("fs");

const COLORS = {
    success: "\x1b[32m",
    warning: "\x1b[33m",
    error: "\x1b[31m",
    reset: "\x1b[0m"
};

const RECENTS_PATH = "../data/recent.json";
const ARCHIVE_PATH = "../data/archive";

try {

    const startPath = process.argv[2];
    const recursion = process.argv[3];
    const toReplace = process.argv[4];
    const replaceWith = process.argv[5];

    // Human error handling

    if (!fs.existsSync(startPath)) {

        console.error(
            COLORS.error +
            "The entered path does not exist." + "\n" +
            "Der angegebene Pfad existiert nicht." +
            COLORS.reset
        );

        return;

    }

    if (!toReplace) {

        console.error(
            COLORS.error +
            "You did not enter a RegEx" + "\n" +
            "Du hast keine RegEx angegeben." +
            COLORS.reset
        );

        return;
    }

    // Loop through files and log every planned rename

    console.log(
        COLORS.warning +
        "The following files will be renamed:" + "\n" +
        "Folgende Dateien werden umbenannt:" +
        COLORS.reset
    );

    loopThroughFiles(startPath, (originalName, newName) => {
        console.log(
            COLORS.warning +
            `${originalName} -> ${newName}` +
            COLORS.reset
        );
    });

    // Ask if the renaming should be started

    const readLine = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readLine.question("Are you sure? | Bist du dir sicher? < 1 (yes) | 0 (no) >: ", (answer) => {

        // Case of cancellation

        if (answer.trim() != "1") {

            console.log(
                COLORS.error +
                "Input aborted." + "\n" +
                "Die Eingabe wurde abgebrochen." +
                COLORS.reset
            );

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

            console.log(
                COLORS.success +
                `${originalName} -> ${newName}` +
                COLORS.reset
            );

        });

        console.log(
            COLORS.success +
            "Renamed all files successfully." + "\n" +
            "Dateien wurden allesamt erfolgreich umbenannt." +
            COLORS.reset
        );

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

    console.log(
        COLORS.error +
        "An error occured." + "\n" +
        "Ein Fehler ist aufgetreten." +
        COLORS.reset + "\n" + error
    );

}