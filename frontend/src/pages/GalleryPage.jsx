// src/pages/GalleryPage.jsx
import React, { useState, useEffect } from 'react';
import { fetchGalleryImages, fetchCategories, fetchHalls } from '../services/galleryApi';
import '../css/GalleryPage.css';

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    hall: '',
    is_featured: false,
    search: '',
  });
  const [hoveredImage, setHoveredImage] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [imagesData, categoriesData, hallsData] = await Promise.all([
          fetchGalleryImages(filters),
          fetchCategories(),
          fetchHalls(),
        ]);
        setImages(imagesData.results || imagesData);
        setCategories(categoriesData.results || categoriesData);
        setHalls(hallsData.results || hallsData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };
    loadData();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      hall: '',
      is_featured: false,
      search: '',
    });
  };

  if (loading) {
    return <div className="loading">Loading gallery...</div>;
  }

  return (
    <div className="gallery-container">
      <h1>Gallery</h1>
      
      <div className="filters">
        <input
          type="text"
          name="search"
          placeholder="Search images..."
          value={filters.search}
          onChange={handleFilterChange}
        />
        
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name} ({category.image_count})
            </option>
          ))}
        </select>
        
        <select
          name="hall"
          value={filters.hall}
          onChange={handleFilterChange}
        >
          <option value="">All Halls</option>
          {halls.map(hall => (
            <option key={hall.id} value={hall.id}>
              Hall {hall.section_number} - {hall.name}
            </option>
          ))}
        </select>
        
        <label>
          <input
            type="checkbox"
            name="is_featured"
            checked={filters.is_featured}
            onChange={handleFilterChange}
          />
          Featured Only
        </label>
        
        <button onClick={clearFilters}>Clear Filters</button>
      </div>
      
      <div className="image-grid">
        {images.length > 0 ? (
          images.map(image => (
            <div 
              key={image.id} 
              className="image-card"
              onMouseEnter={() => setHoveredImage(image)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              <img 
                src={image.image} 
                alt={image.alt_text || image.title}
                className="gallery-image"
              />
              
              {hoveredImage?.id === image.id && (
                <div className="image-info-overlay">
                  <h3>{image.title}</h3>
                  <p>{image.description}</p>
                  <div className="image-meta">
                    <span>Hall: {image.hall_name} (Section {image.hall_section})</span>
                    <span>Category: {image.category_name}</span>
                    <span>Uploaded: {image.formatted_date}</span>
                    <span>Views: {image.views}</span>
                    
                    {image.tags_list.length > 0 && (
                      <div className="tags">
                        {image.tags_list.map((tag, i) => (
                          <span key={i} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-results">No images found matching your criteria.</div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;