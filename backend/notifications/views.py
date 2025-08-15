from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Notification
from .serializers import NotificationSerializer

from rest_framework import generics
from .models import Notification
from .serializers import NotificationSerializer

class AdminNotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer

    def get_queryset(self):
        queryset = Notification.objects.filter(receiver_role='admin').order_by('-created_at')
        status = self.request.query_params.get('status')
        search = self.request.query_params.get('search')
        if status == 'unread':
            queryset = queryset.filter(is_read=False)
        elif status == 'read':
            queryset = queryset.filter(is_read=True)
        if search:
            queryset = queryset.filter(title__icontains=search) | queryset.filter(message__icontains=search)
        return queryset



@api_view(['PATCH'])
def mark_admin_notification_read(request, pk):
    try:
        notif = Notification.objects.get(pk=pk, receiver_role='admin')
        notif.is_read = True
        notif.save()
        return Response({"message": "Marked as read"})
    except Notification.DoesNotExist:
        return Response({"error": "Notification not found"}, status=404)


@api_view(['DELETE'])
def delete_admin_notification(request, pk):
    try:
        notif = Notification.objects.get(pk=pk, receiver_role='admin')
        notif.delete()
        return Response({"message": "Notification deleted"})
    except Notification.DoesNotExist:
        return Response({"error": "Notification not found"}, status=404)
