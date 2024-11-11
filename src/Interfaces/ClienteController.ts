import { ClienteService } from "../Application/ClienteService";
import { ApiResponse } from "./ApiResponse";
import { handleErrorResponse } from "./Errors/handleErrorResponse";
import { Request, Response } from 'express';


const clientService = new ClienteService();


export class ClienteController{
  public async createClient(req: Request, res: Response): Promise<void>{
    try {
      const user = await clientService.createClient(req.body);
      const response = new ApiResponse(201, 'Usuario creado correctamente', user);
      res.status(201).json(response);
    } catch (error) {
      handleErrorResponse(res, error, 'No se pudo crear el usuario');
    }
  };
}
