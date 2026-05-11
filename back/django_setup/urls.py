from django.urls import path, include
from rest_framework.routers import DefaultRouter

from core.views import ComunicadoViewSet, ReclamoViewSet

router = DefaultRouter()
router.register(r'reclamos', ReclamoViewSet)
router.register(r'comunicados', ComunicadoViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]