# from django.apps import AppConfig


# class AboutConfig(AppConfig):
#     default_auto_field = 'django.db.models.BigAutoField'
#     name = 'about'

# backend/about/apps.py
from django.apps import AppConfig

class AboutConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'about'
    verbose_name = 'About Us Management'

# Don't forget to add 'about' to INSTALLED_APPS in settings.py