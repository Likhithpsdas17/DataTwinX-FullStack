import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getSharedDocument,
  getDownloadUrl,
} from "../services/api";
import SecurePdfViewer from "../components/SecurePdfViewer";
import "./SharedViewer.css";

export default function SharedViewer() {
  const { token } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [documentData, setDocumentData] = useState(null);

  useEffect(() => {
    loadDocument();
  }, [token]);

  async function loadDocument() {
    try {
      setLoading(true);

      const data =
        await getSharedDocument(token);

      setDocumentData(data);

      setError("");
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
        "Unable to load secure document."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="viewer-page">
        <div className="viewer-loading">
          <div className="loading-spinner" />

          <h2>Loading Secure Viewer...</h2>

          <p>
            Verifying access permissions...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="viewer-page">
        <div className="saas-card viewer-error">
          <h2>Access Denied</h2>

          <p>{error}</p>
        </div>
      </div>
    );
  }

  const document = documentData.document;

  const share = documentData.share;

  const isPdf =
    document.mimeType ===
    "application/pdf";

  const downloadDocument = () => {
    window.open(
      getDownloadUrl(token),
      "_blank"
    );
  };

  return (
    <div className="viewer-page">

      <header className="viewer-header">

        <div>

          <h1>
            Secure Document Viewer
          </h1>

          <p>
            Powered by Data TwinX
          </p>

        </div>

        {share.allowDownload && (
          <button
            className="btn-primary"
            onClick={downloadDocument}
          >
            Download
          </button>
        )}

      </header>

      <div className="viewer-layout">

        {/* LEFT */}

        <section className="viewer-main">

          <div className="saas-card">

            <h2>
              {document.originalName}
            </h2>

            {isPdf ? (
              <SecurePdfViewer
                fileUrl={documentData.previewUrl}
              />
            ) : (
              <div className="viewer-placeholder">
                <h3>Preview Not Available</h3>

                <p>
                  Only PDF preview is currently
                  supported.
                </p>
              </div>
            )}

          </div>

        </section>

        {/* RIGHT */}

        <aside className="viewer-sidebar">

          <div className="saas-card">

            <h2>
              Document Details
            </h2>

            <div className="info-row">
              <span>
                Twin ID
              </span>

              <strong>
                {document.twinId}
              </strong>
            </div>

            <div className="info-row">
              <span>
                File Type
              </span>

              <strong>
                {document.mimeType}
              </strong>
            </div>

            <div className="info-row">
              <span>
                File Size
              </span>

              <strong>
                {(
                  document.fileSize /
                  1024
                ).toFixed(1)}{" "}
                KB
              </strong>
            </div>

          </div>

          <div className="saas-card">

            <h2>
              Security Policy
            </h2>

            <div className="info-row">
              <span>
                Remaining Views
              </span>

              <strong>
                {share.maxViews
                  ? share.viewsRemaining
                  : "Unlimited"}
              </strong>
            </div>

            <div className="info-row">
              <span>
                Total Views
              </span>

              <strong>
                {share.viewCount}
              </strong>
            </div>

            <div className="info-row">
              <span>
                One-Time Access
              </span>

              <strong>
                {share.oneTimeAccess
                  ? "Enabled"
                  : "Disabled"}
              </strong>
            </div>

            <div className="info-row">
              <span>
                Download
              </span>

              <strong>
                {share.allowDownload
                  ? "Allowed"
                  : "Restricted"}
              </strong>
            </div>

            <div className="info-row">
              <span>
                Expires
              </span>

              <strong>
                {share.expiresAt
                  ? new Date(
                    share.expiresAt
                  ).toLocaleString()
                  : "Never"}
              </strong>
            </div>

          </div>

          <div className="saas-card">

            <h2>
              Trust Status
            </h2>

            <p>
              This document is being
              monitored by the Data TwinX
              lifecycle engine.
            </p>

            <div className="trust-score">
              Secure Share
            </div>

          </div>

        </aside>

      </div>

    </div>
  );
}