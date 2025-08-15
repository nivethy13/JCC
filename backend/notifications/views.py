# from rest_framework import generics
# from rest_framework.response import Response
# from rest_framework.decorators import api_view
# from .models import Notification
# from .serializers import NotificationSerializer

# from rest_framework import generics
# from .models import Notification
# from .serializers import NotificationSerializer

# class AdminNotificationListView(generics.ListAPIView):
#     serializer_class = NotificationSerializer

#     def get_queryset(self):
#         queryset = Notification.objects.filter(receiver_role='admin').order_by('-created_at')
#         status = self.request.query_params.get('status')
#         search = self.request.query_params.get('search')
#         if status == 'unread':
#             queryset = queryset.filter(is_read=False)
#         elif status == 'read':
#             queryset = queryset.filter(is_read=True)
#         if search:
#             queryset = queryset.filter(title__icontains=search) | queryset.filter(message__icontains=search)
#         return queryset



# @api_view(['PATCH'])
# def mark_admin_notification_read(request, pk):
#     try:
#         notif = Notification.objects.get(pk=pk, receiver_role='admin')
#         notif.is_read = True
#         notif.save()
#         return Response({"message": "Marked as read"})
#     except Notification.DoesNotExist:
#         return Response({"error": "Notification not found"}, status=404)


# @api_view(['DELETE'])
# def delete_admin_notification(request, pk):
#     try:
#         notif = Notification.objects.get(pk=pk, receiver_role='admin')
#         notif.delete()
#         return Response({"message": "Notification deleted"})
#     except Notification.DoesNotExist:
#         return Response({"error": "Notification not found"}, status=404)



# views.py
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import json

from backend.notifications.models import Notification, NotificationType

class NotificationService:
    EMAIL_TYPES = [
        NotificationType.BOOKING_SUCCESS,
        NotificationType.BOOKING_REJECTED,
        NotificationType.PAYMENT_APPROVED,
        NotificationType.PAYMENT_REJECTED,
        NotificationType.COMPLAINT_REPLIED,
    ]

    @staticmethod
    def create_notification(user, title, message, notification_type, metadata=None):
        """Create a notification and send email if required"""
        email_required = notification_type in NotificationService.EMAIL_TYPES
        
        notification = Notification.objects.create(
            user=user,
            title=title,
            message=message,
            notification_type=notification_type,
            email_required=email_required,
            metadata=metadata or {}
        )

        if email_required:
            NotificationService.send_email_notification(notification)

        return notification

    @staticmethod
    def send_email_notification(notification):
        """Send email notification"""
        try:
            subject = f"Jaffna Cultural Centre - {notification.title}"
            
            # Create email context
            context = {
                'user_name': notification.user.get_full_name() or notification.user.username,
                'title': notification.title,
                'message': notification.message,
                'notification_type': notification.get_notification_type_display(),
                'metadata': notification.metadata
            }

            # Render email template
            html_message = render_to_string('emails/notification_email.html', context)
            plain_message = strip_tags(html_message)

            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[notification.user.email],
                html_message=html_message,
                fail_silently=False,
            )

            notification.is_email_sent = True
            notification.save(update_fields=['is_email_sent'])

        except Exception as e:
            print(f"Failed to send email notification: {e}")

class NotificationListView(View):
    def get(self, request):
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentication required'}, status=401)
            
        notifications = Notification.objects.filter(user=request.user)
        
        # Filter by type if specified
        notification_type = request.GET.get('type')
        if notification_type:
            notifications = notifications.filter(notification_type=notification_type)

        # Filter by read status
        is_read = request.GET.get('is_read')
        if is_read is not None:
            notifications = notifications.filter(is_read=is_read.lower() == 'true')

        # Pagination
        page = request.GET.get('page', 1)
        paginator = Paginator(notifications, 10)
        notifications_page = paginator.get_page(page)

        data = {
            'notifications': [
                {
                    'id': n.id,
                    'title': n.title,
                    'message': n.message,
                    'type': n.notification_type,
                    'is_read': n.is_read,
                    'created_at': n.created_at.isoformat(),
                    'metadata': n.metadata
                }
                for n in notifications_page
            ],
            'total_pages': paginator.num_pages,
            'current_page': notifications_page.number,
            'unread_count': Notification.objects.filter(user=request.user, is_read=False).count()
        }

        return JsonResponse(data)

class NotificationDetailView(View):
    def get(self, request, notification_id):
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentication required'}, status=401)
            
        notification = get_object_or_404(Notification, id=notification_id, user=request.user)
        
        data = {
            'id': notification.id,
            'title': notification.title,
            'message': notification.message,
            'type': notification.notification_type,
            'is_read': notification.is_read,
            'created_at': notification.created_at.isoformat(),
            'metadata': notification.metadata
        }
        
        return JsonResponse(data)

    def patch(self, request, notification_id):
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentication required'}, status=401)
            
        notification = get_object_or_404(Notification, id=notification_id, user=request.user)
        
        try:
            data = json.loads(request.body)
            
            if 'is_read' in data:
                notification.is_read = data['is_read']
                notification.save(update_fields=['is_read'])
            
            return JsonResponse({'success': True, 'message': 'Notification updated successfully'})
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)

class MarkAllNotificationsReadView(View):
    def post(self, request):
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentication required'}, status=401)
            
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return JsonResponse({'success': True, 'message': 'All notifications marked as read'})

class UnreadNotificationCountView(View):
    def get(self, request):
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentication required'}, status=401)
            
        count = Notification.objects.filter(user=request.user, is_read=False).count()
        return JsonResponse({'unread_count': count})