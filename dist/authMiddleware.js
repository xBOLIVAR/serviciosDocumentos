"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    var _a;
    // Obtén el token de autorización del encabezado de la solicitud
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return res
            .status(401)
            .json({ message: "No se proporcionó un token de autenticación" });
    }
    try {
        // Verifica y decodifica el token
        const decodedToken = jsonwebtoken_1.default.verify(token, "secreto");
        // Agrega el objeto 'user' a la solicitud
        req.user = { email: decodedToken.email };
        // Llamar a la siguiente función de middleware
        next();
    }
    catch (error) {
        console.log("🚀 ~ file: authMiddleware.ts:33 ~ error:", error);
        return res.status(401).json({ message: "Token de autenticación inválido" });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map