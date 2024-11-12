import { Solicitud } from "../Domain/Models/Solicitud";

export class SolicitudService {
    async crearSolicitud(data: Partial<Solicitud>): Promise<Solicitud> {
      return await Solicitud.create(data);
    }
}