import { db } from "./firebaseService";
import { Request, Response } from "express";

export const getUserDocumentsHandler = async (req: Request, res: Response) => {
  const { uid } = req.params; // ID del usuario

  try {
    const snapshot = await db.ref(`documents/${uid}`).once("value");
    const documents = snapshot.val();

    if (!documents) {
      return res
        .status(404)
        .json({ message: "No se encontraron documentos para el usuario" });
    }

    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getMyReviews = async (req: Request, res: Response) => {
  const { uid } = req.params; // ID del usuario

  try {
    const snapshot = await db.ref(`users/${uid}/reviewDocuments`).once("value");
    const owners = snapshot.val();

    if (!owners) {
      return res
        .status(404)
        .json({ message: "No se encontraron documentos para el usuario" });
    }

    const documents = [];

    for (const owner in owners) {
      for (const idDocument in owners[owner]) {
        const documentSnapshot = await db
          .ref(`documents/${owner}/${idDocument}`)
          .once("value");
        const document = documentSnapshot.val();
        if (document) {
          documents.push({...document });
        }
      }
    }

    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const saveDocumentHandler = async (req: any, res: Response) => {
  const { uid } = req.params; // ID del usuario
  const { image, title, state } = req.body; // Propiedades del documento

  try {
    const documentId = db.ref().child(`documents/${uid}`).push().key;
    const validStates = ["Sin revisar", "En revisión", "Rechazado", "Aceptado"];
    if (!validStates.includes(state)) {
      return res.status(400).json({ message: "Estado inválido" });
    }
    const document = { image, title, state };
    await db.ref(`documents/${uid}/${documentId}`).set(document);
    res.json({ document, documentId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const setStateDocument = async (req: Request, res: Response) => {
  try {
    const { uid, idDocument } = req.params;

    const documentRef = db.ref(`documents/${uid}/${idDocument}`);

    await documentRef.update({ state: "En revisión" });

    res.json({ message: "Estado del documento actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar el estado del documento:", error);
    res
      .status(500)
      .json({ error: "Error al actualizar el estado del documento" });
  }
};

export const deleteDocumentHandler = async (req: Request, res: Response) => {
  const { uid, idDocument } = req.params;

  try {
    // Verificar si el documento existe en la base de datos
    const documentRef = db.ref(`documents/${uid}/${idDocument}`);
    const documentSnapshot = await documentRef.once("value");
    const documentData = documentSnapshot.val();

    if (!documentData) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    // Eliminar el documento de la base de datos
    await documentRef.remove();

    res.json({ message: "Documento eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
