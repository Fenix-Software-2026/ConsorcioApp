from rest_framework import serializers
from .models import Reclamo, Comunicado, Unidad, Usuario
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UnidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unidad
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    nombre = serializers.CharField(source='first_name', required=False)
    apellido = serializers.CharField(source='last_name', required=False)
    esta_activo = serializers.BooleanField(source='is_active', default=True)

    piso = serializers.IntegerField(write_only=True, required=False)
    departamento = serializers.CharField(write_only=True, required=False)

    unidad_detalle = UnidadSerializer(
        source='unidad',
        read_only=True
    )

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
            'unidad_detalle',
            'piso',
            'departamento',
            'password'
        ]
        extra_kwargs = {
            'password': {
                'write_only': True,
                'required': False
            }
        }

    def create(self, validated_data):
        piso = validated_data.pop('piso', None)
        departamento = validated_data.pop(
            'departamento',
            None
        )

        if piso and departamento:
            unidad_obj, _ = Unidad.objects.get_or_create(
                piso=piso,
                departamento=departamento
            )
            validated_data['unidad'] = unidad_obj

        password = validated_data.pop(
            'password',
            '123456'
        )

        usuario = Usuario.objects.create_user(
            password=password,
            **validated_data
        )

        return usuario

class ReclamoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reclamo
        fields = '__all__'
        # Marcamos los campos que el cliente NO debe mandar
        read_only_fields = ('usuario', 'unidad', 'estado')

class ComunicadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comunicado
        fields = '__all__'


class ReclamoAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reclamo
        fields = '__all__'
        # El admin NO debería editar nada solo puede cambiar el estado
        read_only_fields = ('usuario', 'unidad', 'titulo', 'descripcion', 'categoria', 'imagen_url', 'fecha_creacion', 'fecha_actualizacion')

class MiTokenSerializer(TokenObtainPairSerializer):
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Añadimos datos personalizados ADENTRO del token de acceso
        token['rol'] = user.rol
        token['username'] = user.username
        
        return token