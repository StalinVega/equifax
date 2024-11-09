import { Usuario } from "../Domain/Models/Usuario";

export class UsuarioService {
    async createUsuario(data: Partial<Usuario>): Promise<Usuario> {
      return await Usuario.create(data);
    }
  
    async getUsuarioById(id: number): Promise<Usuario | null> {
      return await Usuario.findByPk(id);
    }
  
    async updateUsuario(id: number, data: Partial<Usuario>): Promise<number> {
      const [affectedCount] = await Usuario.update(data, { where: { id } });
      return affectedCount;
    }
  
    async deleteUsuario(id: number): Promise<number> {
      return await Usuario.destroy({ where: { id } });
    }
  
    async getAllUsuarios(): Promise<Usuario[]> {
      return await Usuario.findAll();
    }
  }