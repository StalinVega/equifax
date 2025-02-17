import { Request, Response } from 'express';
import { ConsumoTransaccionesService } from "../Application/ConsumoTransaccionesServices";
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

}