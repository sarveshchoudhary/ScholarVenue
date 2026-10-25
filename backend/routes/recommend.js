const axios = require("axios");

/**
 * Recommendation Route Handler
 * Forwards venue recommendation requests to the Python backend
 */
module.exports = async (req, res) => {
  try {
    // Forward request to Python backend
    const response = await axios.post(
      "http://127.0.0.1:5000/recommend",
      req.body
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching recommendations:", error.message);
    res.status(500).json({
      error: error.message || "Error fetching recommendations",
    });
  }
};
