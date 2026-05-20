import cors from "cors";
import express from "express";
import tarefasRoutes from "./routes/tarefas.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/api/tarefas", tarefasRoutes);

app.use((_req, res) => {
    res.status(404).json({
        error: {
            code: "NOT_FOUND",
            message: "Rota não encontrada",
            details: [],
        },
    });
});

app.use(errorHandler);

export default app;
