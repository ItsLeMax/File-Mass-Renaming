const fs = require("fs");
const logger = require("./util/logger.js");

try {

    const recents = require("../data/recent.json");

    // Undo each folder...

    for (const filePath of Object.keys(recents)) {

        // ...from each file

        for (const fileData of recents[filePath]) {
            fs.renameSync(`${filePath}/${fileData.newName}`, `${filePath}/${fileData.originalName}`);
            logger.success(`${fileData.newName} -> ${fileData.originalName}`);
        }

    }

    // Clear recent.json since it has been undone anyway

    fs.writeFileSync(`../data/recent.json`, JSON.stringify({}), () => { });
    logger.success("Renaming undone successfully. | Umbenennung erfolgreich rückgängig gemacht.");

} catch (error) {
    logger.error("An error occured: | Ein Fehler ist aufgetreten:" + "\n" + error);
}