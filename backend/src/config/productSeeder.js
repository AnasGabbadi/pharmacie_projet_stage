import mongoose from "mongoose";
import dotenv from "dotenv";
import Produit from "../models/Produit.model.js";
import Categorie from "../models/Categorie.model.js";

dotenv.config();

const MONGODB_URI = process.env.DATABASE_URL;

// Catégories référencées par les produits ci-dessous — retrouvées par leur nom
// (jamais un id codé en dur), créées seulement si elles n'existent pas déjà
// (ex: categorySeeder.js pas encore exécuté).
const categoriesReferencees = [
  { nom: "Visage", description: "Soins du visage : hydratation, anti-âge, nettoyants", slug: "visage" },
  { nom: "Corps", description: "Soins du corps : hydratation, réparation, confort quotidien", slug: "corps" },
  { nom: "Cheveux", description: "Shampooings, soins et traitements capillaires", slug: "cheveux" },
  { nom: "Compléments alimentaires", description: "Vitamines, minéraux et compléments pour le bien-être", slug: "complements-alimentaires" },
  { nom: "Hygiène bucco-dentaire", description: "Dentifrices, bains de bouche et soins dentaires", slug: "hygiene-bucco-dentaire" },
  { nom: "Bébé & Maman", description: "Produits doux pour bébés et futures mamans", slug: "bebe-maman" },
  { nom: "Solaire", description: "Protection solaire visage et corps", slug: "solaire" },
  { nom: "Hygiène intime", description: "Soins d'hygiène intime au pH physiologique", slug: "hygiene-intime" },
];

// 20 produits de parapharmacie — categorieNom résolu dynamiquement en vrai
// categorieId (ObjectId) juste avant l'insertion, jamais codé en dur.
const produitsData = [
  { nom: "Crème hydratante visage jour SPF15", description: "Hydratation quotidienne, protection solaire légère", prix: 189, stock: 40, categorieNom: "Visage" },
  { nom: "Sérum acide hyaluronique", description: "Anti-âge, repulpant, tous types de peau", prix: 245, stock: 25, categorieNom: "Visage" },
  { nom: "Nettoyant moussant purifiant", description: "Peaux mixtes à grasses, sans savon", prix: 95, stock: 60, categorieNom: "Visage" },
  { nom: "Lait corporel nourrissant", description: "Peaux sèches, application quotidienne", prix: 79, stock: 55, categorieNom: "Corps" },
  { nom: "Gel douche dermatologique", description: "pH neutre, peaux sensibles", prix: 65, stock: 70, categorieNom: "Corps" },
  { nom: "Crème réparatrice mains et pieds", description: "Gerçures, peaux très sèches", prix: 55, stock: 45, categorieNom: "Corps" },
  { nom: "Shampooing antipelliculaire", description: "Cuir chevelu sensible, usage fréquent", prix: 89, stock: 50, categorieNom: "Cheveux" },
  { nom: "Sérum fortifiant anti-chute", description: "Cure 3 mois, cheveux affaiblis", prix: 210, stock: 20, categorieNom: "Cheveux" },
  { nom: "Après-shampooing démêlant", description: "Cheveux longs et secs", prix: 75, stock: 40, categorieNom: "Cheveux" },
  { nom: "Vitamine D3 1000UI", description: "Complément journalier, flacon 60 gélules", prix: 120, stock: 35, categorieNom: "Compléments alimentaires" },
  { nom: "Complexe magnésium marin B6", description: "Fatigue, stress, boîte 30 comprimés", prix: 135, stock: 30, categorieNom: "Compléments alimentaires" },
  { nom: "Oméga 3 huile de poisson", description: "90 capsules, santé cardiovasculaire", prix: 165, stock: 25, categorieNom: "Compléments alimentaires" },
  { nom: "Dentifrice sensibilité dents sensibles", description: "Soulagement immédiat, 75ml", prix: 45, stock: 80, categorieNom: "Hygiène bucco-dentaire" },
  { nom: "Bain de bouche sans alcool", description: "Protection quotidienne, 250ml", prix: 58, stock: 60, categorieNom: "Hygiène bucco-dentaire" },
  { nom: "Lait de toilette bébé", description: "Peau délicate, sans parfum, 500ml", prix: 68, stock: 45, categorieNom: "Bébé & Maman" },
  { nom: "Crème change bébé", description: "Protection érythème fessier, 100ml", prix: 52, stock: 50, categorieNom: "Bébé & Maman" },
  { nom: "Crème solaire SPF50+ visage", description: "Très haute protection, 50ml", prix: 145, stock: 40, categorieNom: "Solaire" },
  { nom: "Spray solaire corps SPF30", description: "Résistant à l'eau, 200ml", prix: 130, stock: 35, categorieNom: "Solaire" },
  { nom: "Soin d'hygiène intime apaisant", description: "pH physiologique, 200ml", prix: 62, stock: 40, categorieNom: "Hygiène intime" },
  { nom: "Lingettes hygiène intime", description: "Usage quotidien, paquet de 15", prix: 35, stock: 60, categorieNom: "Hygiène intime" },
];

// Retrouve (ou crée si absente) chaque catégorie référencée, et renvoie une
// Map nom -> _id réel (ObjectId) à utiliser comme categorieId des produits.
const resoudreCategories = async () => {
  const map = new Map();

  for (const cat of categoriesReferencees) {
    let doc = await Categorie.findOne({ nom: cat.nom });
    if (!doc) {
      doc = await Categorie.create({
        nom: cat.nom,
        description: cat.description,
        slug: cat.slug,
      });
      console.log(`   ➕ Catégorie créée: ${cat.nom} (${doc._id})`);
    }
    map.set(cat.nom, doc._id);
  }

  return map;
};

// Fonction principale de seeding
const seedDatabase = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    console.log('🔎 Résolution des catégories...');
    const categorieIdParNom = await resoudreCategories();

    // Supprimer les anciens produits
    await Produit.deleteMany({});
    console.log('🗑️  Anciens produits supprimés');

    // Construire les produits avec le vrai categorieId (ObjectId) résolu par nom
    const produits = produitsData.map(({ categorieNom, ...p }) => ({
      ...p,
      categorieId: categorieIdParNom.get(categorieNom),
      actif: true,
    }));

    const result = await Produit.insertMany(produits);

    console.log(`✅ ${result.length} produits créés avec succès!`);
    console.log('\n📦 Exemples de produits créés:');
    result.slice(0, 3).forEach((p, i) => {
      console.log(`\n${i + 1}. ${p.nom}`);
      console.log(`   Prix: ${p.prix} DH`);
      console.log(`   Stock: ${p.stock}`);
      console.log(`   Catégorie (ObjectId): ${p.categorieId}`);
      console.log(`   Description: ${p.description}`);
    });

  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
  } finally {
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('\n🔒 Connexion MongoDB fermée');
    process.exit(0);
  }
};

// Exécuter le seeder
seedDatabase();
