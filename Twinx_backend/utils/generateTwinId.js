const { v4: uuidv4 } = require("uuid");

const generateTwinId = () => {
  const shortUuid = uuidv4().replace(/-/g, "").slice(0, 8).toUpperCase();
  return `DTX-${shortUuid}`;
};

module.exports = generateTwinId;
