import { Request, Response, NextFunction } from "express";
import StatusCode from "../3-models/status-code";

// Catch-All middleware:
function catchAll(err: any, request: Request, response: Response, next: NextFunction): void {

    // Log error on console:
    console.log("Error: ", err);

    // Take status:
    const status = err.status || StatusCode.InternalServerError;

    // Take message:
    const message = err.message;

    // Response back the error to the user:
    response.status(status).send(message);
}

export default catchAll;
