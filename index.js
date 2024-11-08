import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import dbConnect from "./DB/user.db.js";
import router1 from "./Router/Authentication.route.js";
import router from "./Router/Loan.route.js";
import { config } from "dotenv";
import cors from "cors";

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = new SocketIOServer(server, {
  cors: {
    origin: [
      "https://crm.firstindiacredit.com",
      "http://localhost:5173",
      "*",
      "http://192.168.1.9:5173",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

// Load environment variables
config();

// Middleware to parse JSON bodies
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// CORS configuration
const corsOptions = {
  origin: [
    "https://crm.firstindiacredit.com",
    "http://localhost:5173",
    "*",
    "http://192.168.1.9:5173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors());

// Define routes
app.use("/api/v1/", router1);
app.use("/api/v2/", router);

app.get("/", (req, res) => {
  res.status(200).send("Welcome");
});

// Connect to the database and start the server
dbConnect()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// Handle Socket.IO connection
io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Export Socket.IO instance
export { io };
export default app;
