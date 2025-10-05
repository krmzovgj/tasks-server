import { NextFunction, Request, Response } from "express";

interface CustomError extends Error {
    status?: number;
}

const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err.status) {
        res.status(err.status).json({ message: err.message });
    } else {
        res.status(404).json({ message: "Not Foudn" });
    }
};

export default errorHandler;
