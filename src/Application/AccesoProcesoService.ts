import { AccesoProceso } from "../Domain/Models/AccesoProceso";


export class AccesoProcesoService {
    public async obtenerProcesosPorUsuario(idUsuario: number): Promise<number[]> {
        const procesos = await AccesoProceso.findAll({
            where: { idUsuario },
            attributes: ['idProceso']
        });
        return procesos.map(proceso => proceso.idProceso);
    }
}