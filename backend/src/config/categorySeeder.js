import mongoose from "mongoose";
import dotenv from "dotenv";
import Categorie from "../models/Categorie.model.js";

dotenv.config();

const MONGODB_URI = process.env.DATABASE_URL;

// 8 catégories de parapharmacie
const categories = [
  { nom: "Visage", description: "Soins du visage : hydratation, anti-âge, nettoyants", slug: "visage" },
  { nom: "Corps", description: "Soins du corps : hydratation, réparation, confort quotidien", slug: "corps" },
  { nom: "Cheveux", description: "Shampooings, soins et traitements capillaires", slug: "cheveux" },
  { nom: "Compléments alimentaires", description: "Vitamines, minéraux et compléments pour le bien-être", slug: "complements-alimentaires" },
  { nom: "Hygiène bucco-dentaire", description: "Dentifrices, bains de bouche et soins dentaires", slug: "hygiene-bucco-dentaire" },
  { nom: "Bébé & Maman", description: "Produits doux pour bébés et futures mamans", slug: "bebe-maman" },
  { nom: "Solaire", description: "Protection solaire visage et corps", slug: "solaire" },
  { nom: "Hygiène intime", description: "Soins d'hygiène intime au pH physiologique", slug: "hygiene-intime" },
];

// Fonction principale de seeding
const seedCategories = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Supprimer les anciennes catégories
    await Categorie.deleteMany({});
    console.log('🗑️  Anciennes catégories supprimées');

    // Insérer les nouvelles catégories
    const result = await Categorie.insertMany(categories);

    console.log(`\n✅ ${result.length} catégories créées avec succès!\n`);

    // Afficher toutes les catégories créées
    console.log('📋 Liste des catégories créées:\n');
    result.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.nom}`);
      console.log(`   Slug: ${cat.slug}`);
      console.log(`   ID: ${cat._id}`);
      console.log(`   Description: ${cat.description}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
  } finally {
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('🔒 Connexion MongoDB fermée');
    process.exit(0);
  }
};

// Exécuter le seeder
seedCategories();
