// import React, { useState, useEffect } from 'react';
// import { 
//   fetchGalleryImages, 
//   fetchCategories, 
//   fetchHalls,
//   createGalleryImage,
//   updateGalleryImage,
//   deleteGalleryImage,
//   bulkDeleteImages,
//   bulkUpdateImages,
//   createCategory,
//   deleteCategory,
//   bulkUploadImages,
//   // eslint-disable-next-line no-unused-vars
//   getOptimizedImageUrl,
//   // eslint-disable-next-line no-unused-vars
//   getThumbnailUrl
// } from '../../services/gallery';
// import '../../css/AdminGallery.css';

// const Gallery = () => {
//   // Main state
//   const [images, setImages] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [halls, setHalls] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [activeTab, setActiveTab] = useState('images');

//   // Image management state
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [editImage, setEditImage] = useState(null);
  
//   // Single image upload state
//   const [newImage, setNewImage] = useState({
//     title: '',
//     description: '',
//     category: '',
//     hall: '',
//     is_featured: false,
//     is_public: true,
//     tags: '',
//     alt_text: '',
//   });
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState('');

//   // Bulk operations state
//   const [bulkUpdate, setBulkUpdate] = useState({
//     category: '',
//     hall: '',
//     is_featured: false,
//     is_public: true,
//   });
//   const [bulkFiles, setBulkFiles] = useState([]);
//   const [bulkUploadProgress, setBulkUploadProgress] = useState(0);
//   const [isBulkUploading, setIsBulkUploading] = useState(false);
//   const [isBulkUpdating, setIsBulkUpdating] = useState(false);
//   // eslint-disable-next-line no-unused-vars
//   const [uploadResults, setUploadResults] = useState(null);

//   // Category management state
//   const [newCategory, setNewCategory] = useState({
//     name: '',
//     description: '',
//     is_active: true
//   });

//   // Clear messages after timeout
//   useEffect(() => {
//     if (success) {
//       const timer = setTimeout(() => setSuccess(null), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [success]);

//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => setError(null), 8000);
//       return () => clearTimeout(timer);
//     }
//   }, [error]);

//   // Load initial data
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setLoading(true);
//         const [imagesData, categoriesData, hallsData] = await Promise.all([
//           fetchGalleryImages(),
//           fetchCategories(),
//           fetchHalls(),
//         ]);
//         setImages(imagesData.results || imagesData);
//         setCategories(categoriesData.results || categoriesData);
//         setHalls(hallsData.results || hallsData);
//       } catch (err) {
//         console.error('Error loading data:', err);
//         setError('Failed to load data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadData();
//   }, []);

//   // Image selection handlers
//   const handleSelectImage = (id) => {
//     setSelectedImages(prev => 
//       prev.includes(id) 
//         ? prev.filter(imgId => imgId !== id) 
//         : [...prev, id]
//     );
//   };

//   const handleSelectAll = (e) => {
//     setSelectedImages(e.target.checked ? images.map(img => img.id) : []);
//   };

//   // File validation
//   const validateFile = (file) => {
//     const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
//     const maxSize = 10 * 1024 * 1024; // 10MB
    
//     if (!allowedTypes.includes(file.type)) {
//       throw new Error(`Invalid file type. Allowed: JPEG, PNG, GIF, WebP`);
//     }
    
//     if (file.size > maxSize) {
//       throw new Error('File size too large. Maximum 10MB allowed.');
//     }
    
//     return true;
//   };

//   // Single image operations
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
    
//     if (selectedFile) {
//       try {
//         validateFile(selectedFile);
//         setFile(selectedFile);
        
//         const reader = new FileReader();
//         reader.onloadend = () => setPreview(reader.result);
//         reader.readAsDataURL(selectedFile);
//         setError(null);
//       } catch (err) {
//         setError(err.message);
//         setFile(null);
//         setPreview('');
//       }
//     } else {
//       setFile(null);
//       setPreview('');
//     }
//   };

//   const handleNewImageChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setNewImage(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleNewImageSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       setError('Please select an image file');
//       return;
//     }
    
//     try {
//       const formData = new FormData();
//       formData.append('image', file);
//       formData.append('title', newImage.title);
//       formData.append('description', newImage.description);
//       formData.append('category', newImage.category);
//       if (newImage.hall) formData.append('hall', newImage.hall);
//       formData.append('is_featured', newImage.is_featured);
//       formData.append('is_public', newImage.is_public);
//       formData.append('tags', newImage.tags);
//       formData.append('alt_text', newImage.alt_text);
      
//       const createdImage = await createGalleryImage(formData);
//       setImages([createdImage, ...images]);
      
//       // Reset form
//       setNewImage({
//         title: '',
//         description: '',
//         category: '',
//         hall: '',
//         is_featured: false,
//         is_public: true,
//         tags: '',
//         alt_text: '',
//       });
//       setFile(null);
//       setPreview('');
//       setError(null);
//       setSuccess('Image uploaded successfully to Cloudinary!');
//     } catch (err) {
//       console.error('Error creating image:', err);
//       setError(err.message || 'Failed to create image');
//     }
//   };

//   // Bulk operations
//   const handleBulkFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     const validFiles = [];
//     const invalidFiles = [];

//     selectedFiles.forEach(file => {
//       try {
//         validateFile(file);
//         validFiles.push(file);
//       } catch (err) {
//         invalidFiles.push({ name: file.name, error: err.message });
//       }
//     });

//     setBulkFiles(validFiles);
    
//     if (invalidFiles.length > 0) {
//       setError(`Some files were rejected: ${invalidFiles.map(f => `${f.name} (${f.error})`).join(', ')}`);
//     }
//   };

//   const handleBulkUpdateChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setBulkUpdate(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleBulkUpload = async (e) => {
//     e.preventDefault();
    
//     if (bulkFiles.length === 0) {
//       setError('Please select at least one valid image');
//       return;
//     }

//     if (!newImage.category) {
//       setError('Please select a default category');
//       return;
//     }

//     setIsBulkUploading(true);
//     setBulkUploadProgress(0);
//     setError(null);
//     setUploadResults(null);

