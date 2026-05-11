CREATE DATABASE consorcio_db;
USE consorcio_db;

CREATE TABLE unidad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    piso VARCHAR(10),
    departamento VARCHAR(10)
);

CREATE TABLE reclamo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100),
    descripcion TEXT,
    categoria VARCHAR(50),
    estado VARCHAR(20),
    fecha_reporte DATETIME,
    usuario_id INT,
    unidad_id INT
);