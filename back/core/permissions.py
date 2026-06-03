# usuarios/permissions.py

from rest_framework.permissions import BasePermission
from core.models import Usuario

class EsAdminConsorcio(BasePermission):
    """
    Permiso para usuarios con rol administrador
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            request.user.rol == Usuario.Rol.administrador
        )
class EsResidente(BasePermission):
    """
    Permiso para usuarios con rol residente
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            request.user.rol == Usuario.Rol.residente
        )