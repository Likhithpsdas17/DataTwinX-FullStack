import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getTwinTrust, getTwinTimeline } from "../services/api";

export default function TwinDetails() {
    const { twinId } = useParams();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [trust, setTrust] = useState(null);
    const [timeline, setTimeline] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {

            const trustData =
                await getTwinTrust(twinId);

            const timelineData =
                await getTwinTimeline(twinId);

                setTrust(trustData);
                setTimeline(timelineData.timeline);

        } catch (err) {
            console.error(err);
        }
    };

    if (!trust) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="dashboard-shell">

            <Sidebar
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            <main className="main-content">

                <div className="analytics-header">
                    <h1>Digital Twin</h1>

                    <p>
                        Twin ID : {trust.twinId}
                    </p>
                </div>

                <div className="stats-grid">

                    <div className="stat-card">
                        <h3>Trust Score</h3>
                        <span>
                            {trust.trustScore}
                        </span>
                    </div>

                    <div className="stat-card">
                        <h3>Health</h3>
                        <span>
                            {trust.healthStatus}
                        </span>
                    </div>

                    <div className="stat-card">
                        <h3>Risk</h3>
                        <span>
                            {trust.riskLevel}
                        </span>
                    </div>

                </div>

                <div className="saas-card">

                    <h2>Lifecycle Timeline</h2>

                    {timeline.map((item) => (

                        <div
                            key={item.id}
                            className="activity-item"
                        >

                            <div className="activity-event">
                                {item.event}
                            </div>

                            <div className="activity-time">
                                {new Date(
                                    item.createdAt
                                ).toLocaleString()}
                            </div>

                        </div>

                    ))}

                </div>

            </main>

        </div>
    );
}