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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setReviewDocuments = exports.getReviewers = exports.registerHandler = exports.loginHandler = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const firebaseService_1 = require("./firebaseService");
const loginHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const snapshot = yield firebaseService_1.db
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
        const validPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }
        const token = jsonwebtoken_1.default.sign({ email: user.email }, "secreto");
        res.json({ token, uid: userId });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});
exports.loginHandler = loginHandler;
const registerHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const usersRef = firebaseService_1.db.ref("users");
        // Verificar si el usuario ya está registrado
        const snapshot = yield usersRef
            .orderByChild("email")
            .equalTo(email)
            .once("value");
        if (snapshot.exists()) {
            return res.status(400).json({ message: "El usuario ya está registrado" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Agregar el usuario a la base de datos
        const newUserRef = usersRef.push();
        yield newUserRef.set({
            email,
            password: hashedPassword,
        });
        res.json({ message: "Registro exitoso" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});
exports.registerHandler = registerHandler;
const getReviewers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtener una referencia a la colección "users"
        const usersRef = firebaseService_1.db.ref("users");
        // Realizar la consulta para obtener los usuarios revisores
        const snapshot = yield usersRef
            .orderByChild("revisor")
            .equalTo(true)
            .once("value");
        // Obtener los datos de los usuarios
        const users = snapshot.val();
        // Devolver los usuarios como respuesta
        res.json(users);
    }
    catch (error) {
        console.error("Error al obtener los usuarios revisores:", error);
        res.status(500).json({ error: "Error al obtener los usuarios revisores" });
    }
});
exports.getReviewers = getReviewers;
const setReviewDocuments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req.params;
        const { idDocument, title, owner } = req.body;
        // Obtener una referencia al usuario específico
        const userRef = firebaseService_1.db.ref(`users/${uid}`);
        // Obtener una referencia al documento específico dentro de "reviewDocuments"
        const documentRef = userRef.child(`reviewDocuments/${owner}/${idDocument}`);
        // Guardar el título del documento en la propiedad "title"
        yield documentRef.set({ title });
        res.json({ message: "Documento agregado exitosamente al usuario" });
    }
    catch (error) {
        console.error("Error al agregar el documento al usuario:", error);
        res.status(500).json({ error: "Error al agregar el documento al usuario" });
    }
});
exports.setReviewDocuments = setReviewDocuments;
//# sourceMappingURL=usersService.js.map