from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.contrib import admin
from core.views import ComunicadoViewSet, ReclamoViewSet, UsuarioViewSet, UnidadViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'reclamos', ReclamoViewSet)
router.register(r'comunicados', ComunicadoViewSet)
router.register(r'usuario', UsuarioViewSet)
router.register(r'unidad', UnidadViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('admin/', admin.site.urls),

    path('api/login/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),
]