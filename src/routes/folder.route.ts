import express, { Router } from "express";
import { verifyToken } from "../middleware/auth";
import {
    createFolder,
    deleteFolder,
    getFolderById,
    getFolders,
    updateFolder,
} from "../controllers/folder.controller";

const router = express.Router();

router.get("/", verifyToken, getFolders);
router.get("/:id", verifyToken, getFolderById);
router.post("/", verifyToken, createFolder);
router.put("/:id", verifyToken, updateFolder);
router.delete("/:id", verifyToken, deleteFolder);

export default router;
