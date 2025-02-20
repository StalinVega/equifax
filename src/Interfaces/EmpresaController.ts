import { Request, Response } from "express";
import { EmpresaService } from "../Application/EmpresaService";

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
  }