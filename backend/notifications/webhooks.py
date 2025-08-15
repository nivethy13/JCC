# # webhooks.py
# from datetime import timezone
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.views.decorators.http import require_http_methods
# from django.contrib.auth.models import User
# from django.utils.decorators import method_decorator
# from django.views import View
# import json
# import logging
# from .models import NotificationType
# from .views import NotificationWebhooks
# import hashlib
# import hmac

# logger = logging.getLogger(__name__)

# class WebhookSecurityMixin:
#     """Mixin to verify webhook signatures for security"""
    
#     def verify_signature(self, request, secret_key):
#         """Verify webhook signature"""
#         try:
#             signature = request.headers.get('X-Webhook-Signature')
#             if not signature:
#                 return False
            
#             expected_signature = hmac.new(
#                 secret_key.encode('utf-8'),
#                 request.body,
#                 hashlib.sha256
#             ).hexdigest()
            
#             return hmac.compare_digest(f"sha256={expected_signature}", signature)
#         except Exception as e:
#             logger.error(f"Signature verification error: {e}")
#             return False

# @method_decorator(csrf_exempt, name='dispatch')
# class BookingWebhookView(View, WebhookSecurityMixin):
#     """Handle booking-related webhooks"""
    
#     def post(self, request):
#         try:
#             # Verify webhook signature (optional but recommended)
#             # if not self.verify_signature(request, settings.WEBHOOK_SECRET_KEY):
#             #     return JsonResponse({'error': 'Invalid signature'}, status=401)
            
#             data = json.loads(request.body)
#             event_type = data.get('event_type')
#             booking_data = data.get('booking_data', {})
#             user_id = data.get('user_id')
            
#             # Get user
#             try:
#                 user = User.objects.get(id=user_id)
#             except User.DoesNotExist:
#                 return JsonResponse({'error': 'User not found'}, status=400)
            
#             # Handle different booking events
#             if event_type == 'booking_success':
#                 NotificationWebhooks.booking_success(user, booking_data)
                
#             elif event_type == 'booking_rejected':
#                 NotificationWebhooks.booking_rejected(user, booking_data)
                
#             elif event_type == 'payment_approved':
#                 NotificationWebhooks.payment_approved(user, booking_data)
                
#             elif event_type == 'payment_rejected':
#                 NotificationWebhooks.payment_rejected(user, booking_data)
                
#             elif event_type == 'event_completed':
#                 NotificationWebhooks.event_completed(user, booking_data)
            
#             else:
#                 return JsonResponse({'error': 'Unknown event type'}, status=400)
            
#             logger.info(f"Webhook processed: {event_type} for user {user.id}")
#             return JsonResponse({'status': 'success', 'message': 'Notification sent'})
            
#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON'}, status=400)
#         except Exception as e:
#             logger.error(f"Webhook processing error: {e}")
#             return JsonResponse({'error': 'Internal server error'}, status=500)

# @method_decorator(csrf_exempt, name='dispatch')
# class ComplaintWebhookView(View, WebhookSecurityMixin):
#     """Handle complaint-related webhooks"""
    
#     def post(self, request):
#         try:
#             data = json.loads(request.body)
#             event_type = data.get('event_type')
#             complaint_data = data.get('complaint_data', {})
#             user_id = data.get('user_id')
#             admin_id = data.get('admin_id')
            
#             if event_type == 'complaint_replied':
#                 # Notify customer about reply
#                 try:
#                     user = User.objects.get(id=user_id)
#                     NotificationWebhooks.complaint_replied(user, complaint_data)
#                 except User.DoesNotExist:
#                     return JsonResponse({'error': 'User not found'}, status=400)
                    
#             elif event_type == 'new_complaint':
#                 # Notify all admins about new complaint
#                 admin_users = User.objects.filter(is_staff=True, is_active=True)
#                 for admin_user in admin_users:
#                     NotificationWebhooks.new_complaint_admin(admin_user, complaint_data)
            
#             else:
#                 return JsonResponse({'error': 'Unknown event type'}, status=400)
            
#             logger.info(f"Complaint webhook processed: {event_type}")
#             return JsonResponse({'status': 'success', 'message': 'Notification sent'})
            
#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON'}, status=400)
#         except Exception as e:
#             logger.error(f"Complaint webhook processing error: {e}")
#             return JsonResponse({'error': 'Internal server error'}, status=500)

