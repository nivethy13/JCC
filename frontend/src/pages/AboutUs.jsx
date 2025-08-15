// frontend/src/pages/AboutPage.jsx
import React, { useState, useEffect } from 'react';
import { aboutService } from '../services/aboutService';
import '../css/AboutPageStyles.css';

const AboutUs = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const data = await aboutService.getAboutUs();
      setAboutData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error loading about page: {error}</p>
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="error-container">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="about-page">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">{aboutData.title}</h1>
          <p className="hero-subtitle">{aboutData.subtitle}</p>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="who-we-are-section">
        <div className="container">
          <div className="content-row">
            <div className="image-column">
              {aboutData.who_we_are_image && (
                <img 
                  src={aboutData.who_we_are_image} 
                  alt="Cultural Centre Interior"
                  className="section-image"
                />
              )}
            </div>
            <div className="text-column">
              <h2 className="section-title">{aboutData.who_we_are_title}</h2>
              <p className="section-text">{aboutData.who_we_are_description}</p>
              <p className="section-text">{aboutData.who_we_are_mission}</p>
              {aboutData.who_we_are_additional && (
                <p className="section-text">{aboutData.who_we_are_additional}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="vision-mission-section">
        <div className="container">
          <div className="cards-row">
            <div className="vision-card">
              <div className="card-icon">🎯</div>
              <h3 className="card-title">{aboutData.vision_title}</h3>
              <p className="card-text">{aboutData.vision_description}</p>
            </div>
            <div className="mission-card">
              <div className="card-icon">🎭</div>
              <h3 className="card-title">{aboutData.mission_title}</h3>
              <p className="card-text">{aboutData.mission_description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Legacy Section */}
      <section className="legacy-section">
        <div className="container">
          <h2 className="section-title centered">{aboutData.legacy_title}</h2>
          <p className="legacy-description">{aboutData.legacy_description}</p>
          
          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-icon">📅</div>
              <div className="stat-number">{aboutData.events_hosted.toLocaleString()}+</div>
              <div className="stat-label">Events Hosted</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">👥</div>
              <div className="stat-number">{(aboutData.happy_guests / 1000).toFixed(0)}+</div>
              <div className="stat-label">Happy Guests</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⭐</div>
              <div className="stat-number">{aboutData.years_of_excellence}</div>
              <div className="stat-label">Years of Excellence</div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Images Gallery */}
      {aboutData.additional_images && aboutData.additional_images.length > 0 && (
        <section className="gallery-section">
          <div className="container">
            <h2 className="section-title centered">Our Gallery</h2>
            <div className="images-grid">
              {aboutData.additional_images.map((image, index) => (
                <div key={image.id} className="gallery-item">
                  <img src={image.image} alt={image.caption || `Gallery image ${index + 1}`} />
                  {image.caption && <p className="image-caption">{image.caption}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-overlay"></div>
        <div className="cta-content">
          <h2 className="cta-title">{aboutData.cta_title}</h2>
          <p className="cta-subtitle">{aboutData.cta_subtitle}</p>
          <button className="cta-button">{aboutData.cta_button_text}</button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;