//     try {
//       const uploadedImages = await bulkUploadImages(
//         bulkFiles,
//         {
//           category: newImage.category,
//           hall: newImage.hall,
//           is_featured: newImage.is_featured,
//           is_public: newImage.is_public,
//           tags: newImage.tags,
//           alt_text: newImage.alt_text,
//           description: newImage.description
//         },
//         (progress) => {
//           setBulkUploadProgress(Math.round(progress * 100));
//         }
//       );

//       setImages([...uploadedImages, ...images]);
//       setBulkFiles([]);
//       setSuccess(`Successfully uploaded ${uploadedImages.length} images to Cloudinary!`);
      
//       // Reset file input
//       const fileInput = document.querySelector('input[type="file"][multiple]');
//       if (fileInput) fileInput.value = '';
      
//     } catch (err) {
//       console.error('Bulk upload error:', err);
//       setError(err.message || 'Failed to upload some images');
//     } finally {
//       setIsBulkUploading(false);
//       setBulkUploadProgress(0);
//     }
//   };

//   const handleBulkUpdate = async () => {
//     if (selectedImages.length === 0) {
//       setError('Please select at least one image');
//       return;
//     }
    
//     setIsBulkUpdating(true);
//     setError(null);

//     try {
//       const updateData = {};
//       if (bulkUpdate.category) updateData.category = bulkUpdate.category;
//       if (bulkUpdate.hall) updateData.hall = bulkUpdate.hall;
//       updateData.is_featured = bulkUpdate.is_featured;
//       updateData.is_public = bulkUpdate.is_public;
      
//       await bulkUpdateImages(selectedImages, updateData);
      
//       // Update local state
//       setImages(images.map(img => 
//         selectedImages.includes(img.id) ? { ...img, ...updateData } : img
//       ));
      
//       // Reset selections
//       setSelectedImages([]);
//       setBulkUpdate({
//         category: '',
//         hall: '',
//         is_featured: false,
//         is_public: true,
//       });
      
//       setSuccess(`Successfully updated ${selectedImages.length} images!`);
//     } catch (err) {
//       console.error('Bulk update error:', err);
//       setError(err.message || 'Failed to update images');
//     } finally {
//       setIsBulkUpdating(false);
//     }
//   };

//   const handleBulkDelete = async () => {
//     if (selectedImages.length === 0) return;
    
//     if (!window.confirm(`Are you sure you want to delete ${selectedImages.length} images? This will also remove them from Cloudinary.`)) {
//       return;
//     }

//     try {
//       await bulkDeleteImages(selectedImages);
//       setImages(images.filter(img => !selectedImages.includes(img.id)));
//       setSelectedImages([]);
//       setSuccess(`Successfully deleted ${selectedImages.length} images from both database and Cloudinary!`);
//     } catch (err) {
//       console.error('Error deleting images:', err);
//       setError('Failed to delete images. Please try again.');
//     }
//   };

//   // Image editing
//   const handleEdit = (image) => {
//     setEditImage(image);
//     setNewImage({
//       title: image.title,
//       description: image.description || '',
//       category: image.category || '',
//       hall: image.hall || '',
//       is_featured: image.is_featured || false,
//       is_public: image.is_public !== false,
//       tags: image.tags || '',
//       alt_text: image.alt_text || '',
//     });
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       const updatedImage = await updateGalleryImage(editImage.id, newImage);
//       setImages(images.map(img => 
//         img.id === editImage.id ? updatedImage : img
//       ));
//       setEditImage(null);
//       setSuccess('Image updated successfully!');
//     } catch (err) {
//       console.error('Error updating image:', err);
//       setError(err.message || 'Failed to update image');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this image? This will also remove it from Cloudinary.')) {
//       try {
//         await deleteGalleryImage(id);
//         setImages(images.filter(img => img.id !== id));
//         setSuccess('Image deleted successfully from both database and Cloudinary!');
//       } catch (err) {
//         console.error('Error deleting image:', err);
//         setError('Failed to delete image. Please try again.');
//       }
//     }
//   };

//   // Category management
//   const handleNewCategoryChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setNewCategory(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleCreateCategory = async (e) => {
//     e.preventDefault();
//     if (!newCategory.name.trim()) {
//       setError('Category name is required');
//       return;
//     }

//     try {
//       const createdCategory = await createCategory(newCategory);
//       setCategories([...categories, createdCategory]);
//       setNewCategory({
//         name: '',
//         description: '',
//         is_active: true
//       });
//       setSuccess('Category created successfully!');
//     } catch (err) {
//       console.error('Error creating category:', err);
//       setError(err.message || 'Failed to create category');
//     }
//   };

//   const handleDeleteCategory = async (id) => {
//     if (window.confirm('Are you sure you want to delete this category? Images in this category will not be deleted.')) {
//       try {
//         await deleteCategory(id);
//         setCategories(categories.filter(cat => cat.id !== id));
//         setSuccess('Category deleted successfully!');
//       } catch (err) {
//         console.error('Error deleting category:', err);
//         setError('Failed to delete category. Please try again.');
//       }
//     }
//   };

//   // Helper function to render image with Cloudinary optimization
//   const renderImage = (image, className = 'thumbnail') => {
//     const imageUrl = image.thumbnail_url || image.image_url || image.thumbnail || image.image;
    
//     return (
//       <img 
//         src={imageUrl}
//         alt={image.alt_text || image.title}
//         className={className}
//         onError={(e) => {
//           // Fallback to original if optimized URL fails
//           if (image.image && e.target.src !== image.image) {
//             e.target.src = image.image;
//           }
//         }}
//       />
//     );
//   };

//   if (loading) {
//     return <div className="loading">Loading gallery data...</div>;
//   }

//   return (
//     <div className="admin-gallery-container">
//       <h1>Gallery Management with Cloudinary</h1>
      
//       {error && (
//         <div className="error-message">
//           {error}
//           <button onClick={() => setError(null)} className="close-btn">×</button>
//         </div>
//       )}
      
//       {success && (
//         <div className="success-message">
//           {success}
//           <button onClick={() => setSuccess(null)} className="close-btn">×</button>
//         </div>
//       )}
      
