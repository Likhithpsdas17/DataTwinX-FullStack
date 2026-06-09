const asyncHandler = require("../utils/asyncHandler");
const twinService = require("../services/twinService");

const getTimeline = asyncHandler(async (req, res) => {
  const result = await twinService.getTimeline(
    req.user._id,
    req.params.twinId
  );

  res.status(200).json({
    success: true,
    data: result,
  });
});

const getTrust = asyncHandler(async (req, res) => {
  const result = await twinService.getTrust(req.user._id, req.params.twinId);

  res.status(200).json({
    success: true,
    data: result,
  });
});

module.exports = { getTimeline, getTrust };
