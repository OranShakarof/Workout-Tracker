import mongoose, { Document, ObjectId, Schema, model } from "mongoose";
import { UploadedFile } from "express-fileupload";

// 1. Interface: 
export interface IWeeklyProgressModel extends Document {
    weight: number,
    fatPercentage: number;
    date: string;
    comments: string;
    image: UploadedFile;
    imageName: string;
    imageUrl: string;
    userId: ObjectId;
}

// 2. Schema: 
export const WeeklyProgressSchema = new Schema<IWeeklyProgressModel>({
    weight: {
        type: Number,
        required: [true, "Missing weight"],
        min: [30, "Weight can't be lower then 30."],
        max: [300, "Weight can't higher then 250."],
        trim: true,
    },
    fatPercentage: {
        type: Number,
        min: [3,"Fat % can't be lower then 3."],
        max: [60, "Fat % can't be higher then 60."],
        trim: true,
    },
    date: {
        type: String,
        required: [true, "Missing date."],
        minlength: [10, "Date can't be lower than 10 chars"],
        maxlength: [100, "Date can't be over 100 chars"],
        trim: true,
    },
    comments: {
        type: String,
        minlength: [5, "Comments can't be lower than 5 chars"],
        maxlength: [250, "Comments can't be over 100 chars."],
        trim: true,
    },
    image:{
        type: Object
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
    userId:{
        type: mongoose.Schema.Types.ObjectId
    },
},{
    versionKey: false,
});

// 3. Model: 
export const WeeklyProgressModel = model<IWeeklyProgressModel>("WeeklyProgressModel", WeeklyProgressSchema, "weekly-progress");