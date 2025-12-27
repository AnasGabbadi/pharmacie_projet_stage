import express from 'express';
import produitRoutes from './routes/produitRoutes.js';
import categorieRoutes from './routes/categorieRoutes.js';
import commandeRoutes from './routes/commandeRoutes.js';
import utilisateurRoutes from './routes/utilisateurRoutes.js';
import cors from "cors"; 

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: false,             
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/produit', produitRoutes);
app.use('/categorie', categorieRoutes);
app.use('/commande', commandeRoutes);
app.use('/utilisateur', utilisateurRoutes);
app.use("/public", express.static("storage/public"));

export default app;