# from rest_framework import generics, permissions
# from .models import AboutPage, AboutImage
# from .serializers import AboutPageSerializer, AboutImageSerializer
# from rest_framework.parsers import MultiPartParser, FormParser

# class AboutPageDetail(generics.RetrieveUpdateAPIView):
#     queryset = AboutPage.objects.all()
#     serializer_class = AboutPageSerializer
#     permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
#     def get_object(self):
#         # We only have one AboutPage instance
#         return AboutPage.objects.first()

# class AboutImageListCreate(generics.ListCreateAPIView):
#     queryset = AboutImage.objects.all()
#     serializer_class = AboutImageSerializer
#     parser_classes = [MultiPartParser, FormParser]
#     permission_classes = [permissions.IsAuthenticatedOrReadOnly]

# class AboutImageDetail(generics.RetrieveUpdateDestroyAPIView):
#     queryset = AboutImage.objects.all()
#     serializer_class = AboutImageSerializer
#     parser_classes = [MultiPartParser, FormParser]
#     permission_classes = [permissions.IsAdminUser]



# backend/about/views.py

# backend/about/views.py - NO AUTHENTICATION VERSION
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import AboutUs, AboutImage
from .serializers import AboutUsSerializer, AboutImageSerializer
import logging

logger = logging.getLogger(__name__)

class AboutUsPublicView(generics.RetrieveAPIView):
    """Public view to get About Us data"""
    serializer_class = AboutUsSerializer
    permission_classes = [AllowAny]
    
    def get_object(self):
        # Get or create the AboutUs instance (singleton pattern)
        about_us, created = AboutUs.objects.get_or_create(
            pk=1,
            defaults={
                'title': 'About Jaffna Cultural Centre',
                'subtitle': 'Preserving Culture Through Celebrations',
                'who_we_are_title': 'Who We Are',
                'who_we_are_description': 'Welcome to our cultural centre...',
                'who_we_are_mission': 'Our mission is to preserve and promote...',
                'vision_title': 'Our Vision',
                'vision_description': 'To be the leading cultural centre...',
                'mission_title': 'Our Mission',
                'mission_description': 'To provide exceptional cultural experiences...',
                'legacy_title': 'Our Legacy',
                'legacy_description': 'Since 1985, we have been...',
                'cta_title': 'Looking to Book a Venue?',
                'cta_subtitle': 'Experience the perfect blend of tradition and elegance',
                'cta_button_text': 'Explore Our Halls',
                'address': '123 Cultural Street, Jaffna',
                'phone': '+94 21 123 4567',
                'email': 'info@eventaura.lk'
            }
        )
        return about_us

