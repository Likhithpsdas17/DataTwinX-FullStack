import { useEffect, useState } from 'react';

const slides = [
  {
    image:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    title: 'Digital Twin for Every Data Asset',
    subtitle: 'Track creation, access, modification, versioning, and deletion with full visibility.'
  },
  {
    image:
      'https://images.unsplash.com/photo-1551281044-8b2f9f8d9f26?q=80&w=1200&auto=format&fit=crop',
    title: 'Lifecycle + Provenance Intelligence',
    subtitle: 'Maintain complete audit trails to strengthen governance and accountability.'
  },
  {
    image:
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop',
    title: 'Integrity & Trust Score Monitoring',
    subtitle: 'Identify high-risk data through trust scoring and rule-based risk analysis.'
  }
];

export default function ImageSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="slider-wrap">
      <div className="slider">
        {slides.map((slide, index) => (
          <div
            key={slide.title}
            className={`slide ${index === active ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-overlay">
              <h2>{slide.title}</h2>
              <p>{slide.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === active ? 'active' : ''}`}
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

