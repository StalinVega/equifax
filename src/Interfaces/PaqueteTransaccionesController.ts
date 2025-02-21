import { Request, Response } from "express";
import { PaqueteTransaccionesService } from "../Application/PaqueteTransaccionesService";


const paqueteTransaccionesService = new PaqueteTransaccionesService();

export class PaqueteTransaccionesController {




    public static async crearPaquete(req: Request, res: Response) {
        try {
            const paquete = await paqueteTransaccionesService.crearPaquete(req.body);
            res.status(200).json({message:"Ingreso exitoso",paquete});
        } catch (error) {
            res.status(500).json({ error: error});
        }
    }

    /**
     * Endpoint para obtener el saldo disponible de transacciones por empresa y proceso.
     */
    public static async obtenerSaldoDisponible(req: Request, res: Response) {
        try {
            const { idEmpresa, idProceso } = req.params;

            // Validar que se proporcionen los parámetros
            if (!idEmpresa || !idProceso) {
                return res.status(400).json({
                    message: "Debe proporcionar el ID de la empresa y el ID del proceso.",
                });
            }

            // Convertir los parámetros a números
            const idEmpresaNum = Number(idEmpresa);
            const idProcesoNum = Number(idProceso);

            // Obtener el saldo disponible
            const saldoDisponible = await PaqueteTransaccionesService.obtenerSaldoDisponible(
                idEmpresaNum,
                idProcesoNum
            );

            // Respuesta exitosa
            return res.status(200).json({
                message: "Saldo disponible obtenido exitosamente.",
                saldoDisponible,
            });
        } catch (error: any) {
            // Manejo de errores
            return res.status(500).json({
                message: "Error al obtener el saldo disponible.",
                error: error.message,
            });
        }
    }



    /**
     * Endpoint para obtener el saldo disponible de transacciones por empresa y proceso.
     */
    public static async obtenerTotalComprada(req: Request, res: Response) {
        try {
            const { idEmpresa, idProceso } = req.params;

            // Validar que se proporcionen los parámetros
            if (!idEmpresa || !idProceso) {
                return res.status(400).json({
                    message: "Debe proporcionar el ID de la empresa y el ID del proceso.",
                });
            }

            // Convertir los parámetros a números
            const idEmpresaNum = Number(idEmpresa);
            const idProcesoNum = Number(idProceso);

            // Obtener el saldo disponible
            const saldoTotal = await PaqueteTransaccionesService.obtenerTotalComprada(
                idEmpresaNum,
                idProcesoNum
            );

            // Respuesta exitosa
            return res.status(200).json({
                message: "Total de paquete comprado.",
                saldoTotal,
            });
        } catch (error: any) {
            // Manejo de errores
            return res.status(500).json({
                message: "Error al obtener el total comprada.",
                error: error.message,
            });
        }
    }




  
}