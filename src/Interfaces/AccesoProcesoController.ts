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

    public async crearAccesoProceso(req:Request, res:Response) {
        const { idUsuario, idProceso } = req.body;

        if (!idUsuario || !idProceso) {
            return res.status(400).json({ message: 'idUsuario y idProceso son requeridos' });
        }

        try {
            const nuevoAccesoProceso = await accesoProcesoService.createAccesoProceso(req.body);
            res.status(200).json({message: "Permiso ingresado correctamente.",nuevoAccesoProceso});
        } catch (error) {
            res.status(500).json({message: "Error al ingresar servicio.", error: error });
        }
    }

    public async actualizarAcceso(req: Request, res: Response) {
        try {
          const { idUsuario, idProceso } = req.params;
          const nuevosDatos = req.body;
          const accesoActualizado = await accesoProcesoService.actualizarAccesoProceso(
            Number(idUsuario),
            Number(idProceso),
            nuevosDatos
          );
          res.json(accesoActualizado);
        } catch (error) {
          res.status(500).json({ error: error });
        }
      }
}