

from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    ROL = [     
        ('residente',   'Residente'),
        ('administrador',  'Administrador'),
    ]
   
    rol = models.CharField(max_length=20, choices=ROL, default='residente')
    residente_actual = models.BooleanField(default=True)
    
    unidad = models.OneToOneField(
        'Unidad',
        on_delete=models.PROTECT,
        related_name='usuario'
    )

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.rol})"

class Unidad(models.Model):
    piso = models.SmallIntegerField()
    departamento = models.CharField(max_length=5)

    def __str__(self):
        return f"Piso {self.piso} - Depto {self.departamento}"

class Reclamo(models.Model):
    CATEGORIAS =[
        ('plomeria',      'Plomería'),
        ('electricidad',  'Electricidad'),
        ('gas',           'Gas'),
        ('humedad',       'Humedad / Filtraciones'),
        ('ascensor',      'Ascensor'),
        ('limpieza',      'Limpieza'),
        ('seguridad',     'Seguridad / Accesos'),
        ('ruidos',        'Ruidos molestos'),
        ('internet',      'Internet / Antena'),
        ('otros',         'Otros'),
    ]

    ESTADOS = [     
        ('pendiente',   'Pendiente'),
        ('en_proceso',  'En proceso'),
        ('resuelto',    'Resuelto'),
        ('archivado',   'Archivado'),
    ]
   
    titulo = models.CharField(max_length=100)
    descripcion = models.TextField()
    categoria = models.CharField(max_length=20, choices=CATEGORIAS)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    imagen_url = models.URLField(null=True, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)


    unidad = models.ForeignKey('Unidad', on_delete=models.PROTECT) 
    # Puse esto por si el residente se va. El administrador puede seguir viendo los reclamos en un futuro
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True) 

    def __str__(self):
        return f"{self.titulo} - {self.estado}"
   
class Comunicado(models.Model):
    titulo = models.CharField(max_length=200)
    contenido = models.TextField()
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    es_urgente = models.BooleanField(default=False)
    
    # Puse esto por si el administrador es despedido y se elimina su cuenta el comunicado se mantiene igual
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True) 

    def __str__(self):
        return self.titulo