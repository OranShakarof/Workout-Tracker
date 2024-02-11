import { NextFunction, Request, Response } from "express";
import cyber from "../2-utils/cyber";

// Verify token validity:
function verifyToken(request: Request, response: Response, next: NextFunction) {
    // Authorization: 
    const authorizationHeader = request.header("authorization");

    // Extract the token:
    const token = authorizationHeader?.substring(7);

    // Verify admin: 
    cyber.verifyAdmin(token);

    // Continue to next middleware/route
    next();
}

export default verifyToken;