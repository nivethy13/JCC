# from django.urls import path
# from . import views

# urlpatterns = [
#     path('', views.AboutPageDetail.as_view()),
#     path('images/', views.AboutImageListCreate.as_view(), ),
#     path('images/<int:pk>/', views.AboutImageDetail.as_view(),),
# ]

# backend/about/urls.py
# backend/about/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Public endpoints
    path('', views.AboutUsPublicView.as_view(), name='about-us-detail'),
    
    # Admin endpoints (NO AUTHENTICATION REQUIRED)
    path('update/', views.update_about_us, name='about-us-update'),
    path('images/upload/', views.upload_additional_image, name='upload-about-image'),
    path('images/<int:image_id>/delete/', views.delete_image, name='delete-about-image'),
    path('images/<int:image_id>/caption/', views.update_image_caption, name='update-image-caption'),
    path('images/reorder/', views.reorder_images, name='reorder-images'),
]

# Add to main urls.py:
# path('api/about/', include('about.urls')),