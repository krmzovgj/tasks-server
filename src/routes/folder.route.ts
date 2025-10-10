import express from "express";
import {
    createFolder,
    deleteFolder,
    getFolderById,
    getFolders,
    updateFolder,
} from "../controllers/folder.controller";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.get("/", verifyToken, getFolders);
router.get("/:id", verifyToken, getFolderById);
router.post("/", verifyToken, createFolder);
router.put("/:id", verifyToken, updateFolder);
router.delete("/:id", verifyToken, deleteFolder);

export default router;
