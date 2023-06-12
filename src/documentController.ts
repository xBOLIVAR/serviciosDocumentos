import { db } from "./firebaseService";
import { Request, Response } from "express";

export const getUserDocumentsHandler = async (req: Request, res: Response) => {
    const { uid } = req.params; // ID del usuario
  
    try {
      const snapshot = await db.ref(`documents/${uid}`).once("value");
      const documents = snapshot.val();
  
      if (!documents) {
        return res.status(404).json({ message: "No se encontraron documentos para el usuario" });
      }
  
      res.json(documents);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  };
  

export const saveDocumentHandler = async (req: Request, res: Response) => {
  const { uid } = req.params; // ID del usuario
  console.log("🚀 ~ file: documentController.ts:25 ~ saveDocumentHandler ~ id:", uid);
  const { image, title, state } = req.body; // Propiedades del documento

  try {
    // Generar un ID único para el documento
    const documentId = db.ref().child(`documents/${uid}`).push().key;

    // Validar el estado del documento
    const validStates = ["Sin revisar", "En revisión", "Rechazado", "Aceptado"];
    if (!validStates.includes(state)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    // Crear el objeto con las propiedades del documento
    const document = { image, title, state };

    // Guardar el documento en la base de datos
    await db.ref(`documents/${uid}/${documentId}`).set(document);

    res.json({ message: "Documento guardado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
