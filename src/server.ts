import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import AIRoutes from "./routes/AI-Routes";
dotenv.config();
const app = express();
app.use(cors({origin: "http://localhost:5173", credentials: true,})
);
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
try {
    res.status(200).json({
      success: true,
      message: "Server is running!",
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});



//Routes data 
app.use('/api/auth', authRoutes)
app.use("/api/ai", AIRoutes);






const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
