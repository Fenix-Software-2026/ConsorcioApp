from rest_framework import viewsets

from core.permissions import EsAdminConsorcio
from .models import Reclamo, Comunicado, Usuario, Unidad
from .serializers import ReclamoSerializer, ComunicadoSerializer, UsuarioSerializer, UnidadSerializer

class ReclamoViewSet(viewsets.ModelViewSet):
    permission_classes = [EsAdminConsorcio]
    queryset = Reclamo.objects.all()
    serializer_class = ReclamoSerializer

class ComunicadoViewSet(viewsets.ModelViewSet):
    queryset = Comunicado.objects.all()
    serializer_class = ComunicadoSerializer
    
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
class UnidadViewSet(viewsets.ModelViewSet):
    queryset = Unidad.objects.all()
    serializer_class = UnidadSerializer