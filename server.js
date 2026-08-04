import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 CRM Backend Live Server Running on http://localhost:${PORT}`);
    console.log(`📖 Swagger API Docs available at http://localhost:${PORT}/docs`);
    console.log(`📖 Swagger API Docs alternative endpoint at http://localhost:${PORT}/api/docs`);
  });
};

startServer();