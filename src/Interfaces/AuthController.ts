import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Usuario } from '../Domain/Models/Usuario';


const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
    throw new Error('SECRET_KEY is not defined in the environment variables');
}

export const login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password } = req.body;
  
      // Busca el usuario en la base de datos
      const user = await Usuario.findOne({ where: { email } });
      // Verifica si el usuario existe
      if (!user) {
        return res.status(400).json({ message: 'El email ingresado es incorrecto' });
      }
      
       // Compara la contraseña ingresada con la almacenada en la base de datos
       if (user.password!=password) {
        return res.status(400).json({ message: "La contraseña es incorrecta" });
      }
  
      // Genera el token JWT
      const token = jwt.sign({ id: user.id, email: user.email, username:user.username,idEmpresa: user.idEmpresa }, SECRET_KEY, {
        expiresIn: '1h',
      });
  
      return res.json({ data: { token } });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error });
    }
  };