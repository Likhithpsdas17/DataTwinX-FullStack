const mongoose = require("mongoose");
const Document = require("../models/Document");
const DigitalTwin = require("../models/DigitalTwin");
const generateTwinId = require("../utils/generateTwinId");
const hashFile = require("../utils/hashFile");
const deleteFile = require("../utils/deleteFile");
const ApiError = require("../utils/ApiError");
const lifecycleService = require("./lifecycleService");
const {
  LIFECYCLE_EVENTS,
  HEALTH_STATUS,
  RISK_LEVEL,
} = require("../config/constants");

const formatDocument = (doc) => ({
  id: doc._id,
  owner: doc.owner,
  twinId: doc.twinId,
  originalName: doc.originalName,
  storedName: doc.storedName,
  mimeType: doc.mimeType,
  fileSize: doc.fileSize,
  sha256Hash: doc.sha256Hash,
  filePath: doc.filePath,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

const formatDigitalTwin = (twin) => ({
  id: twin._id,
  document: twin.document,
  owner: twin.owner,
  twinId: twin.twinId,
  trustScore: twin.trustScore,
  healthStatus: twin.healthStatus,
  riskLevel: twin.riskLevel,
  analytics: twin.analytics,
  recommendations: twin.recommendations,
  lastAssessedAt: twin.lastAssessedAt,
  createdAt: twin.createdAt,
  updatedAt: twin.updatedAt,
});

const getTwinForDocument = async (documentId) => {
  const twin = await DigitalTwin.findOne({ document: documentId });
  if (!twin) {
    throw new ApiError(404, "Digital Twin not found for this document");
  }
  return twin;
};

const uploadDocument = async (ownerId, file, reqMeta = {}) => {
  const twinId = generateTwinId();
  const sha256Hash = hashFile(file.path);
  const filePath = file.path;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const [document] = await Document.create(
      [
        {
          owner: ownerId,
          twinId,
          originalName: file.originalname,
          storedName: file.filename,
          mimeType: file.mimetype,
          fileSize: file.size,
          sha256Hash,
          filePath,
        },
      ],
      { session }
    );

    const [digitalTwin] = await DigitalTwin.create(
      [
        {
          document: document._id,
          owner: ownerId,
          twinId,
          trustScore: 100,
          healthStatus: HEALTH_STATUS.HEALTHY,
          riskLevel: RISK_LEVEL.LOW,
        },
      ],
      { session }
    );

    await lifecycleService.logActivity({
      documentId: document._id,
      twinId: digitalTwin._id,
      ownerId,
      event: LIFECYCLE_EVENTS.UPLOAD,
      metadata: {
        originalName: file.originalname,
        fileSize: file.size,
        twinId,
      },
      ipAddress: reqMeta.ipAddress,
      userAgent: reqMeta.userAgent,
      session,
    });

    await session.commitTransaction();

    return {
      document: formatDocument(document),
      digitalTwin: formatDigitalTwin(digitalTwin),
    };
  } catch (error) {
    await session.abortTransaction();
    deleteFile(filePath);
    throw error;
  } finally {
    session.endSession();
  }
};

const getDocumentsByOwner = async (ownerId) => {
  const documents = await Document.find({
    owner: ownerId,
    isDeleted: false,
  }).sort({ createdAt: -1 });

  const results = await Promise.all(
    documents.map(async (doc) => {
      const twin = await DigitalTwin.findOne({ document: doc._id });
      return {
        document: formatDocument(doc),
        digitalTwin: twin ? formatDigitalTwin(twin) : null,
      };
    })
  );

  return results;
};

const getDocumentById = async (ownerId, documentId) => {
  const document = await Document.findOne({
    _id: documentId,
    owner: ownerId,
    isDeleted: false,
  });

  if (!document) {
    throw new ApiError(404, "Document not found");
  }

  const digitalTwin = await getTwinForDocument(document._id);

  return {
    document: formatDocument(document),
    digitalTwin: formatDigitalTwin(digitalTwin),
  };
};

module.exports = {
  uploadDocument,
  getDocumentsByOwner,
  getDocumentById,
};
