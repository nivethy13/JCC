# # backend/about/admin.py
from django.contrib import admin
from .models import AboutUs, AboutImage

class AboutImageInline(admin.TabularInline):
    model = AboutImage
    extra = 0
    fields = ('image', 'caption', 'order')
    ordering = ('order',)

@admin.register(AboutUs)
class AboutUsAdmin(admin.ModelAdmin):
    inlines = [AboutImageInline]
    
    fieldsets = (
        ('Header Section', {
            'fields': ('title', 'subtitle')
        }),
        ('Who We Are Section', {
            'fields': ('who_we_are_title', 'who_we_are_description', 
                      'who_we_are_mission', 'who_we_are_additional', 'who_we_are_image')
        }),
        ('Vision & Mission', {
            'fields': (('vision_title', 'mission_title'),
                      ('vision_description', 'mission_description'))
        }),
        ('Legacy Section', {
            'fields': ('legacy_title', 'legacy_description', 'establishment_year')
        }),
        ('Statistics', {
            'fields': (('events_hosted', 'happy_guests', 'years_of_excellence'),)
        }),
        ('Call to Action', {
            'fields': ('cta_title', 'cta_subtitle', 'cta_button_text')
        }),
        ('Contact Information', {
            'fields': ('address', 'phone', 'email')
        }),
        ('Metadata', {
            'fields': ('updated_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    readonly_fields = ('created_at', 'updated_at', 'updated_by')
    
    def save_model(self, request, obj, form, change):
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)
    
    def has_add_permission(self, request):
        # Only allow one AboutUs instance
        return not AboutUs.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # Don't allow deletion of AboutUs
        return False

@admin.register(AboutImage)
class AboutImageAdmin(admin.ModelAdmin):
    list_display = ('about_us', 'caption', 'order', 'created_at')
    list_filter = ('created_at',)
    ordering = ('order', 'created_at')