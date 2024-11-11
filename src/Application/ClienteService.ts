import { Cliente } from "../Domain/Models/Cliente";


export class ClienteService {
    async createClient(data: Partial<Cliente>): Promise<Cliente> {
      return await Cliente.create(data);
    }

}