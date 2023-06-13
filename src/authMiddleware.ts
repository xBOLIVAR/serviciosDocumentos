import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Define una interfaz para el payload del token
interface TokenPayload extends JwtPayload {
  id: string;
}

export const authMiddleware = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  // Obtén el token de autorización del encabezado de la solicitud
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "No se proporcionó un token de autenticación" });
  }

  try {
    // Verifica y decodifica el token
    const decodedToken = jwt.verify(token, "secreto") as TokenPayload;

    // Agrega el objeto 'user' a la solicitud
    req.user = { email: decodedToken.email };
    
    // Llamar a la siguiente función de middleware
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token de autenticación inválido" });
  }
};
