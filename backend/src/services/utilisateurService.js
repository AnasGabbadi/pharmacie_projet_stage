import Utilisateur from "../models/Utilisateur.model.js";
import { hashPassword, verifyPassword, generateToken } from "../utils/authUtils.js";

const utilisateurService = {
  async findByEmail(email) {
    return await Utilisateur.findOne({ email }).select("+motDePasseHash");
  },

  async register({ nom, email, motDePasse }) {
    const existing = await Utilisateur.findOne({ email });
    if (existing) {
      return { success: false, statusCode: 400, message: "Cet utilisateur existe déjà." };
    }

    const motDePasseHash = await hashPassword(motDePasse);

    const user = await Utilisateur.create({
      nom,
      email,
      motDePasseHash,
      role: "admin"
    });

    const token = generateToken({ id: user._id, role: user.role, email });

    return {
      success: true,
      statusCode: 201,
      data: {
        token,
        utilisateur: {
          id: user._id,
          nom: user.nom,
          email: user.email,
          role: user.role,
        },
      },
    };
  },

  async login({ email, motDePasse }) {
    const user = await this.findByEmail(email);
    if (!user || !(await verifyPassword(motDePasse, user.motDePasseHash))) {
      return { success: false, statusCode: 401, message: "Email ou mot de passe incorrect." };
    }

    const token = generateToken({ id: user._id.toString(), role: user.role, email });

    return {
      success: true,
      statusCode: 200,
      data: {
        token,
        utilisateur: {
          id: user._id.toString(),
          nom: user.nom,
          email: user.email,
          role: user.role,
        },
      },
    };
  },

  async getById(id) {
    try {
      console.log("🔍 utilisateurService.getById:", id);
      
      const user = await Utilisateur.findById(id).select("-motDePasseHash").lean();
      
      if (!user) {
        return { 
          success: false, 
          statusCode: 404, 
          message: "Admin non trouvé" 
        };
      }
      
      console.log("✅ Admin profil:", { nom: user.nom, email: user.email });
      
      return {
        success: true,
        statusCode: 200,
        data: {
          _id: user._id,
          nom: user.nom,
          email: user.email,
          role: user.role || "admin"
        }
      };
    } catch (error) {
      console.error("❌ utilisateurService.getById ERROR:", error);
      return {
        success: false,
        statusCode: 500,
        message: "Erreur serveur"
      };
    }
  },

  async update(id, data) {
    try {
      if (data.email) {
        const existing = await Utilisateur.findOne({ 
          email: data.email, 
          _id: { $ne: id }
        });
        if (existing) {
          return { 
            success: false, 
            statusCode: 400, 
            message: "Email déjà utilisé" 
          };
        }
      }
      
      const user = await Utilisateur.findByIdAndUpdate(
        id,
        { $set: data },
        { 
          new: true, 
          runValidators: true,
          context: 'query' 
        }
      ).select("-motDePasseHash");
      
      if (!user) {
        return { 
          success: false, 
          statusCode: 404, 
          message: "Admin non trouvé" 
        };
      }
      
      return { 
        success: true, 
        statusCode: 200, 
        data: user 
      };
    } catch (error) {
      console.error("❌ utilisateurService.update ERROR:", error.message);
      return { 
        success: false, 
        statusCode: 400, 
        message: error.message || "Erreur mise à jour" 
      };
    }
  },

  async verifyPassword(id, motDePasse) {
    const user = await Utilisateur.findById(id).select("+motDePasseHash");
    return user ? await verifyPassword(motDePasse, user.motDePasseHash) : false;
  },

  // ✅ LISTE tous les utilisateurs (admin only)
  async getAll(page = 1, limit = 10, search = "") {
    try {
      const query = search 
        ? { nom: { $regex: search, $options: 'i' } }
        : {};
      
      const users = await Utilisateur.find(query)
        .select('-motDePasseHash')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
      
      const total = await Utilisateur.countDocuments(query);
      
      return {
        success: true,
        statusCode: 200,
        data: {
          users,
          pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        }
      };
    } catch (error) {
      return { success: false, statusCode: 500, message: "Erreur liste" };
    }
  },

  // ✅ CRÉER manager (admin only)
  async createManager({ nom, email, motDePasse }) {
    const existing = await Utilisateur.findOne({ email });
    if (existing) {
      return { success: false, statusCode: 400, message: "Email existe déjà" };
    }

    const motDePasseHash = await hashPassword(motDePasse);
    const user = await Utilisateur.create({
      nom, email, motDePasseHash, role: "manager"
    });

    return {
      success: true,
      statusCode: 201,
      data: {
        id: user._id,
        nom: user.nom,
        email: user.email,
        role: user.role
      }
    };
  },

  // ✅ SUPPRIMER (admin only)
  async delete(id) {
    const user = await Utilisateur.findByIdAndDelete(id);
    if (!user) {
      return { success: false, statusCode: 404, message: "Utilisateur non trouvé" };
    }
    return { success: true, statusCode: 200, message: "Supprimé" };
  }
};

export default utilisateurService;