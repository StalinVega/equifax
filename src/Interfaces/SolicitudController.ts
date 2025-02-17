import { Request, Response } from 'express';
import { SolicitudService } from "../Application/SolicitudService";


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
        const idSolicitud = parseInt(req.params.idSolicitud);

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
    
}