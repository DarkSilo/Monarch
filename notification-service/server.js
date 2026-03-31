require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const yaml = require("js-yaml");
const swaggerUi = require("swagger-ui-express");
const app = express();
const PORT = process.env.PORT || 5005;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  "mongodb://localhost:27017/it4020_notifications";
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

function loadOpenApi() {
  const specPath = path.join(__dirname, "api-docs", "openapi.yaml");
  const raw = fs.readFileSync(specPath, "utf8");
  return yaml.load(raw) || {};
}

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, default: "generic" },
    status: { type: String, enum: ["unread", "read"], default: "unread" },
    readAt: { type: Date, default: null }
  },
  { timestamps: true }
);
const Notification = mongoose.model("Notification", notificationSchema);

const openApiDocument = loadOpenApi();

app.get("/docs/openapi.json", (_req, res) => {
  res.status(200).json(openApiDocument);
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument, {
  explorer: true,
  customSiteTitle: "Monarch Notification API Docs",
}));

app.get("/health", (_req, res) => res.json({ ok: true, service: "notification-service" }));
app.get("/health/notifications", (_req, res) => res.json({ ok: true, service: "notification-service" }));

const notificationRouter = express.Router();

notificationRouter.post("/", async (req, res) => {
  try {
    const { userId, title, message, type } = req.body;
    if (!userId || !title || !message) {
      return res.status(400).json({ message: "userId, title, message required" });
    }
    const data = await Notification.create({ userId, title, message, type: type || "generic" });
    res.status(201).json(data);
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
});

notificationRouter.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId query param is required" });
    const list = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
});

notificationRouter.patch("/:id/read", async (req, res) => {
  try {
    const item = await Notification.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Notification not found" });
    item.status = "read";
    item.readAt = new Date();
    await item.save();
    res.json(item);
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Supports both direct service calls (/notifications/...) and gateway-stripped calls (/...)
app.use("/notifications", notificationRouter);
app.use("/", notificationRouter);

mongoose.connect(MONGODB_URI).then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () => console.log("Running on http://localhost:" + PORT));
}).catch((err) => {
  console.error("MongoDB connection failed:", err.message);
  process.exit(1);
});
