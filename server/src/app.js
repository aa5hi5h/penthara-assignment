import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";

const app = express();

app.use(cors({ origin: env.clientOrigin }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/leaves", leaveRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