# @method_decorator(csrf_exempt, name='dispatch')
# class AdminWebhookView(View, WebhookSecurityMixin):
#     """Handle admin-related webhooks"""
    
#     def post(self, request):
#         try:
#             data = json.loads(request.body)
#             event_type = data.get('event_type')
#             booking_data = data.get('booking_data', {})
            
#             if event_type == 'new_booking_payment_slip':
#                 # Notify all admins about new booking with payment slip
#                 admin_users = User.objects.filter(is_staff=True, is_active=True)
#                 for admin_user in admin_users:
#                     NotificationWebhooks.new_booking_admin(admin_user, booking_data)
            
#             else:
#                 return JsonResponse({'error': 'Unknown event type'}, status=400)
            
#             logger.info(f"Admin webhook processed: {event_type}")
#             return JsonResponse({'status': 'success', 'message': 'Notification sent'})
            
#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON'}, status=400)
#         except Exception as e:
#             logger.error(f"Admin webhook processing error: {e}")
#             return JsonResponse({'error': 'Internal server error'}, status=500)

# @method_decorator(csrf_exempt, name='dispatch')
# class ProfileWebhookView(View, WebhookSecurityMixin):
#     """Handle profile update webhooks"""
    
#     def post(self, request):
#         try:
#             data = json.loads(request.body)
#             event_type = data.get('event_type')
#             user_id = data.get('user_id')
            
#             if event_type == 'profile_updated':
#                 try:
#                     user = User.objects.get(id=user_id)
#                     NotificationWebhooks.profile_updated(user)
#                 except User.DoesNotExist:
#                     return JsonResponse({'error': 'User not found'}, status=400)
            
#             else:
#                 return JsonResponse({'error': 'Unknown event type'}, status=400)
            
#             logger.info(f"Profile webhook processed: {event_type} for user {user_id}")
#             return JsonResponse({'status': 'success', 'message': 'Notification sent'})
            
#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON'}, status=400)
#         except Exception as e:
#             logger.error(f"Profile webhook processing error: {e}")
#             return JsonResponse({'error': 'Internal server error'}, status=500)

# # webhook_client.py - Helper functions to trigger webhooks from other parts of your application
# import requests
# import json
# from django.conf import settings
# import logging

# logger = logging.getLogger(__name__)

# class WebhookClient:
#     """Client to send webhook requests internally"""
    
#     @staticmethod
#     def send_webhook(endpoint, data):
#         """Send webhook request to internal endpoint"""
#         try:
#             url = f"{settings.BASE_URL}/api/webhooks/{endpoint}/"
            
#             # Add signature if webhook secret is configured
#             if hasattr(settings, 'WEBHOOK_SECRET_KEY'):
#                 import hmac
#                 import hashlib
                
#                 payload = json.dumps(data).encode('utf-8')
#                 signature = hmac.new(
#                     settings.WEBHOOK_SECRET_KEY.encode('utf-8'),
#                     payload,
#                     hashlib.sha256
#                 ).hexdigest()
                
#                 headers = {
#                     'Content-Type': 'application/json',
#                     'X-Webhook-Signature': f'sha256={signature}'
#                 }
#             else:
#                 headers = {'Content-Type': 'application/json'}
            
#             response = requests.post(url, json=data, headers=headers, timeout=10)
            
#             if response.status_code == 200:
#                 logger.info(f"Webhook sent successfully to {endpoint}")
#                 return True
#             else:
#                 logger.error(f"Webhook failed: {response.status_code} - {response.text}")
#                 return False
                
#         except Exception as e:
#             logger.error(f"Webhook sending error: {e}")
#             return False
    
#     @staticmethod
#     def booking_success(user_id, booking_data):
#         """Trigger booking success webhook"""
#         data = {
#             'event_type': 'booking_success',
#             'user_id': user_id,
#             'booking_data': booking_data,
#             'timestamp': timezone.now().isoformat()
#         }
#         return WebhookClient.send_webhook('booking', data)
    
#     @staticmethod
#     def booking_rejected(user_id, booking_data):
#         """Trigger booking rejected webhook"""
#         data = {
#             'event_type': 'booking_rejected',
#             'user_id': user_id,
#             'booking_data': booking_data,
#             'timestamp': timezone.now().isoformat()
#         }
#         return WebhookClient.send_webhook('booking', data)
    
