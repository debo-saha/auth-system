// server/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./db/connectDB.js";
import userRoutes from "./routs/user.routes.js";
import cookieParser from "cookie-parser";
// import db from './models/index.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
// ✅ Use the route
app.use("/api/users", userRoutes);

db.sequelize
  .authenticate()
  .then(() => console.log("✅ DB connected successfully"))
  .catch((err) => console.error("❌ DB connection failed:", err));

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
