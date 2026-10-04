# Tarea 6: Pruebas automatizadas de seguridad de perfil, validación de contraseñas y reclamos
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from core.models import Reclamo, Unidad

Usuario = get_user_model()


class PruebasPerfilUsuario(APITestCase):

    def setUp(self):
        self.unidad1 = Unidad.objects.create(piso=1, departamento='A')
        self.unidad2 = Unidad.objects.create(piso=2, departamento='B')

        self.residente = Usuario.objects.create_user(
            username='residente1',
            email='residente1@correo.com',
            password='PasswordRobusta2026!',
            rol='residente',
            unidad=self.unidad1
        )
        self.client.force_authenticate(user=self.residente)

    def test_residente_no_puede_modificar_rol_ni_unidad(self):
        datos = {
            'rol': 'administrador',
            'unidad': self.unidad2.id,
            'nombre': 'Juan'
        }
        respuesta = self.client.patch('/api/usuario/mi_perfil/', datos, format='json')
        self.assertEqual(respuesta.status_code, status.HTTP_200_OK)

        self.residente.refresh_from_db()
        self.assertEqual(self.residente.rol, 'residente')
        self.assertEqual(self.residente.unidad, self.unidad1)
        self.assertEqual(self.residente.first_name, 'Juan')

    def test_rechazo_password_debil(self):
        datos = {'password': '1234'}
        respuesta = self.client.patch('/api/usuario/mi_perfil/', datos, format='json')
        self.assertEqual(respuesta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', respuesta.data)

    def test_aceptacion_password_segura(self):
        nueva_clave = 'ClaveMuySegura2026!'
        datos = {'password': nueva_clave}
        respuesta = self.client.patch('/api/usuario/mi_perfil/', datos, format='json')
        self.assertEqual(respuesta.status_code, status.HTTP_200_OK)

        self.residente.refresh_from_db()
        self.assertTrue(self.residente.check_password(nueva_clave))

    def test_actualizar_perfil_conservando_mismo_email(self):
        datos = {
            'email': 'residente1@correo.com',
            'nombre': 'Carlos'
        }
        respuesta = self.client.patch('/api/usuario/mi_perfil/', datos, format='json')
        self.assertEqual(respuesta.status_code, status.HTTP_200_OK)

        self.residente.refresh_from_db()
        self.assertEqual(self.residente.email, 'residente1@correo.com')
        self.assertEqual(self.residente.first_name, 'Carlos')


class PruebasReclamosConsorcio(APITestCase):

    def setUp(self):
        self.unidad1 = Unidad.objects.create(piso=1, departamento='A')
        self.unidad2 = Unidad.objects.create(piso=2, departamento='B')

        self.residente1 = Usuario.objects.create_user(
            username='residente1',
            email='res1@correo.com',
            password='PasswordRobusta2026!',
            rol='residente',
            unidad=self.unidad1
        )
        self.residente2 = Usuario.objects.create_user(
            username='residente2',
            email='res2@correo.com',
            password='PasswordRobusta2026!',
            rol='residente',
            unidad=self.unidad2
        )
        self.admin = Usuario.objects.create_user(
            username='admin1',
            email='admin1@correo.com',
            password='PasswordRobusta2026!',
            rol='administrador',
            is_staff=True
        )

        self.reclamo1 = Reclamo.objects.create(
            titulo='Fuga en baño',
            descripcion='Pérdida de agua',
            categoria='plomeria',
            unidad=self.unidad1,
            usuario=self.residente1
        )
        self.reclamo2 = Reclamo.objects.create(
            titulo='Luz pasillo',
            descripcion='No enciende la luz',
            categoria='electricidad',
            unidad=self.unidad2,
            usuario=self.residente2
        )

    def test_aislamiento_reclamos_residente(self):
        self.client.force_authenticate(user=self.residente1)
        respuesta = self.client.get('/api/reclamos/')
        self.assertEqual(respuesta.status_code, status.HTTP_200_OK)
        self.assertEqual(len(respuesta.data), 1)
        self.assertEqual(respuesta.data[0]['id'], self.reclamo1.id)

    def test_admin_visualiza_todos_los_reclamos(self):
        self.client.force_authenticate(user=self.admin)
        respuesta = self.client.get('/api/reclamos/')
        self.assertEqual(respuesta.status_code, status.HTTP_200_OK)
        self.assertEqual(len(respuesta.data), 2)

