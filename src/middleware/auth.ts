import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: { id: number; email: string };
    folderId?: number;
}

export const verifyToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const header = req.headers.authorization;

    if (!header) {
        return res.status(404).json({ message: "No access token provided" });
    }

    const token = header.split(" ")[1];

    if (!token) {
        res.status(404).json({ message: "Invalid token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            id: number;
            email: string;
        };
        req.user = decoded;
        next();
    } catch {
        return res.status(404).json({ message: "Invalid or expired token" });
    }
};
