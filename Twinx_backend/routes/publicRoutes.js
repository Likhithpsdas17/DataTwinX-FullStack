const express = require("express");
const publicController = require("../controllers/publicController");

const router = express.Router();

router.get("/share/:token/download", publicController.downloadShare);
router.get("/share/:token", publicController.accessShare);

module.exports = router;
