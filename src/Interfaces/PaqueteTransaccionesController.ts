import { Request, Response } from "express";
import { PaqueteTransaccionesService } from "../Application/PaqueteTransaccionesService";


const paqueteTransaccionesService = new PaqueteTransaccionesService();

export class PaqueteTransaccionesController {




    public static async crearPaquete(req: Request, res: Response) {
        try {
            const paquete = await paqueteTransaccionesService.crearPaquete(req.body);
            res.status(201).json(paquete);
        } catch (error) {
            res.status(500).json({ error: error});
        }
    }


    /**
     * Endpoint para obtener el total de transacciones de un usuario.
     */
    public static async obtenerTotalFirmas(req: Request, res: Response): Promise<Response> {
        const { idUsuario } = req.params;

        try {
            const totalFirmas = await paqueteTransaccionesService.obtenerTotalFirmas(Number(idUsuario));
            return res.status(200).json(totalFirmas);
        } catch (error) {
            console.error("Error en el controlador:", error);
            return res.status(500).json({ error: "No se pudo calcular el total de firmas." });
        }
    }

    /**
     * Endpoint para obtener el total de firmas compradas por usuario y proceso.
     */
    public static async obtenerTotalFirmasPorProceso(req: Request, res: Response): Promise<Response> {
        const { idUsuario, idProceso } = req.params;

        try {
            const totalFirmas = await paqueteTransaccionesService.obtenerTotalFirmasPorProceso(
                Number(idUsuario),
                Number(idProceso)
            );
            return res.status(200).json(totalFirmas);
        } catch (error) {
            console.error("Error en el controlador:", error);
            return res.status(500).json({ error: "No se pudo calcular el total de firmas por proceso." });
        }
    }

    /**
     * Endpoint para obtener la cantidad de firmas restantes por usuario y proceso.
     */
    public static async obtenerFirmasRestantesPorProceso(req: Request, res: Response): Promise<Response> {
        const { idUsuario, idProceso } = req.params;

        try {
            const firmasRestantes = await paqueteTransaccionesService.obtenerFirmasRestantesPorProceso(
                Number(idUsuario),
                Number(idProceso)
            );
            return res.status(200).json(firmasRestantes);
        } catch (error) {
            console.error("Error en el controlador:", error);
            return res.status(500).json({ error: "No se pudo calcular las firmas restantes por proceso." });
        }
    }
}