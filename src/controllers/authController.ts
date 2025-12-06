import { Request, Response } from "express";
import * as authService from "../services/authService";

export const signup = async (req: Request, res: Response) => {
  try {
    const result = await authService.signup(
      req.body as authService.SignupInput
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully! You can now log in.",
      data: result,
    });
  } catch (error: any) {
    if (error.message === "User already exists") {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists. Please login instead.",
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || "Signup failed. Please try again.",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body as authService.LoginInput);

    res.status(200).json({
      success: true,
      message: "Logged in successfully! Welcome back.",
      data: result,
    });
  } catch (error: any) {
    if (error.message === "Invalid credentials") {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password. Please try again.",
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || "Login failed. Please try again.",
    });
  }
};
