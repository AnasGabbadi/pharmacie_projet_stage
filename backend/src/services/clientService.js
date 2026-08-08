import Client from "../models/Client.model.js";
import { hashPassword, verifyPassword, generateToken, transferCart } from "../utils/authUtils.js";

const clientService = {
  async findByEmail(email) {
    return await Client.findOne({ email, actif: true }).select("+motDePasseHash");
  },

  async verifyPassword(id, motDePasse) {
    const client = await Client.findById(id).select("+motDePasseHash");
    return client ? await verifyPassword(motDePasse, client.motDePasseHash) : false;
  }, 

  async register({ nom, prenom, email, telephone, motDePasse, adresse, sessionId }) {
    try {
      console.log("🔄 clientService.register:", { nom, prenom, email, telephone });
      
      // ✅ Vérifie email existant
      const existing = await Client.findOne({ email });
      if (existing) {
        return { 
          success: false, 
          statusCode: 400, 
          message: "Cet email est déjà utilisé" 
        };
      }

      // ✅ Hash mot de passe
      const motDePasseHash = await hashPassword(motDePasse);

      // ✅ Adresse formatée
      const adresses = adresse && (adresse.rue || adresse.ville) ? [{
        rue: adresse.rue || "",
        ville: adresse.ville || "",
        codePostal: adresse.codePostal || "",
        pays: adresse.pays || "Maroc",
        estPrincipale: true,
      }] : [];

      // ✅ Création client
      const client = await Client.create({
        nom,
        prenom,
        email,
        telephone,
        motDePasseHash,
        adresses,
        role: "client",
        actif: true
      });

      console.log("✅ Client créé:", client._id);

      // ✅ Transfer cart si sessionId
      if (sessionId) {
        try {
          await transferCart(sessionId, client._id);
        } catch (cartError) {
          console.log("⚠️ Cart transfer ignoré:", cartError.message);
        }
      }

      // ✅ Token
      const token = generateToken({ id: client._id, role: "client", email });

      return {
        success: true,
        statusCode: 201,
        message: "Compte créé avec succès",
        redirect: "/client/dashboard",
        data: {
          token,
          client: {
            id: client._id,
            nom: client.nom,
            prenom: client.prenom,
            email: client.email,
            telephone: client.telephone,
            adresses: client.adresses,
            role: "client"
          },
        },
      };
    } catch (error) {
      console.error("❌ clientService.register ERROR:", error);
      return { 
        success: false, 
        statusCode: 500, 
        message: "Erreur création compte" 
      };
    }
  },

  async login({ email, motDePasse, sessionId }) {
    console.log("🔍 clientService.login:", email);
    
    const client = await this.findByEmail(email);
    if (!client || !(await verifyPassword(motDePasse, client.motDePasseHash))) {
      console.log("❌ Client login KO:", email);
      return { success: false, statusCode: 401, message: "Email ou mot de passe incorrect" };
    }

    console.log("✅ Client trouvé:", client.nom, client.prenom);

    if (sessionId) await transferCart(sessionId, client._id);

    const token = generateToken({ id: client._id.toString(), role: "client", email });

    return {
      success: true,
      statusCode: 200,
      message: "Connexion réussie",
      redirect: "/client/dashboard",
      data: {
        token,
        client: {
          id: client._id.toString(),
          nom: client.nom,
          prenom: client.prenom,
          email: client.email,
          telephone: client.telephone,
          adresses: client.adresses,
          role: "client"
        },
      },
    };
  },

  async getProfile(clientId) {
    const client = await Client.findById(clientId).select("-motDePasseHash");
    if (!client) {
      return { success: false, statusCode: 404, message: "Client introuvable" };
    }
    return {
      success: true,
      statusCode: 200,
      data: {
        id: client._id,
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
        telephone: client.telephone,
        adresses: client.adresses,
        role: "client"
      }
    };
  },

  async update(id, data) {
    const client = await Client.findByIdAndUpdate(
      id, 
      { $set: data }, 
      { new: true }
    ).select("-motDePasseHash");
    
    return client ? { 
      success: true, 
      statusCode: 200, 
      data: {
        id: client._id,
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
        telephone: client.telephone
      } 
    } : { success: false, statusCode: 404 };
  },

  async getAllClients(page = 1, limit = 10, search = "") {
    try {
      const query = search 
        ? { 
            $or: [
              { nom: { $regex: search, $options: 'i' } },
              { prenom: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } }
            ]
          }
        : { actif: true };

      const clients = await Client.find(query)
        .select('-motDePasseHash')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      const total = await Client.countDocuments(query);

      return {
        success: true,
        statusCode: 200,
        data: {
          clients,
          pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        }
      };
    } catch (error) {
      return { success: false, statusCode: 500, message: "Erreur liste clients" };
    }
  },

  async deleteClient(id) {
    const client = await Client.findByIdAndUpdate(id, { actif: false });
    if (!client) {
      return { success: false, statusCode: 404, message: "Client non trouvé" };
    }
    return { success: true, statusCode: 200, message: "Client désactivé" };
  },
};

export default clientService;