//       <div className="admin-tabs">
//         <button 
//           className={activeTab === 'images' ? 'active' : ''}
//           onClick={() => setActiveTab('images')}
//         >
//           Images ({images.length})
//         </button>
//         <button 
//           className={activeTab === 'categories' ? 'active' : ''}
//           onClick={() => setActiveTab('categories')}
//         >
//           Categories ({categories.length})
//         </button>
//         <button 
//           className={activeTab === 'halls' ? 'active' : ''}
//           onClick={() => setActiveTab('halls')}
//         >
//           Halls ({halls.length})
//         </button>
//       </div>

//       {activeTab === 'images' && (
//         <>
//           {/* Bulk Actions Section */}
//           <div className="bulk-actions">
//             <h2>Bulk Actions</h2>
            
//             {/* Bulk Upload */}
//             <div className="bulk-upload-section">
//               <h3>📁 Bulk Upload Images to Cloudinary</h3>
//               <form onSubmit={handleBulkUpload}>
//                 <div className="form-group">
//                   <label>Select Images:</label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     multiple
//                     onChange={handleBulkFileChange}
//                     disabled={isBulkUploading}
//                   />
//                   {bulkFiles.length > 0 && (
//                     <div className="file-list">
//                       <p>✅ Valid files selected: {bulkFiles.length}</p>
//                       <div className="file-grid">
//                         {bulkFiles.slice(0, 5).map((file, index) => (
//                           <div key={index} className="file-item">
//                             <span className="file-name">{file.name}</span>
//                             <span className="file-size">
//                               {(file.size / (1024 * 1024)).toFixed(2)} MB
//                             </span>
//                           </div>
//                         ))}
//                         {bulkFiles.length > 5 && (
//                           <div className="file-item">
//                             <span>... and {bulkFiles.length - 5} more files</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>Default Category: *</label>
//                     <select
//                       name="category"
//                       value={newImage.category}
//                       onChange={handleNewImageChange}
//                       disabled={isBulkUploading}
//                       required
//                     >
//                       <option value="">Select Category</option>
//                       {categories.map(category => (
//                         <option key={category.id} value={category.id}>
//                           {category.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
                  
//                   <div className="form-group">
//                     <label>Default Hall:</label>
//                     <select
//                       name="hall"
//                       value={newImage.hall}
//                       onChange={handleNewImageChange}
//                       disabled={isBulkUploading}
//                     >
//                       <option value="">Select Hall (Optional)</option>
//                       {halls.map(hall => (
//                         <option key={hall.id} value={hall.id}>
//                           Hall {hall.section_number} - {hall.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
                
//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>
//                       <input
//                         type="checkbox"
//                         name="is_featured"
//                         checked={newImage.is_featured}
//                         onChange={handleNewImageChange}
//                         disabled={isBulkUploading}
//                       />
//                       Mark as Featured
//                     </label>
//                   </div>
                  
//                   <div className="form-group">
//                     <label>
//                       <input
//                         type="checkbox"
//                         name="is_public"
//                         checked={newImage.is_public}
//                         onChange={handleNewImageChange}
//                         disabled={isBulkUploading}
//                       />
//                       Make Public
//                     </label>
//                   </div>
//                 </div>
                
//                 <div className="form-group">
//                   <label>Default Tags:</label>
//                   <input
//                     type="text"
//                     name="tags"
//                     value={newImage.tags}
//                     onChange={handleNewImageChange}
//                     placeholder="tag1, tag2, tag3"
//                     disabled={isBulkUploading}
//                   />
//                 </div>
                
//                 {isBulkUploading && (
//                   <div className="upload-progress">
//                     <div className="progress-bar">
//                       <div 
//                         className="progress-fill" 
//                         style={{ width: `${bulkUploadProgress}%` }}
//                       ></div>
//                     </div>
//                     <span className="progress-text">
//                       Uploading to Cloudinary... {bulkUploadProgress}%
//                     </span>
//                   </div>
//                 )}
                
//                 <div className="form-actions">
//                   <button 
//                     type="submit" 
//                     disabled={bulkFiles.length === 0 || isBulkUploading || !newImage.category}
//                     className="submit-btn"
//                   >
//                     {isBulkUploading 
//                       ? `Uploading... ${bulkUploadProgress}%` 
//                       : `📤 Upload ${bulkFiles.length} Files to Cloudinary`
//                     }
//                   </button>
                  
//                   {bulkFiles.length > 0 && !isBulkUploading && (
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setBulkFiles([]);
//                         const fileInput = document.querySelector('input[type="file"][multiple]');
//                         if (fileInput) fileInput.value = '';
//                       }}
//                       className="cancel-btn"
//                     >
//                       Clear Selection
//                     </button>
//                   )}
//                 </div>
//               </form>
//             </div>
            
//             {/* Bulk Update */}
//             <div className="bulk-update-section">
//               <h3>✏️ Bulk Update Selected Images ({selectedImages.length})</h3>
//               <div className="bulk-controls">
//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>Update Category:</label>
//                     <select
//                       name="category"
//                       value={bulkUpdate.category}
//                       onChange={handleBulkUpdateChange}
//                       disabled={selectedImages.length === 0}
//                     >
//                       <option value="">-- No Change --</option>
//                       {categories.map(category => (
//                         <option key={category.id} value={category.id}>
//                           {category.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
                  
//                   <div className="form-group">
//                     <label>Update Hall:</label>
//                     <select
//                       name="hall"
//                       value={bulkUpdate.hall}
//                       onChange={handleBulkUpdateChange}
//                       disabled={selectedImages.length === 0}
//                     >
//                       <option value="">-- No Change --</option>
//                       {halls.map(hall => (
//                         <option key={hall.id} value={hall.id}>
//                           Hall {hall.section_number} - {hall.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
                
//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>
//                       <input
//                         type="checkbox"
//                         name="is_featured"
//                         checked={bulkUpdate.is_featured}
//                         onChange={handleBulkUpdateChange}
//                         disabled={selectedImages.length === 0}
//                       />
//                       Set Featured
//                     </label>
//                   </div>
                  
//                   <div className="form-group">
//                     <label>
//                       <input
//                         type="checkbox"
//                         name="is_public"
//                         checked={bulkUpdate.is_public}
//                         onChange={handleBulkUpdateChange}
//                         disabled={selectedImages.length === 0}
//                       />
//                       Set Public
//                     </label>
//                   </div>
//                 </div>
                
