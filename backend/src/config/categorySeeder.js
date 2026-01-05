import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.DATABASE_URL;

// Schéma Catégorie
const categorieSchema = new mongoose.Schema({
  nom: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String },
  imageUrl: { type: String },
  actif: { type: Boolean, default: true },
  ordre: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Categorie = mongoose.model('Categorie', categorieSchema);

// 12 catégories de parapharmacie
const categories = [
  {
    nom: 'Visage',
    description: 'Soins du visage, crèmes hydratantes, nettoyants et sérums pour tous types de peau',
    slug: 'visage',
    ordre: 1,
    actif: true
  },
  {
    nom: 'Maquillage',
    description: 'Fond de teint, rouge à lèvres, mascara et tous vos produits de maquillage',
    slug: 'maquillage',
    ordre: 2,
    actif: true
  },
  {
    nom: 'Corps',
    description: 'Soins corporels, crèmes hydratantes, gommages et huiles pour le corps',
    slug: 'corps',
    ordre: 3,
    actif: true
  },
  {
    nom: 'Cheveux',
    description: 'Shampooings, après-shampooings, masques capillaires et soins professionnels',
    slug: 'cheveux',
    ordre: 4,
    actif: true
  },
  {
    nom: 'Bébé & Maman',
    description: 'Produits pour bébés et futures mamans, couches, laits infantiles et accessoires',
    slug: 'bebe-maman',
    ordre: 5,
    actif: true
  },
  {
    nom: 'Homme',
    description: 'Soins spécifiques pour hommes, rasage, après-rasage et parfums masculins',
    slug: 'homme',
    ordre: 6,
    actif: true
  },
  {
    nom: 'Hygiène',
    description: 'Produits d\'hygiène quotidienne, déodorants, gels douche et savons',
    slug: 'hygiene',
    ordre: 7,
    actif: true
  },
  {
    nom: 'Solaire',
    description: 'Protection solaire, crèmes SPF, après-soleil et auto-bronzants',
    slug: 'solaire',
    ordre: 8,
    actif: true
  },
  {
    nom: 'Santé',
    description: 'Compléments alimentaires, vitamines, médicaments sans ordonnance et dispositifs médicaux',
    slug: 'sante',
    ordre: 9,
    actif: true
  },
  {
    nom: 'Para-médical',
    description: 'Matériel médical, orthopédie, bandages et équipements de santé',
    slug: 'paramedical',
    ordre: 10,
    actif: true
  },
  {
    nom: 'Bio',
    description: 'Produits biologiques et naturels certifiés pour toute la famille',
    slug: 'bio',
    ordre: 11,
    actif: true
  },
  {
    nom: 'Promotion',
    description: 'Offres spéciales, promotions et produits en solde',
    slug: 'promotion',
    ordre: 12,
    actif: true
  }
];

// Fonction principale de seeding
const seedCategories = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Supprimer les anciennes catégories (optionnel)
    await Categorie.deleteMany({});
    console.log('🗑️  Anciennes catégories supprimées');

    // Insérer les nouvelles catégories
    const result = await Categorie.insertMany(categories);
    
    console.log(`\n✅ ${result.length} catégories créées avec succès!\n`);
    
    // Afficher toutes les catégories créées
    console.log('📋 Liste des catégories créées:\n');
    result.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.icon} ${cat.nom}`);
      console.log(`   Slug: ${cat.slug}`);
      console.log(`   ID: ${cat._id}`);
      console.log(`   Description: ${cat.description.substring(0, 60)}...`);
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