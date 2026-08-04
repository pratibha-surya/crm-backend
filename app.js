import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/config/swagger.js";
import apiRouter from "./src/routes/index.js";
import errorHandler from "./src/middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(morgan("dev"));

// Explicit JSON spec endpoint
app.get(["/swagger.json", "/api/swagger.json"], (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Swagger UI configuration for Express 5
app.use(["/docs", "/api/docs"], swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount main API router
app.use("/api/v1", apiRouter);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CRM Backend Running",
    documentation: "/docs"
  });
});

app.use(errorHandler);

export default app;