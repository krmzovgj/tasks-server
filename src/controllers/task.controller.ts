import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../prisma";
import {
    TaskPriority as PrismaTaskPriority,
    TaskStatus as PrismaTaskStatus,
} from "@prisma/client";

interface GetTasksBody {
    folderId?: number | null;
    userId: number;
}

interface CreateTaskBody {
    title: string;
    description: string;
    folderId?: number | null;
    userId: number;
    priority?: PrismaTaskPriority;
}

interface UpdateTaskBody {
    title: string;
    description: string;
    status: PrismaTaskStatus;
    folderId?: number | null;
    userId: number;
    priority?: PrismaTaskPriority;
    archived: boolean;
}

// @desc Get all tasks
// @route GET /task?folderId=2?archive=true

export const getTasks = async (req: AuthRequest, res: Response) => {
    const folderId = parseInt(req.query.folderId as string);
    const userId = parseInt(req.query.userId as string);
    const archived = req.query.archived;

    const archivedBool = archived === "true";

    const tasks = await prisma.task.findMany({
        where: { userId: userId, folderId: folderId, archived: archivedBool },
        orderBy: { createdAt: "desc" },
    });

    res.status(200).json(tasks);
};

// @desc Get task by id
// @route GET /task/:id

export const getTaskById = async (req: AuthRequest, res: Response) => {
    const taskId = parseInt(req.params.id);
    const userId = Number(req.query.userId);

    if (!taskId) {
        return res.status(400).json({ message: "Task id must be provided" });
    }

    const task = await prisma.task.findUnique({
        where: {
            id: taskId,
        },
    });

    if (!task || task?.userId !== userId) {
        return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
};

// @desc Create task
// @route POST /task

export const createTask = async (req: AuthRequest, res: Response) => {
    const { title, description, priority, folderId, userId } =
        req.body as CreateTaskBody;

    if (!userId) {
        return res.status(400).json({ message: "User id must be provided" });
    }

    if (folderId !== undefined && folderId !== null) {
        const folder = await prisma.folder.findUnique({
            where: { id: Number(folderId) },
        });

        if (!folder) {
            return res.status(400).json({ message: "Folder does not exist" });
        }
    }

    const task = await prisma.task.create({
        data: {
            title,
            description,
            priority,
            userId: Number(userId),
            folderId: req.body.folderId !== null ? Number(folderId) : null,
        },
    });

    res.status(201).json(task);
};

// @desc Update task
// @ PUT /task/:id

export const updateTask = async (req: AuthRequest, res: Response) => {
    const taskId = parseInt(req.params.id);

    const body = req.body as UpdateTaskBody;
    const { title, description, status, priority, userId, folderId, archived } =
        body;

    const where: any = {
        id: taskId,
        userId,
    };

    if (folderId !== null && folderId !== undefined) {
        where.folderId = Number(folderId);
    }

    const updated = await prisma.task.updateMany({
        where,
        data: { title, description, status, priority, archived },
    });

    if (updated.count === 0) {
        return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task updated" });
};

// @desc Delete Task
// @route DELETE /task/:id

export const deleteTask = async (req: AuthRequest, res: Response) => {
    const taskId = parseInt(req.params.id);
    const { folderId } = req.body as GetTasksBody;

    if (!taskId) {
        return res.status(400).json({ message: "Task id must be provided" });
    }

    const deleted = await prisma.task.deleteMany({
        where: { id: taskId, folderId },
    });

    if (deleted.count === 0) {
        return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
};
