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

class UnidadViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint para la consulta de unidades funcionales (departamentos/lotes).
    
    Vista de solo lectura (GET) protegida para administradores. 
    Ideal para alimentar selectores en los formularios de registro de Angular.
    """
    permission_classes = [EsAdminConsorcio]
    queryset = Unidad.objects.all()
    serializer_class = UnidadSerializer