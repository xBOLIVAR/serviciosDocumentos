import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { getReviewers, loginHandler, registerHandler, setReviewDocuments } from "./usersService";
import {
  deleteDocumentHandler,
  getMyReviews,
  getUserDocumentsHandler,
  saveDocumentHandler,
  setStateDocument,
} from "./documentController";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Rutas
app.get("/documents/:uid", getUserDocumentsHandler);
app.get("/users/reviewers", getReviewers);
app.get("/users/:uid/reviewers", getMyReviews);
app.post("/documents/:uid", saveDocumentHandler);
app.post("/login", loginHandler);
app.post("/register", registerHandler);
app.post("/users/:uid/reviewDocuments", setReviewDocuments)
app.patch('/documents/:uid/:idDocument', setStateDocument)
app.delete("/documents/:uid/:idDocument", deleteDocumentHandler)

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
