const express = require("express");
const authRoutes = require("./authRoutes");
const documentRoutes = require("./documentRoutes");
const shareRoutes = require("./shareRoutes");
const twinRoutes = require("./twinRoutes");
const dashboardRoutes = require("./dashboardRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/documents", documentRoutes);
router.use("/share", shareRoutes);
router.use("/twins", twinRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;
