import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import inventoryRouter from "./routes/inventory";
import { errorHandler } from "./middleware/errorHandler";
import { inventoryRateLimiter } from "./middleware/rateLimiter";

import cartRouter from "./routes/cart";
import wishlistRouter from "./routes/wishlist";
import orderRouter from "./routes/order";

export function createApp() {
    const app = express();
    const openApiPath = path.resolve(__dirname, "..", "api-docs", "openapi.yaml");
    const openApiDocument = yaml.load(fs.readFileSync(openApiPath, "utf8")) as Record<string, unknown>;

    const allowedOrigins = env.CORS_ORIGINS.split(",").map((o) => o.trim());
    app.use(
        cors({
            origin: allowedOrigins,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true
        })
    );

    app.use(express.json({ limit: "10kb" }));

    app.get("/health", (_req, res) => {
        res.status(200).json({ status: "ok", service: "inventory" });
    });

    // OpenAPI + Swagger UI
    app.get("/docs/openapi.json", (_req, res) => {
        res.status(200).json(openApiDocument);
    });
    app.use(
        "/docs",
        swaggerUi.serve,
        swaggerUi.setup(openApiDocument, {
            explorer: true,
            customSiteTitle: "Monarch Inventory API Docs"
        })
    );

    app.use(inventoryRateLimiter);

    // Routes mounted at root since API Gateway strips service prefixes
    app.use("/", inventoryRouter);
    app.use("/cart", cartRouter);
    app.use("/wishlist", wishlistRouter);
    app.use("/orders", orderRouter);

    app.use((_req, res) => {
        res.status(404).json({ error: "Route not found." });
    });

    app.use(errorHandler);

    return app;
}
