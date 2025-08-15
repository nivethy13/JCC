import React, { useState, useEffect } from 'react';
import { 
  fetchGalleryImages, 
  fetchCategories, 
  fetchHalls,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  bulkDeleteImages,
  bulkUpdateImages,
  createCategory,
  deleteCategory,
  bulkUploadImages
} from '../../services/galleryApi';
import '../../css/AdminGallery.css';

const GalleryManagement = () => {
  // Main state
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('images');

  // Image management state
  const [selectedImages, setSelectedImages] = useState([]);
  const [editImage, setEditImage] = useState(null);
  
  // Single image upload state
  const [newImage, setNewImage] = useState({
    title: '',
    description: '',
    category: '',
    hall: '',
    is_featured: false,
    is_public: true,
    tags: '',
    alt_text: '',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');

  // Bulk operations state
  const [bulkUpdate, setBulkUpdate] = useState({
    category: '',
    hall: '',
    is_featured: false,
    is_public: true,
  });
  const [bulkFiles, setBulkFiles] = useState([]);
  const [bulkUploadProgress, setBulkUploadProgress] = useState(0);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  // Category management state
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    is_active: true
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [imagesData, categoriesData, hallsData] = await Promise.all([
          fetchGalleryImages(),
          fetchCategories(),
          fetchHalls(),
        ]);
        setImages(imagesData.results || imagesData);
        setCategories(categoriesData.results || categoriesData);
        setHalls(hallsData.results || hallsData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Image selection handlers
  const handleSelectImage = (id) => {
    setSelectedImages(prev => 
      prev.includes(id) 
        ? prev.filter(imgId => imgId !== id) 
        : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    setSelectedImages(e.target.checked ? images.map(img => img.id) : []);
  };

  // Single image operations
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview('');
    }
  };

  const handleNewImageChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewImage(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNewImageSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image file');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', newImage.title);
      formData.append('description', newImage.description);
      formData.append('category', newImage.category);
      if (newImage.hall) formData.append('hall', newImage.hall);
      formData.append('is_featured', newImage.is_featured);
      formData.append('is_public', newImage.is_public);
      formData.append('tags', newImage.tags);
      formData.append('alt_text', newImage.alt_text);
      
      const createdImage = await createGalleryImage(formData);
      setImages([createdImage, ...images]);
      
      // Reset form
      setNewImage({
        title: '',
        description: '',
        category: '',
        hall: '',
        is_featured: false,
        is_public: true,
        tags: '',
        alt_text: '',
      });
      setFile(null);
      setPreview('');
      setError(null);
    } catch (err) {
      console.error('Error creating image:', err);
      setError(err.message || 'Failed to create image');
    }
  };

  // Bulk operations
  const handleBulkFileChange = (e) => {
    setBulkFiles(Array.from(e.target.files));
  };


  const handleBulkUpdateChange = (e) => {
  const { name, value, type, checked } = e.target;
    setBulkUpdate(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleBulkUpload = async (e) => {
  e.preventDefault();
  
  if (bulkFiles.length === 0) {
    setError('Please select at least one image');
    return;
  }

  if (!newImage.category) {
    setError('Please select a default category');
    return;
  }

  setIsBulkUploading(true);
  setBulkUploadProgress(0);
  setError(null);

  try {
    const uploadedImages = await bulkUploadImages(
      bulkFiles,
      {
        category: newImage.category,
        hall: newImage.hall,
        is_featured: newImage.is_featured,
        is_public: newImage.is_public,
        tags: newImage.tags,
        alt_text: newImage.alt_text,
        description: newImage.description
      },
      (progress) => {
        setBulkUploadProgress(Math.round(progress * 100));
      }
    );

    setImages([...uploadedImages, ...images]);
    setBulkFiles([]);
  } catch (err) {
    console.error('Bulk upload error:', err);
    setError(err.message || 'Failed to upload some images');
  } finally {
    setIsBulkUploading(false);
  }
};
  const handleBulkUpdate = async () => {
    if (selectedImages.length === 0) {
      setError('Please select at least one image');
      return;
    }
    
     if (bulkFiles.length === 0) {
    setError('Please select at least one image');
    return;
  }

  if (!newImage.category) {
    setError('Please select a default category');
    return;
  }

  setIsBulkUploading(true);
  setBulkUploadProgress(0);
  setError(null);

    try {
      const updateData = {};
      if (bulkUpdate.category) updateData.category = bulkUpdate.category;
      if (bulkUpdate.hall) updateData.hall = bulkUpdate.hall;
      if (bulkUpdate.is_featured !== undefined) updateData.is_featured = bulkUpdate.is_featured;
      if (bulkUpdate.is_public !== undefined) updateData.is_public = bulkUpdate.is_public;
      
      await bulkUpdateImages(selectedImages, updateData);
      
      // Update local state
      setImages(images.map(img => 
        selectedImages.includes(img.id) ? { ...img, ...updateData } : img
      ));
      
      // Reset selections
      setSelectedImages([]);
      setBulkUpdate({
        category: '',
        hall: '',
        is_featured: false,
        is_public: true,
      });
    } catch (err) {
      console.error('Bulk update error:', err);
      setError(err.message || 'Failed to update images');
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedImages.length} images?`)) {
      return;
    }

    try {
      await bulkDeleteImages(selectedImages);
      setImages(images.filter(img => !selectedImages.includes(img.id)));
      setSelectedImages([]);
    } catch (err) {
      console.error('Error deleting images:', err);
      setError('Failed to delete images. Please try again.');
    }
  };

  // Image editing
  const handleEdit = (image) => {
    setEditImage(image);
    setNewImage({
      title: image.title,
      description: image.description || '',
      category: image.category?.id || '',
      hall: image.hall?.id || '',
      is_featured: image.is_featured || false,
      is_public: image.is_public !== false,
      tags: image.tags || '',
      alt_text: image.alt_text || '',
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedImage = await updateGalleryImage(editImage.id, newImage);
      setImages(images.map(img => 
        img.id === editImage.id ? updatedImage : img
      ));
      setEditImage(null);
    } catch (err) {
      console.error('Error updating image:', err);
      setError(err.message || 'Failed to update image');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteGalleryImage(id);
        setImages(images.filter(img => img.id !== id));
      } catch (err) {
        console.error('Error deleting image:', err);
        setError('Failed to delete image. Please try again.');
      }
    }
  };

  // Category management
  const handleNewCategoryChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCategory(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      const createdCategory = await createCategory(newCategory);
      setCategories([...categories, createdCategory]);
      setNewCategory({
        name: '',
        description: '',
        is_active: true
      });
    } catch (err) {
      console.error('Error creating category:', err);
      setError(err.message || 'Failed to create category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? Images in this category will not be deleted.')) {
      try {
        await deleteCategory(id);
        setCategories(categories.filter(cat => cat.id !== id));
      } catch (err) {
        console.error('Error deleting category:', err);
        setError('Failed to delete category. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading gallery data...</div>;
  }

  return (
    <div className="admin-gallery-container">
      <h1>Gallery Management</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="admin-tabs">
        <button 
          className={activeTab === 'images' ? 'active' : ''}
          onClick={() => setActiveTab('images')}
        >
          Images
        </button>
        <button 
          className={activeTab === 'categories' ? 'active' : ''}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
        <button 
          className={activeTab === 'halls' ? 'active' : ''}
          onClick={() => setActiveTab('halls')}
        >
          Halls
        </button>
      </div>

      {activeTab === 'images' && (
        <>
          {/* Bulk Actions Section */}
          <div className="bulk-actions">
            <h2>Bulk Actions</h2>
            
            {/* Bulk Upload */}
            <div className="bulk-upload-section">
              <h3>Bulk Upload Images</h3>
              <form onSubmit={handleBulkUpload}>
                <div className="form-group">
                  <label>Select Images:</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleBulkFileChange}
                    disabled={isBulkUploading}
                  />
                  {bulkFiles.length > 0 && (
                    <div className="file-list">
                      <p>Selected files: {bulkFiles.length}</p>
                      <ul>
                        {bulkFiles.map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Default Category:</label>
                    <select
                      name="category"
                      value={newImage.category}
                      onChange={handleNewImageChange}
                      disabled={isBulkUploading}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Default Hall:</label>
                    <select
                      name="hall"
                      value={newImage.hall}
                      onChange={handleNewImageChange}
                      disabled={isBulkUploading}
                    >
                      <option value="">Select Hall (Optional)</option>
                      {halls.map(hall => (
                        <option key={hall.id} value={hall.id}>
                          Hall {hall.section_number} - {hall.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        name="is_featured"
                        checked={newImage.is_featured}
                        onChange={handleNewImageChange}
                        disabled={isBulkUploading}
                      />
                      Mark as Featured
                    </label>
                  </div>
                  
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        name="is_public"
                        checked={newImage.is_public}
                        onChange={handleNewImageChange}
                        disabled={isBulkUploading}
                      />
                      Make Public
                    </label>
                  </div>
                </div>
                
                {isBulkUploading && (
                  <div className="upload-progress">
                    <progress value={bulkUploadProgress} max="100" />
                    <span>{bulkUploadProgress}%</span>
                  </div>
                )}
                
                <div className="form-actions">
                  <button 
                    type="submit" 
                    disabled={bulkFiles.length === 0 || isBulkUploading || !newImage.category}
                    className="submit-btn"
                  >
                    {isBulkUploading ? 'Uploading...' : `Upload ${bulkFiles.length} Files`}
                  </button>
                  
                  {bulkFiles.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setBulkFiles([])}
                      disabled={isBulkUploading}
                      className="cancel-btn"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>
              </form>
            </div>
            
            {/* Bulk Update */}
            <div className="bulk-update-section">
              <h3>Bulk Update Selected Images</h3>
              <div className="bulk-controls">
                <div className="form-row">
                  <div className="form-group">
                    <label>Update Category:</label>
                    <select
                      name="category"
                      value={bulkUpdate.category}
                      onChange={handleBulkUpdateChange}
                      disabled={selectedImages.length === 0}
                    >
                      <option value="">-- No Change --</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Update Hall:</label>
                    <select
                      name="hall"
                      value={bulkUpdate.hall}
                      onChange={handleBulkUpdateChange}
                      disabled={selectedImages.length === 0}
                    >
                      <option value="">-- No Change --</option>
                      {halls.map(hall => (
                        <option key={hall.id} value={hall.id}>
                          Hall {hall.section_number} - {hall.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        name="is_featured"
                        checked={bulkUpdate.is_featured}
                        onChange={handleBulkUpdateChange}
                        disabled={selectedImages.length === 0}
                      />
                      Set Featured
                    </label>
                  </div>
                  
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        name="is_public"
                        checked={bulkUpdate.is_public}
                        onChange={handleBulkUpdateChange}
                        disabled={selectedImages.length === 0}
                      />
                      Set Public
                    </label>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button 
                    onClick={handleBulkUpdate}
                    disabled={selectedImages.length === 0 || isBulkUpdating}
                    className="submit-btn"
                  >
                    {isBulkUpdating ? 'Updating...' : `Apply to ${selectedImages.length} Selected`}
                  </button>
                  
                  <button 
                    onClick={handleBulkDelete}
                    disabled={selectedImages.length === 0}
                    className="delete-btn"
                  >
                    Delete Selected
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Add New Image Form */}
          <div className="add-image-form">
            <h2>Add New Image</h2>
            <form onSubmit={handleNewImageSubmit}>
              <div className="form-group">
                <label>Image File:</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  required 
                />
                {preview && <img src={preview} alt="Preview" className="image-preview" />}
              </div>
              
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={newImage.title}
                  onChange={handleNewImageChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={newImage.description}
                  onChange={handleNewImageChange}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Category:</label>
                  <select
                    name="category"
                    value={newImage.category}
                    onChange={handleNewImageChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Hall:</label>
                  <select
                    name="hall"
                    value={newImage.hall}
                    onChange={handleNewImageChange}
                  >
                    <option value="">Select Hall (Optional)</option>
                    {halls.map(hall => (
                      <option key={hall.id} value={hall.id}>
                        Hall {hall.section_number} - {hall.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={newImage.is_featured}
                      onChange={handleNewImageChange}
                    />
                    Featured
                  </label>
                </div>
                
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="is_public"
                      checked={newImage.is_public}
                      onChange={handleNewImageChange}
                    />
                    Public
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <label>Tags (comma separated):</label>
                <input
                  type="text"
                  name="tags"
                  value={newImage.tags}
                  onChange={handleNewImageChange}
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              
              <div className="form-group">
                <label>Alt Text:</label>
                <input
                  type="text"
                  name="alt_text"
                  value={newImage.alt_text}
                  onChange={handleNewImageChange}
                  placeholder="Description for screen readers"
                />
              </div>
              
              <button type="submit" className="submit-btn">
                Upload Image
              </button>
            </form>
          </div>
          
          {/* Images List */}
          <div className="gallery-list">
            <h2>All Images ({images.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>
                    <input 
                      type="checkbox" 
                      onChange={handleSelectAll}
                      checked={selectedImages.length === images.length && images.length > 0}
                    />
                  </th>
                  <th>Thumbnail</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Hall</th>
                  <th>Featured</th>
                  <th>Public</th>
                  <th>Views</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {images.map(image => (
                  <tr key={image.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedImages.includes(image.id)}
                        onChange={() => handleSelectImage(image.id)}
                      />
                    </td>
                    <td>
                      <img 
                        src={image.thumbnail || image.image} 
                        alt={image.alt_text || image.title}
                        className="thumbnail"
                      />
                    </td>
                    <td>{image.title}</td>
                    <td>{image.category_name}</td>
                    <td>
                      {image.hall_name ? `Hall ${image.hall_section} - ${image.hall_name}` : '-'}
                    </td>
                    <td>{image.is_featured ? 'Yes' : 'No'}</td>
                    <td>{image.is_public ? 'Yes' : 'No'}</td>
                    <td>{image.views}</td>
                    <td>
                      <button onClick={() => handleEdit(image)}>Edit</button>
                      <button 
                        onClick={() => handleDelete(image.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Edit Image Modal */}
          {editImage && (
            <div className="modal">
              <div className="modal-content">
                <h2>Edit Image</h2>
                <form onSubmit={handleUpdate}>
                  <div className="form-group">
                    <label>Title:</label>
                    <input
                      type="text"
                      name="title"
                      value={newImage.title}
                      onChange={handleNewImageChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Description:</label>
                    <textarea
                      name="description"
                      value={newImage.description}
                      onChange={handleNewImageChange}
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Category:</label>
                      <select
                        name="category"
                        value={newImage.category}
                        onChange={handleNewImageChange}
                        required
                      >
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Hall:</label>
                      <select
                        name="hall"
                        value={newImage.hall}
                        onChange={handleNewImageChange}
                      >
                        <option value="">Select Hall (Optional)</option>
                        {halls.map(hall => (
                          <option key={hall.id} value={hall.id}>
                            Hall {hall.section_number} - {hall.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          name="is_featured"
                          checked={newImage.is_featured}
                          onChange={handleNewImageChange}
                        />
                        Featured
                      </label>
                    </div>
                    
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          name="is_public"
                          checked={newImage.is_public}
                          onChange={handleNewImageChange}
                        />
                        Public
                      </label>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Tags (comma separated):</label>
                    <input
                      type="text"
                      name="tags"
                      value={newImage.tags}
                      onChange={handleNewImageChange}
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Alt Text:</label>
                    <input
                      type="text"
                      name="alt_text"
                      value={newImage.alt_text}
                      onChange={handleNewImageChange}
                      placeholder="Description for screen readers"
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" className="submit-btn">
                      Save Changes
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setEditImage(null)}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'categories' && (
        <div className="category-management">
          <h2>Category Management</h2>
          
          <div className="add-category-form">
            <h3>Add New Category</h3>
            <form onSubmit={handleCreateCategory}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={newCategory.name}
                  onChange={handleNewCategoryChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={newCategory.description}
                  onChange={handleNewCategoryChange}
                />
              </div>
              
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={newCategory.is_active}
                    onChange={handleNewCategoryChange}
                  />
                  Active
                </label>
              </div>
              
              <button type="submit" className="submit-btn">
                Create Category
              </button>
            </form>
          </div>
          
          <div className="categories-list">
            <h3>All Categories ({categories.length})</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    <td>{category.description || '-'}</td>
                    <td>{category.is_active ? 'Active' : 'Inactive'}</td>
                    <td>
                      <button 
                        onClick={() => handleDeleteCategory(category.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'halls' && (
        <div className="hall-management">
          <h2>Hall List</h2>
          <div className="halls-list">
            <h3>All Halls ({halls.length})</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Section</th>
                  <th>Capacity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {halls.map(hall => (
                  <tr key={hall.id}>
                    <td>{hall.name}</td>
                    <td>{hall.section_number}</td>
                    <td>{hall.capacity || '-'}</td>
                    <td>{hall.is_active ? 'Active' : 'Inactive'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;