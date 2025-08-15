# # admin.py - Register notification model in admin
# from django.contrib import admin
# from .models import Notification

# @admin.register(Notification)
# class NotificationAdmin(admin.ModelAdmin):
#     list_display = ('title', 'user', 'notification_type', 'is_read', 'is_email_sent', 'created_at')
#     list_filter = ('notification_type', 'is_read', 'is_email_sent', 'created_at')
#     search_fields = ('title', 'message', 'user__username', 'user__email')
#     readonly_fields = ('created_at', 'updated_at')
    
#     fieldsets = (
#         (None, {
#             'fields': ('user', 'title', 'message', 'notification_type')
#         }),
#         ('Status', {
#             'fields': ('is_read', 'is_email_sent', 'email_required')
#         }),
#         ('Metadata', {
#             'fields': ('metadata',),
#             'classes': ('collapse',)
#         }),
#         ('Timestamps', {
#             'fields': ('created_at', 'updated_at'),
#             'classes': ('collapse',)
#         }),
#     )


from django.contrib import admin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'type', 'is_read', 'created_at')
    list_filter = ('type', 'is_read')
    readonly_fields = ('id', 'created_at')  # no updated_at
