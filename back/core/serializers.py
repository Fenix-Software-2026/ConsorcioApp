from rest_framework import serializers
from .models import Reclamo, Comunicado, Unidad, Usuario
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UnidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unidad
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        extra_kwargs = {'password': {'write_only': True}} # No se envía el password al front
        fields = ['id', 'nombre', 'apellido', 'email', 'password', 'rol', 'residente_actual', 'esta_activo', 'unidad']

class ReclamoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reclamo
        fields = '__all__'

class ComunicadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comunicado
        fields = '__all__'


class MiTokenSerializer(TokenObtainPairSerializer):
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Añadimos datos personalizados ADENTRO del token de acceso
        token['rol'] = user.rol
        token['username'] = user.username
        
        return token