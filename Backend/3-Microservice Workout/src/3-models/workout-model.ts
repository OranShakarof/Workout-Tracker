import mongoose, { Document, ObjectId, Schema, model } from "mongoose";

// 1. Interface:
export interface IExerciseModel {
    exercise: string;
    sets: number;
    reps: number;
    weight: number;
    restPeriods: string;
    isPR: boolean;
}

export interface IWorkoutModel extends Document {
    workoutName: string;
    exercises: IExerciseModel[];
    dateAndTime: string;
    userId: ObjectId;
}

// 2. Schema:
export const ExerciseSchema = new Schema<IExerciseModel>({
    exercise: {
        type: String,
        required: [true, "Missing Exercise."],
        minlength: [5, "Exercise too short."],
        maxlength: [100, "Exercise name can't be over 100 chars."],
        trim: true,
    },
    sets: {
        type: Number,
        required: [true, "Missing Sets."],
        min: [1, "Sets can't be lower than 1."],
        max: [15, "Sets can't be over 15."],
        trim: true,
    },
    reps: {
        type: Number,
        required: [true, "Missing Reps."],
        min: [1, "Reps can't be lower than 1."],
        max: [250, "Reps can't be over 250."],
        trim: true,
    },
    weight: {
        type: Number,
        required: [true, "Missing Weight."],
        min: [0, "Weight can't be lower than 0."],
        max: [500, "Reps can't be over 500."],
        trim: true,
    },
    restPeriods: {
        type: String,
        minlength: [2, "Rest periods can't be lower than 2 chars."],
        maxlength: [50, "Rest periods can't be over 50 chars."],
    },
    isPR: {
        type: Boolean,
        default: false, // Default value is false (no PR)
    },
});

export const WorkoutSchema = new Schema<IWorkoutModel>({
    workoutName: {
        type: String,
        required: [true, "Missing Workout name."],
        minlength: [3, "Workout name too short."],
        maxlength: [100, "Workout name can't be over 100 chars."],
        trim: true,

    },
    exercises: {
        type: [ExerciseSchema],
        required: [true, "Missing Exercises."],
    },
    dateAndTime: {
        type: String,
        required: [true, "Missing date and time."],
        minlength: [10, "Date and time can't be lower than 10 chars"],
        maxlength: [100, "Date and time can't be over 100 chars"],
        trim: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
    },
}, {
    versionKey: false,
});

// 3. Model:
export const WorkoutModel = model<IWorkoutModel>("WorkoutModel", WorkoutSchema, "workouts");