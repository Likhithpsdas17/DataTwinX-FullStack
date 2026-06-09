const express = require("express");
const { body } = require("express-validator");
const shareController = require("../controllers/shareController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

router.use(protect);

router.post(
  "/:documentId",
  [
    body("expiresAt")
      .optional()
      .isISO8601()
      .withMessage("expiresAt must be a valid ISO 8601 date"),
    body("maxViews")
      .optional()
      .isInt({ min: 1 })
      .withMessage("maxViews must be a positive integer"),
    body("allowDownload")
      .optional()
      .isBoolean()
      .withMessage("allowDownload must be a boolean"),
    body("oneTimeAccess")
      .optional()
      .isBoolean()
      .withMessage("oneTimeAccess must be a boolean"),
  ],
  validate,
  shareController.createShareLink
);

router.delete("/:shareLinkId", shareController.revokeShareLink);

module.exports = router;
