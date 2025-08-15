# auth_utils.py - Custom authentication utilities
from django.http import JsonResponse
from django.contrib.auth.models import User
from functools import wraps

from django.urls import path
import jwt
from django.conf import settings
import json

def jwt_required(view_func):
    """Decorator to check JWT token authentication"""
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        # Check for JWT token in header
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'Authentication token required'}, status=401)
        
        token = auth_header.split(' ')[1]
        
        try:
            # Decode JWT token
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')
            
            if not user_id:
                return JsonResponse({'error': 'Invalid token'}, status=401)
            
            # Get user
            try:
                user = User.objects.get(id=user_id)
                request.user = user
            except User.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=401)
                
        except jwt.ExpiredSignatureError:
            return JsonResponse({'error': 'Token has expired'}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({'error': 'Invalid token'}, status=401)
        
        return view_func(request, *args, **kwargs)
    
    return wrapper

def session_or_jwt_required(view_func):
    """Decorator that accepts either session auth or JWT"""
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        # Check if user is already authenticated via session
        if request.user.is_authenticated:
            return view_func(request, *args, **kwargs)
        
        # Check for JWT token
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                user_id = payload.get('user_id')
                
                if user_id:
                    try:
                        user = User.objects.get(id=user_id)
                        request.user = user
                        return view_func(request, *args, **kwargs)
                    except User.DoesNotExist:
                        pass
            except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
                pass
        
        return JsonResponse({'error': 'Authentication required'}, status=401)
    
    return wrapper

# Alternative: Simple API key authentication
def api_key_required(view_func):
    """Simple API key authentication for webhooks"""
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        api_key = request.headers.get('X-API-Key')
        
        if not api_key:
            return JsonResponse({'error': 'API key required'}, status=401)
        
        # Check if API key is valid (you can store this in database)
        if api_key != getattr(settings, 'NOTIFICATION_API_KEY', None):
            return JsonResponse({'error': 'Invalid API key'}, status=401)
        
        return view_func(request, *args, **kwargs)
    
    return wrapper

# Guest notification system for non-authenticated users
class GuestNotificationManager:
    """Manage notifications for guest users using session or local storage"""
    
    @staticmethod
    def add_guest_notification(request, title, message, notification_type, metadata=None):
        """Add notification to session for guest users"""
        if not hasattr(request, 'session'):
            return False
        
        if 'guest_notifications' not in request.session:
            request.session['guest_notifications'] = []
        
        notification = {
            'id': len(request.session['guest_notifications']) + 1,
            'title': title,
            'message': message,
            'type': notification_type,
            'metadata': metadata or {},
            'is_read': False,
            'created_at': timezone.now().isoformat()
        }
        
        request.session['guest_notifications'].append(notification)
        request.session.modified = True
        return True
    
    @staticmethod
    def get_guest_notifications(request):
        """Get all guest notifications from session"""
        return request.session.get('guest_notifications', [])
    
    @staticmethod
    def mark_guest_notification_read(request, notification_id):
        """Mark guest notification as read"""
        notifications = request.session.get('guest_notifications', [])
        
        for notification in notifications:
            if notification['id'] == notification_id:
                notification['is_read'] = True
                request.session.modified = True
                return True
        
        return False
    
    @staticmethod
    def clear_guest_notifications(request):
        """Clear all guest notifications"""
        if 'guest_notifications' in request.session:
            del request.session['guest_notifications']

# Modified notification views for guest support
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.utils import timezone

@method_decorator(csrf_exempt, name='dispatch')
class GuestNotificationView(View):
    """Handle notifications for guest users"""
    
    def get(self, request):
        """Get notifications for guest or authenticated user"""
        if request.user.is_authenticated:
            # Return user notifications
            notifications = Notification.objects.filter(user=request.user)[:10]
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
                    for n in notifications
                ],
                'unread_count': Notification.objects.filter(user=request.user, is_read=False).count()
            }
        else:
            # Return guest notifications from session
            notifications = GuestNotificationManager.get_guest_notifications(request)
            unread_count = sum(1 for n in notifications if not n['is_read'])
            
            data = {
                'notifications': notifications,
                'unread_count': unread_count
            }
        
        return JsonResponse(data)
    
    def post(self, request):
        """Create notification for guest user"""
        try:
            data = json.loads(request.body)
            
            if request.user.is_authenticated:
                # Create regular notification for authenticated user
                notification = Notification.objects.create(
                    user=request.user,
                    title=data.get('title'),
                    message=data.get('message'),
                    notification_type=data.get('type', 'general'),
                    metadata=data.get('metadata', {})
                )
                return JsonResponse({'success': True, 'id': notification.id})
            else:
                # Create guest notification
                success = GuestNotificationManager.add_guest_notification(
                    request,
                    data.get('title'),
                    data.get('message'),
                    data.get('type', 'general'),
                    data.get('metadata', {})
                )
                
                if success:
                    return JsonResponse({'success': True, 'message': 'Guest notification created'})
                else:
                    return JsonResponse({'error': 'Failed to create notification'}, status=500)
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

# Webhook for guest notifications (using session ID or email)
@method_decorator(csrf_exempt, name='dispatch')
class GuestWebhookView(View):
    """Handle webhooks for guest users"""
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            event_type = data.get('event_type')
            user_email = data.get('user_email')  # For guest users
            session_key = data.get('session_key')  # Alternative identifier
            notification_data = data.get('notification_data', {})
            
            # If email is provided, try to find user
            if user_email:
                try:
                    user = User.objects.get(email=user_email)
                    # Send notification to authenticated user
                    NotificationService.create_notification(
                        user=user,
                        title=notification_data.get('title'),
                        message=notification_data.get('message'),
                        notification_type=event_type,
                        metadata=notification_data.get('metadata', {})
                    )
                except User.DoesNotExist:
                    # User not found, could be guest
                    pass
            
            # For guest users, you might want to store notifications
            # temporarily and show them when they visit the site again
            # This could be done using a temporary storage system
            
            return JsonResponse({'status': 'success'})
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

# URL patterns for guest notifications
guest_notification_urls = [
    path('guest-notifications/', GuestNotificationView.as_view(), name='guest_notifications'),
    path('guest-webhook/', GuestWebhookView.as_view(), name='guest_webhook'),
]

# Settings addition for API authentication
"""
# Add to settings.py

# API Key for notifications (generate a secure random key)
NOTIFICATION_API_KEY = 'your-secure-api-key-here'

# JWT Settings
JWT_SECRET_KEY = SECRET_KEY  # Or use a separate key
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_DELTA = timedelta(days=7)

# Session settings for guest notifications
SESSION_COOKIE_AGE = 86400  # 24 hours
SESSION_SAVE_EVERY_REQUEST = True
"""