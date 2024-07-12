const fs = require("fs");
const colors = {
    success: "\x1b[32m",
    reset: "\x1b[0m"
};

try {
    const recents = require("../data/recent.json");

    for (const filePath of Object.keys(recents)) {
        for (const fileData of recents[filePath]) {
            fs.renameSync(`${filePath}/${fileData.newName}`, `${filePath}/${fileData.originalName}`);

            console.log(
                colors.success +
                `${fileData.newName} -> ${fileData.originalName}` +
                colors.reset
            );
        }
    }

    fs.writeFileSync(`../data/recent.json`, JSON.stringify({}), () => { });

    console.log(
        colors.success +
        "Renaming undone successfully." + "\n" +
        "Umbenennung erfolgreich rückgängig gemacht." +
        colors.reset
    );
} catch (error) {
    console.error(
        "\x1b[31m" +
        "An error occured." + "\n" +
        "Ein Fehler ist aufgetreten." +
        colors.reset + "\n" + error
    );
}