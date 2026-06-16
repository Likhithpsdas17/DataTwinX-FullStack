import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getDocuments, createShareLink, revokeShareLink } from "../services/api";
import "./Sharing.css";

export default function Sharing() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState("");
    const [shareUrl, setShareUrl] = useState("");
    const [shareLinkId, setShareLinkId] = useState("");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        expiresAt: "",
        maxViews: "",
        allowDownload: true,
        oneTimeAccess: false,
    });

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        try {
            const docs = await getDocuments();
            setDocuments(docs);
        } catch (err) {
            console.error(err);
        }
    };

    const generateLink = async () => {
        if (!selectedDoc) {
            alert("Please select a document");
            return;
        }

        try {
            setLoading(true);

            const result = await createShareLink(
                selectedDoc,
                {
                    expiresAt:
                        formData.expiresAt || undefined,

                    maxViews:
                        formData.maxViews
                            ? Number(formData.maxViews)
                            : undefined,

                    allowDownload:
                        formData.allowDownload,

                    oneTimeAccess:
                        formData.oneTimeAccess,
                }
            );

            setShareUrl(result.data.shareUrl);
            setShareLinkId(result.data.shareLink.id);

        } catch (err) {
            console.error(err);
            alert("Failed to generate link");
        } finally {
            setLoading(false);
        }
    };

    const copyLink = async () => {
        await navigator.clipboard.writeText(
            shareUrl
        );

        alert("Link copied!");
    };

    const revokeLink = async () => {
        if (!shareLinkId) return;
      
        const confirmed = window.confirm(
          "Are you sure you want to revoke this share link?"
        );
      
        if (!confirmed) return;
      
        try {
          await revokeShareLink(
            shareLinkId
          );
      
          alert(
            "Share link revoked successfully"
          );
      
          setShareUrl("");
          setShareLinkId("");
        } catch (err) {
          console.error(err);
      
          alert(
            "Failed to revoke share link"
          );
        }
      };

    return (
        <div className="dashboard-shell">

            <Sidebar
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            <main className="main-content">

                <div className="mobile-topbar">
                    <button
                        className="menu-btn"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        ☰
                    </button>
                </div>

                <div className="sharing-header">
                    <h1>Document Sharing</h1>

                    <p>
                        Generate secure links with
                        restrictions and expiry controls.
                    </p>
                </div>

                <div className="sharing-grid">

                    <div className="saas-card">

                        <h2>Create Share Link</h2>

                        <select
                            value={selectedDoc}
                            onChange={(e) =>
                                setSelectedDoc(e.target.value)
                            }
                        >
                            <option value="">
                                Select Document
                            </option>

                            {documents.map((item) => (
                                <option
                                    key={item.document.id}
                                    value={item.document.id}
                                >
                                    {item.document.originalName}
                                </option>
                            ))}
                        </select>

                        <input
                            type="datetime-local"
                            value={formData.expiresAt}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    expiresAt: e.target.value,
                                })
                            }
                        />

                        <input
                            type="number"
                            placeholder="Max Views"
                            value={formData.maxViews}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    maxViews: e.target.value,
                                })
                            }
                        />

                        <label>
                            <input
                                type="checkbox"
                                checked={
                                    formData.allowDownload
                                }
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        allowDownload:
                                            e.target.checked,
                                    })
                                }
                            />

                            Allow Download
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                checked={
                                    formData.oneTimeAccess
                                }
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        oneTimeAccess:
                                            e.target.checked,
                                    })
                                }
                            />

                            One Time Access
                        </label>

                        <button
                            className="btn-primary"
                            onClick={generateLink}
                            disabled={loading}
                        >
                            {loading
                                ? "Generating..."
                                : "Generate Link"}
                        </button>

                    </div>

                    <div className="saas-card">

                        <h2>Generated Link</h2>

                        {shareUrl ? (
                            <>
                                <div className="share-link-box">
                                    {shareUrl}
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        gap: "1rem",
                                        marginTop: "1rem",
                                    }}
                                    >
                                    <button
                                        className="btn-primary"
                                        onClick={copyLink}
                                    >
                                        Copy Link
                                    </button>

                                    <button
                                        className="btn-danger"
                                        onClick={revokeLink}
                                    >
                                        Revoke Link
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p>
                                No share link generated yet.
                            </p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}