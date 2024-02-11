import express, { Request, Response, NextFunction } from "express";
import StatusCode from "../3-models/status-code"
import { UserModel } from "../3-models/user-model";
import authService from "../5-services/auth-service";
import { CredentialsModel } from "../3-models/credentials-model";

const router = express.Router();

router.post("/auth/register", async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Get user send from the frontend: 
        const user = new UserModel(request.body);
        
        // Add user to database:
        const token = await authService.register(user);
        
        // Response back the added token:
        response.status(StatusCode.Created).json(token);
    }
    catch(err: any) {
        next(err);
    }
});

router.post("/auth/login", async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Get credentials send from the frontend: 
        const credentials = new CredentialsModel(request.body);
        
        // login:
        const token = await authService.login(credentials);
        
        // Response back the token:
        response.json(token);
    }
    catch(err: any) {
        next(err);
    }
});


export default router;
