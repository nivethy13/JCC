# backend/about/models.py
from django.db import models
from django.contrib.auth.models import User
import os

def about_image_upload_path(instance, filename):
    return f'about_images/{filename}'

class AboutUs(models.Model):
    title = models.CharField(max_length=200, default="About Jaffna Cultural Centre")
    subtitle = models.CharField(max_length=300, default="Preserving Culture Through Celebrations")
    
    # Who We Are Section
    who_we_are_title = models.CharField(max_length=100, default="Who We Are")
    who_we_are_description = models.TextField()
    who_we_are_mission = models.TextField()
    who_we_are_additional = models.TextField(blank=True)
    who_we_are_image = models.ImageField(upload_to=about_image_upload_path, null=True, blank=True)
    
    # Vision Section
    vision_title = models.CharField(max_length=100, default="Our Vision")
    vision_description = models.TextField()
    
    # Mission Section
    mission_title = models.CharField(max_length=100, default="Our Mission")
    mission_description = models.TextField()
    
    # Legacy Section
    legacy_title = models.CharField(max_length=100, default="Our Legacy")
    legacy_description = models.TextField()
    establishment_year = models.IntegerField(default=1985)
    
    # Statistics
    events_hosted = models.IntegerField(default=5000)
    happy_guests = models.IntegerField(default=50000)
    years_of_excellence = models.IntegerField(default=38)
    
    # Call to Action
    cta_title = models.CharField(max_length=200, default="Looking to Book a Venue?")
    cta_subtitle = models.TextField(default="Experience the perfect blend of tradition and elegance for your special occasion")
    cta_button_text = models.CharField(max_length=50, default="Explore Our Halls")
    
    # Contact Information
    address = models.TextField(default="123 Cultural Street, Jaffna")
    phone = models.CharField(max_length=20, default="+94 21 123 4567")
    email = models.EmailField(default="info@eventaura.lk")
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        verbose_name = "About Us"
        verbose_name_plural = "About Us"
    
    def __str__(self):
        return self.title

class AboutImage(models.Model):
    about_us = models.ForeignKey(AboutUs, on_delete=models.CASCADE, related_name='additional_images')
    image = models.ImageField(upload_to=about_image_upload_path)
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return f"Image for {self.about_us.title}"