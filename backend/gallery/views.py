
# from rest_framework import generics, status, filters
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from django_filters.rest_framework import DjangoFilterBackend
# from django.db.models import Q
# from PIL import Image as PILImage
# from .models import GalleryImage, GalleryCategory, Hall
# from .serializers import GalleryImageSerializer, GalleryCategorySerializer, HallSerializer
# import io
# from django.core.files.uploadedfile import InMemoryUploadedFile

# class AdminGalleryImageListCreateView(generics.ListCreateAPIView):
#     queryset = GalleryImage.objects.all()
#     serializer_class = GalleryImageSerializer
#     filter_backends = [DjangoFilterBackend, filters.SearchFilter]
#     filterset_fields = ['category', 'hall', 'is_public', 'is_featured']
#     search_fields = ['title', 'description']
    
#     def create_thumbnail(self, image_file):
#         try:
#             image = PILImage.open(image_file)
#             image.thumbnail((300, 300), PILImage.Resampling.LANCZOS)
            
#             thumb_io = io.BytesIO()
#             image.save(thumb_io, format='JPEG', quality=85)
#             thumb_io.seek(0)
            
#             return InMemoryUploadedFile(
#                 thumb_io, None, 'thumb.jpg', 'image/jpeg',
#                 thumb_io.getbuffer().nbytes, None
#             )
#         except Exception:
#             return None
    
#     def perform_create(self, serializer):
#         image_file = self.request.FILES.get('image')
#         thumbnail = None
#         file_size = 0
#         width = 0
#         height = 0
        
#         if image_file:
#             file_size = image_file.size
#             try:
#                 img = PILImage.open(image_file)
#                 width, height = img.size
#                 thumbnail = self.create_thumbnail(image_file)
#                 image_file.seek(0)  # Reset file pointer
#             except Exception:
#                 pass
        
#         serializer.save(
#             thumbnail=thumbnail,
#             file_size=file_size,
#             width=width,
#             height=height
#         )

# class AdminGalleryImageDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = GalleryImage.objects.all()
#     serializer_class = GalleryImageSerializer

# class AdminGalleryCategoryListCreateView(generics.ListCreateAPIView):
#     queryset = GalleryCategory.objects.all()
#     serializer_class = GalleryCategorySerializer

# class AdminGalleryCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = GalleryCategory.objects.all()
#     serializer_class = GalleryCategorySerializer

# @api_view(['POST'])
# def bulk_delete_images(request):
#     image_ids = request.data.get('image_ids', [])
#     if image_ids:
#         deleted_count = GalleryImage.objects.filter(id__in=image_ids).count()
#         GalleryImage.objects.filter(id__in=image_ids).delete()
#         return Response({'message': f'Deleted {deleted_count} images successfully'})
#     return Response({'error': 'No image IDs provided'}, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['POST'])
# def bulk_update_images(request):
#     image_ids = request.data.get('image_ids', [])
#     update_data = request.data.get('update_data', {})
    
#     if image_ids and update_data:
#         updated_count = GalleryImage.objects.filter(id__in=image_ids).update(**update_data)
#         return Response({'message': f'Updated {updated_count} images successfully'})
#     return Response({'error': 'Invalid data provided'}, status=status.HTTP_400_BAD_REQUEST)

# # Add these classes to your views.py
# class GalleryImageListView(generics.ListAPIView):
#     queryset = GalleryImage.objects.filter(is_public=True)
#     serializer_class = GalleryImageSerializer
#     filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
#     filterset_fields = ['category', 'hall', 'is_featured']
#     search_fields = ['title', 'description', 'tags']
#     ordering_fields = ['upload_date', 'views', 'title']
#     ordering = ['-upload_date']

# class GalleryImageDetailView(generics.RetrieveAPIView):
#     queryset = GalleryImage.objects.filter(is_public=True)
#     serializer_class = GalleryImageSerializer
    
#     def retrieve(self, request, *args, **kwargs):
#         instance = self.get_object()
#         instance.increment_views()
#         serializer = self.get_serializer(instance)
#         return Response(serializer.data)

# class GalleryCategoryListView(generics.ListAPIView):
#     queryset = GalleryCategory.objects.filter(is_active=True)
#     serializer_class = GalleryCategorySerializer

# class HallListView(generics.ListAPIView):
#     queryset = Hall.objects.filter(is_active=True)
#     serializer_class = HallSerializer


# backend/gallery/views.py
from rest_framework import generics, status, filters
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import GalleryImage, GalleryCategory, Hall
from .serializers import GalleryImageSerializer, GalleryCategorySerializer, HallSerializer
import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
import logging

logger = logging.getLogger(__name__)

# Public Gallery Views (no authentication required)
class GalleryImageListView(generics.ListAPIView):
    """Public view for listing gallery images"""
    serializer_class = GalleryImageSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'hall', 'is_featured']
    search_fields = ['title', 'description', 'tags']
    
    def get_queryset(self):
        return GalleryImage.objects.filter(is_public=True)

class GalleryImageDetailView(generics.RetrieveAPIView):
    """Public view for individual image details"""
    serializer_class = GalleryImageSerializer
    
    def get_queryset(self):
        return GalleryImage.objects.filter(is_public=True)
    
    def get_object(self):
        obj = super().get_object()
        # Increment view count
        obj.increment_views()
        return obj

class GalleryCategoryListView(generics.ListAPIView):
    """Public view for categories"""
    queryset = GalleryCategory.objects.filter(is_active=True)
    serializer_class = GalleryCategorySerializer

class HallListView(generics.ListAPIView):
    """Public view for halls"""
    queryset = Hall.objects.filter(is_active=True)
    serializer_class = HallSerializer

