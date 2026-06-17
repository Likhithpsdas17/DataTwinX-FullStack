import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {

  const token = localStorage.getItem("dtx_token");

  return (
    <div className="page">
      <header className="hero">
        <Navbar />

        <div className="hero-main">
          <div className="hero-content">
            <span className="hero-badge">
              Secure Document Lifecycle Management
            </span>

            <h1>
              Protect Every
              <span className="gradient-text"> Document You Share</span>
            </h1>

            <p className="tagline">
              Create a Digital Twin for every document, generate secure share links,
              monitor activity, detect misuse, and maintain trust throughout its lifecycle.
            </p>

            <div className="hero-actions">
              <Link
                className="btn btn-primary"
                to={token ? "/dashboard" : "/auth"}
              >
                Get Started
              </Link>

            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="hero-dashboard-preview">
            <div className="preview-card">

              <div className="preview-top">
                <span>Data TwinX Dashboard</span>

                <div className="preview-label">
                  Demo Data
                </div>
              </div>

              <div className="preview-score-card">
                <p>Trust Score</p>
                <h2>92%</h2>
              </div>

              <div className="preview-file">
                <h4>Passport.pdf</h4>
                <span>Twin ID: DTX-84392</span>
              </div>

              <div className="preview-stats">
                <div>
                  <h3>15</h3>
                  <span>Views</span>
                </div>

                <div>
                  <h3>3</h3>
                  <span>Downloads</span>
                </div>

                <div>
                  <h3>Active</h3>
                  <span>Status</span>
                </div>
              </div>

              <div className="preview-alert">
                ✓ No suspicious activity detected
              </div>

            </div>
          </div>
        </div>
      </header>

      <main>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="workflow-section">

          <div className="section-header">
            <h2>How Data TwinX Works</h2>

            <p>
              Protect your documents with intelligent lifecycle tracking
              from upload to secure sharing.
            </p>
          </div>

          <div className="workflow-grid">

            <div className="workflow-card">
              <div className="workflow-number">01</div>

              <h3>Upload Document</h3>

              <p>
                Upload any PDF, image, certificate,
                ID card, or sensitive file securely.
              </p>
            </div>

            <div className="workflow-card">
              <div className="workflow-number">02</div>

              <h3>Generate Twin ID</h3>

              <p>
                Data TwinX creates a unique Twin ID
                and secure share link.
              </p>
            </div>

            <div className="workflow-card">
              <div className="workflow-number">03</div>

              <h3>Share Securely</h3>

              <p>
                Control downloads, views,
                expiry time, and permissions.
              </p>
            </div>

            <div className="workflow-card">
              <div className="workflow-number">04</div>

              <h3>Track Activity</h3>

              <p>
                Monitor file views, downloads,
                trust score, and suspicious activity.
              </p>
            </div>

          </div>
        </section>

        {/* PRODUCT PREVIEW */}
        <section id="features" className="dashboard-section">

          <div className="dashboard-content">

            <div className="dashboard-left">
              <span className="section-badge">
                Dashboard Monitoring
              </span>

              <h2>
                Monitor Everything
                <br />
                From One Dashboard
              </h2>

              <p>
                Track document trust scores, access history,
                downloads, suspicious activity, and secure sharing
                controls from a centralized workspace.
              </p>

              <div className="dashboard-features">
                <div>✓ Trust Score Monitoring</div>
                <div>✓ Access & Download Tracking</div>
                <div>✓ Misuse Detection Alerts</div>
                <div>✓ Link Expiration Controls</div>
              </div>

              <div className="dashboard-cta">
                <Link
                  className="dashboard-btn">
                  Learn More
                </Link>
              </div>
            </div>

            <div className="dashboard-right">

              <div className="dashboard-preview-large">

                <div className="preview-header">
                  <h4>Demo Dashboard Preview</h4>
                  <span className="online-dot"></span>
                </div>

                <div className="preview-score-big">
                  <span>Trust Score</span>
                  <h1>92%</h1>
                </div>

                <div className="preview-stats-large">
                  <div>
                    <h3>15</h3>
                    <span>Views</span>
                  </div>

                  <div>
                    <h3>3</h3>
                    <span>Downloads</span>
                  </div>

                  <div>
                    <h3>Active</h3>
                    <span>Status</span>
                  </div>
                </div>

                <div className="activity-box">
                  <h5>Recent Activity</h5>

                  <div className="activity-bar"></div>
                  <div className="activity-bar short"></div>
                  <div className="activity-bar"></div>
                  <div className="activity-bar medium"></div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* INSIGHTS */}
        <section id="insights" className="insights-section">
          <div className="section-header">
            <span className="section-tag">
              Trust Intelligence
            </span>

            <h2>Security Insights</h2>

            <p>
              Real-time metrics that help you monitor
              document trust and sharing activity.
            </p>
          </div>

          <div className="insight-grid">

            <div className="insight-card">
              <h3>92%</h3>
              <span>Average Trust Score</span>
            </div>

            <div className="insight-card">
              <h3>15+</h3>
              <span>Tracked Documents</span>
            </div>

            <div className="insight-card">
              <h3>24/7</h3>
              <span>Activity Monitoring</span>
            </div>

            <div className="insight-card">
              <h3>97%</h3>
              <span>Safe Sharing Rate</span>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}