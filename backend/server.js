import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import path from "path";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import viewTokenRoutes from "./routes/viewTokenRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import workFlowRoutes from "./routes/workFlowRoutes.js";
import { errorHandler } from "./middleWare/errorMiddleware.js";
import connectDB from "./config/db.js";
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const config = dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/api/projects", projectRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/viewTokens", viewTokenRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workFlow", workFlowRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../', 'frontend', 'build', 'index.html'));
  })
}

app.use(errorHandler);