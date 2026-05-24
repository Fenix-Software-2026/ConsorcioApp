
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from core.models import Usuario

# Register your models here.
@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (
            'Información adicional',
            {
                'fields': (
                    'rol',
                    'unidad',
                    'residente_actual',
                )
            }
        ),
    ) # type: ignore

    add_fieldsets = UserAdmin.add_fieldsets + (
        (
            'Información adicional',
            {
                'fields': (
                    'rol',
                    'unidad',
                    'residente_actual',
                )
            }
        ),
    )
    list_display = (
        'username',
        'email',
        'rol',
        'unidad',
        'is_staff',
    )