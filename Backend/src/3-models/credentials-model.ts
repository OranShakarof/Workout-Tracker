import { Document, Schema, model } from "mongoose";

// 1. Interface: 
export interface ICredentialsModel extends Document{
    email: string;
    password: string;
}

// 2. Schema: 
export const CredentialsSchema = new Schema<ICredentialsModel>({
    email: {
        type: String,
        required: [true, "Missing email."],
        minlength: [10, "Incorrect Email."],
        maxlength: [150, "Email can't exceed 150 chars."],
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Missing password."],
        minlength: [6, "Password must be minimum 6 chars."],
        maxlength: [150, "password name can't exceed 150 chars."],
        trim: true,
    },
});

// 3. Model: 
export const CredentialsModel = model<ICredentialsModel>("CredentialsModel", CredentialsSchema, "users");