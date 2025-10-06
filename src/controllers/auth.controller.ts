import { Request, Response } from "express";
import prisma from "../prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// @desc Register user
// @route POST /register

export const register = async (req: Request, res: Response) => {
    const { email, password, username } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email & password required" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
        return res
            .status(400)
            .json({ message: "User with that email already exists" });
    }

    // Hash the password 2^10 = 1024 times internally
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { username, email, password: hashed },
    });

    res.status(201).json({
        message: "User created",
        user: { id: user.id, email: user.email },
    });
};

// @desc Sign in user
// @route POST /auth/sign-in

export const signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json({ message: "Email & password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    // Re-hash the req.body password internally and compare it with the hased one in the db
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate jwt token for user with id:X and email:X
    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    );

    res.status(200).json({ token, user: { id: user.id } });
};
