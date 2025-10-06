import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../prisma";

// @desc Get user
// @route GET /user/:id

export const getUser = async (req: AuthRequest, res: Response) => {
    const userId = parseInt(req.params.id);

    if (!userId) {
        return res.status(400).json({ message: "User id must be provided" });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            username: true,
            email: true,
            createdAt: true,
        },
    });

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    res.status(200).json(user);
};
