import { Cliente } from "../Domain/Models/Cliente";
import { PaqueteTransacciones } from "../Domain/Models/PaquetesTransacciones";
import { Solicitud } from "../Domain/Models/Solicitud";
import { Usuario } from "../Domain/Models/Usuario";

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

  async getSolicitudAndPaqueteByTramite(numeroTramite: string): Promise<{ idSolicitud: number, idPaquete: number }> {
    // Validación de entrada
    if (!numeroTramite || typeof numeroTramite !== 'string') {
        throw new Error('Número de trámite no válido');
    }

    try {
        // Paso 1: Obtener el cliente basado en el número de trámite
        const cliente = await Cliente.findOne({
            where: { numTramite: numeroTramite }
        });

        if (!cliente) {
            throw new Error('Cliente no encontrado');
        }

        const idCliente = cliente.id;

        // Paso 2: Obtener la solicitud asociada al cliente
        const solicitud = await Solicitud.findOne({
            where: { id_cliente: idCliente }
        });

        if (!solicitud) {
            throw new Error('Solicitud no encontrada para el cliente');
        }

        const idSolicitud = solicitud.id;
        const idUsuario = solicitud.idUsuario; // Obtenemos el id_usuario de la solicitud
        const idProcesoSolicitud = solicitud.idProceso; // Obtenemos el idProceso de la solicitud

        // Paso 3: Obtener el usuario asociado a la solicitud
        const usuario = await Usuario.findOne({
            where: { id: idUsuario }
        });

        if (!usuario) {
            throw new Error('Usuario no encontrado para la solicitud');
        }

        const idEmpresa = usuario.idEmpresa; // Obtenemos el idEmpresa del usuario

        // Paso 4: Obtener el paquete asociado a la empresa y que coincida con el idProceso de la solicitud
        const paquete = await PaqueteTransacciones.findOne({
            where: { idEmpresa: idEmpresa, id_proceso: idProcesoSolicitud }
        });

        if (!paquete) {
            throw new Error('Paquete no encontrado para la empresa y el proceso de la solicitud');
        }

        const idPaquete = paquete.idPaquete;

        // Devolver los resultados
        return { idSolicitud, idPaquete };

    } catch (error) {
        console.error(`Error al obtener la solicitud y el paquete: ${error}`);
        throw new Error(`Error al obtener la solicitud y el paquete: ${error}`);
    }
}
}