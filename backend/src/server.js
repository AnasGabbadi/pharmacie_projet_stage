import dotenv from "dotenv";

// Charger dotenv EN PREMIER, avant tout autre import
dotenv.config();

import app from './app.js';
import connecterDB from './api/config/db.js';

// Connecter la base de données
connecterDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port http://localhost:${PORT}`);
});
