import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../prisma";

interface FolderBody {
    name: string;
    color?: string;
}

// @desc Get Folders
// @route GET /folder

export const getFolders = async (req: AuthRequest, res: Response) => {
    const folders = await prisma.folder.findMany({
        where: { userId: req.user?.id },
    });

    res.status(200).json(folders);
};

//@desc Get folder by id
//@route GET /folder/:id

export const getFolderById = async (req: AuthRequest, res: Response) => {
    const folderId = parseInt(req.params.id);

    if (!folderId) {
        return res.status(400).json({ message: "Folder id must be provided" });
    }

    const folder = await prisma.folder.findUnique({
        where: { id: folderId, userId: req.user!.id },
    });

    if (!folder) {
        return res.status(400).json({ message: "Folder not found" });
    }

    res.status(200).json(folder);
};

// @desc Create folder
// @route POST /folder

export const createFolder = async (req: AuthRequest, res: Response) => {
    const { name, color } = req.body as FolderBody;

    const folder = await prisma.folder.create({
        data: {
            name,
            color,
            userId: req.user!.id,
        },
    });

    res.status(201).json(folder);
};

// @desc Update folder
// @route POST /folder/:id

export const updateFolder = async (req: AuthRequest, res: Response) => {
    const folderId = parseInt(req.params.id);

    const { name, color } = req.body as FolderBody;

    if (!folderId) {
        return res.status(400).json({ message: "Folder id must be provided" });
    }

    const updated = await prisma.folder.updateMany({
        where: { id: folderId, userId: req.user?.id },
        data: { name, color },
    });

    if (updated.count === 0) {
        return res.status(404).json({ message: "Folder not found" });
    }

    res.json({ message: "Folder updated" });
};

// @desc Delete folder
// @route DELETE /folder/:id

export const deleteFolder = async (req: AuthRequest, res: Response) => {
    const folderId = parseInt(req.params.id);

    if (!folderId) {
        return res.status(400).json({ message: "Folder id must be provided" });
    }

    const deleted = await prisma.folder.deleteMany({
        where: { id: folderId, userId: req.user?.id },
    });

    if (deleted.count === 0) {
        return res.status(400).json({ message: "Folder not found" });
    }

    res.json({ message: "Folder deleted" });
};
