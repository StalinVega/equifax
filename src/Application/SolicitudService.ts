import { Solicitud } from "../Domain/Models/Solicitud";

export class SolicitudService {
    async crearSolicitud(data: Partial<Solicitud>): Promise<Solicitud> {
      return await Solicitud.create(data);
    }


    async obtenerSolicitudesPorUsuario(idUsuario: number) {
      return await Solicitud.findAll({ where: { idUsuario } });
  }

  static async obtenerSolicitudPorId(idSolicitud: number) {
    try {
        const solicitud = await Solicitud.findOne({ where: { id: idSolicitud } });
        return solicitud;
    } catch (error) {
        console.error("Error al obtener la solicitud:", error);
        throw new Error("Error al obtener la solicitud");
    }
}

    
}