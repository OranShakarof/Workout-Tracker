import axios from "axios";
import express, { Request, Response, NextFunction } from "express";
import StatusCode from "../../../Shared/models/status-code";
import verifyToken from "../../../1-Microservice Auth/src/4-middleware/verify-token";

const router = express.Router();

router.get("/workouts/:userId([0-9a-f]{24})", verifyToken, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = request.params.userId;
        const msResponse = await axios.get("http://localhost:4003/api/workouts/" + userId);
        response.send(msResponse.data);
    }
    catch(err: any) {
        next(err);
    }
});

router.post("/workouts", verifyToken, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const workout = request.body;
        const msResponse = await axios.post("http://localhost:4003/api/workouts/" , workout);
        response.status(StatusCode.Created).send(msResponse.data);
    }
    catch(err: any) {
        next(err);
    }
});

router.put("/workouts/:_id([0-9a-f]{24})", verifyToken,async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id;
        const workout = request.body;
        const msResponse = await axios.put("http://localhost:4003/api/workouts/" + _id, workout);
        response.send(msResponse.data);
    }
    catch(err: any) {
        next(err);
    }
});

router.delete("/workouts/:_id([0-9a-f]{24})", verifyToken, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id;
        await axios.delete("http://localhost:4003/api/workouts/" + _id);
        response.sendStatus(StatusCode.NoContent);
    }
    catch(err: any) {
        next(err);
    }
});

export default router;