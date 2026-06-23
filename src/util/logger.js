const { COLORS } = require("../config/config.js");

module.exports = {

    /**
     * @description Schreibt eine Fehlermeldung in die Konsole
     * @author ItsLeMax
     * @param { String } message Nachricht für die Fehlermeldung
     * @since 1.1.2 
     */
    error(message) {
        console.log(COLORS.error, message, COLORS.reset);
    },

    /**
     * @description Schreibt eine Warnmeldung in die Konsole
     * @author ItsLeMax
     * @param { String } message Nachricht für die Warnmeldung
     * @since 1.1.2 
     */
    warn(message) {
        console.log(COLORS.warning, message, COLORS.reset);
    },

    /**
     * @description Schreibt eine Erfolgsmeldung in die Konsole
     * @author ItsLeMax
     * @param { String } message Nachricht für die Erfolgsmeldung
     * @since 1.1.2 
     */
    success(message) {
        console.log(COLORS.success, message, COLORS.reset);
    }

};