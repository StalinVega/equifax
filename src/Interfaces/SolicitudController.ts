import { Request, Response } from 'express';
import { SolicitudService } from "../Application/SolicitudService";
import { ClienteService } from '../Application/ClienteService';


const servicio = new SolicitudService();

export class SolicitudController {
    static async crearSolicitud(req: Request, res: Response) {
        try {
            const solicitud = await servicio.crearSolicitud(req.body);
            res.status(201).json(solicitud);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

   /**
     * Controlador para obtener una solicitud por su ID
     */
   static async obtenerSolicitudPorId(req: Request, res: Response) {
    try {

        console.log("🔹 Parámetros recibidos:", req.params); 
        const idSolicitud = parseInt(req.params.idSolicitud);

        console.log("🔹 ID convertido:", idSolicitud); 
        if (isNaN(idSolicitud)) {
            return res.status(400).json({ message: "El ID de solicitud no es válido" });
        }

        // Usamos el servicio en lugar de hacer la consulta directamente
        const solicitud = await SolicitudService.obtenerSolicitudPorId(idSolicitud);

        if (!solicitud) {
            return res.status(404).json({ message: "Solicitud no encontrada" });
        }

        res.status(200).json(solicitud);
    } catch (error) {
        console.error("Error al obtener la solicitud:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

 /**
     * Controlador para obtener el idSolicitud y el idPaquete por el número de trámite del cliente
     */
 static async obtenerSolicitudYPaquetePorTramite(req: Request, res: Response) {
    try {
        console.log("🔹 Parámetros recibidos:", req.params);
        const { numeroTramite } = req.params;

        // Validar que el número de trámite no esté vacío
        if (!numeroTramite) {
            return res.status(400).json({ message: "El número de trámite es requerido" });
        }

        console.log("🔹 Número de trámite:", numeroTramite);

        // Usamos el servicio para obtener el idSolicitud y el idPaquete
        const { idSolicitud, idPaquete } = await servicio.getSolicitudAndPaqueteByTramite(numeroTramite);

        if (!idSolicitud || !idPaquete) {
            return res.status(404).json({ message: "No se encontraron datos para el número de trámite proporcionado" });
        }

        // Devolver la respuesta exitosa
        res.status(200).json({ idSolicitud, idPaquete });
    } catch (error) {
        console.error("Error al obtener la solicitud y el paquete:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}
    
}