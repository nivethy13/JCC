// src/services/galleryApi.js
const API_BASE_URL = 'http://localhost:8000/api/gallery';

// Enhanced response handler
const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    const error = new Error(data.message || 'Request failed');
    error.status = response.status;
    error.data = data;
    if (response.status === 404) {
      error.message = 'Resource not found';
    }
    throw error;
  }
  
  return data;
};

export const bulkUploadImages = async (files, metadata, onProgress) => {
  try {
    const uploadedImages = [];
    const totalFiles = files.length;
    
    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      const formData = new FormData();
    
      const title = file.name.split('.')[0];
      
      formData.append('image', file);
      formData.append('title', title);
      formData.append('description', metadata.description || '');
      formData.append('category', metadata.category);
      if (metadata.hall) formData.append('hall', metadata.hall);
      formData.append('is_featured', metadata.is_featured);
      formData.append('is_public', metadata.is_public);
      formData.append('tags', metadata.tags || '');
      formData.append('alt_text', metadata.alt_text || '');
      
      try {
        const response = await fetch(`${API_BASE_URL}/admin/images/`, {
          method: 'POST',
          body: formData,
        });
        
        const createdImage = await handleResponse(response);
        uploadedImages.push(createdImage);
      } catch (err) {
        console.error(`Error uploading ${file.name}:`, err);
        // Continue with next file even if one fails
      }
      
      // Update progress
      if (onProgress) {
        onProgress((i + 1) / totalFiles);
      }
    }

    return uploadedImages;
  } catch (err) {
    console.error('Bulk upload error:', err);
    throw new Error(err.message || 'Failed to upload some images');
  }
};


export const fetchGalleryImages = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/images/?${query}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Gallery images fetch error:', error);
    throw new Error(error.message || 'Failed to fetch gallery images');
  }
};

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

// Image Management APIs
export const createGalleryImage = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/images/`, {
      method: 'POST',
      body: formData, // Note: No Content-Type header for FormData
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Image creation error:', error);
    throw new Error(error.message || 'Failed to create image');
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
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Update failed');
    }
    
    return await response.json();
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
    return await handleResponse(response);
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
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Bulk update failed');
    }
    
    return await response.json();
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
    return await handleResponse(response);
  } catch (error) {
    console.error('Category deletion error:', error);
    throw new Error(error.message || 'Failed to delete category');
  }
};








