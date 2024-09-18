import express from "express";
import dbConnect from "./DB/user.db.js";
import router1 from "./Router/Authentication.route.js";
import router from "./Router/Loan.route.js";
import { config } from "dotenv";
import cors from "cors";

const app = express();

// Load environment variables
config();

// Middleware to parse JSON bodies

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// CORS configuration
const corsOptions = {
  origin: ["https://crm.firstindiacredit.com", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.options("*", cors());

// Define routes
app.use("/api/v1/", router1);
app.use("/api/v2/", router);

// Default route
app.get("/", (req, res) => {
  res.status(200).send("Welcome");
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    // Bad JSON payload error handling
    res.status(400).json({ error: "Invalid JSON payload" });
  } else {
    // Other errors
    res.status(500).json({ error: "Internal server error" });
  }
});

// Connect to the database and start the server
dbConnect()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

export default app;
