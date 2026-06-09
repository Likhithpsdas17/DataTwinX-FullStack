const asyncHandler = require("../utils/asyncHandler");
const dashboardService = require("../services/dashboardService");

const getOverview = asyncHandler(async (req, res) => {
  const overview = await dashboardService.getOverview(req.user._id);

  res.status(200).json({
    success: true,
    data: overview,
  });
});

module.exports = { getOverview };
