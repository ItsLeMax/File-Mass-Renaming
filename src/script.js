const config = require("../run/config.json");
const readline = require("readline");
const fs = require("fs");

const colors = {
    success: "\x1b[32m",
    warning: "\x1b[33m",
    error: "\x1b[31m",
    reset: "\x1b[0m"
};
const recentsPath = "../data/recent.json";
const archive = "../data/archive";

try {
    const startPath = process.argv[2];
    const toReplace = process.argv[3];
    const replaceWith = process.argv[4];

    if (!fs.existsSync(startPath)) {
        console.error(
            colors.error +
            "The entered path does not exist." + "\n" +
            "Der angegebene Pfad existiert nicht." +
            colors.reset
        );
        return;
    }

    if (!toReplace) {
        console.error(
            colors.error +
            "You did not enter a RegEx" + "\n" +
            "Du hast keine RegEx angegeben." +
            colors.reset
        );
        return;
    }

    /**
     * @description
     * Looped (rekursiv) durch den angegebenen Pfad und führt eine Funktion aus
     * 
     * Loops (recursively) trough the entered path and executes a function
     *
     * @author ItsLeMax
     * 
     * @param { String } path
     * Pfad mit Dateien und potenziell Ordnern
     * 
     * Path with files and potentially folders
     *
     * @param { Function } fn
     * Funktion, welche ausgeführt werden soll
     * 
     * Function, which is supposed to be executed
     */
    const loopThroughFiles = (path, fn) => {
        for (const originalName of fs.readdirSync(path)) {
            const target = `${path}\\${originalName}`;
            if (config.subDirectories && fs.statSync(target).isDirectory()) {
                loopThroughFiles(target, fn);
            }

            const newName = originalName.replace(new RegExp(toReplace, "g"), replaceWith);
            if (originalName == newName) continue;

            fn(originalName, newName, target);
        }
    }

    console.log(
        colors.warning +
        "The following files will be renamed:" + "\n" +
        "Folgende Dateien werden umbenannt:" +
        colors.reset
    );

    loopThroughFiles(startPath, (originalName, newName) => {
        console.log(
            colors.warning +
            `${originalName} -> ${newName}` +
            colors.reset
        );
    });

    const readLine = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readLine.question("Are you sure? | Bist du dir sicher? < 1 (yes) | 0 (no) >: ", (answer) => {
        if (answer.trim() == "1") {
            const data = new Object;

            if (!fs.existsSync("../data")) {
                fs.mkdirSync("../data");
            }

            if (!fs.existsSync(recentsPath)) {
                fs.writeFileSync(recentsPath, JSON.stringify(new Object));
            }

            if (Object.keys(require(recentsPath)).length) {
                if (!fs.existsSync(archive)) {
                    fs.mkdirSync(archive);
                }

                fs.renameSync(recentsPath, `${archive}/${new Date().getTime()}.json`);
            }

            loopThroughFiles(startPath, (originalName, newName, target) => {
                const targetsFolder = target.substr(0, target.lastIndexOf("\\"));

                if (!data[targetsFolder]) {
                    data[targetsFolder] = new Array;
                }

                data[targetsFolder].push({
                    originalName: originalName,
                    newName: newName,
                });

                fs.renameSync(target, `${targetsFolder}/${newName}`);
                fs.writeFileSync(recentsPath, JSON.stringify(data, null, "\t"), () => { });

                console.log(
                    colors.success +
                    `${originalName} -> ${newName}` +
                    colors.reset
                );
            });

            console.log(
                colors.success +
                "Renamed all files successfully." + "\n" +
                "Dateien wurden allesamt erfolgreich umbenannt." +
                colors.reset
            );
        } else {
            console.log(
                colors.error +
                "Input aborted." + "\n" +
                "Die Eingabe wurde abgebrochen." +
                colors.reset
            );
        }

        readLine.close();
    });
} catch (error) {
    console.log(
        colors.error +
        "An error occured." + "\n" +
        "Ein Fehler ist aufgetreten." +
        colors.reset + "\n" + error
    );
}