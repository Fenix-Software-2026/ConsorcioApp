

from django.db import models
class Usuario(models.Model):
    pass

class Unidad(models.Model):
    pass

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
   imagen = models.URLField(null=True, blank=True)
   fecha_creacion = models.DateTimeField(auto_now_add=True)
   fecha_actualizacion = models.DateTimeField(auto_now=True)

   usuario = models.ForeignKey('Usuario', on_delete=models.CASCADE)
   unidad = models.ForeignKey('Unidad', on_delete=models.CASCADE) 

   def __str__(self):
        return f"{self.titulo} - {self.estado}"
   
class Comunicado(models.Model):
    titulo = models.CharField(max_length=200)
    contenido = models.TextField()
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    es_urgente = models.BooleanField(default=False)

    def __str__(self):
        return self.titulo