import express, { Request, Response, NextFunction } from "express";
import workoutService from "../5-services/workout-service";
import { WorkoutModel } from "../3-models/workout-model";
import StatusCode from "../3-models/status-code";

const router = express.Router();

router.get("/workouts/:userId([0-9a-f]{24})", async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Get route user id:
        const userId = request.params.userId;

        // Get the workout by the user id:
        const workouts = await workoutService.getWorkoutsByUser(userId);

        // Response back the desired workout:
        response.json(workouts);
    }
    catch(err: any) {
        next(err);
    }
});

router.get("/workouts/details/:_id([0-9a-f]{24})", async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Get route workout _id:
        const _id = request.params._id;

        // Get the workout by the user id:
        const workouts = await workoutService.getOneWorkoutByUser(_id);

        // Response back the desired workout:
        response.json(workouts);
    }
    catch(err: any) {
        next(err);
    }
});


router.post("/workouts", async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Get the workout from frontend:
        const workout = new WorkoutModel(request.body);

        // Add the workout to database:
        const addedWorkout = await workoutService.addWorkout(workout);

        // Response back the added workout:
        response.status(StatusCode.Created).json(addedWorkout); 
    }
    catch(err: any) {
        next(err);
    }
});

router.put("/workouts/:_id([0-9a-f]{24})", async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Extract route id into body:
        request.body._id = request.params._id;
        
        // Get the workout from the frontend: 
        const workout = new WorkoutModel(request.body);

        // Update the workout in database:
        const updatedWorkout = await workoutService.editWorkout(workout);

        // Response back the workout:
        response.json(updatedWorkout); 
    }
    catch(err: any) {
        next(err);
    }
});

router.delete("/workouts/:_id([0-9a-f]{24})", async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Get Route _id:
        const _id = request.params._id;
        
        // Delete the desired workout form database:
        await workoutService.deleteWorkout(_id);

        // Response back:
        response.sendStatus(StatusCode.NoContent); 
    }
    catch(err: any) {
        next(err);
    }
});



export default router;
