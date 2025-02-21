import { Empresa } from "../Domain/Models/Empresas";
import { Usuario } from "../Domain/Models/Usuario";
import { sequelize } from "../Infrastructure/database";

export class EmpresaService {
  /**
   * Crea una empresa y sus usuarios asociados.
   * @param empresaData Datos de la empresa.
   * @param usuariosData Datos de los usuarios (puede ser un array o undefined).
   * @returns La empresa creada con los usuarios asociados.
   * @throws Error si no se proporcionan usuarios.
   */
  public static async crearEmpresaConUsuarios(
    empresaData: {
      nombreEmpresa: string;
      correoEmpresa:string;
      responsable: string;
      correoResponsable: string;
      textoDocumento: string;
      responsableEquifax: string;
      cargoEquifax: string;
      createdAt:string
    },
    usuariosData?: Array<{
      email: string;
      password: string;
      role: string;
    }>
  ) {
    // Validar que se proporcionen usuarios
    if (!usuariosData || usuariosData.length === 0) {
      throw new Error("Debe proporcionar al menos un usuario.");
    }

    // Iniciar una transacción
    const transaction = await sequelize.transaction();

    try {
      // Crear la empresa dentro de la transacción
      const empresa = await Empresa.create(empresaData, { transaction });

      // Crear los usuarios asociados a la empresa dentro de la transacción
      const usuarios = await Promise.all(
        usuariosData.map((usuario) =>
          Usuario.create(
            {
              ...usuario,

              idEmpresa: empresa.id, // Asociar el usuario a la empresa
              username: usuario.email
            },
            { transaction }
          )
        )
      );

      // Confirmar la transacción (commit)
      await transaction.commit();

      return { empresa, usuarios };
    } catch (error) {
      // Revertir la transacción (rollback) en caso de error
      await transaction.rollback();
      throw new Error("Error al crear la empresa y los usuarios.");
    }
  }

   /**
   * Obtener todas las empresas.
   */
   public static async obtenerEmpresas() {
    return await Empresa.findAll();
  }

  public static async obtenerEmpresaPorId(id: number): Promise<Empresa | null> {
    try {
      // Buscar empresa por su ID
      const empresa = await Empresa.findByPk(id);
  
      // Retorna la empresa o null si no existe
      return empresa;
    } catch (error) {
      throw new Error(`Error al obtener la empresa por ID: ${error}`);
    }
  }
  

  public static async updateEmpresa(id: number, data: Partial<Empresa>): Promise<number> {
    const [affectedCount] = await Empresa.update(data, { where: { id } });
    return affectedCount;
  }


  /**
     * Obtiene la plantilla desde la base de datos.
     */
  public static async obtenerPlantilla(idEmpresa: number): Promise<string> {
    const empresa = await Empresa.findByPk(idEmpresa);
    if (!empresa) {
        throw new Error("Empresa no encontrada.");
    }
    return empresa.textoDocumento;
}


}