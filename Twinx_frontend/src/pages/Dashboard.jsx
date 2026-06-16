import { useState, useEffect, useRef } from 'react';
import { Icons } from "../components/Icons";
import { predictTrustScore, uploadDocument, getDashboardOverview, getDocuments } from '../services/api';
import Sidebar from "../components/Sidebar";
import './Dashboard.css';


function Dashboard() {
  const token = localStorage.getItem('dtx_token');
  let user = null;
  try {
    const storedUser = localStorage.getItem("dtx_user");
    if (
      storedUser &&
      storedUser !== "undefined" &&
      storedUser !== "null"
    ) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Invalid user data");
  }

  const [file, setFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [scoreResult, setScoreResult] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [overviewData, setOverviewData] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState(null);
  const [recentDocuments, setRecentDocuments] = useState([]);
  const fileInputRef = useRef(null);

  const onUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage('Please choose a document first.');
      return;
    }
    setMessage('');
    setLoading(true);
    try {
      const result = await uploadDocument(file, token);
      setUploadResult(result.data);
      setMessage('Document uploaded successfully.');
    } catch (err) {
      const fallback = {
        documentId: `DOC-${Date.now()}`,
        fileName: file.name,
        lifecycleState: 'CREATED'
      };
      setUploadResult(fallback);
      setMessage('Demo mode: upload simulated.');
    } finally {
      setLoading(false);
    }
  };

  const onCheckScore = async () => {
    if (!uploadResult?.document?.id) {
      setMessage('Upload a document before checking trust score.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const score = await predictTrustScore(uploadResult.document.id, token);
      setScoreResult(score);
    } catch (err) {
      const value = Math.floor(72 + Math.random() * 25);
      setScoreResult({
        documentId: uploadResult.documentId,
        trustScore: value,
        riskLevel: value > 90 ? 'LOW' : value > 80 ? 'MEDIUM' : 'HIGH',
        model: 'Python Trust Model (demo fallback)'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setMetricsLoading(true);

        const overview = await getDashboardOverview();
        setOverviewData(overview);

        const docs = await getDocuments();
        setRecentDocuments(docs);

        setMetricsError(null);
      } catch (err) {
        setMetricsError(err.message || "Could not load dashboard data.");
      } finally {
        setMetricsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Compute modern risk classes matches without destroying old values
  const activeTrustScore = scoreResult?.trustScore ?? overviewData?.trustStatistics?.averageTrustScore ?? 0;
  const badgeClass = activeTrustScore >= 90 ? 'badge-success' : activeTrustScore >= 80 ? 'badge-warning' : 'badge-danger';

  return (
    <div className="dashboard-shell">

      <Sidebar />

      {/* Main Workspace Stage */}
      <main className="main-content">
        {/* Dynamic Telemetry Alerts */}
        {metricsLoading && <div className="system-alert loading">Retrieving real-time analytical telemetry matrix...</div>}
        {metricsError && <div className="system-alert error">Telemetry Matrix Error: {metricsError}</div>}

        {/* Focus Trust Score Hero Section */}
        <section className="saas-card trust-hero-section">
          <div className="hero-flex">
            <div className="hero-left">
              <h1>Welcome back, {user?.name || "User"} </h1>

              <p>
                Manage your digital twins, monitor document trust,
                and track sharing activity from one dashboard.
              </p>

            </div>
            <div className="hero-metrics">
              <div className="hero-metric-pill">
                <div className="label">Network Trust Score</div>
                <div className="value">{activeTrustScore}%</div>
              </div>
              <div className="hero-metric-pill">
                <div className="label">Risk Profile Index</div>
                <div style={{ marginTop: '8px' }} className={`badge ${badgeClass}`}>
                  {scoreResult?.riskLevel || (activeTrustScore >= 90 ? 'LOW' : activeTrustScore >= 80 ? 'MEDIUM' : 'HIGH')}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Analytics Cards Counter Row */}
        {!metricsLoading && !metricsError && overviewData && (
          <section className="analytics-grid">
            <div className="saas-card analytics-card">
              <div className="card-header">
                <span>Total Documents</span>
                <Icons.Documents />
              </div>
              <div className="card-value">{overviewData.userStatistics?.totalDocuments ?? 0}</div>
            </div>
            <div className="saas-card analytics-card">
              <div className="card-header">
                <span>Total Shares</span>
                <Icons.Sharing />
              </div>
              <div className="card-value">{overviewData.userStatistics?.totalShares ?? 0}</div>
            </div>
            <div className="saas-card analytics-card">
              <div className="card-header">
                <span>Total Views</span>
                <Icons.Analytics />
              </div>
              <div className="card-value">{overviewData.userStatistics?.totalViews ?? 0}</div>
            </div>
            <div className="saas-card analytics-card">
              <div className="card-header">
                <span>Total Downloads</span>
                <Icons.Documents />
              </div>
              <div className="card-value">{overviewData.userStatistics?.totalDownloads ?? 0}</div>
            </div>
          </section>
        )}

        {/* Workplace Execution Columns */}
        <div className="workplace-grid">

          {/* Column Left: Ingestion Engine & Twin Meta */}
          <div className="workplace-column">

            {/* Upload Section Card */}
            <div className="saas-card">
              <h2>Upload Document</h2>
              <form onSubmit={onUpload}>
                <div className="upload-dropzone" onClick={() => fileInputRef.current.click()}>
                  <div className="upload-icon"><Icons.Upload /></div>
                  <p style={{ fontWeight: 500 }}>Click to select your document file</p>
                  <p className="file-spec">Supported formats: PDF, DOC, DOCX, TXX, CSV, JSON</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf,.doc,.docx,.txt,.csv,.json"
                    style={{ display: 'none' }}
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>

                {file && (
                  <div className="selected-file-banner">
                    <span style={{ fontWeight: 500, wordBreak: 'break-all' }}>{file.name}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Ready to Process</span>
                  </div>
                )}

                <button className="btn-primary" disabled={loading}>
                  {loading ? 'Uploading...' : 'Create Digital Twin'}
                </button>
              </form>
              {message && <p className="system-alert loading" style={{ marginTop: '16px', marginBottom: '0' }}>{message}</p>}
            </div>

            {/* Document Twin Info Panel */}
            <div className="saas-card">
              <h2 className="section-title">Document Information</h2>
              {uploadResult ? (
                <div className="info-list">
                  <div className="info-row">
                    <span className="info-label">Document ID</span>
                    <span className="info-value" style={{ fontFamily: 'monospace' }}>{uploadResult.document.id}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">File Name</span>
                    <span className="info-value">{uploadResult.document?.originalName}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Lifecycle State</span>
                    <span className="info-value">
                      <span className="badge badge-success"> CREATED </span>
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Twin ID</span>

                    <span className="info-value">
                      {uploadResult.digitalTwin?.twinId}
                    </span>
                  </div>
                  <button className="btn-primary" style={{ marginTop: '8px' }} onClick={onCheckScore} disabled={loading}>
                    Check Trust Score
                  </button>
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Upload a document to create a digital twin entry.</p>
              )}
            </div>

          </div>

          {/* Column Right: Trust Assessment Diagnostics */}
          <div className="workplace-column">
            <div className="saas-card">
              <h2 className="section-title">Trust Analysis</h2>
              {scoreResult ? (
                <div className="info-list">
                  <div className="info-row">
                    <span className="info-label">Verdict Score</span>
                    <span className="info-value" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                      {scoreResult.trustScore ?? '--'}%
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Threat Classification</span>
                    <span className="info-value">
                      <span className={`badge ${scoreResult.riskLevel === 'LOW' ? 'badge-success' : scoreResult.riskLevel === 'MEDIUM' ? 'badge-warning' : 'badge-danger'}`}>
                        {scoreResult.riskLevel || 'N/A'}
                      </span>
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Model Signature</span>
                    <span className="info-value" style={{ color: 'var(--text-muted)' }}>{scoreResult.model || 'Python trust predictor'}</span>
                  </div>
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Click "Check Trust Score" after uploading a document.</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Documents */}
        <section className="saas-card recent-documents">
          <h2 className="section-title">Recent Documents</h2>

          <div className="documents-table">
            <div className="table-header">
              <span>File Name</span>
              <span>Twin ID</span>
              <span>Trust Score</span>
              <span>Status</span>
            </div>

            {recentDocuments.slice(0, 5).map((item) => (
              <div className="table-row" key={item.document.id}>
                <span>{item.document.originalName}</span>

                <span>
                  {item.digitalTwin?.twinId || "N/A"}
                </span>

                <span className="trust-high">
                  {item.digitalTwin?.trustScore || 0}%
                </span>

                <span className="badge badge-success">
                  {item.digitalTwin?.riskLevel || "LOW"}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Activity Timeline */}
        <section className="saas-card activity-timeline">
          <h2 className="section-title">Recent Activity</h2>

          <div className="timeline">
            {recentDocuments.slice(0, 5).map((item) => (
              <div
                className="timeline-item"
                key={item.document.id}
              >
                <div className="timeline-dot"></div>

                <div>
                  <strong>Document Uploaded</strong>

                  <p>
                    {item.document.originalName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
export default Dashboard;