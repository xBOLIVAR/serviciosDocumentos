import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { getReviewers, loginHandler, registerHandler, setReviewDocuments } from "./usersService";
import {
  getUserDocumentsHandler,
  saveDocumentHandler,
} from "./documentController";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Rutas
app.get("/documents/:uid", getUserDocumentsHandler);
app.get("/users/reviewers", getReviewers);
app.post("/documents/:uid", saveDocumentHandler);
app.post("/login", loginHandler);
app.post("/register", registerHandler);
app.post("/users/:uid/reviewDocuments", setReviewDocuments)

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
