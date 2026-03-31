const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const swaggerUi = require("swagger-ui-express");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8084;

// Middleware
app.use(cors());
app.use(express.json());

const openApiPath = path.resolve(__dirname, "..", "api-docs", "openapi.yaml");
const swaggerDocs = yaml.load(fs.readFileSync(openApiPath, "utf8")) || {};
app.get("/docs/openapi.json", (_req, res) => {
  res.status(200).json(swaggerDocs);
});
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "orders" });
});
app.get("/health/orders", (_req, res) => {
  res.status(200).json({ status: "ok", service: "orders" });
});
app.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
  explorer: true,
  customSiteTitle: "Monarch Order API Docs",
}));

// Routes
const orderRoutes = require("./Routes/order.routes");
// Support both direct calls (/orders) and gateway path-rewrite style (/) mounting.
app.use("/orders", orderRoutes);
app.use("/", orderRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Monarch Order Service running on port ${PORT}`);
      console.log(`Swagger UI: http://localhost:${PORT}/docs`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
