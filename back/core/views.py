import secrets
import string

from django.core.mail import send_mail
from rest_framework.exceptions import PermissionDenied 
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from core.permissions import EsAdminConsorcio, EsResidente
from .models import Reclamo, Comunicado, Usuario, Unidad
from .serializers import ReclamoAdminSerializer, ReclamoSerializer, ComunicadoSerializer, UsuarioSerializer, UnidadSerializer
from rest_framework.permissions import IsAuthenticated

class ReclamoViewSet(viewsets.ModelViewSet):
    """
    API endpoint para la gestión de reclamos del consorcio.
    
    Administradores: Pueden listar, visualizar y actualizar todos los reclamos.
    Residentes: Solo visualizan y crean reclamos asociados a su unidad.
    """
    permission_classes = [EsResidente | EsAdminConsorcio]

    def get_queryset(self):
        user = self.request.user
        if user.rol == 'administrador':
            return Reclamo.objects.all()
        return Reclamo.objects.filter(unidad=user.unidad)

    def get_serializer_class(self):
        if self.request.user.rol == 'administrador':
            return ReclamoAdminSerializer
        return ReclamoSerializer

    def perform_create(self, serializer):
        usuario_logueado = self.request.user
        
        if usuario_logueado.is_staff or usuario_logueado.rol == 'administrador':
            raise PermissionDenied("Los administradores no pueden crear reclamos.")
            
        serializer.save(usuario=usuario_logueado, unidad=usuario_logueado.unidad)
        
      

class ComunicadoViewSet(viewsets.ModelViewSet):
    """
    API endpoint para la publicación de comunicados oficiales.
    
    Lectura (GET): Permitida para todos los usuarios autenticados.
    Escritura (POST, PUT, DELETE): Restringida exclusivamente a los administradores.
    """
    queryset = Comunicado.objects.all()
    serializer_class = ComunicadoSerializer

    def perform_create(self, serializer):
        # Django agarra al administrador dueño del token y se lo clava al comunicado solo
        serializer.save(usuario=self.request.user)

    def get_permissions(self):
        # GET -> admin y residente
        if self.action in ['list', 'retrieve']:
            permission_classes = [
                EsAdminConsorcio | EsResidente
            ]
        # POST PUT DELETE -> solo admin
        else:
            permission_classes = [
                EsAdminConsorcio
            ]

        return [
            permission()
            for permission in permission_classes
        ]
    
class UsuarioViewSet(viewsets.ModelViewSet):
    """
    API endpoint para la administración de usuarios del sistema.
    
    Por defecto, las operaciones CRUD completas (listar, crear, editar, eliminar) 
    están restringidas únicamente a los Administradores del Consorcio.
    """
    permission_classes = [EsAdminConsorcio]
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    @action(detail=False, methods=['get', 'patch'], permission_classes=[IsAuthenticated])
    def mi_perfil(self, request):
        """
        Endpoint privado para que el usuario logueado gestione su propia cuenta.
        Sobrescribe el permiso general para permitir el acceso a cualquier residente.

        Métodos soportados:
        - GET: Devuelve el detalle del usuario autenticado (incluyendo su unidad).
        - PATCH: Permite actualizar campos específicos (ej: cambio de password) 
                 sin necesidad de enviar todo el objeto completo.
        """
        usuario_actual = request.user 
        
        # --- LÓGICA PARA LEER EL PERFIL (GET) ---
        if request.method == 'GET':
            serializer = self.get_serializer(usuario_actual)
            return Response(serializer.data)
            
        # --- LÓGICA PARA ACTUALIZAR EL PERFIL (PATCH) ---
        elif request.method == 'PATCH':
            # partial=True permite que el residente envíe solo la contraseña 
            # sin que Django exija los demás campos obligatorios.
            serializer = self.get_serializer(
                usuario_actual, 
                data=request.data, 
                partial=True
            )
            
            if serializer.is_valid():
                # El método save() disparará el def update() de tu UsuarioSerializer,
                # donde ya tenés escrita la lógica para encriptar la nueva password.
                serializer.save()
                return Response(
                    {"mensaje": "Los datos de tu perfil se actualizaron correctamente."}, 
                    status=status.HTTP_200_OK
                )
                
            # Si la validación falla, devolvemos los errores exactos
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def recuperar_password(self, request):
        """
        Endpoint sencillo para recuperar contraseña.
        Recibe el email, genera una nueva contraseña temporal segura y la envía por SMTP.
        """
        email = request.data.get('email')
        if not email:
            return Response(
                {"error": "Debes proporcionar un correo electrónico."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            usuario = Usuario.objects.get(email=email)
        except Usuario.DoesNotExist:
            # Por seguridad no revelamos si el correo existe o no, pero devolvemos OK
            return Response(
                {"mensaje": "Si el correo está registrado, se han enviado las instrucciones."}, 
                status=status.HTTP_200_OK
            )

        # Generar una nueva contraseña segura temporal (cumpliendo con ciberseguridad)
        lower = string.ascii_lowercase
        upper = string.ascii_uppercase
        digits = string.digits
        special = "!@#$%^&*()"

        password_chars = [
            secrets.choice(lower),
            secrets.choice(upper),
            secrets.choice(digits),
            secrets.choice(special)
        ]
        all_chars = lower + upper + digits + special
        for _ in range(6):
            password_chars.append(secrets.choice(all_chars))

        secrets.SystemRandom().shuffle(password_chars)
        nueva_password = "".join(password_chars)

        # Asignar y hashear la nueva contraseña en la base de datos
        usuario.set_password(nueva_password)
        usuario.save()

        # Enviar por SMTP
        try:
            send_mail(
                subject='ConsorcioApp - Recuperación de Contraseña',
                message=(
                    f"Hola {usuario.first_name or usuario.username},\n\n"
                    f"Has solicitado restablecer tu contraseña.\n"
                    f"Tu usuario es: {usuario.username}\n"
                    f"Tu nueva contraseña provisoria es: {nueva_password}\n\n"
                    f"Te recomendamos iniciar sesión y cambiarla desde tu perfil."
                ),
                from_email=None,
                recipient_list=[usuario.email],
                fail_silently=False,
            )
        except Exception as e:
            return Response(
                {"error": f"No se pudo enviar el correo: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
            {"mensaje": "Se ha enviado una nueva contraseña temporal a tu correo."}, 
            status=status.HTTP_200_OK
        )

class UnidadViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint para la consulta de unidades funcionales (departamentos/lotes).
    
    Vista de solo lectura (GET) protegida para administradores. 
    Ideal para alimentar selectores en los formularios de registro de Angular.
    """
    permission_classes = [EsAdminConsorcio]
    queryset = Unidad.objects.all()
    serializer_class = UnidadSerializer