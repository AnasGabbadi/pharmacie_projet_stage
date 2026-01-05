import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.DATABASE_URL;

// Définir le schéma Produit (adapté à votre modèle)
const produitSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String, required: true },
  prix: { type: Number, required: true },
  stock: { type: Number, required: true },
  imageUrl: { type: String },
  categorieId: { type: String },
  actif: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Produit = mongoose.model('Produit', produitSchema);

// Catégories exemple (remplacez par vos vrais IDs de catégories)
const categoriesIds = [
  '694aecaf86a51174d431300c',
  '694aecaf86a51174d431300d',
  '694aecaf86a51174d431300e'
];

// Noms de produits en français
const produitsNoms = [
  'Ordinateur Portable Gaming',
  'Souris Sans Fil Ergonomique',
  'Clavier Mécanique RGB',
  'Écran LED 27 pouces',
  'Casque Audio Bluetooth',
  'Webcam HD 1080p',
  'Tapis de Souris XXL',
  'Microphone USB Studio',
  'Chaise Gaming Professionnelle',
  'Bureau Réglable en Hauteur',
  'Lampe LED de Bureau',
  'Hub USB-C 7 Ports'
];

// Fonction pour générer des produits
const generateProducts = () => {
  const products = [];

  for (let i = 0; i < 12; i++) {
    products.push({
      nom: produitsNoms[i] || faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      prix: faker.number.int({ min: 20, max: 1500 }),
      stock: faker.number.int({ min: 0, max: 100 }),
      imageUrl: `https://picsum.photos/400/400?random=${i}`, // Images placeholder
      categorieId: faker.helpers.arrayElement(categoriesIds),
      actif: faker.datatype.boolean(0.9), // 90% actifs
      createdAt: faker.date.past(),
      updatedAt: new Date()
    });
  }

  return products;
};

// Fonction principale de seeding
const seedDatabase = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Supprimer les anciens produits (optionnel)
    await Produit.deleteMany({});
    console.log('🗑️  Anciens produits supprimés');

    // Générer et insérer les nouveaux produits
    const products = generateProducts();
    await Produit.insertMany(products);
    
    console.log(`✅ ${products.length} produits créés avec succès!`);
    console.log('\n📦 Exemples de produits créés:');
    products.slice(0, 3).forEach((p, i) => {
      console.log(`\n${i + 1}. ${p.nom}`);
      console.log(`   Prix: ${p.prix} DH`);
      console.log(`   Stock: ${p.stock}`);
      console.log(`   Description: ${p.description.substring(0, 50)}...`);
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