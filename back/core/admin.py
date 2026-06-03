
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from core.models import Comunicado, Reclamo, Unidad, Usuario

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


@admin.register(Unidad)
class UnidadAdmin(admin.ModelAdmin):
    list_display = ('piso', 'departamento')

@admin.register(Reclamo)
class ReclamoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'categoria', 'estado', 'fecha_creacion')
    list_filter = ('estado', 'categoria')

@admin.register(Comunicado)
class ComunicadoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'fecha_publicacion', 'es_urgente')


