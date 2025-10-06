import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../prisma";
import {
    TaskPriority as PrismaTaskPriority,
    TaskStatus as PrismaTaskStatus,
} from "@prisma/client";

interface GetTasksBody {
    folderId: number;
}

interface CreateTaskBody {
    title: string;
    description: string;
    folderId: number;
    priority?: PrismaTaskPriority;
}

interface UpdateTaskBody {
    title: string;
    description: string;
    status: PrismaTaskStatus;
    folderId: number;
    priority?: PrismaTaskPriority;
    archived: boolean;
}

// @desc Get all tasks
// @route GET /task?folderId=2

export const getTasks = async (req: AuthRequest, res: Response) => {
    const folderId = parseInt(req.query.folderId as string);

    const archivedQuery = req.query.archived;
    let whereClause: any = { folderId };

    if (archivedQuery !== undefined) {
        whereClause.archived = archivedQuery === "true";
    }

    const tasks = await prisma.task.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
    });

    res.status(200).json(tasks);
};

// @desc Get task by id
// @route GET /task/:id

export const getTaskById = async (req: AuthRequest, res: Response) => {
    const taskId = parseInt(req.params.id);
    const { folderId } = req.body as GetTasksBody;

    if (!taskId) {
        return res.status(400).json({ message: "Task id must be provided" });
    }

    const task = await prisma.task.findUnique({
        where: { id: taskId, folderId },
    });

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
};


// @desc Create task
// @route POST /task

export const createTask = async (req: AuthRequest, res: Response) => {
    const { title, description, priority, folderId } =
        req.body as CreateTaskBody;

    const task = await prisma.task.create({
        data: {
            title,
            description,
            priority,
            folderId,
        },
    });

    res.status(201).json(task);
};

// @desc Update task
// @ PUT /task/:id

export const updateTask = async (req: AuthRequest, res: Response) => {
    const taskId = parseInt(req.params.id);

    const { title, description, status, priority, folderId, archived } =
        req.body as UpdateTaskBody;

    const updated = await prisma.task.updateMany({
        where: { id: taskId, folderId },
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
