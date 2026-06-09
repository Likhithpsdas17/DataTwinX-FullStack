const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const publicRoutes = require("./routes/publicRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Data TwinX API is running",
    version: "1.0.0",
  });
});

// Mount API routes: /api/auth | /api/documents | /api/share | /api/twins
app.use("/api", routes);

// Public share routes (no authentication)
app.use("/public", publicRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

module.exports = app;
