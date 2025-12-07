import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/database";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Return user type without password
export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

// Return type for login / signup
export interface AuthResponse {
  user: AuthUser;
  token: string;
}

// ----------------------------- SIGNUP -----------------------------
export const signup = async (name: string,email: string,password: string): Promise<AuthResponse> => {
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) throw new Error("Email already exists");

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email: normalizedEmail, password: hashed },
  });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

// ----------------------------- LOGIN -----------------------------
export const login = async (email: string,password: string): Promise<AuthResponse> => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};
