import { Request, Response } from 'express';
import { ConsumoTransaccionesService, obtenerIdPaquetePorClienteYSolicitud } from "../Application/ConsumoTransaccionesServices";
import { handleErrorResponse } from './Errors/handleErrorResponse';



const servicio = new ConsumoTransaccionesService();

export class ConsumoTransaccionesController {
    static async consumir(req: Request, res: Response) {
        try {
            const consumo = await servicio.consumirTransaccion(req.body);
            res.status(201).json(consumo);
        } catch (error) {
            handleErrorResponse(res, error, 'No se pudo crear el consumo');
        }
    }

    static async obtenerIdPaquete(req: Request, res: Response) {
        const { idCliente, idSolicitud } = req.body;
    
        try {
            // Llamar al servicio para obtener el idPaquete
            const idPaquete = await obtenerIdPaquetePorClienteYSolicitud(idCliente, idSolicitud);
            
            // Responder con el idPaquete
            return res.json({ idPaquete });
        } catch (error) {
            // Manejar errores
            handleErrorResponse(res, error, 'No se pudo encontrar el paquete');
        }
    }

}

