import mongoose from "mongoose";

const connecterDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    console.log(`MongoDB connecté: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erreur MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connecterDB;