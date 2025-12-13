import express from 'express';
import produitRoutes from './api/routes/produitRoutes.js';
import categorieRoutes from './api/routes/categorieRoutes.js';
import commandeRoutes from './api/routes/commandeRoutes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/produits', produitRoutes);
app.use('/categories', categorieRoutes);
app.use('/commandes', commandeRoutes);

export default app;