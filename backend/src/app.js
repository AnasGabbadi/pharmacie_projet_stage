import express from 'express';
import produitRoutes from './api/routes/produitRoutes.js'
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/produits', produitRoutes);

export default app;