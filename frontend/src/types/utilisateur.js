/**
 * @typedef {Object} UtilisateurAdmin
 * @property {string} id
 * @property {string} nom
 * @property {string} email
 * @property {"admin"} role
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} token
 * @property {UtilisateurAdmin} utilisateur
 */

/**
 * @typedef {Object} JWTPayload
 * @property {string} id
 * @property {string} email
 * @property {"admin"} role
 * @property {number} iat
 * @property {number} exp
 */
