const getBaseUrl = () => {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, "");
  }
  const port = process.env.PORT || 8080;
  return `http://localhost:${port}`;
};

module.exports = getBaseUrl;
