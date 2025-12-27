import utilisateurService from "../services/utilisateurService.js";
import bcrypt from "bcrypt";
import Utilisateur from "../models/Utilisateur.model.js";

const utilisateurController = {
  register: async (req, res) => {
    try {
      const { nom, email, motDePasse } = req.body;

      const { statusCode, data } = await utilisateurService.register({
        nom,
        email,
        motDePasse,
      });

      return res.status(statusCode).json(data);
    } catch (error) {
      console.error("Erreur register:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  login: async (req, res) => {
    try {
      const { email, motDePasse } = req.body;

      const { statusCode, data } = await utilisateurService.login({
        email,
        motDePasse,
      });

      return res.status(statusCode).json(data);
    } catch (error) {
      console.error("Erreur login:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // ✅ GET profil de l'utilisateur connecté
  getProfil: async (req, res) => {
    try {
      const user = await utilisateurService.getUtilisateurById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // ✅ PUT modifier profil (nom, email)
  updateProfil: async (req, res) => {
    try {
        const { nom, email } = req.body;

        if (!nom || !email) {
        return res.status(400).json({ message: "Nom et email requis" });
        }

        // ✅ Récupérer l'utilisateur actuel
        const currentUser = await Utilisateur.findById(req.user.id);
        if (!currentUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // ✅ Vérifier uniquement si l'email a changé
        if (email !== currentUser.email) {
        const existingUser = await Utilisateur.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Cet email est déjà utilisé" });
        }
        }

        const updated = await utilisateurService.updateUtilisateur(req.user.id, {
        nom,
        email,
        });

        if (!updated) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.status(200).json(updated);
    } catch (err) {
        console.error("Erreur updateProfil:", err);
        res.status(400).json({ message: err.message });
    }
    },

  // ✅ PUT changer mot de passe
  updatePassword: async (req, res) => {
    try {
      const { ancienMotDePasse, nouveauMotDePasse } = req.body;

      if (!ancienMotDePasse || !nouveauMotDePasse) {
        return res.status(400).json({
          message: "Ancien et nouveau mot de passe requis",
        });
      }

      // Vérifier l'ancien mot de passe
      const isValid = await utilisateurService.verifyPassword(
        req.user.id,
        ancienMotDePasse
      );

      if (!isValid) {
        return res.status(400).json({
          message: "Ancien mot de passe incorrect",
        });
      }

      // Hasher le nouveau mot de passe
      const motDePasseHash = await bcrypt.hash(nouveauMotDePasse, 10);

      await utilisateurService.updateUtilisateur(req.user.id, {
        motDePasseHash,
      });

      res.status(200).json({ message: "Mot de passe modifié avec succès" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};

export default utilisateurController;