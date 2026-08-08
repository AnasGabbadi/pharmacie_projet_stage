import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminController from "../controllers/adminController.js";
import requireRole from "../middleware/roleAuth.js";

const router = express.Router();

// ✅ Users (Admin only)
router.get('/users', authMiddleware, requireRole(['admin']), adminController.getUsers);
router.post('/users', authMiddleware, requireRole(['admin']), adminController.createManager);
router.delete('/users/:id', authMiddleware, requireRole(['admin']), adminController.deleteUser);
router.put('/users/:id', authMiddleware, requireRole(['admin']), adminController.updateUser);

// ✅ Clients (Admin + Manager)
router.get('/clients', authMiddleware, requireRole(['admin', 'manager']), adminController.getClients);
router.delete('/clients/:id', authMiddleware, requireRole(['admin', 'manager']), adminController.deleteClient);

export default router;
