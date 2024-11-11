import { AccesoProcesoService } from "../Application/AccesoProcesoService";
import { Request, Response } from 'express';
import { ApiResponse } from "./ApiResponse";
import { handleErrorResponse } from "./Errors/handleErrorResponse";

const accesoProcesoService = new AccesoProcesoService();

export class AccesoProcesoController {
    public async obtenerProcesosPorUsuario(req: Request, res: Response): Promise<void> {
        try {
            const { idUsuario } = req.body;
            const procesos = await accesoProcesoService.obtenerProcesosPorUsuario(Number(idUsuario));
            const response = new ApiResponse(201, 'Consulta exitosa', procesos);
            res.status(201).json(response);
            //return res.status(200).json(procesos);
        } catch (error) {
            handleErrorResponse(res, error, 'Error al obtener los procesos');
        }
    }
}