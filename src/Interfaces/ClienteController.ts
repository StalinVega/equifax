import { ClienteService } from "../Application/ClienteService";
import { ApiResponse } from "./ApiResponse";
import { handleErrorResponse } from "./Errors/handleErrorResponse";
import { Request, Response } from 'express';


const clientService = new ClienteService();


export class ClienteController{
  // Metodo para crear el cliente y
  public async createClient(req: Request, res: Response): Promise<void>{
    try {
      
      // Obtener datos del cuerpo de la solicitud
      const { clienteData, solicitudData } = req.body;
      const user = await clientService.createClientWithSolicitud(clienteData, solicitudData);
      const response = new ApiResponse(201, 'Usuario creado correctamente', [user]);
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

   // Método para obtener los clientes vinculados a un usuario con paginación
   public async getClientsByUserIdAndProcess(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId); // Obtener el ID de usuario desde los parámetros
  
      // Validar si el userId es un número
      if (isNaN(userId)) {
        res.status(400).json(new ApiResponse(400, 'ID de usuario no válido', null));
        return;
      }
  
      // Obtener idProceso de los query parameters (si existe)
      const idProceso = req.query.idProceso ? parseInt(req.query.idProceso as string) : undefined;
  
      // Validar si idProceso es un número válido si se proporciona
      if (idProceso !== undefined && isNaN(idProceso)) {
        res.status(400).json(new ApiResponse(400, 'ID de proceso no válido', null));
        return;
      }
  
      // Obtener parámetros de paginación desde los query parameters
      const page = parseInt(req.query.page as string) || 1; // Página actual (por defecto 1)
      const limit = parseInt(req.query.limit as string) || 10; // Límite de resultados por página (por defecto 10)
  
      // Obtener los clientes vinculados al usuario y, si se proporciona, al idProceso
      const clientes = await clientService.getClientsByUserIdAndProcess(userId, idProceso, page, limit);
  
      // Si no hay clientes, devolver un mensaje con un array vacío
      if (clientes.length === 0) {
        const response = new ApiResponse(404, 'No se encontraron clientes vinculados a este usuario o proceso', []);
        res.status(404).json(response);
        return;
      }
  
      // Si se encuentran clientes, devolver los datos
      const response = new ApiResponse(200, 'Clientes encontrados', clientes);
      res.status(200).json(response);
  
    } catch (error) {
      // Manejo de errores, si ocurre un fallo en la consulta o en la lógica
      handleErrorResponse(res, error, 'No se pudo obtener los clientes vinculados al usuario y proceso');
    }
  }
  
}
