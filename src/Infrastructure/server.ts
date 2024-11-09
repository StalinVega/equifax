import express, { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../Interfaces/Errors/ErrorResponse";
import { login } from "../Interfaces/AuthController";
import { sequelize } from "./database";

const cors = require("cors");
const app = express();

const port = process.env.PORT || 3006;

// Configuración básica de CORS
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Middleware para parsear JSON en las solicitudes

// Definir la ruta para login
app.post("/auth/login", login);


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