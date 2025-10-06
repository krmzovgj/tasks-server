import express, { Application, Request, Response } from "express";
import cors from "cors";
import notFound from "./middleware/not-found";
import errorHandler from "./middleware/error-handler";
import authRoutes from "./routes/auth.route";
import taskRoutes from './routes/task.route'
import folderRoutes from './routes/folder.route'

const app: Application = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 8080;

// Body parser
app.use(express.json());

// Allow all origin
app.use(cors());

app.get("/", (req: Request, res: Response) => {
    res.send("Server is running...");
});

app.use("/auth", authRoutes);
app.use('/task', taskRoutes)
app.use('/folder', folderRoutes)

// Not found & global error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
