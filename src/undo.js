const fs = require("fs");

const COLORS = {
    success: "\x1b[32m",
    reset: "\x1b[0m"
};

try {

    const recents = require("../data/recent.json");

    // Undo from each folder...

    for (const filePath of Object.keys(recents)) {

        // ...each file

        for (const fileData of recents[filePath]) {

            fs.renameSync(`${filePath}/${fileData.newName}`, `${filePath}/${fileData.originalName}`);

            console.log(
                COLORS.success +
                `${fileData.newName} -> ${fileData.originalName}` +
                COLORS.reset

            );

        }

    }

    // Clear recent.json since it has been undone anyway

    fs.writeFileSync(`../data/recent.json`, JSON.stringify({}), () => { });

    console.log(
        COLORS.success +
        "Renaming undone successfully." + "\n" +
        "Umbenennung erfolgreich rückgängig gemacht." +
        COLORS.reset
    );
} catch (error) {

    console.error(
        "\x1b[31m" +
        "An error occured." + "\n" +
        "Ein Fehler ist aufgetreten." +
        COLORS.reset + "\n" + error
    );

}