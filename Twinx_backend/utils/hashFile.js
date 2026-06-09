const crypto = require("crypto");
const fs = require("fs");

const hashFile = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(fileBuffer).digest("hex");
};

module.exports = hashFile;
