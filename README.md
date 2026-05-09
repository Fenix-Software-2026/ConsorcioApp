# 🏢 ConsorcioApp - Sistema de Gestión de Inquilinos

## 📝 Descripción del Proyecto
**ConsorcioApp** es una plataforma integral diseñada para centralizar la comunicación y administración de consorcios. El proyecto surge como respuesta a la desorganización de los canales informales, permitiendo una gestión transparente y eficiente de reclamos, gastos y avisos mediante una **bitácora digital**.

### Problemas que resuelve:
* **Falta de seguimiento:** Evita la pérdida de reclamos y pedidos.
* **Comunicación ineficiente:** Centraliza avisos y contactos en un entorno organizado.
* **Falta de transparencia:** Ofrece acceso claro a estados de gestión y movimientos.

---

## 🛠️ Tecnologías Utilizadas
Stack tecnológico empleado con sus versiones específicas:

| Tecnología | Versión |
| :--- | :--- |
| **Django** | 6.0.4 |
| **Angular** | 21.2.7 |
| **Node.js** | 24.14.1 |
| **MySQL** | 2.2.8 | 
---

## ⚙️ Instrucciones de Instalación
 1. Clonar el Repositorio

```bash
git clone [https://github.com/tu-usuario/consorcio-app.git](https://github.com/tu-usuario/consorcio-app.git)
cd consorcio-app

### Configuración de la Base de Datos (MySQL)
#### Creá la base de datos en tu servidor MySQL:
```SQL
CREATE DATABASE consorcio_db;
```
### 2- Configurá tus credenciales (usuario y contraseña) en el archivo settings.py del backend o en tu archivo de variables de entorno (.env). *

### 3. Instalación del Backend (Django)
Desde la raíz del proyecto o la carpeta backend:

```bash
# Crear entorno virtual
python -m venv venv
```

## Activar entorno virtual
``` # Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
```

### Instalar librerías y dependencias
```
pip install -r requirements.txt
```
### Aplicar migraciones a MySQL
```
python manage.py migrate
```

### Iniciar servidor
```
python manage.py runserver
```
### 4. Instalación del Frontend (Angular)
Desde la carpeta frontend:

```Bash
# Instalar dependencias de Node
npm install
```
## Levantar la aplicación
```
ng serve
```
* Nota: La aplicación estará disponible en http://localhost:4200 *

# 🚀 Uso Básico
### Acceso: 
* **Iniciá sesión: El sistema asignará funciones según tu rol (Administrador o Residente/Propietario).**

* **Perfil: Podés actualizar tus datos desde la configuración.**

* **Gestión de Reclamos:**
*  **Los inquilinos crean reclamos con fotos y descripción.**
*La administración cambia el estado (Pendiente, En proceso, Resuelto, Archivado).*
*Se puede auditar quién y cuándo realizó cada cambio en el historial.*

## 📋 Requerimientos del Sistema
### ✅ Requerimientos Funcionales
* **Gestión de Usuarios:**
(RF01) El sistema debe permitir que los usuarios se registren ingresando nombre, apellido, email, contraseña y rol (administrador o residente).

(RF02) El sistema debe permitir la desactivación de usuarios.

(RF03) El sistema debe permitir que los usuarios inicien y cierren sesión. 
 
(RF04) El sistema debe permitir diferenciar los permisos y funcionalidades según el rol del usuario (administrador o residente). 

(RF05) El sistema debe permitir que los usuarios editen sus datos personales. 

* **Gestión de Reclamos:**
**(RF06) El sistema debe permitir crear reclamos por parte de los inquilinos/propietarios, los mismos contarán con título, descripción,categoría.

(RF07) El sistema debe poder adjuntar imágenes.

(RF08) El sistema debe permitir visualizar listado de reclamos realizados.
 
(RF9) El sistema debe poder filtrar reclamos por categoría y unidad/departamento.

(RF10)-El sistema debe permitir cambiar el estado del reclamo (pendiente, en proceso, resuelto,archivado). 

(RF11) El sistema debe permitir asociar reclamos a una unidad/departamento. 

(RF12)El sistema debe permitir notificar al usuario sobre actualizaciones. 

(RF13)El sistema debe permitir agregar comentarios.

(RF14) El sistema debe permitir visualizar el historial de cambio del reclamo (estado, fecha, usuario).

**

### 🔒 Requerimientos No Funcionales
**(RNF01)El sistema debe ser accesible desde navegador web y adaptarse a distintos dispositivos mediante diseño responsive.

(RNF02)El sistema debe tener una interfaz clara e intuitiva.

(RNF03)El sistema debe garantizar la seguridad de los datos de los usuarios mediante encriptación de contraseñas y control de acceso por roles.

(RNF04)El sistema debe permitir un uso sencillo sin conocimientos técnicos.

(RNF05)El sistema debe registrar quién realizó cada acción.

(RNF06)El sistema no deberá permitir la eliminación de datos críticos.**

```

