# # backend/notifications/models.py
# from django.db import models

# class Notification(models.Model):
#     TYPE_CHOICES = [
#         ('info', 'Info'),
#         ('success', 'Success'),
#         ('warning', 'Warning'),
#         ('error', 'Error'),
#     ]
#     ROLE_CHOICES = [
#         ('admin', 'Admin'),
#         ('customer', 'Customer'),
#     ]
    
#     receiver_role = models.CharField(max_length=20, choices=ROLE_CHOICES)
#     title = models.CharField(max_length=255)
#     message = models.TextField()
#     type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='info')
#     is_read = models.BooleanField(default=False)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.receiver_role} - {self.title}"


from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import json

class NotificationType(models.TextChoices):
    BOOKING_SUCCESS = 'booking_success', 'Booking Success'
    BOOKING_REJECTED = 'booking_rejected', 'Booking Rejected'
    PAYMENT_APPROVED = 'payment_approved', 'Payment Approved'
    PAYMENT_REJECTED = 'payment_rejected', 'Payment Rejected'
    COMPLAINT_REPLIED = 'complaint_replied', 'Complaint Replied'
    EVENT_COMPLETED = 'event_completed', 'Event Completed'
    PROFILE_UPDATED = 'profile_updated', 'Profile Updated'
    NEW_BOOKING = 'new_booking', 'New Booking'
    NEW_COMPLAINT = 'new_complaint', 'New Complaint'

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, choices=NotificationType.choices)
    is_read = models.BooleanField(default=False)
    is_email_sent = models.BooleanField(default=False)
    email_required = models.BooleanField(default=False)
    metadata = models.JSONField(default=dict, blank=True)  # Store booking_id, complaint_id etc.
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.title}"