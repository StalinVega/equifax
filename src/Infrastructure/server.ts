import express, { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../Interfaces/Errors/ErrorResponse";
import { login } from "../Interfaces/AuthController";
import { sequelize } from "./database";
import { createUser, obtenerUsuariosPorEmpresa } from "../Interfaces/UsuarioController";
import { AccesoProcesoController } from "../Interfaces/AccesoProcesoController";
import { ClienteController } from "../Interfaces/ClienteController";
import { PaqueteTransaccionesController } from "../Interfaces/PaqueteTransaccionesController";
import { ConsumoTransaccionesController } from "../Interfaces/ConsumoTransaccionesController";
import { SolicitudController } from "../Interfaces/SolicitudController";
import { EmpresaController } from "../Interfaces/EmpresaController";

const cors = require("cors");
const app = express();
const accesoProcesoController = new AccesoProcesoController();
const clienteController = new ClienteController();
const port = process.env.PORT || 3006;

// Configuración básica de CORS
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Middleware para parsear JSON en las solicitudes

// Definir la ruta para login
app.post("/auth/login", login);
// CREAAR USUARIO
app.post("/create-users", createUser);
// CREAAR Cliente y a la vez se crea la solicitud
app.post("/add-cliente", clienteController.createClient);
// busqueda de ID de proceso acorde al id de usuario
app.post("/usuario/proceso",accesoProcesoController.obtenerProcesosPorUsuario);
//Ingresar Numero de tramite deacuerdo al numero de cedula
app.post("/cedula-tramite",clienteController.updateNumTramiteByCedula)
// Actualziar el numero de tramite
app.put('/clientes/update-num-tramite', clienteController.updateNumTramite);
// Ruta para obtener los clientes vinculados a un usuario
app.get('/clientes/:userId', clienteController.getClientsByUserIdAndProcess);

// Endpoint para obtener el saldo disponible de transacciones por empresa y proceso
app.get("/empresas/procesos-saldo/:idEmpresa/:idProceso", PaqueteTransaccionesController.obtenerSaldoDisponible);

// Endpoint para obtener el saldo disponible de transacciones por empresa y proceso
app.get("/empresas/procesos-total/:idEmpresa/:idProceso", PaqueteTransaccionesController.obtenerTotalComprada);

// Consumos
app.post('/consumos', ConsumoTransaccionesController.consumir);
//Solicitud
app.get('/solicitud/:idSolicitud', SolicitudController.obtenerSolicitudPorId);
// Endpoint para obtener el idPaquete correcto
app.post('/obtener-id-paquete', ConsumoTransaccionesController.obtenerIdPaquete);

//Creacion de empresa y usuarios
app.post("/empresa-usuarios", EmpresaController.crearEmpresaConUsuarios);

// Obtener todas las empresas
app.get("/lista-empresas", EmpresaController.obtenerEmpresas);
//Permisos de usuario
app.post("/acceso-proceso",accesoProcesoController.crearAccesoProceso);
//Usuarios por empresas
app.get("/lista-usuarios-empresa/:idEmpresa",obtenerUsuariosPorEmpresa);
// actualziar datos de empresa
app.put("/actualizar-empresa/:id",EmpresaController.updateEmpresa)
// actualizar permisos
app.put("/accesos/:idUsuario/:idProceso", accesoProcesoController.actualizarAcceso);
// crear paqeutes de trasnaciones
app.post("/ingreso-paquetes",PaqueteTransaccionesController.crearPaquete);
// Endpoint para generar el texto dinámico
app.post("/empresas/generar-texto/:idEmpresa", EmpresaController.generarTextoYPDF);
// Endpoint para obtener el id solicitud y paquete 
app.get('/solicitud-paquete/:numeroTramite', SolicitudController.obtenerSolicitudYPaquetePorTramite);
// Middleware para manejar errores globales
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    const response = new ErrorResponse(500, "Internal Server Error", err.message);
    res.status(500).json(response);
});



// sequelize.sync({ alter: true })
//   .then(() => {
//     console.log('Base de datos sincronizada');
//     app.listen(3001, () => {
//       console.log('Servidor corriendo en el puerto 3001');
//     });
//   })
//   .catch((error) => {
//     console.error('Error al sincronizar la base de datos:', error);
//   });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app; // Exporta la instancia del servidor