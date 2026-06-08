from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.contrib import admin
from core.views import ComunicadoViewSet, ReclamoViewSet, UsuarioViewSet, UnidadViewSet
from core.serializers import MiTokenSerializer
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

class MiTokenView(TokenObtainPairView):#es un serializer, y los serializers no tienen as_view, entonces lo que hacemos es crear una clase que herede de TokenObtainPairView y le decimos que use nuestro serializer personalizado
    serializer_class = MiTokenSerializer
    
router = DefaultRouter()
router.register(r'reclamos', ReclamoViewSet, basename='reclamo')
router.register(r'comunicados', ComunicadoViewSet)
router.register(r'usuario', UsuarioViewSet)
router.register(r'unidad', UnidadViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('admin/', admin.site.urls),

    path('api/login/', MiTokenView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]