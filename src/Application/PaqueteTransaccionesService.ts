import { PaqueteTransacciones } from "../Domain/Models/PaquetesTransacciones";


export class PaqueteTransaccionesService {

    public async crearPaquete(data: any) {
        return await PaqueteTransacciones.create(data);
    }

     /**
     * Obtiene el total de firmas electrónicas de un usuario.
     * @param idUsuario ID del usuario.
     * @returns Total de firmas compradas y restantes.
     */
     public async obtenerTotalFirmas(idUsuario: number): Promise<{ totalFirmas: number }> {
        try {
            // Obtiene todos los paquetes de transacciones del usuario
            const paquetes = await PaqueteTransacciones.findAll({
                where: {
                    idUsuario: idUsuario,
                },
                attributes: ["cantidadComprada", "cantidadRestante"],
            });

           // Calcula el total sumando las cantidades compradas menos las restantes
           const totalFirmas = paquetes.reduce((total, paquete) => {
            return total + (paquete.cantidadComprada - paquete.cantidadRestante);
        }, 0);

            return { totalFirmas };
        } catch (error) {
            console.error("Error obteniendo el total de firmas:", error);
            throw new Error("No se pudo obtener el total de firmas.");
        }
    }

    /**
     * Obtiene la cantidad total de firmas compradas para un usuario y un proceso específico.
     * @param idUsuario ID del usuario.
     * @param idProceso ID del proceso.
     * @returns Total de firmas compradas.
     */
    public async obtenerTotalFirmasPorProceso(idUsuario: number, idProceso: number): Promise<{ totalFirmas: number }> {
        try {
            // Filtra por usuario y proceso
            const paquetes = await PaqueteTransacciones.findAll({
                where: {
                    idUsuario: idUsuario,
                    idProceso: idProceso,
                },
                attributes: ["cantidadComprada"],
            });

            // Calcula el total de firmas compradas
            const totalFirmas = paquetes.reduce((total, paquete) => total + paquete.cantidadComprada, 0);

            return { totalFirmas };
        } catch (error) {
            console.error("Error obteniendo el total de firmas por proceso:", error);
            throw new Error("No se pudo obtener el total de firmas por proceso.");
        }
    }

    /**
     * Obtiene la cantidad restante de firmas para un usuario y un proceso específico.
     * @param idUsuario ID del usuario.
     * @param idProceso ID del proceso.
     * @returns Total de firmas restantes.
     */
    public async obtenerFirmasRestantesPorProceso(idUsuario: number, idProceso: number): Promise<{ firmasRestantes: number }> {
        try {
            // Filtra por usuario y proceso
            const paquetes = await PaqueteTransacciones.findAll({
                where: {
                    idUsuario: idUsuario,
                    idProceso: idProceso,
                },
                attributes: ["cantidadRestante"],
            });

            // Calcula el total de firmas restantes
            const firmasRestantes = paquetes.reduce((total, paquete) => total + paquete.cantidadRestante, 0);

            return { firmasRestantes };
        } catch (error) {
            console.error("Error obteniendo las firmas restantes por proceso:", error);
            throw new Error("No se pudo obtener las firmas restantes por proceso.");
        }
    }


}