#     @staticmethod
#     def payment_approved(user_id, booking_data):
#         """Trigger payment approved webhook"""
#         data = {
#             'event_type': 'payment_approved',
#             'user_id': user_id,
#             'booking_data': booking_data,
#             'timestamp': timezone.now().isoformat()
#         }
#         return WebhookClient.send_webhook('booking', data)
    
#     @staticmethod
#     def payment_rejected(user_id, booking_data):
#         """Trigger payment rejected webhook"""
#         data = {
#             'event_type': 'payment_rejected',
#             'user_id': user_id,
#             'booking_data': booking_data,
#             'timestamp': timezone.now().isoformat()
#         }
#         return WebhookClient.send_webhook('booking', data)
    
#     @staticmethod
#     def event_completed(user_id, booking_data):
#         """Trigger event completed webhook"""
#         data = {
#             'event_type': 'event_completed',
#             'user_id': user_id,
#             'booking_data': booking_data,
#             'timestamp': timezone.now().isoformat()
#         }
#         return WebhookClient.send_webhook('booking', data)
    
#     @staticmethod
#     def new_booking_payment_slip(booking_data):
#         """Trigger new booking with payment slip webhook"""
#         data = {
#             'event_type': 'new_booking_payment_slip',
#             'booking_data': booking_data,
#             'timestamp': timezone.now().isoformat()
#         }
#         return WebhookClient.send_webhook('admin', data)
    
#     @staticmethod
#     def complaint_replied(user_id, complaint_data):
#         """Trigger complaint replied webhook"""
#         data = {
#             'event_type': 'complaint_replied',
#             'user_id': user_id,
#             'complaint_data': complaint_data,
#             'timestamp': timezone.now().isoformat()
#         }
#         return WebhookClient.send_webhook('complaint', data)
    
#     @staticmethod
#     def new_complaint(complaint_data):
#         """Trigger new complaint webhook"""
#         data = {
#             'event_type': 'new_complaint',
#             'complaint_data': complaint_data,
#             'timestamp': timezone.now().isoformat()
#         }
#         return WebhookClient.send_webhook('complaint', data)
    
#     @staticmethod
#     def profile_updated(user_id):
#         """Trigger profile updated webhook"""
#         data = {
#             'event_type': 'profile_updated',
#             'user_id': user_id,
#             'timestamp': timezone.now().isoformat()
#         }
#         return WebhookClient.send_webhook('profile', data)

# # Example usage in your booking views
# """
# # In your booking view after successful booking:
# from .webhook_client import WebhookClient

# # When booking is successful
# booking_data = {
#     'booking_id': booking.id,
#     'hall_name': booking.hall.name,
#     'booking_date': booking.date.isoformat(),
#     'customer_name': booking.user.get_full_name(),
#     'amount': str(booking.total_amount)
# }
# WebhookClient.booking_success(booking.user.id, booking_data)

# # When payment slip is uploaded
# booking_data = {
#     'booking_id': booking.id,
#     'hall_name': booking.hall.name,
#     'customer_name': booking.user.get_full_name(),
#     'customer_email': booking.user.email,
#     'amount': str(booking.total_amount)
# }
# WebhookClient.new_booking_payment_slip(booking_data)

# # When admin approves payment
# WebhookClient.payment_approved(booking.user.id, booking_data)

# # When event is completed (you can run this as a scheduled task)
# WebhookClient.event_completed(booking.user.id, booking_data)

# # When admin replies to complaint
# complaint_data = {
#     'complaint_id': complaint.id,
#     'customer_name': complaint.user.get_full_name()
# }
# WebhookClient.complaint_replied(complaint.user.id, complaint_data)

# # When new complaint is submitted
# complaint_data = {
#     'complaint_id': complaint.id,
#     'customer_name': complaint.user.get_full_name(),
#     'customer_email': complaint.user.email,
#     'subject': complaint.subject
# }
# WebhookClient.new_complaint(complaint_data)

# # When profile is updated
# WebhookClient.profile_updated(request.user.id)
# """



# # Add to your main urls.py:
# # from notifications.webhook_urls import webhook_urlpatterns
# # urlpatterns += webhook_urlpatterns