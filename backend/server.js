const express = require("express");
const axios = require("axios");
const cors = require("cors");
const multer = require("multer");
const FormData = require("form-data");
const recommendRoute = require("./routes/recommend");

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

app.post("/analyze", upload.single("file"), async (req, res) => {
  try {
    // Check if file is present
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const formData = new FormData();
    formData.append("file", req.file.buffer, "file.pdf");

    const response = await axios.post(
      "http://127.0.0.1:5000/predict",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message || "Error processing file" });
  }
});

app.post("/api/recommend", recommendRoute);

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});