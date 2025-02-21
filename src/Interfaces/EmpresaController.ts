import { Request, Response } from "express";
import { EmpresaService } from "../Application/EmpresaService";
import {reemplazarPlaceholders} from "../utils/reemplazarPlaceholders"
export class EmpresaController {
    /**
     * Endpoint para crear una empresa y sus usuarios asociados.
     */
    public static async crearEmpresaConUsuarios(req: Request, res: Response) {
      try {
        const { empresa, usuarios } = req.body;
  
        // Validar que se proporcionen datos de empresa y usuarios
        if (!empresa || !usuarios || usuarios.length === 0) {
          return res.status(400).json({
            message: "Debe proporcionar datos de la empresa y al menos un usuario.",
          });
        }
  
        // Llamar al servicio para crear la empresa y los usuarios
        const resultado = await EmpresaService.crearEmpresaConUsuarios(empresa, usuarios);
  
        // Respuesta exitosa
        return res.status(201).json({
          message: "Empresa y usuarios creados exitosamente.",
          data: resultado,
        });
      } catch (error: any) {
        // Manejo de errores
        return res.status(500).json({
          message: "Error al crear la empresa y los usuarios.",
          error: error.message,
        });
      }
    }

     /**
   * Obtener todas las empresas.
   */
  public static async obtenerEmpresas(req: Request, res: Response) {
    try {
      const empresas = await EmpresaService.obtenerEmpresas();
      return res.status(200).json({
        message: "Empresas obtenidas exitosamente.",
        data: empresas,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Error al obtener las empresas.",
        error: error.message,
      });
    }
  }

  public static async updateEmpresa(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const data = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({ message: "ID de empresa inválido" });
      }

      // Verificar si la empresa existe antes de actualizar
      const empresa = await EmpresaService.obtenerEmpresaPorId(id);
      if (!empresa) {
        return res.status(404).json({ message: `No se encontró la empresa con ID: ${id}` });
      }

      // Actualizar la empresa
      const affectedCount = await EmpresaService.updateEmpresa(id, data);

      if (affectedCount === 0) {
        return res.status(200).json({ message: "No se realizaron cambios en la empresa" });
      }

      return res.status(200).json({ message: "Empresa actualizada exitosamente" });
    } catch (error) {
      return res.status(500).json({ message: `Error al actualizar la empresa: ${error}` });
    }
  }


  /**
     * Endpoint para generar el texto dinámico.
     */
  public static async generarTexto(req: Request, res: Response) {
    try {
        const { idEmpresa } = req.params;
        const datos = req.body; // Datos en formato JSON

        // Validar que se proporcione el ID de la empresa y los datos
        if (!idEmpresa || !datos) {
            return res.status(400).json({
                message: "Debe proporcionar el ID de la empresa y los datos en formato JSON.",
            });
        }

        // Convertir el ID de la empresa a número
        const idEmpresaNum = Number(idEmpresa);

        // Obtener la plantilla desde la empresa
        const plantilla = await EmpresaService.obtenerPlantilla(idEmpresaNum);

        // Reemplazar los placeholders en la plantilla
        const textoFinal = reemplazarPlaceholders(plantilla, datos);

        // Respuesta exitosa
        return res.status(200).json({
            message: "Texto generado exitosamente.",
            texto: textoFinal,
        });
    } catch (error: any) {
        // Manejo de errores
        return res.status(500).json({
            message: "Error al generar el texto.",
            error: error.message,
        });
    }
}
  }