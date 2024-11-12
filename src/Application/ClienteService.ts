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
    

}

