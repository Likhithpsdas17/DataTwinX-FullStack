import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getDashboardOverview } from "../services/api";
import "./Settings.css";

export default function Settings() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [stats, setStats] = useState(null);

    const user =
        JSON.parse(localStorage.getItem("dtx_user")) || {};

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getDashboardOverview();
            setStats(data);
        } catch (err) {
            console.error(err);
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
                        onClick={() =>
                            setMobileOpen(!mobileOpen)
                        }
                    >
                        ☰
                    </button>
                </div>

                <div className="settings-header">
                    <h1>Settings</h1>

                    <p>
                        Manage your profile and security.
                    </p>
                </div>

                <div className="settings-grid">

                    <div className="saas-card">

                        <h2>Profile Information</h2>

                        <div className="setting-row">
                            <span>Name</span>
                            <strong>{user.name}</strong>
                        </div>

                        <div className="setting-row">
                            <span>Email</span>
                            <strong>{user.email}</strong>
                        </div>

                        <div className="setting-row">
                            <span>Role</span>
                            <strong>
                                {user.role || "User"}
                            </strong>
                        </div>
                    </div>

                    <div className="saas-card">

                        <h2>Account Statistics</h2>

                        {stats && (
                            <>
                                <div className="setting-row">
                                    <span>Documents</span>
                                    <strong>
                                        {
                                            stats.summary
                                                .totalDocuments
                                        }
                                    </strong>
                                </div>

                                <div className="setting-row">
                                    <span>Shares</span>
                                    <strong>
                                        {
                                            stats.summary
                                                .totalShares
                                        }
                                    </strong>
                                </div>

                                <div className="setting-row">
                                    <span>Views</span>
                                    <strong>
                                        {
                                            stats.summary
                                                .totalViews
                                        }
                                    </strong>
                                </div>

                                <div className="setting-row">
                                    <span>Downloads</span>
                                    <strong>
                                        {
                                            stats.summary
                                                .totalDownloads
                                        }
                                    </strong>
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}