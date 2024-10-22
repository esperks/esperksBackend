import express from "express";
import cors from "cors";
import { connectDB } from "./db.conn";
connectDB();

import AppRoutes from "./routes";

const app = express();

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, TypeScript + Node.js + Express!");
});

//Routes
app.use(AppRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
