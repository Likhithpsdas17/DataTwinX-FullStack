const asyncHandler = require("../utils/asyncHandler");
const shareService = require("../services/shareService");

const accessShare = asyncHandler(async (req, res) => {
  const result = await shareService.accessShare(req.params.token, {
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

const downloadShare = asyncHandler(async (req, res) => {
  const file = await shareService.downloadShare(req.params.token, {
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
  });

  res.download(file.filePath, file.originalName, {
    headers: { "Content-Type": file.mimeType },
  });
});

module.exports = { accessShare, downloadShare };
