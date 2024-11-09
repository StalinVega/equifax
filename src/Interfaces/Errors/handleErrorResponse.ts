import { Response } from 'express';
import { ErrorResponse } from './ErrorResponse';  // Asegúrate de que la ruta a ErrorResponse sea correcta

/**
 * Maneja la respuesta de error enviando un ErrorResponse JSON al cliente.
 *
 * @param res - El objeto Response de Express.
 * @param error - El error que ocurrió.
 * @param message - Un mensaje personalizado para describir el contexto del error.
 */
export const handleErrorResponse = (res: Response, error: unknown, message: string): void => {
  let errorMessage = 'Unknown error';
  if (error instanceof Error) {
    errorMessage = error.message;
  }
  const response = new ErrorResponse(500, message, errorMessage);
  res.status(500).json(response);
};
