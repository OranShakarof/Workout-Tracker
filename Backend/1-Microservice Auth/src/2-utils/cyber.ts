import jwt from "jsonwebtoken";
import { ForbiddenError, UnauthorizedError } from "../../../Shared/models/client-errors-model";
import RoleModel from "../3-models/role-model";
import { IUserModel } from "../3-models/user-model";
import crypto from "crypto";

// Token secret key:
const tokenSecretKey = "July-Twenty-Two-Thousand-One"

function getNewToken(user: IUserModel): string{
    
    // Remove password from token: 
    delete user.password;
    
    // Container for user object inside the token:
    const container =  { user };

    // Expiration: 
    const options = { expiresIn: "4h" };
    
    // Create token:
    const token = jwt.sign(container, tokenSecretKey , options);
    
    // Return token
    return token;
}

function verifyToken(token: string): void {

    if(!token) throw new UnauthorizedError("Access denied.")
    try{
        jwt.verify(token, tokenSecretKey);

    }
    catch(err: any) {
        throw new UnauthorizedError(err.message); 
    }
}

function verifyAdmin(token: string): void {

    // Verify legal token:
    verifyToken(token);

    // Get container: 
    const container = jwt.verify(token, tokenSecretKey) as { user: IUserModel};

    // Extract user: 
    const user = container.user;

    // If not admin: 
    if(user.role !== RoleModel.Admin) throw new ForbiddenError("You are not allowed.");
    
}

// Hash salt: 
const hashSalt = "ILoveFootball"

function hashPassword(plainText: string): string{
    if(!plainText) return null;
    
    const hashedPassword = crypto.createHmac("sha512", hashSalt).update(plainText).digest("hex");
    return hashedPassword;
}

export default {
    getNewToken,
    verifyToken,
    verifyAdmin,
    hashPassword
}