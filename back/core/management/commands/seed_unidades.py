from django.core.management.base import BaseCommand
from core.models import Unidad  # Cambiá 'core' por el nombre real de tu app si es distinto

class Command(BaseCommand):
    help = 'Pobla la base de datos con las unidades iniciales del consorcio'

    def handle(self, *args, **options):
        pisos = [1, 2, 3, 4]
        departamentos = ['A', 'B', 'C', 'D', 'E', 'F']
        
        unidades_creadas = 0
        unidades_omitidas = 0

        self.stdout.write(self.style.WARNING('Iniciando la carga de unidades...'))

        for piso in pisos:
            for depto in departamentos:
                # Usamos get_or_create para que si volvés a correr el comando
                # no intente duplicar nada gracias al UniqueConstraint que pusimos
                unidad, created = Unidad.objects.get_or_create(
                    piso=piso,
                    departamento=depto
                )
                
                if created:
                    unidades_creadas += 1
                else:
                    unidades_omitidas += 1

        if unidades_creadas > 0:
            self.stdout.write(self.style.SUCCESS(f'¡Éxito! Se crearon {unidades_creadas} unidades nuevas.'))
        
        if unidades_omitidas > 0:
            self.stdout.write(self.style.NOTICE(f'Se omitieron {unidades_omitidas} unidades porque ya existían.'))