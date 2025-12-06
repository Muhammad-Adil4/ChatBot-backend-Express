import { Router } from "express";
import { getAIResponse } from "../controllers/AI-Controller";


const AIRoutes = Router();

AIRoutes.post("/generate", getAIResponse);
AIRoutes.post("/Gemini3", getAIResponse);

export default AIRoutes;
