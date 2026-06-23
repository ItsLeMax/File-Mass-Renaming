const { COLORS } = require("../config/config.js");

module.exports = {

    /**
     * @description Writes an error message into the console
     * @author ItsLeMax
     * @param { String } message message for the error
     * @since 1.1.2
     */
    error(message) {
        console.log(COLORS.error, message, COLORS.reset);
    },

    /**
     * @description Writes a warning message into the console
     * @author ItsLeMax
     * @param { String } message message for the warning
     * @since 1.1.2
     */
    warn(message) {
        console.log(COLORS.warning, message, COLORS.reset);
    },

    /**
     * @description Writes a success message into the console
     * @author ItsLeMax
     * @param { String } message message of success
     * @since 1.1.2
     */
    success(message) {
        console.log(COLORS.success, message, COLORS.reset);
    }

};