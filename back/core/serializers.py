from rest_framework import serializers
from .models import Reclamo, Comunicado, Unidad, Usuario
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UnidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unidad
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    nombre = serializers.CharField(source='first_name', required=False, allow_blank=True)
    apellido = serializers.CharField(source='last_name', required=False, allow_blank=True)
    esta_activo = serializers.BooleanField(source='is_active', default=True)

    class Meta:
        model = Usuario
        fields = [
            'id', 
            'username',
            'nombre',
            'apellido',
            'email', 
            'rol', 
            'residente_actual', 
            'esta_activo',
            'unidad', 
            'password'
        ]
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
            'email': {'required': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        
        # Crea el usuario usando el manager nativo de Django para AbstractUser
        usuario = Usuario.objects.create_user(**validated_data)
        usuario.set_password(password)
        usuario.save()
        return usuario

    def update(self, instance, validated_data):
        # Permite actualizar los datos y la contraseña de forma segura si se envía
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

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