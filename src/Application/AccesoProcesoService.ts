import { AccesoProceso } from "../Domain/Models/AccesoProceso";


export class AccesoProcesoService {
    public async obtenerProcesosPorUsuario(idUsuario: number): Promise<number[]> {
        const procesos = await AccesoProceso.findAll({
            where: { idUsuario },
            attributes: ['idProceso']
        });
        return procesos.map(proceso => proceso.idProceso);
    }

    public async createAccesoProceso(data: Partial<AccesoProceso>): Promise<AccesoProceso> {

        try {
        return await AccesoProceso.create(data);
        }catch (error) {
            throw new Error(`Error al crear permiso: ${error}`);

        }
    }

  // 🔹 Actualizar el acceso de un usuario a un proceso
  public async actualizarAccesoProceso(idUsuario: number, idProceso: number, nuevosDatos: Partial<AccesoProceso>) {
    const acceso = await AccesoProceso.findOne({
      where: { idUsuario, idProceso },
    });

    if (!acceso) {
      throw new Error("AccesoProceso no encontrado");
    }

    await acceso.update(nuevosDatos);
    return acceso;
  }


}

