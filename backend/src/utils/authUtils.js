import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const hashPassword = (password) => bcrypt.hash(password, 12);
export const verifyPassword = (password, hash) => bcrypt.compare(password, hash);
export const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });

export const transferCart = async (sessionId, userId) => {
  const cartModel = await import("../models/cartModel.js");
  await cartModel.default.updateOne(
    { userId: sessionId, status: "active" },
    { userId: userId.toString(), clientId: userId }
  );
};