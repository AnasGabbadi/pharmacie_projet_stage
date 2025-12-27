/**
 * @typedef {Object} AuthState
 * @property {string | null} token
 * @property {import("./utilisateur").UtilisateurAdmin | null} user
 */

/**
 * @typedef {Object} AuthContextValue
 * @property {AuthState} state
 * @property {(data: import("./utilisateur").AuthResponse) => void} login
 * @property {() => void} logout
 */

/**
 * @typedef {Object} CartContextValue
 * @property {import("./panier").PanierClient} panier
 * @property {(item: import("./panier").LignePanierClient) => void} addItem
 * @property {(produitId: string, quantite: number) => void} updateQuantity
 * @property {(produitId: string) => void} removeItem
 * @property {() => void} clearCart
 * @property {number} total
 */