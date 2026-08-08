import cartService from "../services/cartService.js";

const getUserId = (req) => {
  if (req.user?.id || req.user?._id) {
    return (req.user.id || req.user._id).toString();
  }
  const guestId = req.get('X-Guest-Id');
  if (guestId) return guestId;

  return null;
};

const cartController = {
  // GET /cart - Récupérer le panier (Guest + Client)
  getCart: async (req, res) => {
    try {
      console.log("🔍 getCart headers:", {
        token: !!req.user,
        'x-guest-id': req.get('X-Guest-Id'),
      });
      
      let userId = req.user?.id || req.user?._id || req.get('X-Guest-Id');
      if (!userId) {
        userId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }
      
      console.log("🆔 getCart userId:", userId);
      
      const cart = await cartService.getActiveCartForUser({
        userId: userId.toString(),
        populateProduct: true,
      });
      
      console.log("🛒 getCart retour:", !!cart, cart?.items?.length || 0);
      
      res.status(200).json({ 
        success: true, 
        data: cart || { items: [], totalAmount: 0, status: 'active' } 
      });
    } catch (error) {
      console.error("💥 getCart CRASH:", error.stack);
      res.status(500).json({ 
        success: false, 
        message: "Erreur serveur panier",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // POST /cart/items - Ajouter un produit (Guest + Client)
  addItem: async (req, res) => {
    try {
      const userId = getUserId(req);

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "Identifiant requis. Envoyez X-Guest-Id en header pour les guests." 
      });
    }

      const { productId, quantity } = req.body;

      if (!productId || !quantity || quantity < 1) {
        return res.status(400).json({ success: false, message: "Données invalides" });
      }

      // ✅ FIX : Vérifie produit AVANT cartService
      const Product = (await import('../models/Produit.model.js')).default;
      const product = await Product.findOne({ _id: productId }).lean();
      
      if (!product) {
        console.error("❌ Produit introuvable:", productId);
        return res.status(404).json({ 
          success: false, 
          message: `Produit ${productId} introuvable` 
        });
      }

      console.log("✅ Produit OK:", product.nom, product.prix, "DH");
      
      const result = await cartService.addItemToCart({
        userId: userId.toString(),
        productId,
        quantity: parseInt(quantity),
      });

      res.status(result.statusCode).json({
        success: result.statusCode === 200,
        data: result.data,
      });
    } catch (error) {
      console.error("❌ ERREUR 500:", error.message);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },

  // PUT /cart/items/:productId - Modifier quantité (Guest + Client)
  updateItem: async (req, res) => {
    try {
      // ✅ Guest OU Client
      let userId = req.user?.id || req.user?._id;
      if (!userId) {
        userId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }

      const { productId } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Quantité invalide",
        });
      }

      const result = await cartService.updateItemInCart({
        userId: userId.toString(),
        productId,
        quantity: parseInt(quantity),
      });

      res.status(result.statusCode).json({
        success: result.statusCode === 200,
        data: result.data,
      });
    } catch (error) {
      console.error("❌ Erreur mise à jour panier:", error);
      res.status(500).json({
        success: false,
        message: "Erreur serveur",
      });
    }
  },

  // DELETE /cart/items/:productId - Supprimer produit (Guest + Client)
  deleteItem: async (req, res) => {
    try {
      // ✅ Guest OU Client
      let userId = req.user?.id || req.user?._id;
      if (!userId) {
        userId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }

      const { productId } = req.params;

      const result = await cartService.deleteItemInCart({
        userId: userId.toString(),
        productId,
      });

      res.status(result.statusCode).json({
        success: result.statusCode === 200,
        data: result.data,
      });
    } catch (error) {
      console.error("❌ Erreur suppression produit:", error);
      res.status(500).json({
        success: false,
        message: "Erreur serveur",
      });
    }
  },

  // DELETE /cart - Vider panier (Guest + Client)
  clearCart: async (req, res) => {
    try {
      // ✅ Guest OU Client
      let userId = req.user?.id || req.user?._id;
      if (!userId) {
        userId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }

      const result = await cartService.clearCart({
        userId: userId.toString(),
      });

      res.status(result.statusCode).json({
        success: true,
        data: result.data,
      });
    } catch (error) {
      console.error("❌ Erreur vidage panier:", error);
      res.status(500).json({
        success: false,
        message: "Erreur serveur",
      });
    }
  },

  // POST /cart/checkout - Passer commande (Client UNIQUEMENT)
  checkout: async (req, res) => {
    try {
      const userId = req.user?.id || req.user?._id;
      const { adresse } = req.body;

      // ✅ Checkout = Client AUTH requise
      if (!userId || !req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentification client requise pour commander",
        });
      }

      const clientData = {
        clientId: userId,
        nom: req.user.nom,
        prenom: req.user.prenom || "",
        email: req.user.email,
        telephone: req.user.telephone || "",
        adresse: adresse,
      };

      // TODO: Implémenter cartService.checkout()
      const result = {
        statusCode: 201,
        data: { 
          message: "Commande créée (TODO: implémenter checkout)",
          orderId: `CMD_${Date.now()}`
        }
      };

      res.status(result.statusCode).json({
        success: true,
        data: result.data,
      });
    } catch (error) {
      console.error("❌ Erreur checkout:", error);
      res.status(500).json({
        success: false,
        message: "Erreur serveur",
      });
    }
  },
};

export default cartController;