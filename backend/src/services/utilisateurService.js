import Utilisateur from "../models/Utilisateur.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateJWT = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET || "dev-secret", {
    expiresIn: "7d",
    });
};

const utilisateurService = {
    async register({ nom, email, motDePasse }) {
    const existing = await Utilisateur.findOne({ email });
    if (existing) {
        return { statusCode: 400, data: "Cet utilisateur existe déjà." };
    }

    const motDePasseHash = await bcrypt.hash(motDePasse, 10);

    const user = await Utilisateur.create({
        nom,
        email,
        motDePasseHash,
    });

    const token = generateJWT({ id: user._id, role: user.role, email });

    return {
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

    // Login admin
    async login({ email, motDePasse }) {
    const user = await Utilisateur.findOne({ email }).select(
        "+motDePasseHash"
    );

    if (!user) {
        return {
        statusCode: 400,
        data: "Email ou mot de passe incorrect.",
        };
    }

    const passwordMatch = await bcrypt.compare(motDePasse, user.motDePasseHash);
    if (!passwordMatch) {
        return {
        statusCode: 400,
        data: "Email ou mot de passe incorrect.",
        };
    }

    const token = generateJWT({ id: user._id, role: user.role, email });

    return {
        statusCode: 200,
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
};

export default utilisateurService;