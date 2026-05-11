CREATE DATABASE IF NOT EXISTS consorcio_db;
USE consorcio_db;

-- 1. Tabla Unidad
CREATE TABLE unidad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    piso SMALLINT NOT NULL,
    departamento VARCHAR(5) NOT NULL
);

-- 2. Tabla Usuario
CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) DEFAULT 'residente',
    residente_actual BOOLEAN DEFAULT TRUE,
    esta_activo BOOLEAN DEFAULT TRUE,
    unidad_id INT NOT NULL,
    FOREIGN KEY (unidad_id) REFERENCES unidad(id) ON DELETE RESTRICT
);

-- 3. Tabla Reclamo
CREATE TABLE reclamo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    categoria VARCHAR(20) NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente',
    imagen_url VARCHAR(200),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    unidad_id INT NOT NULL,
    usuario_id INT NULL,
    FOREIGN KEY (unidad_id) REFERENCES unidad(id) ON DELETE RESTRICT,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE SET NULL
);

-- 4. Tabla Comunicado
CREATE TABLE comunicado (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    contenido TEXT NOT NULL,
    tipo VARCHAR(50),
    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    es_urgente BOOLEAN DEFAULT FALSE,
    usuario_id INT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE SET NULL
);
