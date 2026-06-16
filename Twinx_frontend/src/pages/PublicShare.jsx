import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getSharedDocument,
  getDownloadUrl,
} from "../services/api";

import "./PublicShare.css";

export default function PublicShare() {
  const { token } = useParams();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDocument();
  }, []);

  const loadDocument = async () => {
    try {
      const result = await getSharedDocument(token);
      setData(result);
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return (
      <div className="public-share-page">
        <div className="share-card">
          <h1>Access Denied</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="public-share-page">
        Loading...
      </div>
    );
  }

  return (
    <div className="public-share-page">

      <div className="share-card">

        <h1>Shared Document</h1>

        <div className="share-row">
          <span>File Name</span>
          <strong>{data.document.originalName}</strong>
        </div>

        <div className="share-row">
          <span>Twin ID</span>
          <strong>{data.document.twinId}</strong>
        </div>

        <div className="share-row">
          <span>File Size</span>
          <strong>
            {(data.document.fileSize / 1024).toFixed(2)} KB
          </strong>
        </div>

        <div className="share-row">
          <span>Views Used</span>
          <strong>{data.share.viewCount}</strong>
        </div>

        <div className="share-row">
          <span>Views Remaining</span>
          <strong>
            {data.share.viewsRemaining ?? "Unlimited"}
          </strong>
        </div>

        <div className="share-row">
          <span>Download Allowed</span>
          <strong>
            {data.share.allowDownload ? "Yes" : "No"}
          </strong>
        </div>

        {data.share.allowDownload && (
          <a
            href={getDownloadUrl(token)}
            className="download-btn"
          >
            Download Document
          </a>
        )}

      </div>

    </div>
  );
}