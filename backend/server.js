const express = require("express");
const axios = require("axios");
const cors = require("cors");
const multer = require("multer");
const FormData = require("form-data");
const recommendRoute = require("./routes/recommend");

const app = express();
const PORT = Number(process.env.PORT || 3001);
const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://127.0.0.1:5000";
const FRONTEND_ORIGINS = (process.env.FRONTEND_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const upload = multer({
  limits: { fileSize: Number(process.env.MAX_PDF_BYTES || 25 * 1024 * 1024) },
});

app.use(cors({ origin: FRONTEND_ORIGINS }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "gateway" });
});

app.post("/analyze", upload.single("file"), async (req, res) => {
  try {
    // Check if file is present
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const formData = new FormData();
    formData.append("file", req.file.buffer, "file.pdf");

    const response = await axios.post(
      `${PYTHON_API_URL}/predict`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Analysis proxy error:", error.message);
    const status = error.response?.status === 400 ? 400 : 502;
    res.status(status).json({
      error: status === 400 ? error.response.data?.error || "Invalid paper upload" : "Analysis service unavailable",
    });
  }
});

app.post("/api/recommend", (req, res) => recommendRoute(req, res, PYTHON_API_URL));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});