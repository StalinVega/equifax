-- Tabla de usuarios (autenticación y autorización)
CREATE TABLE IF NOT EXISTS transacciones_equifax.usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('almacen', 'admin') NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de clientes (información de las personas que solicitan servicios)
CREATE TABLE IF NOT EXISTS transacciones_equifax.clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    documento_identidad VARCHAR(20) NOT NULL UNIQUE,
    fecha_nacimiento DATE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de procesos (definición de los tipos de procesos disponibles)
CREATE TABLE IF NOT EXISTS transacciones_equifax.procesos (
    id_proceso INT AUTO_INCREMENT PRIMARY KEY,
    tipo_proceso ENUM('firma_electronica', 'verificacion_identidad') NOT NULL,
    descripcion TEXT
);

-- Tabla de solicitudes (registro de solicitudes de servicios)
CREATE TABLE IF NOT EXISTS transacciones_equifax.solicitudes (
    id_solicitud INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_proceso INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'completado', 'rechazado') DEFAULT 'pendiente',
    FOREIGN KEY (id_cliente) REFERENCES transacciones_equifax.clientes(id_cliente),
    FOREIGN KEY (id_proceso) REFERENCES transacciones_equifax.procesos(id_proceso),
    FOREIGN KEY (id_usuario) REFERENCES transacciones_equifax.usuarios(id_usuario)
);

-- Tabla de reportes (seguimiento de actividades de solicitudes y créditos económicos)
CREATE TABLE IF NOT EXISTS transacciones_equifax.reportes (
    id_reporte INT AUTO_INCREMENT PRIMARY KEY,
    id_solicitud INT NOT NULL,
    descripcion TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_solicitud) REFERENCES transacciones_equifax.solicitudes(id_solicitud)
);