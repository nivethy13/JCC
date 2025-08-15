# backend/notifications/triggers.py
from backend.notifications.models import Notification
from backend.notifications.utils import send_email_notification


def trigger_admin_notification(title, message, notif_type='info', email=False):
    from django.contrib.auth.models import User
    admins = User.objects.filter(is_staff=True)
    for admin in admins:
        Notification.objects.create(
            user=admin,
            recipient_role='admin',
            title=title,
            message=message,
            type=notif_type
        )
        if email:
            send_email_notification(title, message, [admin.email])
