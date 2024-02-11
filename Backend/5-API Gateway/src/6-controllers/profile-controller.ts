import axios from "axios";
import FormData from 'form-data';
import express, { Request, Response, NextFunction } from "express";
import { UploadedFile } from "express-fileupload";
import StatusCode from "../../../Shared/models/status-code";
import verifyToken from "../../../1-Microservice Auth/src/4-middleware/verify-token";
const router = express.Router();

router.get("/profile/:userId([0-9a-f]{24})", verifyToken ,async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = request.params.userId;
        const msResponse = await axios.get("http://localhost:4002/api/profile/" + userId);
        response.send(msResponse.data);
    }
    catch(err: any) {
        next(err);
    }
});

router.post("/profile", verifyToken, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const formData = new FormData();
        formData.append('height', request.body.height);
        formData.append('weight', request.body.weight);
        formData.append('weightGoal', request.body.weightGoal);
        formData.append('fatPercentage', request.body.fatPercentage);
        formData.append('userId', request.body.userId);
        // Type assertion to let TypeScript know it's a single UploadedFile
        const singleFile = request?.files.image as UploadedFile | undefined;

        formData.append('image', singleFile.data, {
            filename: singleFile.name,
            contentType: singleFile.mimetype,
        });

        const msResponse = await axios.post("http://localhost:4002/api/profile/", formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        response.status(StatusCode.Created).send(msResponse.data);
    } catch (err: any) {
        next(err);
    }
});

router.put("/profile/:_id([0-9a-f]{24})", verifyToken, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id
        const formData = new FormData();

        formData.append('height', request.body.height);
        formData.append('weight', request.body.weight);
        formData.append('weightGoal', request.body.weightGoal);
        formData.append('fatPercentage', request.body.fatPercentage);
        formData.append('userId', request.body.userId);
        // Type assertion to let TypeScript know it's a single UploadedFile
        const singleFile = request.files?.image as UploadedFile | undefined;

        if (singleFile) {
            formData.append('image', singleFile.data, {
                filename: singleFile.name,
                contentType: singleFile.mimetype,
            });
        } else {
            formData.append('image', null);
        }

        const msResponse = await axios.post("http://localhost:4002/api/profile/" + _id,formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });
        response.send(msResponse.data);
    }
    catch(err: any) {
        next(err);
    }
});

router.delete("/profile/:_id([0-9a-f]{24})", verifyToken, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id
        await axios.delete("http://localhost:4002/api/profile/" + _id);
        response.sendStatus(StatusCode.NoContent);
    }
    catch(err: any) {
        next(err);
    }
});

router.get("/profile-image/:imageName",  async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Extract the image name from the request parameters:
        const imageName = request.params.imageName;

        // Fetch the image data from the specified URL using Axios
        const msResponse = await axios.get("http://localhost:4002/api/profile-image/" + imageName, {
            responseType: 'arraybuffer', // Set the response type to receive an ArrayBuffer
        });

        // Convert the received data to a Buffer:
        const imageBuffer = Buffer.from(msResponse.data, 'binary');

        // Set the Content-Type header to inform the browser about the image format:
        response.setHeader('Content-Type', 'image/jpeg'); // Adjust this based on the actual image format

        // Send the image buffer as the response to the client:
        response.send(imageBuffer);
    } catch(err: any) {
        next(err);
    }
});


export default router;
