"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const usersService_1 = require("./usersService");
const documentController_1 = require("./documentController");
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Rutas
app.get("/documents/:uid", documentController_1.getUserDocumentsHandler);
app.get("/users/reviewers", usersService_1.getReviewers);
app.post("/documents/:uid", documentController_1.saveDocumentHandler);
app.post("/login", usersService_1.loginHandler);
app.post("/register", usersService_1.registerHandler);
app.post("/users/:uid/reviewDocuments", usersService_1.setReviewDocuments);
app.patch('/documents/:uid/:idDocument', documentController_1.setStateDocument);
app.delete("/documents/:uid/:idDocument", documentController_1.deleteDocumentHandler);
app.listen(port, () => {
    console.log(`Servidor en ejecución en http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map