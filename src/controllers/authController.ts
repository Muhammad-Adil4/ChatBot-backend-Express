// controllers/authController.ts
import { Request, Response } from "express";
import * as authService from "../services/authService";

export const signup = async (req: Request, res: Response) => {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json({
      success: true,
      message: "Account created successfully! You can now log in.",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({
      success: true,
      message: "Logged in successfully! Welcome back.",
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
};
