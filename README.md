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
* **Gestión de Usuarios: Registro, inicio/cierre de sesión, desactivación de cuentas y roles diferenciados.**
* **Control de Acceso: Restricción de funcionalidades según permisos de usuario.**
  

* **Gestión de Reclamos:**
* **Creación por categoría con soporte para imágenes adjuntas.**
* **Filtros por unidad/departamento.**
* **Sistema de comentarios y notificaciones de actualización.**
* **Historial completo de trazabilidad (bitácora).**

### 🔒 Requerimientos No Funcionales
* **Diseño Responsive: Interfaz adaptable a móviles, tablets y PCs.**
* **Usabilidad: Navegación clara e intuitiva para usuarios sin perfil técnico.**
* **Seguridad: Encriptación de contraseñas y control de acceso robusto.**
* **Auditoría: Registro obligatorio de trazabilidad para cada acción realizada.**
* **Integridad de Datos: Protección de registros críticos; el sistema no permite la eliminación de datos históricos esenciales.**




```

