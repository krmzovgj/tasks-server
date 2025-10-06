import express from "express";
import {
    createTask,
    deleteTask,
    getTaskById,
    getTasks,
    updateTask,
} from "../controllers/task.controller";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.get("/", verifyToken, getTasks);
router.get("/:id", verifyToken, getTaskById);
router.post("/", verifyToken, createTask);
router.put("/:id", verifyToken, updateTask);
router.delete("/:id", verifyToken, deleteTask);


export default router;
