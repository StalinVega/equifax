import { Empresa } from "../Domain/Models/Empresas";
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

  /**
  * Obtiene todos los usuarios asociados a una empresa.
  * @param idEmpresa ID de la empresa.
  * @returns Lista de usuarios.
  */
  async obtenerUsuariosPorEmpresa(idEmpresa: number): Promise<Usuario[]> {
    try {
      // Verificar si la empresa existe
      const empresa = await Empresa.findByPk(idEmpresa);
      if (!empresa) {
        throw new Error(`No se encontró la empresa con ID: ${idEmpresa}`);
      }
  
      // Buscar todos los usuarios asociados a la empresa
      const usuarios = await Usuario.findAll({
        where: { id_empresa: idEmpresa },
      });
  
      // Si no hay usuarios, lanzar un error informativo
      if (usuarios.length === 0) {
        throw new Error(`La empresa con ID ${idEmpresa} no tiene usuarios registrados.`);
      }
  
      return usuarios;
    } catch (error) {
      throw new Error(`Error al obtener los usuarios por empresa: ${error}`);
    }
  }
  
}