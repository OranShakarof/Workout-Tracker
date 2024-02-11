import StatusCode from "./status-code";

// Base client error:
abstract class ClientError {
    public constructor( public status: number, public message: string) { }
}

// Route not found error: 
export class RouteNotFoundError extends ClientError {
    public constructor(route: string) {
        super(StatusCode.NotFound, `Route ${route} not found`);
    }
}

// Resource not found error: 
export class ResourceNotFoundError extends ClientError {
    public constructor(_id: string) {
        super(StatusCode.NotFound, `id ${_id} not found`);
    }
}

// Validation error: 
export class ValidationError extends ClientError {
    public constructor(message: string) {
        super(StatusCode.BadRequest, message);
    }
}

export class UnauthorizedError extends ClientError {
    public constructor(message: string) {
        super(StatusCode.Unauthorized, message);
    }
}

export class ForbiddenError extends ClientError {
    public constructor(message: string) {
        super(StatusCode.Forbidden, message);
    }
}
