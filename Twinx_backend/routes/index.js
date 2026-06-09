const express = require("express");
const authRoutes = require("./authRoutes");
const documentRoutes = require("./documentRoutes");
const shareRoutes = require("./shareRoutes");
const twinRoutes = require("./twinRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/documents", documentRoutes);
router.use("/share", shareRoutes);
router.use("/twins", twinRoutes);

module.exports = router;
