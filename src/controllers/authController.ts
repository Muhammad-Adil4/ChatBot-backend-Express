import { Request, Response } from "express";
import { signup, login } from "../services/authService";
import { AuthResponse } from "../services/authService";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// ----------------------------- SIGNUP -----------------------------
export const signupController = async (
  req: Request,
  res: Response<ApiResponse<AuthResponse>>
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
      return;
    }

    const data = await signup(name, email, password);

    res.status(201).json({
      success: true,
      message: "Signup successful",
      data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

// ----------------------------- LOGIN -----------------------------
export const loginController = async (
  req: Request,
  res: Response<ApiResponse<AuthResponse>>
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const data = await login(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";

    res.status(400).json({
      success: false,
      message,
    });
  }
};
