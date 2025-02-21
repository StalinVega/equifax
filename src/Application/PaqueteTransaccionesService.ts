import { PaqueteTransacciones } from "../Domain/Models/PaquetesTransacciones";


export class PaqueteTransaccionesService {

    public async crearPaquete(data: any) {
        return await PaqueteTransacciones.create(data);
    }

    /**
     * Obtiene el saldo disponible de transacciones por empresa y proceso.
     * @param idEmpresa ID de la empresa.
     * @param idProceso ID del proceso.
     * @returns El saldo disponible de transacciones.
     */
    public static async obtenerSaldoDisponible(idEmpresa: number, idProceso: number): Promise<number> {
        try {
            // Sumar la cantidad restante de transacciones para la empresa y proceso especificados
            const resultado = await PaqueteTransacciones.sum("cantidad_restante", {
                where: {
                    id_empresa: idEmpresa,
                    id_proceso: idProceso,
                },
            });

            // Si no hay resultados, el saldo es 0
            return resultado || 0;
        } catch (error) {
            throw new Error(`Error al obtener el saldo disponible: ${error}`);
        }
    }

    public static async obtenerTotalComprada(idEmpresa: number, idProceso: number): Promise<number> {
        try {
            // Sumar la cantidad restante de transacciones para la empresa y proceso especificados
            const resultado = await PaqueteTransacciones.sum("cantidad_comprada", {
                where: {
                    id_empresa: idEmpresa,
                    id_proceso: idProceso,
                },
            });

            // Si no hay resultados, el saldo es 0
            return resultado || 0;
        } catch (error) {
            throw new Error(`Error al obtener el saldo disponible: ${error}`);
        }
    }

}