//                 <div className="form-actions">
//                   <button 
//                     onClick={handleBulkUpdate}
//                     disabled={selectedImages.length === 0 || isBulkUpdating}
//                     className="submit-btn"
//                   >
//                     {isBulkUpdating 
//                       ? 'Updating...' 
//                       : `✅ Apply to ${selectedImages.length} Selected`
//                     }
//                   </button>
                  
//                   <button 
//                     onClick={handleBulkDelete}
//                     disabled={selectedImages.length === 0}
//                     className="delete-btn"
//                   >
//                     🗑️ Delete Selected
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Add New Image Form */}
//           <div className="add-image-form">
//             <h2>📸 Add New Image to Cloudinary</h2>
//             <form onSubmit={handleNewImageSubmit}>
//               <div className="form-group">
//                 <label>Image File: *</label>
//                 <input 
//                   type="file" 
//                   accept="image/*" 
//                   onChange={handleFileChange} 
//                   required 
//                 />
//                 {preview && (
//                   <div className="image-preview-container">
//                     <img src={preview} alt="Preview" className="image-preview" />
//                     <p className="preview-note">Preview - Will be uploaded to Cloudinary</p>
//                   </div>
//                 )}
//               </div>
              
//               <div className="form-group">
//                 <label>Title: *</label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={newImage.title}
//                   onChange={handleNewImageChange}
//                   required
//                 />
//               </div>
              
//               <div className="form-group">
//                 <label>Description:</label>
//                 <textarea
//                   name="description"
//                   value={newImage.description}
//                   onChange={handleNewImageChange}
//                   placeholder="Describe this image..."
//                 />
//               </div>
              
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>Category: *</label>
//                   <select
//                     name="category"
//                     value={newImage.category}
//                     onChange={handleNewImageChange}
//                     required
//                   >
//                     <option value="">Select Category</option>
//                     {categories.map(category => (
//                       <option key={category.id} value={category.id}>
//                         {category.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <div className="form-group">
//                   <label>Hall:</label>
//                   <select
//                     name="hall"
//                     value={newImage.hall}
//                     onChange={handleNewImageChange}
//                   >
//                     <option value="">Select Hall (Optional)</option>
//                     {halls.map(hall => (
//                       <option key={hall.id} value={hall.id}>
//                         Hall {hall.section_number} - {hall.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
              
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>
//                     <input
//                       type="checkbox"
//                       name="is_featured"
//                       checked={newImage.is_featured}
//                       onChange={handleNewImageChange}
//                     />
//                     Featured
//                   </label>
//                 </div>
                
//                 <div className="form-group">
//                   <label>
//                     <input
//                       type="checkbox"
//                       name="is_public"
//                       checked={newImage.is_public}
//                       onChange={handleNewImageChange}
//                     />
//                     Public
//                   </label>
//                 </div>
//               </div>
              
//               <div className="form-group">
//                 <label>Tags (comma separated):</label>
//                 <input
//                   type="text"
//                   name="tags"
//                   value={newImage.tags}
//                   onChange={handleNewImageChange}
//                   placeholder="tag1, tag2, tag3"
//                 />
//               </div>
              
//               <div className="form-group">
//                 <label>Alt Text:</label>
//                 <input
//                   type="text"
//                   name="alt_text"
//                   value={newImage.alt_text}
//                   onChange={handleNewImageChange}
//                   placeholder="Description for screen readers"
//                 />
//               </div>
              
//               <button type="submit" className="submit-btn">
//                 📤 Upload to Cloudinary
//               </button>
//             </form>
//           </div>
          
//           {/* Images List */}
//           <div className="gallery-list">
//             <div className="gallery-header">
//               <h2>📷 All Images ({images.length})</h2>
//               {selectedImages.length > 0 && (
//                 <div className="selection-info">
//                   {selectedImages.length} selected
//                 </div>
//               )}
//             </div>
            
//             <div className="table-container">
//               <table className="gallery-table">
//                 <thead>
//                   <tr>
//                     <th>
//                       <input 
//                         type="checkbox" 
//                         onChange={handleSelectAll}
//                         checked={selectedImages.length === images.length && images.length > 0}
//                         indeterminate={selectedImages.length > 0 && selectedImages.length < images.length}
//                       />
//                     </th>
//                     <th>Thumbnail</th>
//                     <th>Title</th>
//                     <th>Category</th>
//                     <th>Hall</th>
//                     <th>Status</th>
//                     <th>Views</th>
//                     <th>Size</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {images.map(image => (
//                     <tr key={image.id} className={selectedImages.includes(image.id) ? 'selected' : ''}>
//                       <td>
//                         <input
//                           type="checkbox"
//                           checked={selectedImages.includes(image.id)}
//                           onChange={() => handleSelectImage(image.id)}
//                         />
//                       </td>
//                       <td>
//                         <div className="thumbnail-container">
//                           {renderImage(image)}
//                           {image.cloudinary_public_id && (
//                             <div className="cloudinary-badge" title="Stored in Cloudinary">☁️</div>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="image-title">
//                           <strong>{image.title}</strong>
//                           {image.description && (
//                             <div className="image-description">{image.description.substring(0, 50)}...</div>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <span className="category-badge">{image.category_name}</span>
//                       </td>
//                       <td>
//                         {image.hall_name ? (
//                           <span className="hall-badge">
//                             Hall {image.hall_section} - {image.hall_name}
//                           </span>
//                         ) : (
//                           <span className="no-hall">-</span>
//                         )}
//                       </td>
//                       <td>
//                         <div className="status-badges">
//                           {image.is_featured && <span className="badge featured">⭐ Featured</span>}
//                           {image.is_public ? (
//                             <span className="badge public">🌐 Public</span>
//                           ) : (
//                             <span className="badge private">🔒 Private</span>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <span className="view-count">{image.views} views</span>
//                       </td>
//                       <td>
//                         <div className="image-info">
//                           <div>{image.file_size_formatted}</div>
//                           {image.width && image.height && (
//                             <div className="dimensions">{image.width}×{image.height}</div>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="action-buttons">
//                           <button 
//                             onClick={() => handleEdit(image)}
//                             className="edit-btn"
//                             title="Edit image"
//                           >
//                             ✏️
//                           </button>
//                           <button 
//                             onClick={() => handleDelete(image.id)}
//                             className="delete-btn"
//                             title="Delete from database and Cloudinary"
//                           >
//                             🗑️
//                           </button>
//                           {image.image_url && (
//                             <a 
//                               href={image.image_url} 
//                               target="_blank" 
//                               rel="noopener noreferrer"
//                               className="view-btn"
//                               title="View in Cloudinary"
//                             >
//                               👁️
//                             </a>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
          
