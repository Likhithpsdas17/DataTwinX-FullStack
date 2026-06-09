const express = require("express");
const documentController = require("../controllers/documentController");
const { protect } = require("../middleware/auth");
const handleUpload = require("../middleware/handleUpload");

const router = express.Router();

router.use(protect);

router.post("/upload", handleUpload, documentController.upload);
router.get("/", documentController.getDocuments);
router.get("/:id", documentController.getDocumentById);

module.exports = router;
