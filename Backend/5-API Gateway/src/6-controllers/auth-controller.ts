import axios from "axios";
import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

router.post("/auth/register", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const user = request.body;
        const msResponse = await axios.post("http://localhost:4001/api/auth/register", user);
        response.json(msResponse.data);
    }
    catch(err: any) {
        next(err);
    }
});

router.post("/auth/login", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const credentials = request.body;
        const msResponse = await axios.post("http://localhost:4001/api/auth/login", credentials);
        response.send(msResponse.data);
    }
    catch(err: any) {
        next(err);
    }
});

export default router;
