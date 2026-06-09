const asyncHandler = require("../utils/asyncHandler");
const documentService = require("../services/documentService");

const upload = asyncHandler(async (req, res) => {
  const result = await documentService.uploadDocument(req.user._id, req.file, {
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
  });

  res.status(201).json({
    success: true,
    message: "Document uploaded and Digital Twin created",
    data: result,
  });
});

const getDocuments = asyncHandler(async (req, res) => {
  const documents = await documentService.getDocumentsByOwner(req.user._id);

  res.status(200).json({
    success: true,
    count: documents.length,
    data: documents,
  });
});

const getDocumentById = asyncHandler(async (req, res) => {
  const result = await documentService.getDocumentById(
    req.user._id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    data: result,
  });
});

module.exports = { upload, getDocuments, getDocumentById };
