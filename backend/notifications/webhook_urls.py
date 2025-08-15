# # webhook_urls.py
# from django.urls import path
# from . import webhooks

# webhook_urlpatterns = [
#     path('webhooks/booking/', webhooks.BookingWebhookView.as_view(), name='booking_webhook'),
#     path('webhooks/complaint/', webhooks.ComplaintWebhookView.as_view(), name='complaint_webhook'),
#     path('webhooks/admin/', webhooks.AdminWebhookView.as_view(), name='admin_webhook'),
#     path('webhooks/profile/', webhooks.ProfileWebhookView.as_view(), name='profile_webhook'),
# ]