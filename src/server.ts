import express from "express";
import cors from "cors";
import { connectDB } from "./db.conn";
require("dotenv").config();
connectDB();

import AppRoutes from "./routes";
import { SeederService } from "./seeder/seeder.service";

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

app.listen(port, async () => {
  await SeederService.prototype.seedAdmin();
  console.log(`Server is running on http://localhost:${port}`);
});
