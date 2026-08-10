import './loadEnv.js';

import app from './app.js';
import connecterDB from './config/db.js';

connecterDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port http://localhost:${PORT}`);
});
