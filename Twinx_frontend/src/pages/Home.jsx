import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ImageSlider from '../components/ImageSlider';
import FeatureCard from '../components/FeatureCard';
import Footer from '../components/Footer';

const features = [
  {
    title: 'Digital Twin Creation',
    description: 'Creates a dynamic twin for each uploaded document with metadata and trust indicators.'
  },
  {
    title: 'Lifecycle Tracking',
    description: 'Records data creation, access, updates, versioning, and deletion in structured timelines.'
  },
  {
    title: 'Provenance & Audit Trail',
    description: 'Captures complete interaction history for compliance and accountability.'
  },
  {
    title: 'Integrity Verification',
    description: 'Supports cryptographic hash checks to detect unauthorized changes.'
  },
  {
    title: 'Trust & Risk Scoring',
    description: 'Evaluates trust score dynamically using access and modification behavior.'
  },
  {
    title: 'Dashboard Monitoring',
    description: 'Offers intuitive visual views for trust status, alerts, and document insights.'
  }
];

export default function Home() {
  return (
    <div className="page">
      <header className="hero">
        <Navbar />
        <div className="hero-main">
          <div className="hero-content">
            <h1>Data TwinX</h1>
            <p className="tagline">
              "From data creation to trust prediction - one intelligent twin for complete lifecycle visibility."
            </p>
            <p className="hero-note">
              A digital data lifecycle and trust management platform for secure, transparent, and auditable governance.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to="/auth">
                Get Started
              </Link>
              <a className="btn btn-light" href="#features">
                Explore Features
              </a>
            </div>
          </div>
          <div className="hero-image-box" aria-label="Data TwinX conceptual image">
            <img
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop"
              alt="Digital network and data technology concept"
            />
          </div>
        </div>
      </header>

      <main>
        <ImageSlider />

        <section id="features" className="features-section">
          <h2>Key Features</h2>
          <p className="section-note">
            Designed based on your Data TwinX objective: lifecycle visibility, provenance, integrity, and trust.
          </p>
          <div className="feature-grid">
            {features.map((item) => (
              <FeatureCard key={item.title} title={item.title} description={item.description} />
            ))}
          </div>
        </section>

        <section id="about" className="about-section">
          <h2>Why Data TwinX?</h2>
          <p>
            Traditional systems treat data as static. Data TwinX models data as a living digital entity and provides
            complete lifecycle intelligence to improve trust, governance, and auditability.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

