from rest_framework.exceptions import PermissionDenied 
from rest_framework import viewsets

from core.permissions import EsAdminConsorcio, EsResidente
from .models import Reclamo, Comunicado, Usuario, Unidad
from .serializers import ReclamoAdminSerializer, ReclamoSerializer, ComunicadoSerializer, UsuarioSerializer, UnidadSerializer


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
    API endpoint para la administración de usuarios del sistema (CRUD completo).
    
    Acceso exclusivo para Administradores del Consorcio.
    """
    permission_classes = [EsAdminConsorcio]
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class UnidadViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint para la consulta de unidades funcionales (departamentos/lotes).
    
    Vista de solo lectura (GET) protegida para administradores. 
    Ideal para alimentar selectores en los formularios de registro de Angular.
    """
    permission_classes = [EsAdminConsorcio]
    queryset = Unidad.objects.all()
    serializer_class = UnidadSerializer