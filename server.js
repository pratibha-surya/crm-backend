import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app.js";
import connectDB from "./src/config/db.js";
import { startReminderScheduler } from "./src/utils/reminderScheduler.js";
import { initSocket } from "./src/config/socket.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  startReminderScheduler();

  const server = http.createServer(app);
  initSocket(server);

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 CRM Backend Live Server Running on http://localhost:${PORT}`);
    console.log(`📡 Network Access: http://192.168.1.2:${PORT}`);
    console.log(`📖 Swagger API Docs available at http://localhost:${PORT}/docs`);
    console.log(`📖 Swagger API Docs alternative endpoint at http://localhost:${PORT}/api/docs`);
  });
};

startServer();