# Admin Views (NO AUTHENTICATION REQUIRED)
class AdminGalleryImageListCreateView(generics.ListCreateAPIView):
    """Admin view for managing images - NO AUTH REQUIRED"""
    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'hall', 'is_public', 'is_featured']
    search_fields = ['title', 'description']
    
    def perform_create(self, serializer):
        """Handle image upload to Cloudinary with better error handling"""
        image_file = self.request.FILES.get('image')
        
        cloudinary_url = None
        cloudinary_thumbnail_url = None
        cloudinary_public_id = None
        file_size = 0
        width = 0
        height = 0
        
        if image_file:
            file_size = image_file.size
            
            try:
                # Get image dimensions
                from PIL import Image
                img = Image.open(image_file)
                width, height = img.size
                image_file.seek(0)  # Reset file pointer
            except Exception as e:
                logger.warning(f"Could not get image dimensions: {e}")
            
            # Try to upload to Cloudinary
            try:
                # Upload main image
                upload_result = cloudinary.uploader.upload(
                    image_file,
                    folder="gallery/images",
                    transformation=[
                        {'quality': 'auto'},
                        {'fetch_format': 'auto'}
                    ],
                    resource_type="image",
                    use_filename=True,
                    unique_filename=True,
                )
                
                cloudinary_url = upload_result['secure_url']
                cloudinary_public_id = upload_result['public_id']
                
                # Generate thumbnail URL (don't upload separately)
                cloudinary_thumbnail_url = cloudinary.CloudinaryImage(cloudinary_public_id).build_url(
                    width=300,
                    height=300,
                    crop="fill",
                    quality="auto",
                    fetch_format="auto"
                )
                
                logger.info(f"Successfully uploaded to Cloudinary: {cloudinary_public_id}")
                
            except Exception as e:
                logger.error(f"Cloudinary upload failed: {e}")
                # Continue without Cloudinary - save locally instead
                cloudinary_url = None
                cloudinary_thumbnail_url = None
                cloudinary_public_id = None
        
        # Save with Cloudinary URLs if successful, otherwise just local
        # NO USER ASSIGNMENT - remove uploaded_by field
        serializer.save(
            cloudinary_url=cloudinary_url,
            cloudinary_thumbnail_url=cloudinary_thumbnail_url,
            cloudinary_public_id=cloudinary_public_id,
            file_size=file_size,
            width=width,
            height=height
        )

class AdminGalleryImageDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin view for individual image management - NO AUTH REQUIRED"""
    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageSerializer
    
    def perform_update(self, serializer):
        """Handle image update"""
        try:
            serializer.save()
        except Exception as e:
            logger.error(f"Update failed: {e}")
            raise
    
    def perform_destroy(self, instance):
        """Delete image from Cloudinary when deleting from database"""
        try:
            if instance.cloudinary_public_id:
                # Delete from Cloudinary
                cloudinary.uploader.destroy(instance.cloudinary_public_id)
                logger.info(f"Deleted from Cloudinary: {instance.cloudinary_public_id}")
        except Exception as e:
            logger.error(f"Error deleting from Cloudinary: {e}")
            # Continue with database deletion even if Cloudinary fails
        
        # Delete from database
        instance.delete()

class AdminGalleryCategoryListCreateView(generics.ListCreateAPIView):
    """Admin view for category management - NO AUTH REQUIRED"""
    queryset = GalleryCategory.objects.all()
    serializer_class = GalleryCategorySerializer

class AdminGalleryCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin view for individual category management - NO AUTH REQUIRED"""
    queryset = GalleryCategory.objects.all()
    serializer_class = GalleryCategorySerializer

@api_view(['POST'])
def bulk_delete_images(request):
    """Bulk delete images from both database and Cloudinary - NO AUTH REQUIRED"""
    image_ids = request.data.get('image_ids', [])
    if not image_ids:
        return Response({'error': 'No image IDs provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Get images to delete
        images_to_delete = GalleryImage.objects.filter(id__in=image_ids)
        deleted_count = images_to_delete.count()
        
        # Delete from Cloudinary first
        for image in images_to_delete:
            try:
                if image.cloudinary_public_id:
                    cloudinary.uploader.destroy(image.cloudinary_public_id)
                    logger.info(f"Deleted from Cloudinary: {image.cloudinary_public_id}")
            except Exception as e:
                logger.error(f"Error deleting image {image.id} from Cloudinary: {e}")
        
        # Delete from database
        images_to_delete.delete()
        
        return Response({'message': f'Deleted {deleted_count} images successfully'})
    except Exception as e:
        logger.error(f"Bulk delete failed: {e}")
        return Response(
            {'error': f'Failed to delete images: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def bulk_update_images(request):
    """Bulk update multiple images - NO AUTH REQUIRED"""
    image_ids = request.data.get('image_ids', [])
    update_data = request.data.get('update_data', {})
    
    if not image_ids:
        return Response({'error': 'No image IDs provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    if not update_data:
        return Response({'error': 'No update data provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Filter out fields that shouldn't be bulk updated
        allowed_fields = ['category', 'hall', 'is_featured', 'is_public', 'tags']
        filtered_data = {k: v for k, v in update_data.items() if k in allowed_fields}
        
        if not filtered_data:
            return Response({'error': 'No valid update data provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        updated_count = GalleryImage.objects.filter(id__in=image_ids).update(**filtered_data)
        
        return Response({
            'message': f'Updated {updated_count} images successfully',
            'updated_count': updated_count
        })
    except Exception as e:
        logger.error(f"Bulk update failed: {e}")
        return Response(
            {'error': f'Failed to update images: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )