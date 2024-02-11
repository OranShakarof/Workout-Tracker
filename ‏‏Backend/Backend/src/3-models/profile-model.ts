import { UploadedFile } from "express-fileupload";
import mongoose, { Document, ObjectId, Schema, model } from "mongoose";

// 1. Interface: 
export interface IProfileModel extends Document{
    height: number;
    weight: number;
    weightGoal: number;
    fatPercentage: number;
    imageName: string;
    imageUrl: string;
    image: UploadedFile;
    userId: ObjectId;
}

// 2. Schema: 
export const ProfileSchema = new Schema<IProfileModel>({
    height: {
        type: Number,
        required: [true, "Missing height."],
        min: [100,"Height can't be lower then 100."],
        max: [280, "Height can't be higher then 280."],
        trim: true,
    },
    weight: {
        type: Number,
        required: [true, "Missing weight."],
        min: [30,"weight can't be lower then 30."],
        max: [250, "weight can't be higher then 250."],
        trim: true,
    },
    weightGoal: {
        type: Number,
        required: [true, "Missing weight goal."],
        min: [40,"weight can't be lower then 40."],
        max: [250, "weight can't be higher then 250."],
        trim: true,
    },
    fatPercentage: {
        type: Number,
        min: [3,"Fat % can't be lower then 3."],
        max: [60, "Fat % can't be higher then 60."],
        trim: true,
    },
    imageName: {
        type: String,
        max: [200, "Image URL can't be over 200 chars."],
        trim: true,
    },
    imageUrl: {
        type: String,
        minlength: [40,"Image URL can't be shorter then 40 chars."],
        max: [200, "Image URL can't be over 200 chars."],
        trim: true,
    },
    image:{
        type: Object
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId
    }
},{
    versionKey: false,
});

// 3. Model: 
export const ProfileModel = model<IProfileModel>("ProfileModel", ProfileSchema, "profiles");