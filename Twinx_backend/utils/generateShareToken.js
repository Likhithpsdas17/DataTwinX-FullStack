const crypto = require("crypto");

const generateShareToken = () => crypto.randomBytes(32).toString("hex");

module.exports = generateShareToken;
