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