// src/services/galleryApi.js
const API_BASE_URL = 'http://localhost:8000/api/gallery';

// Enhanced response handler
const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    const error = new Error(data.message || data.detail || 'Request failed');
    error.status = response.status;
    error.data = data;
    if (response.status === 404) {
      error.message = 'Resource not found';
    }
    throw error;
  }
  
  return data;
};

// Helper function to validate image files
const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed: JPEG, PNG, GIF, WebP`);
  }
  
  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum 10MB allowed.');
  }
  
  return true;
};

// Enhanced bulk upload with better error handling and progress tracking
export const bulkUploadImages = async (files, metadata, onProgress) => {
  try {
    const uploadedImages = [];
    const failedUploads = [];
    const totalFiles = files.length;
    
    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      
      try {
        // Validate file before upload
        validateImageFile(file);
        
        const formData = new FormData();
        
        // Generate title from filename if not provided
        const title = metadata.title || file.name.split('.')[0].replace(/[_-]/g, ' ');
        
        formData.append('image', file);
        formData.append('title', title);
        formData.append('description', metadata.description || '');
        formData.append('category', metadata.category);
        if (metadata.hall) formData.append('hall', metadata.hall);
        formData.append('is_featured', metadata.is_featured || false);
        formData.append('is_public', metadata.is_public !== false);
        formData.append('tags', metadata.tags || '');
        formData.append('alt_text', metadata.alt_text || title);
        
        const response = await fetch(`${API_BASE_URL}/admin/images/`, {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const createdImage = await response.json();
          uploadedImages.push(createdImage);
        } else {
          const errorData = await response.json().catch(() => ({}));
          failedUploads.push({
            file: file.name,
            error: errorData.message || errorData.detail || 'Upload failed'
          });
        }
      } catch (err) {
        console.error(`Error uploading ${file.name}:`, err);
        failedUploads.push({
          file: file.name,
          error: err.message
        });
      }
      
      // Update progress
      if (onProgress) {
        onProgress((i + 1) / totalFiles);
      }
    }

    // Return results with success and failure information
    // eslint-disable-next-line no-unused-vars
    const result = {
      success: uploadedImages,
      failed: failedUploads,
      successCount: uploadedImages.length,
      failedCount: failedUploads.length
    };

    if (failedUploads.length > 0) {
      console.warn('Some uploads failed:', failedUploads);
    }

    return uploadedImages; // Return successful uploads for compatibility
  } catch (err) {
    console.error('Bulk upload error:', err);
    throw new Error(err.message || 'Failed to upload images');
  }
};

// Enhanced single image upload
export const createGalleryImage = async (formData) => {
  try {
    // Validate image file if present
    const imageFile = formData.get('image');
    if (imageFile && imageFile instanceof File) {
      validateImageFile(imageFile);
    }

    const response = await fetch(`${API_BASE_URL}/admin/images/`, {
      method: 'POST',
      body: formData,
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Image creation error:', error);
    throw new Error(error.message || 'Failed to create image');
  }
};

// Fetch gallery images with enhanced filtering
export const fetchGalleryImages = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_BASE_URL}/images/?${query}` : `${API_BASE_URL}/images/`;
    const response = await fetch(url);
    return await handleResponse(response);
  } catch (error) {
    console.error('Gallery images fetch error:', error);
    throw new Error(error.message || 'Failed to fetch gallery images');
  }
};

// Fetch single image with view increment
export const fetchGalleryImage = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/images/${id}/`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Gallery image fetch error:', error);
    throw new Error(error.message || 'Failed to fetch image details');
  }
};

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Categories fetch error:', error);
    throw new Error(error.message || 'Failed to fetch categories');
  }
};

export const fetchHalls = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/halls/`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Halls fetch error:', error);
    throw new Error(error.message || 'Failed to fetch halls');
  }
};

export const updateGalleryImage = async (id, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/images/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Update error:', error);
    throw error;
  }
};

export const deleteGalleryImage = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/images/${id}/`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.detail || 'Failed to delete image');
    }
    
    return true;
  } catch (error) {
    console.error('Image deletion error:', error);
    throw new Error(error.message || 'Failed to delete image');
  }
};

export const bulkDeleteImages = async (ids) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/images/bulk-delete/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image_ids: ids }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Bulk delete error:', error);
    throw new Error(error.message || 'Failed to delete images');
  }
};

export const bulkUpdateImages = async (ids, updateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/images/bulk-update/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        image_ids: ids,
        update_data: updateData 
      }),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Bulk update error:', error);
    throw error;
  }
};

// Category Management APIs
export const createCategory = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/categories/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Category creation error:', error);
    throw new Error(error.message || 'Failed to create category');
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/categories/${id}/`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.detail || 'Failed to delete category');
    }
    
    return true;
  } catch (error) {
    console.error('Category deletion error:', error);
    throw new Error(error.message || 'Failed to delete category');
  }
};

// Cloudinary specific utilities
export const getOptimizedImageUrl = (publicId, transformations = {}) => {
  if (!publicId) return null;
  
  const baseUrl = 'https://res.cloudinary.com/damplktwn/image/upload';
  const defaultTransformations = {
    quality: 'auto',
    fetch_format: 'auto',
    ...transformations
  };
  
  const transformString = Object.entries(defaultTransformations)
    .map(([key, value]) => `${key}_${value}`)
    .join(',');
  
  return `${baseUrl}/${transformString}/${publicId}`;
};

export const getThumbnailUrl = (publicId, size = 300) => {
  return getOptimizedImageUrl(publicId, {
    width: size,
    height: size,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto'
  });
};