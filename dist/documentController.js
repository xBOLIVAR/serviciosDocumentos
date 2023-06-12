"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocumentHandler = exports.setStateDocument = exports.saveDocumentHandler = exports.getUserDocumentsHandler = void 0;
const firebaseService_1 = require("./firebaseService");
const getUserDocumentsHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.params; // ID del usuario
    try {
        const snapshot = yield firebaseService_1.db.ref(`documents/${uid}`).once("value");
        const documents = snapshot.val();
        if (!documents) {
            return res
                .status(404)
                .json({ message: "No se encontraron documentos para el usuario" });
        }
        res.json(documents);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});
exports.getUserDocumentsHandler = getUserDocumentsHandler;
const saveDocumentHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.params; // ID del usuario
    const { image, title, state } = req.body; // Propiedades del documento
    try {
        const documentId = firebaseService_1.db.ref().child(`documents/${uid}`).push().key;
        const validStates = ["Sin revisar", "En revisión", "Rechazado", "Aceptado"];
        if (!validStates.includes(state)) {
            return res.status(400).json({ message: "Estado inválido" });
        }
        const document = { image, title, state };
        yield firebaseService_1.db.ref(`documents/${uid}/${documentId}`).set(document);
        res.json({ document, documentId });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});
exports.saveDocumentHandler = saveDocumentHandler;
const setStateDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid, idDocument } = req.params;
        const documentRef = firebaseService_1.db.ref(`documents/${uid}/${idDocument}`);
        yield documentRef.update({ state: "En revisión" });
        res.json({ message: "Estado del documento actualizado exitosamente" });
    }
    catch (error) {
        console.error("Error al actualizar el estado del documento:", error);
        res
            .status(500)
            .json({ error: "Error al actualizar el estado del documento" });
    }
});
exports.setStateDocument = setStateDocument;
const deleteDocumentHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid, idDocument } = req.params;
    try {
        // Verificar si el documento existe en la base de datos
        const documentRef = firebaseService_1.db.ref(`documents/${uid}/${idDocument}`);
        const documentSnapshot = yield documentRef.once("value");
        const documentData = documentSnapshot.val();
        if (!documentData) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }
        // Eliminar el documento de la base de datos
        yield documentRef.remove();
        res.json({ message: "Documento eliminado exitosamente" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});
exports.deleteDocumentHandler = deleteDocumentHandler;
//# sourceMappingURL=documentController.js.map