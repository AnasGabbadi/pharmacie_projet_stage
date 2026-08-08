import express from 'express';
import cors from 'cors';
import morgan from 'morgan'; 
import helmet from 'helmet'; 

import authRoutes from './routes/authRoutes.js';  
import produitRoutes from './routes/produitRoutes.js';
import categorieRoutes from './routes/categorieRoutes.js';
import commandeRoutes from './routes/commandeRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import stripeRoutes from './routes/Striperoutes.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static("storage/public"));

app.use('/api/auth', authRoutes);         
app.use('/api/produits', produitRoutes);  
app.use('/api/categories', categorieRoutes);
app.use('/api/commandes', commandeRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/stripe", stripeRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV 
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.originalUrl} non trouvée` 
  });
});

export default app;
