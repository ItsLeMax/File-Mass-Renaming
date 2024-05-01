const fs = require("fs");
const reset = "\x1b[0m";

try {
    const recent = require("../data/recent.json");
    for (const data of recent.data) {
        fs.renameSync(`${recent.path}/${data.newName}`, `${recent.path}/${data.originalName}`);
        console.log(
            "\x1b[32m" +
            "Renaming successful!", "Umbenennung erfolgreich!", `${data.newName} -> ${data.originalName}` + reset
        );
    }
    fs.writeFileSync(`../data/recent.json`, JSON.stringify({}), () => { });
} catch (error) {
    console.error("\x1b[31m" + "An error occured.", "Ein Fehler ist aufgetreten." + reset + "\n" + error);
}