//           {/* Edit Image Modal */}
//           {editImage && (
//             <div className="modal-overlay">
//               <div className="modal">
//                 <div className="modal-content">
//                   <div className="modal-header">
//                     <h2>✏️ Edit Image</h2>
//                     <button 
//                       onClick={() => setEditImage(null)}
//                       className="close-btn"
//                     >
//                       ×
//                     </button>
//                   </div>
                  
//                   <form onSubmit={handleUpdate}>
//                     <div className="modal-body">
//                       {editImage.image_url && (
//                         <div className="edit-image-preview">
//                           {renderImage(editImage, 'edit-preview')}
//                           <div className="cloudinary-info">
//                             <span>☁️ Stored in Cloudinary</span>
//                             {editImage.cloudinary_public_id && (
//                               <span>ID: {editImage.cloudinary_public_id}</span>
//                             )}
//                           </div>
//                         </div>
//                       )}
                      
//                       <div className="form-group">
//                         <label>Title:</label>
//                         <input
//                           type="text"
//                           name="title"
//                           value={newImage.title}
//                           onChange={handleNewImageChange}
//                           required
//                         />
//                       </div>
                      
//                       <div className="form-group">
//                         <label>Description:</label>
//                         <textarea
//                           name="description"
//                           value={newImage.description}
//                           onChange={handleNewImageChange}
//                         />
//                       </div>
                      
//                       <div className="form-row">
//                         <div className="form-group">
//                           <label>Category:</label>
//                           <select
//                             name="category"
//                             value={newImage.category}
//                             onChange={handleNewImageChange}
//                             required
//                           >
//                             {categories.map(category => (
//                               <option key={category.id} value={category.id}>
//                                 {category.name}
//                               </option>
//                             ))}
//                           </select>
//                         </div>
                        
//                         <div className="form-group">
//                           <label>Hall:</label>
//                           <select
//                             name="hall"
//                             value={newImage.hall}
//                             onChange={handleNewImageChange}
//                           >
//                             <option value="">Select Hall (Optional)</option>
//                             {halls.map(hall => (
//                               <option key={hall.id} value={hall.id}>
//                                 Hall {hall.section_number} - {hall.name}
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                       </div>
                      
//                       <div className="form-row">
//                         <div className="form-group">
//                           <label>
//                             <input
//                               type="checkbox"
//                               name="is_featured"
//                               checked={newImage.is_featured}
//                               onChange={handleNewImageChange}
//                             />
//                             Featured
//                           </label>
//                         </div>
                        
//                         <div className="form-group">
//                           <label>
//                             <input
//                               type="checkbox"
//                               name="is_public"
//                               checked={newImage.is_public}
//                               onChange={handleNewImageChange}
//                             />
//                             Public
//                           </label>
//                         </div>
//                       </div>
                      
//                       <div className="form-group">
//                         <label>Tags (comma separated):</label>
//                         <input
//                           type="text"
//                           name="tags"
//                           value={newImage.tags}
//                           onChange={handleNewImageChange}
//                           placeholder="tag1, tag2, tag3"
//                         />
//                       </div>
                      
//                       <div className="form-group">
//                         <label>Alt Text:</label>
//                         <input
//                           type="text"
//                           name="alt_text"
//                           value={newImage.alt_text}
//                           onChange={handleNewImageChange}
//                           placeholder="Description for screen readers"
//                         />
//                       </div>
//                     </div>
                    
//                     <div className="modal-footer">
//                       <button type="submit" className="submit-btn">
//                         💾 Save Changes
//                       </button>
//                       <button 
//                         type="button" 
//                         onClick={() => setEditImage(null)}
//                         className="cancel-btn"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           )}
//         </>
//       )}

//       {activeTab === 'categories' && (
//         <div className="category-management">
//           <h2>📁 Category Management</h2>
          
//           <div className="add-category-form">
//             <h3>Add New Category</h3>
//             <form onSubmit={handleCreateCategory}>
//               <div className="form-group">
//                 <label>Name:</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={newCategory.name}
//                   onChange={handleNewCategoryChange}
//                   required
//                 />
//               </div>
              
//               <div className="form-group">
//                 <label>Description:</label>
//                 <textarea
//                   name="description"
//                   value={newCategory.description}
//                   onChange={handleNewCategoryChange}
//                 />
//               </div>
              
//               <div className="form-group">
//                 <label>
//                   <input
//                     type="checkbox"
//                     name="is_active"
//                     checked={newCategory.is_active}
//                     onChange={handleNewCategoryChange}
//                   />
//                   Active
//                 </label>
//               </div>
              
//               <button type="submit" className="submit-btn">
//                 ➕ Create Category
//               </button>
//             </form>
//           </div>
          
