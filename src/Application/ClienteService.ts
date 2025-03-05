import { Cliente } from "../Domain/Models/Cliente";
import { Solicitud } from "../Domain/Models/Solicitud";
import { SolicitudService } from "./SolicitudService";
import { sequelize } from '../Infrastructure/database';

const solicitudService = new SolicitudService();
export class ClienteService {
  async createClient(data: Partial<Cliente>): Promise<Cliente> {
    return await Cliente.create(data);
  }

  async updateNumTramiteByCedula(cedula: string, numTramite: string): Promise<Cliente | null> {
    // Primero busca el cliente usando el número de cédula
    const cliente = await Cliente.findOne({
      where: { cedula },
      order: [['createdAt', 'DESC']], // Ordena por fecha de creación en orden descendente
    });

    // Si el cliente existe, actualiza el campo numTramite
    if (cliente) {
      cliente.numTramite = numTramite;
      await cliente.save(); // Guarda los cambios en la base de datos
      return cliente; // Devuelve el cliente actualizado
    }

    // Si no se encuentra el cliente, devuelve null o lanza un error según tu preferencia
    return null;
  }

  // Crear cliente y solicitud en una transacción
  async createClientWithSolicitud(clienteData: Partial<Cliente>, solicitudData: Partial<Solicitud>): Promise<{ cliente: Cliente, solicitud: Solicitud }> {
    const transaction = await sequelize.transaction();

    try {
      // Crear el cliente
      const cliente = await this.createClient(clienteData);

      // Agregar el idCliente al objeto solicitud
      solicitudData.idCliente = cliente.id;

      // Crear la solicitud
      const solicitud = await solicitudService.crearSolicitud(solicitudData);
      
      // Confirmar la transacción
      await transaction.commit();

      return { cliente, solicitud };
    } catch (error) {
      // En caso de error, revertir la transacción
      await transaction.rollback();
      throw new Error(`Error al crear cliente y solicitud: ${error}`);
    }
  }

 // Método para obtener los clientes vinculados a un usuario y un idProceso con paginación
public async getClientsByUserIdAndProcess(userId: number, idProceso?: number, page: number = 1, limit: number = 10): Promise<Cliente[]> {
  const offset = (page - 1) * limit; // Calcular el desplazamiento para la paginación

  // Construcción dinámica de condiciones para la consulta
  const whereConditions: any = { idUsuario: userId };
  if (idProceso) {
    whereConditions.idProceso = idProceso; // Agregar filtro de idProceso si se proporciona
  }

  // Consulta de clientes vinculados a este usuario y opcionalmente a un idProceso con paginación
  const clientes = await Cliente.findAll({
    include: [
      {
        model: Solicitud,
        where: whereConditions,
        required: true,
        attributes: ['idProceso']
      },
    ],
    limit: limit, // Establecer el límite de resultados
    offset: offset, // Aplicar el desplazamiento
    order: [['createdAt', 'DESC']], // Ordenar por fechaCreacion de más nuevo a más antiguo
  });

  // Transformación de la respuesta para aplanar idProceso en cada cliente
  const formattedClientes = clientes.map(cliente => {
    const clienteData = cliente.toJSON();
    clienteData.idProceso = clienteData.Solicituds[0]?.idProceso; // Extrae idProceso del primer elemento de Solicituds
    delete clienteData.Solicituds; // Elimina el array Solicituds de la respuesta
    return clienteData;
  });

  return formattedClientes;
}


async updateNumTramiteByNumTramite(numTramite: string, nuevoNumTramite: string): Promise<Cliente | null> {
  // Buscar el cliente usando el numTramite existente
  const cliente = await Cliente.findOne({
      where: { numTramite },
      order: [['createdAt', 'DESC']], // Ordena por fecha de creación en orden descendente
  });

  // Si el cliente existe, actualiza el campo numTramite con el nuevo valor
  if (cliente) {
      cliente.numTramite = nuevoNumTramite;
      await cliente.save(); // Guarda los cambios en la base de datos
      return cliente; // Devuelve el cliente actualizado
  }

  // Si no se encuentra el cliente, devuelve null o lanza un error según tu preferencia
  return null;
}

}

