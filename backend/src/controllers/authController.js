import clientService from "../services/clientService.js";
import utilisateurService from "../services/utilisateurService.js";
import { hashPassword } from "../utils/authUtils.js";

const authController = {
  // POST /api/auth/login ← TOUS les utilisateurs
  login: async (req, res) => {
    try {
      const { email, motDePasse } = req.body;
      const sessionId = req.headers["x-session-id"];

      if (!email || !motDePasse) {
        return res.status(400).json({
          success: false,
          message: "Email et mot de passe requis",
        });
      }

      // 1. Client d'abord
      let result = await clientService.login({ email, motDePasse, sessionId });
      if (result.success) {
        return res.status(result.statusCode).json({
          ...result,
          redirect: "/client/dashboard",
          role: "client"
        });
      }

      // 2. Admin
      result = await utilisateurService.login({ email, motDePasse });
      if (result.success) {
        return res.status(result.statusCode).json({
          ...result,
          redirect: "/admin/dashboard",
          role: "admin"
        });
      }

      res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    } catch (error) {
      console.error("Erreur login:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },

  // POST /api/auth/register ← UNIQUEMENT CLIENTS
  register: async (req, res) => {
  try {
    console.log("🔥 authController.register START");
    console.log("📥 Body reçu:", req.body);
    
    const { nom, prenom, email, telephone, motDePasse, adresse } = req.body;
    const sessionId = req.headers["x-session-id"];

    // ✅ Validation renforcée
    if (!nom?.trim() || !prenom?.trim() || !email?.trim() || !telephone?.trim() || !motDePasse) {
      console.log("❌ Validation échouée:", { nom, prenom, email, telephone, motDePasse: !!motDePasse });
      return res.status(400).json({
        success: false,
        message: "Champs obligatoires manquants",
      });
    }

    if (motDePasse.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Mot de passe trop court (min 8)",
      });
    }

    console.log("✅ Validation OK → clientService.register");
    
    // ✅ APPEL service
    const result = await clientService.register({
      nom: nom.trim(),
      prenom: prenom.trim(),
      email: email.trim(),
      telephone: telephone.trim(),
      motDePasse,
      adresse,
      sessionId
    });

    console.log("✅ clientService result:", result);

    // ✅ Réponse
    return res.status(result.statusCode).json(result);
    
  } catch (error) {
    console.error("💥 authController.register CRASH:", error);
    console.error("Stack:", error.stack);
    res.status(500).json({ 
      success: false, 
      message: "Erreur création compte",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
},

  // GET /api/auth/me ← TOUS (protégé par rôle)
  getProfile: async (req, res) => {
    try {
      console.log("🔍 authController.getProfile - Role:", req.user.role, "ID:", req.user.id);
      
      let result;

      if (req.user.role === "client") {
        result = await clientService.getProfile(req.user.id);
      } else if (req.user.role === "admin") {
        result = await utilisateurService.getById(req.user.id);
      } else {
        return res.status(403).json({
          success: false,
          statusCode: 403,
          message: "Rôle non autorisé",
        });
      }

      // ✅ Vérifie format uniforme
      if (result.success) {
        console.log("✅ Profil OK:", result.data);
        return res.status(result.statusCode || 200).json(result);
      } else {
        console.log("❌ Profil KO:", result.message);
        return res.status(result.statusCode || 404).json(result);
      }
    } catch (error) {
      console.error("❌ getProfile ERROR:", error);
      res.status(500).json({ 
        success: false, 
        statusCode: 500, 
        message: "Erreur serveur" 
      });
    }
  },

  // PUT /api/auth/me ← TOUS (protégé par rôle)
    updateProfile: async (req, res) => {
        try {
            const updateData = req.body;
            
            let result;
            
            if (req.user.role === "client") {
            result = await clientService.update(req.user.id, updateData); // ✅ Maintenant ça marche !
            } else if (req.user.role === "admin") {
            result = await utilisateurService.update(req.user.id, updateData);
            } else {
            return res.status(403).json({
                success: false,
                message: "Rôle non autorisé",
            });
            }
            
            res.status(result.statusCode).json(result); // ✅ Uniformisé
        } catch (error) {
            console.error("Erreur update:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    },

  // PUT /api/auth/password ← TOUS (protégé)
  updatePassword: async (req, res) => {
    try {
      const { ancienMotDePasse, nouveauMotDePasse } = req.body;

      if (!ancienMotDePasse || !nouveauMotDePasse) {
        return res.status(400).json({
          success: false,
          message: "Champs requis",
        });
      }

      if (req.user.role === "client") {
        const isValid = await clientService.verifyPassword(req.user.id, ancienMotDePasse);
        if (!isValid) {
            return res.status(400).json({ success: false, message: "Ancien mot de passe incorrect" });
        }
        const motDePasseHash = await hashPassword(nouveauMotDePasse);
        await clientService.update(req.user.id, { motDePasseHash });
        return res.status(200).json({ success: true, message: "Mot de passe modifié" });
      } else if (req.user.role === "admin") {
        const isValid = await utilisateurService.verifyPassword(
          req.user.id, ancienMotDePasse
        );
        
        if (!isValid) {
          return res.status(400).json({
            success: false,
            message: "Ancien mot de passe incorrect",
          });
        }

        const motDePasseHash = await hashPassword(nouveauMotDePasse);
        const result = await utilisateurService.update(req.user.id, { motDePasseHash });
        res.status(200).json({ 
          success: true, 
          message: "Mot de passe modifié" 
        });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },
};

export default authController;