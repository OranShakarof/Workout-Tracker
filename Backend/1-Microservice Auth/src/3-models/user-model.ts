import { Document, Schema, model } from "mongoose";
import RoleModel from "./role-model";


// 1. Interface - describing model properties: 
export interface IUserModel extends Document{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: RoleModel;
}

// 2. Schema - describing model rules: 
export const UserSchema = new Schema<IUserModel>({
    firstName: {
        type: String,
        required: [true, "Missing first name."],
        minlength: [2, "First name must be minimum 2 chars."],
        maxlength: [25, "First name can't exceed 25 chars."],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, "Missing last name."],
        minlength: [2, "Last name must be minimum 2 chars."],
        maxlength: [30, "Last name can't exceed 30 chars."],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Missing email."],
        match:[/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,3}$/i,"invalid email"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Missing password."],
        minlength: [6, "Password must be minimum 6 chars."],
        maxlength: [150, "password name can't exceed 150 chars."],
        trim: true,
    },
    role: {
        type: Number,
        min: [1, "Role cannot be lower then 1."],
        max: [2, "Role cannot be higher then 2."],
    },
},{
    versionKey: false,
});

// 3. Model:
export const UserModel = model<IUserModel>("UserModel", UserSchema, "users");