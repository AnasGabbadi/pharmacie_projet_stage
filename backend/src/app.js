import express from 'express';
import produitRoutes from './api/routes/produitRoutes.js';
import categorieRoutes from './api/routes/categorieRoutes.js';
import commandeRoutes from './api/routes/commandeRoutes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/produit', produitRoutes);
app.use('/categorie', categorieRoutes);
app.use('/commande', commandeRoutes);

export default app;