import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../prisma";
import {
    TaskPriority as PrismaTaskPriority,
    TaskStatus as PrismaTaskStatus,
} from "@prisma/client";

interface CreateTaskBody {
    title: string;
    folderId: number;
    priority?: PrismaTaskPriority;
}

interface UpdateTaskBody {
    title: string;
    status: PrismaTaskStatus;
    folderId: number;
    priority?: PrismaTaskPriority;
}

// @desc Get all tasks
// @route GET /task

export const getTasks = async (req: AuthRequest, res: Response) => {
    const tasks = await prisma.task.findMany({
        where: { folderId: req.folderId },
    });

    res.status(200).json(tasks);
};

// @desc Get task by id
// @route GET /task/:id

export const getTaskById = async (req: AuthRequest, res: Response) => {
    const taskId = parseInt(req.params.id);

    if (!taskId) {
        return res.status(400).json({ message: "Task id must be provided" });
    }

    const task = await prisma.task.findUnique({
        where: { id: taskId, folderId: req.folderId },
    });

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
};

// @desc Create task
// @route POST /task

export const createTask = async (req: AuthRequest, res: Response) => {
    const { title, folderId, priority } = req.body as CreateTaskBody;

    const task = await prisma.task.create({
        data: {
            title,
            folderId,
            priority,
        },
    });

    res.status(201).json(task);
};

// @desc Update task
// @ PUT /task/:id

export const updateTask = async (req: AuthRequest, res: Response) => {
    const taskId = parseInt(req.params.id);

    const { title, status, priority, folderId } = req.body as UpdateTaskBody;

    const updated = await prisma.task.updateMany({
        where: { id: taskId, folderId },
        data: { title, status, priority },
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

    if (!taskId) {
        return res.status(400).json({ message: "Task id must be provided" });
    }

    const deleted = await prisma.task.deleteMany({
        where: { id: taskId, folderId: req?.folderId },
    });

    if (deleted.count === 0) {
        return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
};
