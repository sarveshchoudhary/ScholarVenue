const axios = require("axios");

/**
 * Recommendation Route Handler
 * Forwards venue recommendation requests to the Python backend
 */
module.exports = async (req, res, pythonApiUrl = process.env.PYTHON_API_URL || "http://127.0.0.1:5000") => {
  try {
    // Forward request to Python backend
    const response = await axios.post(
      `${pythonApiUrl}/recommend`,
      req.body
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching recommendations:", error.message);
    const status = error.response?.status >= 400 && error.response.status < 500 ? error.response.status : 502;
    res.status(status).json({
      error: status === 502 ? "Recommendation service unavailable" : error.response?.data?.error || "Invalid recommendation request",
    });
  }
};
