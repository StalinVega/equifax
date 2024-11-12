import { Cliente } from "../Domain/Models/Cliente";


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
    

    

}

