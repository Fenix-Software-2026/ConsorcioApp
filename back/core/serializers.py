import secrets
import string
from django.core.mail import send_mail

from rest_framework import serializers
from .models import Reclamo, Comunicado, Unidad, Usuario
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UnidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unidad
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    nombre = serializers.CharField(
        source='first_name',
        required=False,
        allow_blank=True
    )
    apellido = serializers.CharField(
        source='last_name',
        required=False,
        allow_blank=True
    )
    esta_activo = serializers.BooleanField(
        source='is_active',
        default=True
    )

    # Para recibir desde Angular
    piso = serializers.IntegerField(
        write_only=True,
        required=False
    )
    departamento = serializers.CharField(
        write_only=True,
        required=False
    )

    # Para devolver detalle de unidad
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
            },
            'email': {
                'required': True
            }
        }

    def create(self, validated_data):
        # Extraemos piso/depto si vienen
        piso = validated_data.pop('piso', None)
        departamento = validated_data.pop(
            'departamento',
            None
        )

        # Si Angular manda piso/depto
        if piso is not None and departamento:
            unidad_obj, _ = Unidad.objects.get_or_create(
                piso=piso,
                departamento=departamento
            )
            validated_data['unidad'] = unidad_obj

        # Generar una contraseña aleatoria segura si no viene especificada
        password = validated_data.pop('password', None)
        if not password:
            # Definir conjuntos de caracteres obligatorios para cumplir con la política de seguridad
            lower = string.ascii_lowercase
            upper = string.ascii_uppercase
            digits = string.digits
            special = "!@#$%^&*()"

            # Asegurar al menos un carácter de cada tipo
            password_chars = [
                secrets.choice(lower),
                secrets.choice(upper),
                secrets.choice(digits),
                secrets.choice(special)
            ]

            # Completar hasta tener 10 caracteres en total con caracteres aleatorios de cualquier tipo
            all_chars = lower + upper + digits + special
            for _ in range(6):
                password_chars.append(secrets.choice(all_chars))

            # Mezclar para que no queden siempre en el mismo orden
            secrets.SystemRandom().shuffle(password_chars)
            password = "".join(password_chars)

        usuario = Usuario.objects.create_user(
            password=password,
            **validated_data
        )

        # Enviar correo electrónico con la contraseña provisoria si es residente
        if usuario.rol == 'residente' and usuario.email:
            try:
                send_mail(
                    subject='Acceso a ConsorcioApp - Tus credenciales provisorias',
                    message=(
                        f"Hola {usuario.first_name},\n\n"
                        f"Se ha registrado tu cuenta en ConsorcioApp.\n"
                        f"Tu nombre de usuario para iniciar sesión es: {usuario.username}\n"
                        f"Tu contraseña provisoria segura es: {password}\n\n"
                        f"Te recomendamos cambiarla desde tu perfil al ingresar por primera vez."
                    ),
                    from_email=None,  # Utiliza el DEFAULT_FROM_EMAIL del settings.py
                    recipient_list=[usuario.email],
                    fail_silently=False,
                )
            except Exception as e:
                print(f"Error al enviar el correo de credenciales: {e}")
        
        # Aquí puedes implementar el envío por SMTP usando `password` como la clave provisoria
        return usuario

    def update(self, instance, validated_data):
        # Si se actualiza piso/depto
        piso = validated_data.pop('piso', None)
        departamento = validated_data.pop(
            'departamento',
            None
        )

        if piso is not None and departamento:
            unidad_obj, _ = Unidad.objects.get_or_create(
                piso=piso,
                departamento=departamento
            )
            instance.unidad = unidad_obj

        # Password segura
        password = validated_data.pop(
            'password',
            None
        )

        # Actualizar resto de campos
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
        # Marcamos los campos que el cliente NO debe mandar
        read_only_fields = ('usuario', 'unidad', 'estado')

class ComunicadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comunicado
        fields = '__all__'

        read_only_fields = ['usuario']

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