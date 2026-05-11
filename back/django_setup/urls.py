from django.urls import path, include
from rest_framework.routers import DefaultRouter

from core.views import ComunicadoViewSet, ReclamoViewSet, UsuarioViewSet, UnidadViewSet

router = DefaultRouter()
router.register(r'reclamos', ReclamoViewSet)
router.register(r'comunicados', ComunicadoViewSet)
router.register(r'usuario', UsuarioViewSet)
router.register(r'unidad', UnidadViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]