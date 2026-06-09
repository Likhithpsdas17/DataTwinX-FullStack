const express = require("express");
const twinController = require("../controllers/twinController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/:twinId/trust", twinController.getTrust);
router.get("/:twinId/timeline", twinController.getTimeline);

module.exports = router;