//           <div className="categories-list">
//             <h3>All Categories ({categories.length})</h3>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Description</th>
//                   <th>Images</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {categories.map(category => (
//                   <tr key={category.id}>
//                     <td>
//                       <strong>{category.name}</strong>
//                     </td>
//                     <td>{category.description || '-'}</td>
//                     <td>
//                       <span className="image-count">{category.image_count || 0} images</span>
//                     </td>
//                     <td>
//                       <span className={`status-badge ${category.is_active ? 'active' : 'inactive'}`}>
//                         {category.is_active ? '✅ Active' : '❌ Inactive'}
//                       </span>
//                     </td>
//                     <td>
//                       <button 
//                         onClick={() => handleDeleteCategory(category.id)}
//                         className="delete-btn"
//                         title="Delete category"
//                       >
//                         🗑️ Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {activeTab === 'halls' && (
//         <div className="hall-management">
//           <h2>🏛️ Hall List</h2>
//           <div className="halls-list">
//             <h3>All Halls ({halls.length})</h3>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Section</th>
//                   <th>Capacity</th>
//                   <th>Images</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {halls.map(hall => (
//                   <tr key={hall.id}>
//                     <td>
//                       <strong>{hall.name}</strong>
//                     </td>
//                     <td>
//                       <span className="section-number">#{hall.section_number}</span>
//                     </td>
//                     <td>
//                       <span className="capacity">{hall.capacity || '-'} people</span>
//                     </td>
//                     <td>
//                       <span className="image-count">
//                         {images.filter(img => img.hall === hall.id).length} images
//                       </span>
//                     </td>
//                     <td>
//                       <span className={`status-badge ${hall.is_active ? 'active' : 'inactive'}`}>
//                         {hall.is_active ? '✅ Active' : '❌ Inactive'}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Gallery;


// src/components/GalleryManagement.jsx
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
} from '../../services/gallery';
import '../../css/AdminGallery.css';

