import * as admin from 'firebase-admin';

// Configuración de Firebase
const serviceAccount = require('../serviciosdocumentos-e5986-firebase-adminsdk-ko94d-03ad76e4c0.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://serviciosdocumentos-e5986-default-rtdb.firebaseio.com",
});

export const db = admin.database();
