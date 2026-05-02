import jwt from "jsonwebtoken";
import env from "../config/env";

export const generateToken = (payload: Record<string, unknown>, options: jwt.SignOptions = {}) => {
    return jwt.sign(payload, env.JWT.SECRET, { expiresIn: "8h", ...options });
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, env.JWT.SECRET);
}
