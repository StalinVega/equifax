import express, { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../Interfaces/Errors/ErrorResponse";
import { login } from "../Interfaces/AuthController";
import { sequelize } from "./database";
import { createUser } from "../Interfaces/UsuarioController";
import { AccesoProcesoController } from "../Interfaces/AccesoProcesoController";
import { ClienteController } from "../Interfaces/ClienteController";
import { PaqueteTransaccionesController } from "../Interfaces/PaqueteTransaccionesController";
import { ConsumoTransaccionesController } from "../Interfaces/ConsumoTransaccionesController";
import { SolicitudController } from "../Interfaces/SolicitudController";
import { obtenerIdPaquetePorClienteYSolicitud } from "../Application/ConsumoTransaccionesServices";

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

// Ruta para obtener los clientes vinculados a un usuario
app.get('/clientes/:userId', clienteController.getClientsByUserIdAndProcess);

//Total de transacciones a utilizar
app.get("/paquete-transacciones/:idUsuario", PaqueteTransaccionesController.obtenerTotalFirmas);
// Endpoint para obtener el total de transacciones compradas por usuario y proceso
app.get(
    "/paquete-transacciones/total/:idUsuario/:idProceso",
    PaqueteTransaccionesController.obtenerTotalFirmasPorProceso
);

// Endpoint para obtener la cantidad de transacciones restantes por usuario y proceso
app.get(
    "/paquete-transacciones/restantes/:idUsuario/:idProceso",
    PaqueteTransaccionesController.obtenerFirmasRestantesPorProceso
);

// Consumos
app.post('/consumos', ConsumoTransaccionesController.consumir);
//Solicitud
app.get('/solicitud/:idSolicitud', SolicitudController.obtenerSolicitudPorId);
// Endpoint para obtener el idPaquete correcto
app.post('/obtener-id-paquete', ConsumoTransaccionesController.obtenerIdPaquete);
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