import { useEffect, useState } from "react";
import { FileText, Search } from "lucide-react";
import { getDocuments } from "../services/api";
import Sidebar from "../components/Sidebar";
import "./Documents.css";


export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="documents-page">Loading...</div>;
  }

  return (
    <div className="dashboard-shell">

        <Sidebar />       

        <main className="main-content">

        <div className="documents-page">

        <div className="documents-header">
        <h1>Documents</h1>
        <p>Manage all uploaded digital twin documents</p>
        </div>

        <div className="documents-table-card">

        <table className="documents-table">

            <thead>
            <tr>
                <th>File Name</th>
                <th>Twin ID</th>
                <th>Trust Score</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
            </thead>

            <tbody>
            {documents.map((item) => (
                <tr key={item.document.id}>

                <td>
                    <FileText size={16} />
                    {item.document.originalName}
                </td>

                <td>{item.digitalTwin?.twinId}</td>

                <td>
                    {item.digitalTwin?.trustScore ?? 0}%
                </td>

                <td>
                    {item.digitalTwin?.riskLevel}
                </td>

                <td>
                    <button
                    className="view-btn"
                    onClick={() => setSelectedDoc(item)}
                    >
                    View
                    </button>
                </td>

                </tr>
            ))}
            </tbody>

        </table>

        </div>

        {selectedDoc && (
        <div className="document-details-card">

            <h2>Document Details</h2>

            <div className="detail-row">
            <span>Document ID</span>
            <span>{selectedDoc.document.id}</span>
            </div>

            <div className="detail-row">
            <span>File Name</span>
            <span>{selectedDoc.document.originalName}</span>
            </div>

            <div className="detail-row">
            <span>Twin ID</span>
            <span>{selectedDoc.digitalTwin?.twinId}</span>
            </div>

            <div className="detail-row">
            <span>Trust Score</span>
            <span>{selectedDoc.digitalTwin?.trustScore}%</span>
            </div>

        </div>
        )}

    </div>

    </main>

  </div>
  );
}

