import express, { Request, Response, NextFunction } from "express";
import profileService from "../5-services/profile-service";
import { ProfileModel } from "../3-models/profile-model";
import StatusCode from "../3-models/status-code";
import path from "path";

const router = express.Router();

router.get("/profile/:userId([0-9a-f]{24})", async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Get Route user id:
        const userId = request.params.userId;

        // Get Profile By userId: 
        const profile = await profileService.getProfileByUser(userId);

        // Response back desired profile
        response.json(profile);
    }
    catch(err: any) {
        next(err);
    }
});

router.post("/profile", async (request: Request, response: Response, next: NextFunction) => {
    try {

        // Add image from request.files into request.body:
        request.body.image = request.files?.image;
  
        // Get profile send from frontend: 
        const profile = new ProfileModel(request.body);

        // Add the profile to the database: 
        const addedProfile = await profileService.addProfile(profile);

        // Response back the added profile
        response.status(StatusCode.Created).json(addedProfile);
    }
    catch(err: any) {
        next(err);
    }
});

router.put("/profile/:_id([0-9a-f]{24})", async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Extract route id into body:
        request.body._id = request.params._id;

        // Add image from request.files into request.body:
        request.body.image = request.files?.image;

        // Get Profile send from frontend: 
        const profile = new ProfileModel(request.body);

        // Update profile in database:
        const updatedProfile = await profileService.updateProfile(profile);

        // Response back the updated profile:
        response.json(updatedProfile);
    }
    catch(err: any) {
        next(err);
    }
});

router.delete("/profile/:_id([0-9a-f]{24})", async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Extract route id into body:
        const _id = request.params._id;

        // Delete profile from database:
        await profileService.deleteProfile(_id);

        // Response back:
        response.sendStatus(StatusCode.NoContent);
    }
    catch(err: any) {
        next(err);
    }
});

router.get("/profile-image/:imageName", async (request: Request, response: Response, next: NextFunction) => {
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
