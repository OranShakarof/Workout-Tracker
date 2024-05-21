import mongoose, { Document, Schema } from 'mongoose';

// 1. Interface:
export interface ISet {
    reps: number;
    weight: number;
}

export interface IExerciseModel {
    exercise: string;
    sets: ISet[];
    restPeriods?: string;
    isPR?: boolean;
}

export interface IWorkoutModel extends Document {
    workoutName: string;
    exercises: IExerciseModel[];
    date: string;
    userId: mongoose.Types.ObjectId;
}

// 2. Schema:
const SetSchema = new Schema<ISet>({
    reps: {
        type: Number,
        required: [true, "Missing reps."],
        min: [1, "Reps can't be lower than 1."],
        max: [250, "Reps can't be over 250."],
        trim: true,
    },
    weight: {
        type: Number,
        required: [true, "Missing weight."],
        min: [0, "Weight can't be lower than 0."],
        max: [500, "Reps can't be over 500."],
        trim: true,
    }
});

const ExerciseSchema = new Schema<IExerciseModel>({
    exercise: {
        type: String,
        required: [true, "Missing Exercise."],
        minlength: [5, "Exercise too short."],
        maxlength: [100, "Exercise name can't be over 100 chars."],
        trim: true,
    },
    sets: {
        type: [SetSchema],
        required: [true, "Missing Sets."],
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

const WorkoutSchema = new Schema<IWorkoutModel>({
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
    date: {
        type: String,
        required: [true, "Missing date and time."],
        trim: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
    },
}, {
    versionKey: false,
});

WorkoutSchema.index({ date: 1, userId: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

// 3. Model:
export const WorkoutModel = mongoose.model<IWorkoutModel>("WorkoutModel", WorkoutSchema, "workouts");
