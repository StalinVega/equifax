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
    cedula VARCHAR(20) NOT NULL UNIQUE,
    num_tramite VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
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

-- Tabla de acceso a procesos por usuario (relaciona los usuarios con los procesos disponibles)
CREATE TABLE IF NOT EXISTS transacciones_equifax.acceso_procesos (
    id_usuario INT NOT NULL,
    id_proceso INT NOT NULL,
    PRIMARY KEY (id_usuario, id_proceso),
    FOREIGN KEY (id_usuario) REFERENCES transacciones_equifax.usuarios(id_usuario),
    FOREIGN KEY (id_proceso) REFERENCES transacciones_equifax.procesos(id_proceso)
);


CREATE TABLE IF NOT EXISTS transacciones_equifax.paquetes_transacciones (
    id_paquete INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_proceso INT NOT NULL,
    cantidad_comprada INT NOT NULL,
    cantidad_restante INT NOT NULL,
    fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES transacciones_equifax.clientes(id_cliente),
    FOREIGN KEY (id_proceso) REFERENCES transacciones_equifax.procesos(id_proceso)
);

CREATE TABLE IF NOT EXISTS transacciones_equifax.consumo_transacciones (
    id_consumo INT AUTO_INCREMENT PRIMARY KEY,
    id_paquete INT NOT NULL,
    id_solicitud INT NOT NULL,
    cantidad_usada INT NOT NULL DEFAULT 0,
    fecha_consumo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_paquete) REFERENCES transacciones_equifax.paquetes_transacciones(id_paquete),
    FOREIGN KEY (id_solicitud) REFERENCES transacciones_equifax.solicitudes(id_solicitud)
);
