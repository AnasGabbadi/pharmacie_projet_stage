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

  // ✅ Whitelist stricte : seuls ces champs sont modifiables via PUT /api/auth/me
  // (évite un mass assignment sur role/adresses/motDePasseHash/etc. si le body
  // contient des champs supplémentaires — ils sont silencieusement ignorés).
  async update(id, data) {
    const allowedFields = ["nom", "prenom", "email", "telephone"];
    const sanitized = {};
    for (const field of allowedFields) {
      if (data[field] !== undefined) sanitized[field] = data[field];
    }

    const client = await Client.findByIdAndUpdate(
      id,
      { $set: sanitized },
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

  // Changement de mot de passe — canal séparé de update(), non exposé au
  // mass assignment (le hash n'est jamais accepté depuis un body client).
  async updatePasswordHash(id, motDePasseHash) {
    const client = await Client.findByIdAndUpdate(
      id,
      { $set: { motDePasseHash } },
      { new: true }
    ).select("-motDePasseHash");

    return client
      ? { success: true, statusCode: 200 }
      : { success: false, statusCode: 404, message: "Client introuvable" };
  },

  async listAddresses(clientId) {
    const client = await Client.findById(clientId).select("adresses");
    if (!client) return { success: false, statusCode: 404, message: "Client introuvable" };
    return { success: true, statusCode: 200, data: client.adresses };
  },

  async addAddress(clientId, { rue, ville, codePostal, pays, estPrincipale }) {
    if (!rue?.trim() || !ville?.trim()) {
      return { success: false, statusCode: 400, message: "Rue et ville sont obligatoires" };
    }

    const client = await Client.findById(clientId);
    if (!client) return { success: false, statusCode: 404, message: "Client introuvable" };

    const estPremiereAdresse = client.adresses.length === 0;
    const nouvelleAdresse = {
      rue: rue.trim(),
      ville: ville.trim(),
      codePostal: codePostal?.trim() || "",
      pays: pays?.trim() || "Maroc",
      // La toute première adresse devient automatiquement principale, même
      // sans demande explicite — sinon on respecte estPrincipale demandé.
      estPrincipale: estPremiereAdresse ? true : !!estPrincipale,
    };

    if (nouvelleAdresse.estPrincipale) {
      client.adresses.forEach((a) => { a.estPrincipale = false; });
    }

    client.adresses.push(nouvelleAdresse);
    await client.save();

    return { success: true, statusCode: 201, data: client.adresses };
  },

  async updateAddress(clientId, addressId, { rue, ville, codePostal, pays, estPrincipale }) {
    const client = await Client.findById(clientId);
    if (!client) return { success: false, statusCode: 404, message: "Client introuvable" };

    const adresse = client.adresses.id(addressId);
    if (!adresse) return { success: false, statusCode: 404, message: "Adresse introuvable" };

    if (rue !== undefined) {
      if (!rue.trim()) return { success: false, statusCode: 400, message: "La rue ne peut pas être vide" };
      adresse.rue = rue.trim();
    }
    if (ville !== undefined) {
      if (!ville.trim()) return { success: false, statusCode: 400, message: "La ville ne peut pas être vide" };
      adresse.ville = ville.trim();
    }
    if (codePostal !== undefined) adresse.codePostal = codePostal.trim();
    if (pays !== undefined) adresse.pays = pays.trim() || "Maroc";

    if (estPrincipale === true) {
      client.adresses.forEach((a) => { a.estPrincipale = a._id.equals(adresse._id); });
    } else if (estPrincipale === false) {
      adresse.estPrincipale = false;
    }

    await client.save();
    return { success: true, statusCode: 200, data: client.adresses };
  },

  async deleteAddress(clientId, addressId) {
    const client = await Client.findById(clientId);
    if (!client) return { success: false, statusCode: 404, message: "Client introuvable" };

    const adresse = client.adresses.id(addressId);
    if (!adresse) return { success: false, statusCode: 404, message: "Adresse introuvable" };

    client.adresses.pull(addressId);
    await client.save();

    return { success: true, statusCode: 200, data: client.adresses };
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