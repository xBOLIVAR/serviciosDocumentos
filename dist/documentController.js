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
exports.saveDocumentHandler = exports.getUserDocumentsHandler = void 0;
const firebaseService_1 = require("./firebaseService");
const getUserDocumentsHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.params; // ID del usuario
    try {
        const snapshot = yield firebaseService_1.db.ref(`documents/${uid}`).once("value");
        const documents = snapshot.val();
        if (!documents) {
            return res.status(404).json({ message: "No se encontraron documentos para el usuario" });
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
    console.log("🚀 ~ file: documentController.ts:25 ~ saveDocumentHandler ~ id:", uid);
    const { image, title, state } = req.body; // Propiedades del documento
    try {
        // Generar un ID único para el documento
        const documentId = firebaseService_1.db.ref().child(`documents/${uid}`).push().key;
        // Validar el estado del documento
        const validStates = ["Sin revisar", "En revisión", "Rechazado", "Aceptado"];
        if (!validStates.includes(state)) {
            return res.status(400).json({ message: "Estado inválido" });
        }
        // Crear el objeto con las propiedades del documento
        const document = { image, title, state };
        // Guardar el documento en la base de datos
        yield firebaseService_1.db.ref(`documents/${uid}/${documentId}`).set(document);
        res.json({ message: "Documento guardado exitosamente" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});
exports.saveDocumentHandler = saveDocumentHandler;
//# sourceMappingURL=documentController.js.map