@api_view(['PUT'])
@permission_classes([AllowAny])
def update_about_us(request):
    """Update About Us data - NO AUTHENTICATION REQUIRED"""
    try:
        # Get or create the AboutUs instance
        about_us, created = AboutUs.objects.get_or_create(pk=1)
        
        # Log the incoming data for debugging
        logger.info("Updating About Us data - No auth required")
        logger.debug(f"Request data keys: {list(request.data.keys())}")
        
        # Handle file uploads separately
        files = request.FILES
        data = request.data.copy()
        
        # Update text fields
        text_fields = [
            'title', 'subtitle', 'who_we_are_title', 'who_we_are_description',
            'who_we_are_mission', 'who_we_are_additional', 'vision_title',
            'vision_description', 'mission_title', 'mission_description',
            'legacy_title', 'legacy_description', 'cta_title', 'cta_subtitle',
            'cta_button_text', 'address', 'phone', 'email'
        ]
        
        numeric_fields = [
            'establishment_year', 'events_hosted', 'happy_guests', 'years_of_excellence'
        ]
        
        # Update text fields
        for field in text_fields:
            if field in data:
                setattr(about_us, field, data[field])
                logger.debug(f"Updated {field}: {data[field][:50]}..." if len(str(data[field])) > 50 else f"Updated {field}: {data[field]}")
        
        # Update numeric fields with validation
        for field in numeric_fields:
            if field in data and data[field]:
                try:
                    value = int(data[field])
                    setattr(about_us, field, value)
                    logger.debug(f"Updated {field}: {value}")
                except (ValueError, TypeError) as e:
                    logger.warning(f"Invalid value for {field}: {data[field]} - {str(e)}")
                    return Response({
                        'error': f'Invalid value for {field}. Must be a number.'
                    }, status=status.HTTP_400_BAD_REQUEST)
        
        # Handle image upload
        if 'who_we_are_image' in files:
            # Validate file type
            image_file = files['who_we_are_image']
            if not image_file.content_type.startswith('image/'):
                return Response({
                    'error': 'Invalid file type. Please upload an image.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check file size (limit to 10MB)
            if image_file.size > 10 * 1024 * 1024:
                return Response({
                    'error': 'Image file too large. Maximum size is 10MB.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            about_us.who_we_are_image = image_file
            logger.info(f"Updated who_we_are_image: {image_file.name}")
        
        # No user to set since no authentication
        # about_us.updated_by = request.user
        
        # Save the changes
        about_us.save()
        logger.info("About Us data updated successfully")
        
        # Serialize and return the updated data
        serializer = AboutUsSerializer(about_us)
        return Response({
            'message': 'About Us information updated successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error updating About Us data: {str(e)}", exc_info=True)
        return Response({
            'error': f'Failed to update about us data: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def upload_additional_image(request):
    """Upload additional image for About Us page - NO AUTHENTICATION REQUIRED"""
    try:
        # Get or create the AboutUs instance
        about_us, created = AboutUs.objects.get_or_create(pk=1)
        
        if 'image' not in request.FILES:
            return Response({
                'error': 'No image file provided'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        image_file = request.FILES['image']
        caption = request.data.get('caption', '')
        
        # Validate file type
        if not image_file.content_type.startswith('image/'):
            return Response({
                'error': 'Invalid file type. Please upload an image.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check file size (limit to 10MB)
        if image_file.size > 10 * 1024 * 1024:
            return Response({
                'error': 'Image file too large. Maximum size is 10MB.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create new AboutImage instance
        about_image = AboutImage.objects.create(
            about_us=about_us,
            image=image_file,
            caption=caption,
            order=about_us.additional_images.count()  # Add to end
        )
        
        logger.info(f"Additional image uploaded: {image_file.name}")
        
        serializer = AboutImageSerializer(about_image)
        return Response({
            'message': 'Image uploaded successfully',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.error(f"Error uploading image: {str(e)}", exc_info=True)
        return Response({
            'error': f'Failed to upload image: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_image(request, image_id):
    """Delete an additional image - NO AUTHENTICATION REQUIRED"""
    try:
        image = get_object_or_404(AboutImage, id=image_id)
        image_name = image.image.name
        image.delete()
        
        logger.info(f"Image deleted: {image_name}")
        
        return Response({
            'message': 'Image deleted successfully'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error deleting image: {str(e)}", exc_info=True)
        return Response({
            'error': f'Failed to delete image: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([AllowAny])
def update_image_caption(request, image_id):
    """Update image caption - NO AUTHENTICATION REQUIRED"""
    try:
        image = get_object_or_404(AboutImage, id=image_id)
        caption = request.data.get('caption', '')
        
        image.caption = caption
        image.save()
        
        logger.info(f"Image caption updated for image {image_id}")
        
        serializer = AboutImageSerializer(image)
        return Response({
            'message': 'Caption updated successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error updating image caption: {str(e)}", exc_info=True)
        return Response({
            'error': f'Failed to update caption: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def reorder_images(request):
    """Reorder additional images - NO AUTHENTICATION REQUIRED"""
    try:
        image_orders = request.data.get('image_orders', [])
        
        if not image_orders:
            return Response({
                'error': 'No image orders provided'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        with transaction.atomic():
            for item in image_orders:
                image_id = item.get('id')
                order = item.get('order')
                
                if image_id is not None and order is not None:
                    AboutImage.objects.filter(id=image_id).update(order=order)
        
        logger.info("Images reordered successfully")
        
        return Response({
            'message': 'Images reordered successfully'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error reordering images: {str(e)}", exc_info=True)
        return Response({
            'error': f'Failed to reorder images: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)