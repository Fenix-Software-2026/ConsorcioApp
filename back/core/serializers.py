from rest_framework import serializers
from .models import Reclamo, Comunicado, Unidad, Usuario
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UnidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unidad
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    # Campos que se usan para RECIBIR los datos desde Angular (solo escritura)
    piso = serializers.IntegerField(write_only=True)
    departamento = serializers.CharField(write_only=True)
    
    # Campo que se usa para DEVOLVER los datos al frontend (solo lectura)
    # Al ponerle 'read_only=True', Django sabe que no debe exigirlo en el POST
    unidad_detalle = UnidadSerializer(source='unidad', read_only=True)

    class Meta:
        model = Usuario
        fields = [
            'username', 'email', 
            'rol','piso', 'departamento' , 'unidad_detalle', 'password'
        ]
        # Dejamos la password oculta en las respuestas GET por seguridad
        extra_kwargs = {'password': {'write_only': True, 'required': False}}

    def create(self, validated_data):
        # Extraemos piso y depto enviados por Angular
        piso = validated_data.pop('piso')
        departamento = validated_data.pop('departamento')

        # Buscamos o creamos la unidad correspondiente
        unidad_obj, _ = Unidad.objects.get_or_create(
            piso=piso, 
            departamento=departamento
        )

        password = validated_data.pop('password', '123456')
        
        # Instanciamos y guardamos el usuario con su relación armada
        usuario = Usuario(**validated_data)
        usuario.set_password(password)
        usuario.unidad = unidad_obj # type: ignore
        usuario.save()
        
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