const Gallery = () => {
  // Main state
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
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

  // Clear messages after timeout
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [imagesData, categoriesData, hallsData] = await Promise.all([
          fetchGalleryImages().catch(err => {
            console.warn('Failed to fetch images:', err);
            return { results: [] };
          }),
          fetchCategories().catch(err => {
            console.warn('Failed to fetch categories:', err);
            return { results: [] };
          }),
          fetchHalls().catch(err => {
            console.warn('Failed to fetch halls:', err);
            return { results: [] };
          }),
        ]);
        
        setImages(Array.isArray(imagesData) ? imagesData : (imagesData.results || []));
        setCategories(Array.isArray(categoriesData) ? categoriesData : (categoriesData.results || []));
        setHalls(Array.isArray(hallsData) ? hallsData : (hallsData.results || []));
        
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data. Please check your server connection.');
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

  // File validation
  const validateFile = (file) => {
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

  // Single image operations
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      try {
        validateFile(selectedFile);
        setFile(selectedFile);
        
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(selectedFile);
        setError(null);
      } catch (err) {
        setError(err.message);
        setFile(null);
        setPreview('');
      }
    } else {
      setFile(null);
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
    
    if (!newImage.category) {
      setError('Please select a category');
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
      setSuccess('🎉 Image uploaded successfully to Cloudinary! No login required!');
    } catch (err) {
      console.error('Error creating image:', err);
      setError(err.message || 'Failed to create image');
    }
  };

  // Bulk operations
  const handleBulkFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = [];
    const invalidFiles = [];

    selectedFiles.forEach(file => {
      try {
        validateFile(file);
        validFiles.push(file);
      } catch (err) {
        invalidFiles.push({ name: file.name, error: err.message });
      }
    });

    setBulkFiles(validFiles);
    
    if (invalidFiles.length > 0) {
      setError(`Some files were rejected: ${invalidFiles.map(f => `${f.name} (${f.error})`).join(', ')}`);
    }
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
      setError('Please select at least one valid image');
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
      setSuccess(`🚀 Successfully uploaded ${uploadedImages.length} images to Cloudinary! No authentication needed!`);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"][multiple]');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      console.error('Bulk upload error:', err);
      setError(err.message || 'Failed to upload some images');
    } finally {
      setIsBulkUploading(false);
      setBulkUploadProgress(0);
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedImages.length === 0) {
      setError('Please select at least one image');
      return;
    }
    
    setIsBulkUpdating(true);
    setError(null);

    try {
      const updateData = {};
      if (bulkUpdate.category) updateData.category = bulkUpdate.category;
      if (bulkUpdate.hall) updateData.hall = bulkUpdate.hall;
      updateData.is_featured = bulkUpdate.is_featured;
      updateData.is_public = bulkUpdate.is_public;
      
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
      
      setSuccess(`✅ Successfully updated ${selectedImages.length} images!`);
    } catch (err) {
      console.error('Bulk update error:', err);
      setError(err.message || 'Failed to update images');
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedImages.length} images? This will also remove them from Cloudinary.`)) {
      return;
    }

    try {
      await bulkDeleteImages(selectedImages);
      setImages(images.filter(img => !selectedImages.includes(img.id)));
      setSelectedImages([]);
      setSuccess(`🗑️ Successfully deleted ${selectedImages.length} images from both database and Cloudinary!`);
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
      category: image.category || '',
      hall: image.hall || '',
      is_featured: image.is_featured || false,
      is_public: image.is_public !== false,
      tags: image.tags || '',
      alt_text: image.alt_text || '',
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!newImage.category) {
      setError('Please select a category');
      return;
    }
    
    try {
      const updatedImage = await updateGalleryImage(editImage.id, newImage);
      setImages(images.map(img => 
        img.id === editImage.id ? { ...img, ...updatedImage } : img
      ));
      setEditImage(null);
      setSuccess('✨ Image updated successfully!');
    } catch (err) {
      console.error('Error updating image:', err);
      setError(err.message || 'Failed to update image');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this image? This will also remove it from Cloudinary.')) {
      try {
        await deleteGalleryImage(id);
        setImages(images.filter(img => img.id !== id));
        setSuccess('🗑️ Image deleted successfully from both database and Cloudinary!');
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
      setSuccess('📁 Category created successfully!');
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
        setSuccess('🗑️ Category deleted successfully!');
      } catch (err) {
        console.error('Error deleting category:', err);
        setError('Failed to delete category. Please try again.');
      }
    }
  };

  // Helper function to render image with fallback
  const renderImage = (image, className = 'thumbnail') => {
    // Priority order: Cloudinary thumbnail -> Cloudinary main -> local thumbnail -> local main
    const imageUrl = image.thumbnail_url || image.image_url || 
                    (image.thumbnail && image.thumbnail) || 
                    (image.image && image.image);
    
    return (
      <img 
        src={imageUrl || '/placeholder-image.png'}
        alt={image.alt_text || image.title}
        className={className}
        onError={(e) => {
          // Fallback chain
          if (image.image_url && e.target.src !== image.image_url) {
            e.target.src = image.image_url;
          } else if (image.image && e.target.src !== image.image) {
            e.target.src = image.image;
          } else {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNSAyNUMyNyAyMyAzMyAyMyAzNSAyNUMzNyAyNyAzNyAzMyAzNSAzNUMzMyAzNyAyNyAzNyAyNSAzNUMyMyAzMyAyMyAyNyAyNSAyNVoiIGZpbGw9IiNEMUQ1REIiLz4KPHN2Zz4K';
          }
        }}
      />
    );
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>📷 Loading gallery data...</h2>
        <p>No authentication required - freely accessible!</p>
      </div>
    );
  }

  return (
    <div className="admin-gallery-container">
      <div className="header-section">
        <h1>🎨 Gallery Management with Cloudinary</h1>
        <div className="no-auth-badge">
          <span>🔓 No Login Required - Freely Accessible!</span>
        </div>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="close-btn">×</button>
        </div>
      )}
      
      {success && (
        <div className="success-message">
          {success}
          <button onClick={() => setSuccess(null)} className="close-btn">×</button>
        </div>
      )}
      
      <div className="admin-tabs">
        <button 
          className={activeTab === 'images' ? 'active' : ''}
          onClick={() => setActiveTab('images')}
        >
          📸 Images ({images.length})
        </button>
        <button 
          className={activeTab === 'categories' ? 'active' : ''}
          onClick={() => setActiveTab('categories')}
        >
          📁 Categories ({categories.length})
        </button>
        <button 
          className={activeTab === 'halls' ? 'active' : ''}
          onClick={() => setActiveTab('halls')}
        >
          🏛️ Halls ({halls.length})
        </button>
      </div>

      {activeTab === 'images' && (
        <>
          {/* Quick Info Panel */}
          <div className="info-panel">
            <div className="info-card">
              <h3>🚀 Quick Start</h3>
              <p>Upload images directly to Cloudinary without any authentication!</p>
              <ul>
                <li>✅ Select images and category</li>
                <li>✅ Automatic optimization & thumbnails</li>
                <li>✅ Bulk operations supported</li>
                <li>✅ No login or signup required</li>
              </ul>
            </div>
          </div>

          {/* Bulk Actions Section */}
          <div className="bulk-actions">
            <h2>🔄 Bulk Actions</h2>
            
            {/* Bulk Upload */}
            <div className="bulk-upload-section">
              <h3>📁 Bulk Upload Images to Cloudinary</h3>
              <div className="no-auth-info">
                <span>🔓 No authentication required - anyone can upload!</span>
              </div>
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
                      <p>✅ Valid files selected: {bulkFiles.length}</p>
                      <div className="file-grid">
                        {bulkFiles.slice(0, 5).map((file, index) => (
                          <div key={index} className="file-item">
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </span>
                          </div>
                        ))}
                        {bulkFiles.length > 5 && (
                          <div className="file-item">
                            <span>... and {bulkFiles.length - 5} more files</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Default Category: *</label>
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
                
                <div className="form-group">
                  <label>Default Tags:</label>
                  <input
                    type="text"
                    name="tags"
                    value={newImage.tags}
                    onChange={handleNewImageChange}
                    placeholder="tag1, tag2, tag3"
                    disabled={isBulkUploading}
                  />
                </div>
                
                {isBulkUploading && (
                  <div className="upload-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${bulkUploadProgress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      ☁️ Uploading to Cloudinary... {bulkUploadProgress}%
                    </span>
                  </div>
                )}
                
                <div className="form-actions">
                  <button 
                    type="submit" 
                    disabled={bulkFiles.length === 0 || isBulkUploading || !newImage.category}
                    className="submit-btn"
                  >
                    {isBulkUploading 
                      ? `⏫ Uploading... ${bulkUploadProgress}%` 
                      : `📤 Upload ${bulkFiles.length} Files to Cloudinary`
                    }
                  </button>
                  
                  {bulkFiles.length > 0 && !isBulkUploading && (
                    <button
                      type="button"
                      onClick={() => {
                        setBulkFiles([]);
                        const fileInput = document.querySelector('input[type="file"][multiple]');
                        if (fileInput) fileInput.value = '';
                      }}
                      className="cancel-btn"
                    >
                      🗑️ Clear Selection
                    </button>
                  )}
                </div>
              </form>
            </div>
            
            {/* Bulk Update */}
            <div className="bulk-update-section">
              <h3>✏️ Bulk Update Selected Images ({selectedImages.length})</h3>
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
                    {isBulkUpdating 
                      ? '⏳ Updating...' 
                      : `✅ Apply to ${selectedImages.length} Selected`
                    }
                  </button>
                  
                  <button 
                    onClick={handleBulkDelete}
                    disabled={selectedImages.length === 0}
                    className="delete-btn"
                  >
                    🗑️ Delete Selected
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Add New Image Form */}
          <div className="add-image-form">
            <h2>📸 Add New Image to Cloudinary</h2>
            <div className="no-auth-info">
              <span>🔓 Quick upload - no registration needed!</span>
            </div>
            <form onSubmit={handleNewImageSubmit}>
              <div className="form-group">
                <label>Image File: *</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  required 
                />
                {preview && (
                  <div className="image-preview-container">
                    <img src={preview} alt="Preview" className="image-preview" />
                    <p className="preview-note">Preview - Will be uploaded to Cloudinary ☁️</p>
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label>Title: *</label>
                <input
                  type="text"
                  name="title"
                  value={newImage.title}
                  onChange={handleNewImageChange}
                  required
                  placeholder="Enter image title..."
                />
              </div>
              
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={newImage.description}
                  onChange={handleNewImageChange}
                  placeholder="Describe this image..."
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Category: *</label>
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
                    ⭐ Featured
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
                    🌐 Public
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
                📤 Upload to Cloudinary (No Login Required!)
              </button>
            </form>
          </div>
          
          {/* Images List */}
          <div className="gallery-list">
            <div className="gallery-header">
              <h2>📷 All Images ({images.length})</h2>
              {selectedImages.length > 0 && (
                <div className="selection-info">
                  {selectedImages.length} selected
                </div>
              )}
            </div>
            
            <div className="table-container">
              <table className="gallery-table">
                <thead>
                  <tr>
                    <th>
                      <input 
                        type="checkbox" 
                        onChange={handleSelectAll}
                        checked={selectedImages.length === images.length && images.length > 0}
                        ref={(input) => {
                          if (input) {
                            input.indeterminate = selectedImages.length > 0 && selectedImages.length < images.length;
                          }
                        }}
                      />
                    </th>
                    <th>Thumbnail</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Hall</th>
                    <th>Status</th>
                    <th>Views</th>
                    <th>Size</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {images.map(image => (
                    <tr key={image.id} className={selectedImages.includes(image.id) ? 'selected' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedImages.includes(image.id)}
                          onChange={() => handleSelectImage(image.id)}
                        />
                      </td>
                      <td>
                        <div className="thumbnail-container">
                          {renderImage(image)}
                          {image.cloudinary_public_id && (
                            <div className="cloudinary-badge" title="Stored in Cloudinary">☁️</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="image-title">
                          <strong>{image.title}</strong>
                          {image.description && (
                            <div className="image-description">{image.description.substring(0, 50)}...</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="category-badge">{image.category_name}</span>
                      </td>
                      <td>
                        {image.hall_name ? (
                          <span className="hall-badge">
                            Hall {image.hall_section} - {image.hall_name}
                          </span>
                        ) : (
                          <span className="no-hall">-</span>
                        )}
                      </td>
                      <td>
                        <div className="status-badges">
                          {image.is_featured && <span className="badge featured">⭐ Featured</span>}
                          {image.is_public ? (
                            <span className="badge public">🌐 Public</span>
                          ) : (
                            <span className="badge private">🔒 Private</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="view-count">{image.views} views</span>
                      </td>
                      <td>
                        <div className="image-info">
                          <div>{image.file_size_formatted}</div>
                          {image.width && image.height && (
                            <div className="dimensions">{image.width}×{image.height}</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => handleEdit(image)}
                            className="edit-btn"
                            title="Edit image"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => handleDelete(image.id)}
                            className="delete-btn"
                            title="Delete from database and Cloudinary"
                          >
                            🗑️
                          </button>
                          {(image.image_url || image.cloudinary_url) && (
                            <a 
                              href={image.image_url || image.cloudinary_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="view-btn"
                              title="View full image"
                            >
                              👁️
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Edit Image Modal */}
          {editImage && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-content">
                  <div className="modal-header">
                    <h2>✏️ Edit Image - No Auth Required</h2>
                    <button 
                      onClick={() => setEditImage(null)}
                      className="close-btn"
                    >
                      ×
                    </button>
                  </div>
                  
                  <form onSubmit={handleUpdate}>
                    <div className="modal-body">
                      {(editImage.image_url || editImage.cloudinary_url) && (
                        <div className="edit-image-preview">
                          {renderImage(editImage, 'edit-preview')}
                          <div className="cloudinary-info">
                            {editImage.cloudinary_public_id ? (
                              <>
                                <span>☁️ Stored in Cloudinary</span>
                                <span>ID: {editImage.cloudinary_public_id}</span>
                              </>
                            ) : (
                              <span>📁 Local Storage</span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="form-group">
                        <label>Title: *</label>
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
                          <label>Category: *</label>
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
                            ⭐ Featured
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
                            🌐 Public
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
                    </div>
                    
                    <div className="modal-footer">
                      <button type="submit" className="submit-btn">
                        💾 Save Changes
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
            </div>
          )}
        </>
      )}

      {activeTab === 'categories' && (
        <div className="category-management">
          <h2>📁 Category Management</h2>
          <div className="no-auth-info">
            <span>🔓 Create and manage categories without authentication</span>
          </div>
          
          <div className="add-category-form">
            <h3>Add New Category</h3>
            <form onSubmit={handleCreateCategory}>
              <div className="form-group">
                <label>Name: *</label>
                <input
                  type="text"
                  name="name"
                  value={newCategory.name}
                  onChange={handleNewCategoryChange}
                  required
                  placeholder="Enter category name..."
                />
              </div>
              
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={newCategory.description}
                  onChange={handleNewCategoryChange}
                  placeholder="Describe this category..."
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
                  ✅ Active
                </label>
              </div>
              
              <button type="submit" className="submit-btn">
                ➕ Create Category
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
                  <th>Images</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category.id}>
                    <td>
                      <strong>{category.name}</strong>
                    </td>
                    <td>{category.description || '-'}</td>
                    <td>
                      <span className="image-count">{category.image_count || 0} images</span>
                    </td>
                    <td>
                      <span className={`status-badge ${category.is_active ? 'active' : 'inactive'}`}>
                        {category.is_active ? '✅ Active' : '❌ Inactive'}
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => handleDeleteCategory(category.id)}
                        className="delete-btn"
                        title="Delete category"
                      >
                        🗑️ Delete
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
          <h2>🏛️ Hall Management</h2>
          <div className="no-auth-info">
            <span>🔓 View and manage halls without authentication</span>
          </div>
          <div className="halls-list">
            <h3>All Halls ({halls.length})</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Section</th>
                  <th>Capacity</th>
                  <th>Images</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {halls.map(hall => (
                  <tr key={hall.id}>
                    <td>
                      <strong>{hall.name}</strong>
                    </td>
                    <td>
                      <span className="section-number">#{hall.section_number}</span>
                    </td>
                    <td>
                      <span className="capacity">{hall.capacity || '-'} people</span>
                    </td>
                    <td>
                      <span className="image-count">
                        {images.filter(img => img.hall === hall.id).length} images
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${hall.is_active ? 'active' : 'inactive'}`}>
                        {hall.is_active ? '✅ Active' : '❌ Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="footer-info">
        <div className="footer-card">
          <h3>🎉 Gallery Features</h3>
          <div className="feature-list">
            <span className="feature">🔓 No authentication required</span>
            <span className="feature">☁️ Cloudinary integration</span>
            <span className="feature">📤 Bulk upload support</span>
            <span className="feature">🖼️ Automatic thumbnails</span>
            <span className="feature">🔍 Search & filtering</span>
            <span className="feature">📱 Mobile responsive</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;