import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "./firebaseService";

export const loginHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const snapshot = await db
      .ref("users")
      .orderByChild("email")
      .equalTo(email)
      .once("value");

    const users = snapshot.val();

    if (!users) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const userId = Object.keys(users)[0];
    const user = users[userId];

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign({ email: user.email }, "secreto");

    res.json({ token, uid: userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const registerHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const usersRef = db.ref("users");

    // Verificar si el usuario ya está registrado
    const snapshot = await usersRef
      .orderByChild("email")
      .equalTo(email)
      .once("value");
    if (snapshot.exists()) {
      return res.status(400).json({ message: "El usuario ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Agregar el usuario a la base de datos
    const newUserRef = usersRef.push();
    await newUserRef.set({
      email,
      password: hashedPassword,
    });

    res.json({ message: "Registro exitoso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getReviewers = async (req: Request, res: Response) => {
  try {
    // Obtener una referencia a la colección "users"
    const usersRef = db.ref("users");

    // Realizar la consulta para obtener los usuarios revisores
    const snapshot = await usersRef
      .orderByChild("revisor")
      .equalTo(true)
      .once("value");

    // Obtener los datos de los usuarios
    const users = snapshot.val();

    // Devolver los usuarios como respuesta
    res.json(users);
  } catch (error) {
    console.error("Error al obtener los usuarios revisores:", error);
    res.status(500).json({ error: "Error al obtener los usuarios revisores" });
  }
};

export const setReviewDocuments = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const { idDocument, title, owner } = req.body;

    // Obtener una referencia al usuario específico
    const userRef = db.ref(`users/${uid}`);

    // Obtener una referencia al documento específico dentro de "reviewDocuments"
    const documentRef = userRef.child(`reviewDocuments/${owner}/${idDocument}`);

    // Guardar el título del documento en la propiedad "title"
    await documentRef.set({ title });

    res.json({ message: "Documento agregado exitosamente al usuario" });
  } catch (error) {
    console.error("Error al agregar el documento al usuario:", error);
    res.status(500).json({ error: "Error al agregar el documento al usuario" });
  }
};
