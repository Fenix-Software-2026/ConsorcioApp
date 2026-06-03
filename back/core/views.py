from rest_framework.exceptions import PermissionDenied 
from rest_framework import viewsets

from core.permissions import EsAdminConsorcio, EsResidente
from .models import Reclamo, Comunicado, Usuario, Unidad
from .serializers import ReclamoAdminSerializer, ReclamoSerializer, ComunicadoSerializer, UsuarioSerializer, UnidadSerializer


class ReclamoViewSet(viewsets.ModelViewSet):
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
            # 2. Corregido el raise con la excepción limpia de DRF
            raise PermissionDenied("Los administradores no pueden crear reclamos.")
            
        serializer.save(usuario=usuario_logueado, unidad=usuario_logueado.unidad)
        
      

class ComunicadoViewSet(viewsets.ModelViewSet):

    queryset = Comunicado.objects.all()
    serializer_class = ComunicadoSerializer

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
    permission_classes = [EsAdminConsorcio]
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class UnidadViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Cambiamos ModelViewSet por ReadOnlyModelViewSet.
    Esto deshabilita POST, PUT y DELETE automáticos. 
    Solo permite GET (listar) para que el formulario de Angular arme el Select.
    """
    permission_classes = [EsAdminConsorcio]
    queryset = Unidad.objects.all()
    serializer_class = UnidadSerializer