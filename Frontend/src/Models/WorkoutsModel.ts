export class SetModel {
    public _id?: string;
    public reps: number;
    public weight: number; 
}

export class ExerciseModel {
    public _id?: string;
    public exercise?: string;
    public sets?: SetModel[];
    public isPR?: boolean;
    public restPeriods?: string;
}

export class WorkoutModel {
    public _id: string;
    public workoutName: string;
    public exercises: ExerciseModel[];
    public date: string;
    public userId: string;
}
