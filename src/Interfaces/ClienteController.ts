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

  // Método para actualizar el numTramite por cédula
  async updateNumTramiteByCedula(req: Request, res: Response): Promise<void> {
    try {
      const { cedula, numTramite } = req.body; // Obtén los datos del cuerpo de la solicitud

      // Llama al servicio para actualizar el numTramite
      const updatedCliente = await clientService.updateNumTramiteByCedula(cedula, numTramite);
      const response = new ApiResponse(201, 'Usuario creado correctamente', updatedCliente);
      // Si el cliente no existe, responde con un error 404
      if (!updatedCliente) {
        res.status(404).json({ message: 'Cliente no encontrado' });
      }

      // Responde con el cliente actualizado
      res.status(200).json(response);
    } catch (error) {
      // Maneja los errores y responde con un código 500
      res.status(500).json({ message: 'Error al actualizar el cliente'});
    }
  }
}
