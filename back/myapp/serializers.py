from rest_framework import serializers
from .models import PruebaConexion

class PruebaConexionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PruebaConexion
        fields = '__all__'  # Esto incluye el id, mensaje y fecha