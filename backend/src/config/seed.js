import dotenv from "dotenv";
import mongoose from "mongoose";
import Utilisateur from "../models/Utilisateur.model.js";
import Categorie from "../models/Categorie.model.js";
import Produit from "../models/Produit.model.js";
import Commande from "../models/Commande.model.js";

dotenv.config();

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);

    await Utilisateur.createCollection();
    await Categorie.createCollection();
    await Produit.createCollection();
    await Commande.createCollection();

    console.log("Toutes les collections ont été créées.");
  } catch (err) {
    console.error("Erreur seed :", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

runSeed();