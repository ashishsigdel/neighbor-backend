import admin from "firebase-admin";
import { rootDir } from "./fileStorageService.js";
import path from "path";

const serviceAccount = path.join(
  rootDir,
  "app",
  "config",
  "firebase-admin.json"
);

/**
 * @description Firebase service
 * @module FirebaseService
 * @requires firebase-admin
 * @requires path
 * @exports FirebaseService
 * @example import { FirebaseService } from "./app/services/index.js";
 */

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default firebaseApp;
