import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getDashboardOverview } from "../services/api";
import "./Analytics.css";

export default function Analytics() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [data, setData] = useState(null);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            const result = await getDashboardOverview();
            setData(result);
        } catch (err) {
            console.error(err);
        }
    };

    if (!data) {
        return <h2>Loading...</h2>;
    }

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

                <div className="analytics-header">
                    <h1>Analytics Dashboard</h1>
                    <p>
                        Monitor trust, risk and sharing activity.
                    </p>
                </div>

                <div className="stats-grid">

                    <div className="stat-card">
                        <h3>Documents</h3>
                        <span>{data.summary.totalDocuments}</span>
                    </div>

                    <div className="stat-card">
                        <h3>Shares</h3>
                        <span>{data.summary.totalShares}</span>
                    </div>

                    <div className="stat-card">
                        <h3>Views</h3>
                        <span>{data.summary.totalViews}</span>
                    </div>

                    <div className="stat-card">
                        <h3>Downloads</h3>
                        <span>{data.summary.totalDownloads}</span>
                    </div>

                    <div className="stat-card">
                        <h3>Trust Score</h3>
                        <span>{data.summary.averageTrustScore}</span>
                    </div>

                </div>

                <div className="analytics-row">

                    <div className="saas-card">
                        <h2>Trust Health</h2>

                        <div className="metric-row">
                            <span>🟢 Healthy</span>
                            <strong>{data.trustStatistics.healthyCount}</strong>
                        </div>

                        <div className="metric-row">
                            <span>🟡 Warning</span>
                            <strong>{data.trustStatistics.warningCount}</strong>
                        </div>

                        <div className="metric-row">
                            <span>🔴 Critical</span>
                            <strong>{data.trustStatistics.criticalCount}</strong>
                        </div>
                    </div>

                    <div className="saas-card">
                        <h2>System Summary</h2>

                        <div className="metric-row">
                            <span>Total Documents</span>
                            <strong>{data.summary.totalDocuments}</strong>
                        </div>

                        <div className="metric-row">
                            <span>Total Shares</span>
                            <strong>{data.summary.totalShares}</strong>
                        </div>

                        <div className="metric-row">
                            <span>Total Views</span>
                            <strong>{data.summary.totalViews}</strong>
                        </div>

                        <div className="metric-row">
                            <span>Total Downloads</span>
                            <strong>{data.summary.totalDownloads}</strong>
                        </div>
                    </div>

                </div>

                <div className="saas-card recent-activity">

                    <h2>Recent Activity</h2>

                    {data.recentActivity.map((activity) => (
                        <div
                            key={activity.id}
                            className="activity-item"
                        >

                            <div className="activity-event">
                                {activity.event}
                            </div>

                            <div className="activity-file">
                                {activity.document?.originalName}
                            </div>

                            <div className="activity-time">
                                {new Date(
                                    activity.timestamp
                                ).toLocaleString()}
                            </div>

                        </div>
                    ))}
                </div>

            </main>
        </div>
    );
}