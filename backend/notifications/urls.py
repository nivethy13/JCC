# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('notifications/', views.NotificationListView.as_view(), name='notification_list'),
    path('notifications/<int:notification_id>/', views.NotificationDetailView.as_view(), name='notification_detail'),
    path('notifications/mark-all-read/', views.MarkAllNotificationsReadView.as_view(), name='mark_all_read'),
    path('notifications/unread-count/', views.UnreadNotificationCountView.as_view(), name='unread_count'),
]


# # backend/notifications/urls.py
# from django.urls import path
# from .views import AdminNotificationListView, mark_admin_notification_read, delete_admin_notification

# urlpatterns = [
#     path('', AdminNotificationListView.as_view(), name='admin_notifications'),  # <-- just ''
#     path('<int:pk>/read/', mark_admin_notification_read, name='mark_admin_notification_read'),
#     path('<int:pk>/delete/', delete_admin_notification, name='delete_admin_notification'),
# ]


