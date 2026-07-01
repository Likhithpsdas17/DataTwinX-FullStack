const getBaseUrl = () => {
  return (
    process.env.BACKEND_URL?.replace(/\/$/, "") ||
    `http://localhost:${process.env.PORT || 8080}`
  );
};

module.exports = getBaseUrl;