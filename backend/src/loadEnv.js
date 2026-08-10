



// Doit rester le tout premier import de server.js : en ESM, les imports statiques
// sont évalués avant le reste du code d'un module, donc charger dotenv ici garantit
// que process.env est prêt avant que la chaîne d'imports (app.js → routes → services,
// ex. Stripeservice.js) ne s'exécute.
import dotenv from "dotenv";

dotenv.config();

// Vérification unique au démarrage : sans secret JWT réel, le serveur ne doit
// jamais démarrer avec une valeur par défaut prévisible codée dans le code source.
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET manquant dans l'environnement — arrêt du serveur.");
  process.exit(1);
}
