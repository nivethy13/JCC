# from rest_framework import serializers
# from .models import AboutPage, AboutImage

# class AboutImageSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = AboutImage
#         fields = ['id', 'image', 'caption', 'is_featured', 'uploaded_at']
#         read_only_fields = ['uploaded_at']

# class AboutPageSerializer(serializers.ModelSerializer):
#     images = AboutImageSerializer(many=True, read_only=True)
    
#     class Meta:
#         model = AboutPage
#         fields = '__all__'
#         read_only_fields = ['last_updated']

# backend/about/serializers.py
from rest_framework import serializers
from .models import AboutUs, AboutImage

class AboutImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutImage
        fields = ['id', 'image', 'caption', 'order', 'created_at']

class AboutUsSerializer(serializers.ModelSerializer):
    additional_images = AboutImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = AboutUs
        fields = [
            'id', 'title', 'subtitle',
            'who_we_are_title', 'who_we_are_description', 'who_we_are_mission', 
            'who_we_are_additional', 'who_we_are_image',
            'vision_title', 'vision_description',
            'mission_title', 'mission_description',
            'legacy_title', 'legacy_description', 'establishment_year',
            'events_hosted', 'happy_guests', 'years_of_excellence',
            'cta_title', 'cta_subtitle', 'cta_button_text',
            'address', 'phone', 'email',
            'additional_images', 'created_at', 'updated_at'
        ]

class AboutUsUpdateSerializer(serializers.ModelSerializer):
    additional_images = AboutImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = AboutUs
        fields = [
            'id', 'title', 'subtitle',
            'who_we_are_title', 'who_we_are_description', 'who_we_are_mission', 
            'who_we_are_additional', 'who_we_are_image',
            'vision_title', 'vision_description',
            'mission_title', 'mission_description',
            'legacy_title', 'legacy_description', 'establishment_year',
            'events_hosted', 'happy_guests', 'years_of_excellence',
            'cta_title', 'cta_subtitle', 'cta_button_text',
            'address', 'phone', 'email'
        ]
    
    def update(self, instance, validated_data):
        # Update all fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Set the user who updated
        if 'request' in self.context:
            instance.updated_by = self.context['request'].user
        
        instance.save()
        return instance