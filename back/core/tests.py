# Tarea 6: Pruebas automatizadas de seguridad de perfil, validación de contraseñas y reclamos
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from core.models import Reclamo, Unidad
from core.serializers import UsuarioSerializer

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
        datos = {
            'current_password': 'PasswordRobusta2026!',
            'new_password': '1234'
        }
        respuesta = self.client.patch('/api/usuario/mi_perfil/', datos, format='json')
        self.assertEqual(respuesta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('new_password', respuesta.data)

    def test_aceptacion_password_segura(self):
        nueva_clave = 'ClaveMuySegura2026!'
        datos = {
            'current_password': 'PasswordRobusta2026!',
            'new_password': nueva_clave
        }
        respuesta = self.client.patch('/api/usuario/mi_perfil/', datos, format='json')
        self.assertEqual(respuesta.status_code, status.HTTP_200_OK)

        self.residente.refresh_from_db()
        self.assertTrue(self.residente.check_password(nueva_clave))

    def test_rechazo_password_actual_incorrecta(self):
        datos = {
            'current_password': 'ClaveIncorrecta2026!',
            'new_password': 'ClaveMuySegura2026!'
        }
        respuesta = self.client.patch('/api/usuario/mi_perfil/', datos, format='json')
        self.assertEqual(respuesta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('current_password', respuesta.data)

    def test_rechazo_cambio_password_sin_password_actual(self):
        datos = {'new_password': 'ClaveMuySegura2026!'}
        respuesta = self.client.patch('/api/usuario/mi_perfil/', datos, format='json')
        self.assertEqual(respuesta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('current_password', respuesta.data)

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

    def test_rechaza_alta_con_unidad_ocupada(self):
        datos = {
            'username': 'residente2',
            'email': 'residente2@correo.com',
            'password': 'PasswordRobusta2026!',
            'unidad': self.unidad1.id
        }
        serializer = UsuarioSerializer(data=datos)

        self.assertFalse(serializer.is_valid())
        self.assertEqual(
            serializer.errors['unidad'][0],
            'La unidad seleccionada ya tiene un residente asignado.'
        )

    def test_rechaza_cambio_a_unidad_ocupada(self):
        datos = {'unidad': self.unidad1.id}
        serializer = UsuarioSerializer(
            instance=Usuario.objects.create_user(
                username='residente2',
                email='residente2@correo.com',
                password='PasswordRobusta2026!',
                rol='residente',
                unidad=self.unidad2
            ),
            data=datos,
            partial=True
        )

        self.assertFalse(serializer.is_valid())
        self.assertEqual(
            serializer.errors['unidad'][0],
            'La unidad seleccionada ya tiene un residente asignado.'
        )

    def test_permite_conservar_la_unidad_actual(self):
        serializer = UsuarioSerializer(
            instance=self.residente,
            data={'unidad': self.unidad1.id},
            partial=True
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)


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

    def test_residente_no_puede_ver_reclamo_de_otra_unidad(self):
        self.client.force_authenticate(user=self.residente1)
        respuesta = self.client.get(f'/api/reclamos/{self.reclamo2.id}/')
        self.assertEqual(respuesta.status_code, status.HTTP_404_NOT_FOUND)

    def test_admin_visualiza_todos_los_reclamos(self):
        self.client.force_authenticate(user=self.admin)
        respuesta = self.client.get('/api/reclamos/')
        self.assertEqual(respuesta.status_code, status.HTTP_200_OK)
        self.assertEqual(len(respuesta.data), 2)

    def test_admin_puede_actualizar_estado_de_reclamo(self):
        self.client.force_authenticate(user=self.admin)
        respuesta = self.client.patch(
            f'/api/reclamos/{self.reclamo1.id}/',
            {'estado': 'en_proceso'},
            format='json'
        )
        self.assertEqual(respuesta.status_code, status.HTTP_200_OK)

        self.reclamo1.refresh_from_db()
        self.assertEqual(self.reclamo1.estado, 'en_proceso')
