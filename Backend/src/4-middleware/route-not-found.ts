import { Request, Response, NextFunction } from "express";
import { RouteNotFoundError } from "../3-models/client-errors-model";

// Route not found:
function routeNotFound(request: Request, response: Response, next: NextFunction): void {
    next(new RouteNotFoundError(request.originalUrl));
}

export default routeNotFound;
