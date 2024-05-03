const readline = require('readline');
const fs = require("fs");

const colors = {
    success: "\x1b[32m",
    error: "\x1b[31m",
    reset: "\x1b[0m"
};
const filePath = "../data/recent.json";

try {
    const path = process.argv[2];
    const toReplace = process.argv[3];
    const replaceWith = process.argv[4];

    if (!fs.existsSync(path)) {
        console.error(
            colors.error +
            "The entered path does not exist.", "Der angegebene Pfad existiert nicht." + colors.reset
        );
        return;
    }

    if (!toReplace) {
        console.error(
            colors.error +
            "You did not enter a RegEx", "Du hast keine RegEx angegeben." + colors.reset
        );
        return;
    }

    /**
     * @description
     * Looped durch den angegebenen Pfad und führt eine Funktion aus
     * 
     * Loops trough the entered path and executes a function

     * @author ItsLeMax

     * @param { Function } fn
     * Funktion, welche ausgeführt werden soll
     * 
     * Function, which is supposed to be executed
     */
    const loop = (fn) => {
        for (const file of fs.readdirSync(path)) {
            fn(file, (() => file.replace(new RegExp(toReplace), replaceWith))());
        }
    }

    console.log(
        colors.success +
        "The following files will be renamed", "Folgende Dateien werden umbenannt:" + colors.reset
    );

    const newNames = new Array;
    loop((originalName, newName) => {
        newNames.push(newName);
        console.log(
            colors.success +
            `${originalName} -> ${newName}` +
            colors.reset
        );
    });

    if ((new Set(newNames)).size != newNames.length) {
        console.error(
            colors.error +
            "Some files would get the same name and file type and potentially overwrite each other! The process aborted.",
            "Einige Dateien würden den gleichen Namen erhalten mit gleichem Dateityp und sich somit potenziell selbst überschreiben! Der Prozess wurde abgebrochen." +
            colors.reset
        );
        return;
    }

    const readLine = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readLine.question('Are you sure? | Bist du dir sicher? < 1 (yes) | 0 (no) >: ', (answer) => {
        if (answer.trim() == "1") {
            const data = new Array;

            loop((originalName, newName) => {
                data.push({
                    originalName: originalName,
                    newName: newName
                });
                fs.renameSync(`${path}/${originalName}`, `${path}/${newName}`);

                console.log(
                    colors.success +
                    "Renaming successful!", "Umbenennung erfolgreich!", `${originalName} -> ${newName}` + colors.reset
                );
            });

            if (Object.keys(require(filePath)).length) {
                fs.renameSync(filePath, `../data/${new Date().getTime()}.json`);
            }
            fs.writeFileSync(filePath, JSON.stringify({
                path: path,
                data: data
            }, null, "\t"), () => { });
        } else {
            console.log(
                colors.error +
                "Input aborted.", "Die Eingabe wurde abgebrochen." + colors.reset
            );
        }
        readLine.close();
    });
} catch (error) {
    console.log(colors.error + "An error occured.", "Ein Fehler ist aufgetreten." + colors.reset + "\n" + error);
}