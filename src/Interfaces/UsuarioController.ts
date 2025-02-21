import { Request, Response } from 'express';
import { UsuarioService } from "../Application/UsuarioService";
import { ApiResponse } from "./ApiResponse";
import { handleErrorResponse } from './Errors/handleErrorResponse';


const userService = new UsuarioService();

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.createUsuario(req.body);
    const response = new ApiResponse(201, 'Usuario creado correctamente', user);
    res.status(201).json(response);
  } catch (error) {
    handleErrorResponse(res, error, 'No se pudo crear el usuario');
  }
};

export const obtenerUsuariosPorEmpresa = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idEmpresa } = req.params;
    // Validar que se proporcione el ID de la empresa
    if (!idEmpresa) {
      res.status(400).json({
        message: "Debe proporcionar el ID de la empresa.",
      });
    }

    // Convertir el parámetro a número
    const idEmpresaNum = Number(idEmpresa);

    // Obtener los usuarios asociados a la empresa
    const usuarios = await userService.obtenerUsuariosPorEmpresa(idEmpresaNum);

    // Respuesta exitosa
     res.status(200).json({
      message: "Usuarios obtenidos exitosamente.",
      usuarios,
    });
  } catch (error: any) {
    // Manejo de errores
     res.status(500).json({
      message: "Error al obtener los usuarios por empresa.",
      error: error.message,
    });
  }
};


