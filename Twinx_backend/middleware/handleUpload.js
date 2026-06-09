const upload = require("../config/upload");
const ApiError = require("../utils/ApiError");

const handleUpload = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      return next(err);
    }

    if (!req.file) {
      return next(new ApiError(400, "No file uploaded"));
    }

    next();
  });
};

module.exports = handleUpload;
