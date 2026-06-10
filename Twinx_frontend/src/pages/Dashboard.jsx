import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictTrustScore, uploadDocument, getDashboardOverview } from '../services/api';

export default function Dashboard() {
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
      // Demo fallback for presentation before full backend implementation.
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
        setMetricsError(
          err.message || "Could not load analytics data."
        );
      } finally {
        setMetricsLoading(false);
      }
    };
  
    fetchMetrics();
  }, []);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Data TwinX Dashboard</h1>
          <p>Welcome, {user}. Upload documents and evaluate trust score.</p>
        </div>
        <button className="btn btn-light" onClick={logout}>
          Logout
        </button>
      </header>

      <div className="dashboard-analytics-header" style={{ marginBottom: '24px' }}>
        {metricsLoading && <div className="metrics-loading">Loading overview metrics...</div>}
        
        {metricsError && <div className="metrics-error" style={{ color: 'red' }}>Error: {metricsError}</div>}
        
        {!metricsLoading && !metricsError && overviewData && (
          <div className="analytics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div className="analytic-card">
              <h4>Average Trust Score</h4>
              <p>{overviewData.trustStatistics?.averageTrustScore ?? 0}%</p>
            </div>
            <div className="analytic-card">
              <h4>Total Documents</h4>
              <p>{overviewData.userStatistics?.totalDocuments ?? 0}</p>
            </div>
            <div className="analytic-card">
              <h4>Total Shares</h4>
              <p>{overviewData.userStatistics?.totalShares ?? 0}</p>
            </div>
            <div className="analytic-card">
              <h4>Total Views</h4>
              <p>{overviewData.userStatistics?.totalViews ?? 0}</p>
            </div>
            <div className="analytic-card">
              <h4>Total Downloads</h4>
              <p>{overviewData.userStatistics?.totalDownloads ?? 0}</p>
            </div>
          </div>
        )}
      </div>

      <section className="dashboard-grid">
        <article className="panel">
          <h2>Upload Document</h2>
          <form onSubmit={onUpload}>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.csv,.json"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <button className="btn btn-primary full" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </form>
          {message ? <p className="info-text">{message}</p> : null}
        </article>

        <article className="panel">
          <h2>Document Twin Info</h2>
          {uploadResult ? (
            <div className="kv-list">
              <p>
                <strong>Document ID:</strong> {uploadResult.documentId}
              </p>
              <p>
                <strong>File Name:</strong> {uploadResult.fileName}
              </p>
              <p>
                <strong>Lifecycle State:</strong> {uploadResult.lifecycleState || 'CREATED'}
              </p>
              <button className="btn btn-primary" onClick={onCheckScore} disabled={loading}>
                Check Trust Score
              </button>
            </div>
          ) : (
            <p>Upload a document to create a digital twin entry.</p>
          )}
        </article>

        <article className="panel trust-panel">
          <h2>Trust Score Result</h2>
          {scoreResult ? (
            <>
              <p className="trust-score">{scoreResult.trustScore ?? '--'}</p>
              <p>
                <strong>Risk Level:</strong> {scoreResult.riskLevel || 'N/A'}
              </p>
              <p>
                <strong>Model:</strong> {scoreResult.model || 'Python trust predictor'}
              </p>
            </>
          ) : (
            <p>Click "Check Trust Score" after uploading a document.</p>
          )}
        </article>
      </section>
    </div>
  );
}

