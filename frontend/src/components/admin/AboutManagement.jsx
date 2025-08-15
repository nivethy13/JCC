// frontend/src/components/admin/AboutManagement.jsx
import React, { useState, useEffect } from 'react';
import { aboutServiceNoAuth as aboutService } from '../../services/aboutService';

const AboutManagement = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    who_we_are_title: '',
    who_we_are_description: '',
    who_we_are_mission: '',
    who_we_are_additional: '',
    vision_title: '',
    vision_description: '',
    mission_title: '',
    mission_description: '',
    legacy_title: '',
    legacy_description: '',
    establishment_year: '',
    events_hosted: '',
    happy_guests: '',
    years_of_excellence: '',
    cta_title: '',
    cta_subtitle: '',
    cta_button_text: '',
    address: '',
    phone: '',
    email: '',
  });

  const [imageFiles, setImageFiles] = useState({
    who_we_are_image: null,
  });

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const data = await aboutService.getAboutUs();
      setAboutData(data);
      setFormData({
        title: data.title || '',
        subtitle: data.subtitle || '',
        who_we_are_title: data.who_we_are_title || '',
        who_we_are_description: data.who_we_are_description || '',
        who_we_are_mission: data.who_we_are_mission || '',
        who_we_are_additional: data.who_we_are_additional || '',
        vision_title: data.vision_title || '',
        vision_description: data.vision_description || '',
        mission_title: data.mission_title || '',
        mission_description: data.mission_description || '',
        legacy_title: data.legacy_title || '',
        legacy_description: data.legacy_description || '',
        establishment_year: data.establishment_year || '',
        events_hosted: data.events_hosted || '',
        happy_guests: data.happy_guests || '',
        years_of_excellence: data.years_of_excellence || '',
        cta_title: data.cta_title || '',
        cta_subtitle: data.cta_subtitle || '',
        cta_button_text: data.cta_button_text || '',
        address: data.address || '',
        phone: data.phone || '',
        email: data.email || '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setImageFiles(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const formDataToSend = new FormData();

      // Add text fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Add image files
      Object.keys(imageFiles).forEach(key => {
        if (imageFiles[key]) {
          formDataToSend.append(key, imageFiles[key]);
        }
      });

      await aboutService.updateAboutUs(formDataToSend);
      setMessage('About Us information updated successfully!');
      
      // Refresh data
      await fetchAboutData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (imageFile, caption = '') => {
    setUploadingImage(true);
    try {
      await aboutService.uploadImage({ image: imageFile, caption });
      setMessage('Image uploaded successfully!');
      await fetchAboutData();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await aboutService.deleteImage(imageId);
        setMessage('Image deleted successfully!');
        await fetchAboutData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleImageCaptionUpdate = async (imageId, newCaption) => {
    try {
      await aboutService.updateImageCaption(imageId, newCaption);
      setMessage('Caption updated successfully!');
      await fetchAboutData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading About Us data...</div>;
  }

  return (
    <div className="about-management">
      <div className="admin-header">
        <h1>About Us Management</h1>
        <p>Manage the About Us page content and images</p>
      </div>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="about-form">
        {/* Header Section */}
        <div className="form-section">
          <h3>Header Section</h3>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="About Jaffna Cultural Centre"
            />
          </div>
          <div className="form-group">
            <label>Subtitle</label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleInputChange}
              placeholder="Preserving Culture Through Celebrations"
            />
          </div>
        </div>

        {/* Who We Are Section */}
        <div className="form-section">
          <h3>Who We Are Section</h3>
          <div className="form-group">
            <label>Section Title</label>
            <input
              type="text"
              name="who_we_are_title"
              value={formData.who_we_are_title}
              onChange={handleInputChange}
              placeholder="Who We Are"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="who_we_are_description"
              value={formData.who_we_are_description}
              onChange={handleInputChange}
              rows="4"
              placeholder="Main description about the cultural centre..."
            />
          </div>
          <div className="form-group">
            <label>Mission Statement</label>
            <textarea
              name="who_we_are_mission"
              value={formData.who_we_are_mission}
              onChange={handleInputChange}
              rows="3"
              placeholder="Our mission statement..."
            />
          </div>
          <div className="form-group">
            <label>Additional Information</label>
            <textarea
              name="who_we_are_additional"
              value={formData.who_we_are_additional}
              onChange={handleInputChange}
              rows="3"
              placeholder="Additional information (optional)..."
            />
          </div>
          <div className="form-group">
            <label>Section Image</label>
            <input
              type="file"
              name="who_we_are_image"
              onChange={handleFileChange}
              accept="image/*"
            />
            {aboutData?.who_we_are_image && (
              <div className="current-image">
                <img src={aboutData.who_we_are_image} alt="Current" style={{maxWidth: '200px', height: 'auto'}} />
                <p>Current image</p>
              </div>
            )}
          </div>
        </div>

        {/* Vision & Mission Section */}
        <div className="form-section">
          <h3>Vision & Mission</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Vision Title</label>
              <input
                type="text"
                name="vision_title"
                value={formData.vision_title}
                onChange={handleInputChange}
                placeholder="Our Vision"
              />
            </div>
            <div className="form-group">
              <label>Mission Title</label>
              <input
                type="text"
                name="mission_title"
                value={formData.mission_title}
                onChange={handleInputChange}
                placeholder="Our Mission"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Vision Description</label>
              <textarea
                name="vision_description"
                value={formData.vision_description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Vision statement..."
              />
            </div>
            <div className="form-group">
              <label>Mission Description</label>
              <textarea
                name="mission_description"
                value={formData.mission_description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Mission statement..."
              />
            </div>
          </div>
        </div>

        {/* Legacy Section */}
        <div className="form-section">
          <h3>Legacy Section</h3>
          <div className="form-group">
            <label>Legacy Title</label>
            <input
              type="text"
              name="legacy_title"
              value={formData.legacy_title}
              onChange={handleInputChange}
              placeholder="Our Legacy"
            />
          </div>
          <div className="form-group">
            <label>Legacy Description</label>
            <textarea
              name="legacy_description"
              value={formData.legacy_description}
              onChange={handleInputChange}
              rows="4"
              placeholder="Legacy description..."
            />
          </div>
          <div className="form-group">
            <label>Establishment Year</label>
            <input
              type="number"
              name="establishment_year"
              value={formData.establishment_year}
              onChange={handleInputChange}
              placeholder="1985"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="form-section">
          <h3>Statistics</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Events Hosted</label>
              <input
                type="number"
                name="events_hosted"
                value={formData.events_hosted}
                onChange={handleInputChange}
                placeholder="5000"
              />
            </div>
            <div className="form-group">
              <label>Happy Guests</label>
              <input
                type="number"
                name="happy_guests"
                value={formData.happy_guests}
                onChange={handleInputChange}
                placeholder="50000"
              />
            </div>
            <div className="form-group">
              <label>Years of Excellence</label>
              <input
                type="number"
                name="years_of_excellence"
                value={formData.years_of_excellence}
                onChange={handleInputChange}
                placeholder="38"
              />
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="form-section">
          <h3>Call to Action</h3>
          <div className="form-group">
            <label>CTA Title</label>
            <input
              type="text"
              name="cta_title"
              value={formData.cta_title}
              onChange={handleInputChange}
              placeholder="Looking to Book a Venue?"
            />
          </div>
          <div className="form-group">
            <label>CTA Subtitle</label>
            <textarea
              name="cta_subtitle"
              value={formData.cta_subtitle}
              onChange={handleInputChange}
              rows="3"
              placeholder="CTA description..."
            />
          </div>
          <div className="form-group">
            <label>Button Text</label>
            <input
              type="text"
              name="cta_button_text"
              value={formData.cta_button_text}
              onChange={handleInputChange}
              placeholder="Explore Our Halls"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="form-section">
          <h3>Contact Information</h3>
          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="2"
              placeholder="123 Cultural Street, Jaffna"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+94 21 123 4567"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="info@eventaura.lk"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={saving} className="save-button">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Additional Images Management */}
      <div className="images-section">
        <h3>Additional Images</h3>
        
        {/* Image Upload */}
        <div className="image-upload">
          <h4>Upload New Image</h4>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files[0]) {
                handleImageUpload(e.target.files[0]);
              }
            }}
            disabled={uploadingImage}
          />
          {uploadingImage && <p>Uploading...</p>}
        </div>

        {/* Current Images */}
        {aboutData?.additional_images?.length > 0 && (
          <div className="current-images">
            <h4>Current Images</h4>
            <div className="images-grid">
              {aboutData.additional_images.map((image) => (
                <div key={image.id} className="image-item">
                  <img src={image.image} alt={image.caption} />
                  <div className="image-controls">
                    <input
                      type="text"
                      value={image.caption}
                      onChange={(e) => handleImageCaptionUpdate(image.id, e.target.value)}
                      placeholder="Image caption..."
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(image.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .about-management {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .admin-header {
          margin-bottom: 30px;
        }

        .admin-header h1 {
          color: #8B2635;
          margin-bottom: 10px;
        }

        .success-message {
          background: #d4edda;
          color: #155724;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .form-section {
          background: #f8f9fa;
          padding: 20px;
          margin-bottom: 20px;
          border-radius: 8px;
        }

        .form-section h3 {
          color: #8B2635;
          margin-bottom: 15px;
          border-bottom: 2px solid #8B2635;
          padding-bottom: 5px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #333;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-group textarea {
          resize: vertical;
        }

        .current-image {
          margin-top: 10px;
        }

        .current-image p {
          margin-top: 5px;
          color: #666;
          font-size: 12px;
        }

        .form-actions {
          text-align: center;
          margin: 30px 0;
        }

        .save-button {
          background: #8B2635;
          color: white;
          padding: 12px 30px;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.3s;
        }

        .save-button:hover:not(:disabled) {
          background: #6d1e29;
        }

        .save-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .images-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
        }

        .images-section h3,
        .images-section h4 {
          color: #8B2635;
        }

        .image-upload {
          margin-bottom: 30px;
          padding: 20px;
          border: 2px dashed #ddd;
          border-radius: 8px;
          text-align: center;
        }

        .images-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .image-item {
          background: white;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .image-item img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 4px;
          margin-bottom: 10px;
        }

        .image-controls input {
          width: 100%;
          margin-bottom: 10px;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .delete-button {
          background: #dc3545;
          color: white;
          padding: 8px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .delete-button:hover {
          background: #c82333;
        }

        .admin-loading {
          text-align: center;
          padding: 50px;
          font-size: 18px;
          color: #666;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .images-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutManagement;