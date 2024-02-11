import express, { Request, Response, NextFunction } from "express";
import weeklyProgressService from "../5-services/weekly-progress-service";
import { WeeklyProgressModel } from "../3-models/weekly-progress-model";
import StatusCode from "../3-models/status-code";
import path from "path";

const router = express.Router();

router.get("/weekly-progresses/:userId([0-9a-f]{24})", async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Get Route user id: 
        const userId = request.params.userId;

        // Get Weekly progress by userId: 
        const weeklyProgresses = await weeklyProgressService.getAllWeeklyProgressesByUser(userId);
        
        // Response back desired weekly progresses:
        response.json(weeklyProgresses);
    }
    catch(err: any) {
        next(err);
    }
});

router.post("/weekly-progresses", async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Add image from request.files into request.body:
        request.body.image = request.files?.image;

        // Get Weekly progress send from frontend: 
        const weeklyProgress = new WeeklyProgressModel(request.body);
        
        // Add the weekly progress to the database:
        const addedWeeklyProgress = await weeklyProgressService.addWeeklyProgress(weeklyProgress);

        // Response back desired weekly progresses:
        response.status(StatusCode.Created).json(addedWeeklyProgress);
    }
    catch(err: any) {
        next(err);
    }
});

router.put("/weekly-progresses/:_id([0-9a-f]{24})", async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Extract route id into body:
        request.body._id = request.params._id;

        // Add image from request.files into request.body:
        request.body.image = request.files?.image;
       
        // Get weekly progress sent from frontend:
        const weeklyProgress = new WeeklyProgressModel(request.body);
    
        // Updated the weekly progress in database:
        const updatedWeeklyProgress = await weeklyProgressService.updateWeeklyProgress(weeklyProgress);

        // Response back the updated weekly progress:
        response.json(updatedWeeklyProgress);
    
    }
    catch(err: any) {
        next(err);
    }
});

router.delete("/weekly-progresses/:_id([0-9a-f]{24})", async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Get Route  _id: 
        const _id = request.params._id;

        // Delete Weekly progress by _id: 
        await weeklyProgressService.deleteWeeklyProgress(_id);
        
        // Response back:
        response.sendStatus(StatusCode.NoContent);
    }
    catch(err: any) {
        next(err);
    }
});

router.get("/weekly-progress-image/:imageName", async (request: Request, response: Response, next: NextFunction) => {
    try {

        // Get image Name: 
        const imageName = request.params.imageName;
        
        // Get image absolute path:
        const absolutePath = path.join(__dirname, "..", "1-assets", "images", imageName);

        // Response back the image file: 
        response.sendFile(absolutePath);
    }
    catch(err: any) {
        next(err);
    }
});

export default router;
