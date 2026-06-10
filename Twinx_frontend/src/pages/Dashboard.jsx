const Icons = {
  Dashboard: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>,
  Documents: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>,
  Sharing: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>,
  Analytics: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
  Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1-2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
  Logout: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
  Upload: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
};

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictTrustScore, uploadDocument, getDashboardOverview } from '../services/api';
import './Dashboard.css';

function Dashboard() {
const navigate = useNavigate();
const user = localStorage.getItem('dtx_user') || 'User';
const token = localStorage.getItem('dtx_token');

const [file, setFile] = useState(null);
const [uploadResult, setUploadResult] = useState(null);
const [scoreResult, setScoreResult] = useState(null);
const [message, setMessage] = useState('');
const [loading, setLoading] = useState(false);

const [overviewData, setOverviewData] = useState(null);
const [metricsLoading, setMetricsLoading] = useState(true);
const [metricsError, setMetricsError] = useState(null);

const fileInputRef = useRef(null);

const logout = () => {
  localStorage.removeItem('dtx_token');
  localStorage.removeItem('dtx_user');
  navigate('/auth');
};

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
    setUploadResult(result);
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
  if (!uploadResult?.documentId) {
    setMessage('Upload a document before checking trust score.');
    return;
  }
  setLoading(true);
  setMessage('');
  try {
    const score = await predictTrustScore(uploadResult.documentId, token);
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
  const fetchMetrics = async () => {
    try {
      setMetricsLoading(true);
      const data = await getDashboardOverview();
      setOverviewData(data);
      setMetricsError(null);
    } catch (err) {
      setMetricsError(err.message || "Could not load analytics data.");
    } finally {
      setMetricsLoading(false);
    }
  };

  fetchMetrics();
}, []);

// Compute modern risk classes matches without destroying old values
const activeTrustScore = scoreResult?.trustScore ?? overviewData?.trustStatistics?.averageTrustScore ?? 0;
const badgeClass = activeTrustScore >= 90 ? 'badge-success' : activeTrustScore >= 80 ? 'badge-warning' : 'badge-danger';

return (
  <div className="dashboard-shell">
    {/* SaaS Left Navigation Sidebar */}
    <aside className="sidebar">
      <div className="sidebar-brand">
        Data <span>TwinX</span>
      </div>
      <nav className="sidebar-nav">
        <button className="nav-item active"><Icons.Dashboard /> <span>Dashboard</span></button>
        <button className="nav-item"><Icons.Documents /> <span>Documents</span></button>
        <button className="nav-item"><Icons.Sharing /> <span>Sharing</span></button>
        <button className="nav-item"><Icons.Analytics /> <span>Analytics</span></button>
        <button className="nav-item"><Icons.Settings /> <span>Settings</span></button>
        <button className="nav-item nav-item-logout" onClick={logout}>
          <Icons.Logout /> <span>Logout</span>
        </button>
      </nav>
    </aside>

    {/* Main Workspace Stage */}
    <main className="main-content">
      {/* Dynamic Telemetry Alerts */}
      {metricsLoading && <div className="system-alert loading">Retrieving real-time analytical telemetry matrix...</div>}
      {metricsError && <div className="system-alert error">Telemetry Matrix Error: {metricsError}</div>}

      {/* Focus Trust Score Hero Section */}
      <section className="saas-card trust-hero-section">
        <div className="hero-flex">
          <div className="hero-left">
            <h1>System Integrity Engine</h1>
            <p>Welcome back, {user}. Ingest documents to monitor, generate and map infrastructure compliance diagnostics.</p>
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
            <h2 className="section-title">Ingest Document Object</h2>
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
                {loading ? 'Uploading...' : 'Execute Twin Mapping'}
              </button>
            </form>
            {message && <p className="system-alert loading" style={{ marginTop: '16px', marginBottom: '0' }}>{message}</p>}
          </div>

          {/* Document Twin Info Panel */}
          <div className="saas-card">
            <h2 className="section-title">Active Twin Registry Metadata</h2>
            {uploadResult ? (
              <div className="info-list">
                <div className="info-row">
                  <span className="info-label">Document ID</span>
                  <span className="info-value" style={{ fontFamily: 'monospace' }}>{uploadResult.documentId}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">File Name</span>
                  <span className="info-value">{uploadResult.fileName}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Lifecycle State</span>
                  <span className="info-value">
                    <span className="badge badge-success">{uploadResult.lifecycleState || 'CREATED'}</span>
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
            <h2 className="section-title">Trust Score Diagnostics</h2>
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
    </main>
  </div>
);
}
export default Dashboard;