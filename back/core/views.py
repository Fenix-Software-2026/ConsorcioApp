from rest_framework import viewsets

from core.permissions import EsAdminConsorcio, EsResidente
from .models import Reclamo, Comunicado, Usuario, Unidad
from .serializers import ReclamoSerializer, ComunicadoSerializer, UsuarioSerializer, UnidadSerializer

class ReclamoViewSet(viewsets.ModelViewSet):
    permission_classes = [EsResidente]
    queryset = Reclamo.objects.all()
    serializer_class = ReclamoSerializer

class ComunicadoViewSet(viewsets.ModelViewSet):
    permission_classes = [EsAdminConsorcio]
    queryset = Comunicado.objects.all()
    serializer_class = ComunicadoSerializer
    
class UsuarioViewSet(viewsets.ModelViewSet):
    permission_classes = [EsAdminConsorcio]
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
class UnidadViewSet(viewsets.ModelViewSet):
    permission_classes = [EsAdminConsorcio]
    queryset = Unidad.objects.all()
    serializer_class = UnidadSerializer