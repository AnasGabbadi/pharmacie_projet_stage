import express from 'express';
import produitRoutes from './routes/produitRoutes.js';
import categorieRoutes from './routes/categorieRoutes.js';
import commandeRoutes from './routes/commandeRoutes.js';
import utilisateurRoutes from './routes/utilisateurRoutes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/produit', produitRoutes);
app.use('/categorie', categorieRoutes);
app.use('/commande', commandeRoutes);
app.use('/utilisateur', utilisateurRoutes);

export default app;