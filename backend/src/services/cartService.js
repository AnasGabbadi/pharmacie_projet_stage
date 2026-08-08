import Cart from "../models/cartModel.js"; 
import Produit from "../models/Produit.model.js";

const cartService = {
  // Récupérer le panier actif
  getActiveCartForUser: async ({ userId, populateProduct = false }) => {
    try {
      let query = Cart.findOne({ userId, status: "active" });

      if (populateProduct) {
        query = query.populate("items.product");
      }

      let cart = await query;

      if (!cart) {
        cart = await Cart.create({
          userId,
          items: [],
          totalAmount: 0,
          status: "active",
        });
      }

      return cart;
    } catch (error) {
      console.error("Erreur getActiveCartForUser:", error);
      throw error;
    }
  },

  // Ajouter un produit au panier
  addItemToCart: async ({ userId, productId, quantity }) => {
    try {
      const product = await Produit.findById(productId);

      if (!product) {
        return {
          data: { message: "Produit introuvable" },
          statusCode: 404,
        };
      }

      if (product.stock < quantity) {
        return {
          data: { message: `Stock insuffisant. Disponible: ${product.stock}` },
          statusCode: 400,
        };
      }

      let cart = await cartService.getActiveCartForUser({ userId });

      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({
          product: productId,
          quantity,
          unitPrice: product.prix,
        });
      }

      cart.totalAmount = cart.items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
      );

      await cart.save();
      await cart.populate("items.product");

      return {
        data: cart,
        statusCode: 200,
      };
    } catch (error) {
      console.error("Erreur addItemToCart:", error);
      throw error;
    }
  },

  // Mettre à jour la quantité
  updateItemInCart: async ({ userId, productId, quantity }) => {
    try {
      let cart = await cartService.getActiveCartForUser({ userId });

      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex === -1) {
        return {
          data: { message: "Produit non trouvé dans le panier" },
          statusCode: 404,
        };
      }

      cart.items[itemIndex].quantity = quantity;

      cart.totalAmount = cart.items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
      );

      await cart.save();
      await cart.populate("items.product");

      return {
        data: cart,
        statusCode: 200,
      };
    } catch (error) {
      console.error("Erreur updateItemInCart:", error);
      throw error;
    }
  },

  // Supprimer un produit
  deleteItemInCart: async ({ userId, productId }) => {
    try {
      let cart = await cartService.getActiveCartForUser({ userId });

      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
      );

      cart.totalAmount = cart.items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
      );

      await cart.save();
      await cart.populate("items.product");

      return {
        data: cart,
        statusCode: 200,
      };
    } catch (error) {
      console.error("Erreur deleteItemInCart:", error);
      throw error;
    }
  },

  // Vider le panier
  clearCart: async ({ userId }) => {
    try {
      let cart = await cartService.getActiveCartForUser({ userId });

      cart.items = [];
      cart.totalAmount = 0;

      await cart.save();

      return {
        data: cart,
        statusCode: 200,
      };
    } catch (error) {
      console.error("Erreur clearCart:", error);
      throw error;
    }
  },
};

export default cartService;