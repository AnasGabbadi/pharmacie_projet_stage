import utilisateurService from "../services/utilisateurService.js";

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
};

export default utilisateurController;