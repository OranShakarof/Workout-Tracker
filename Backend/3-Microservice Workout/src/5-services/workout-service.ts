import { ResourceNotFoundError, ValidationError } from "../../../Shared/models/client-errors-model";
import { IWorkoutModel, WorkoutModel } from "../3-models/workout-model";

async function getWorkoutsByUser(userId: string): Promise<IWorkoutModel[]> {
    const workouts = await WorkoutModel.find({userId: userId}).exec();
    if(!workouts) throw new ResourceNotFoundError(userId);
    return workouts;
}

async function addWorkout(workout: IWorkoutModel): Promise<IWorkoutModel> {
    
    // Validate: 
    const errors = workout.validateSync();
    if(errors) throw new ValidationError(errors.message);

    // Save the Workout in the Data base: 
    await workout.save();

    // Return the added workout:
    return workout;
}

async function editWorkout(workout: IWorkoutModel): Promise<IWorkoutModel> {
    
    // Validate: 
    const errors = workout.validateSync();
    if(errors) throw new ValidationError(errors.message);

    // Update the Workout in the Data base: 
    const updatedWorkout = await WorkoutModel.findByIdAndUpdate(workout._id, workout, {returnOriginal: false}).exec();
    if(!updatedWorkout) throw new ResourceNotFoundError(workout._id);
    
    // Return the added workout:
    return updatedWorkout;
}

async function deleteWorkout(_id: string): Promise<void> {
    const deletedWorkout = await WorkoutModel.findByIdAndDelete(_id).exec();
    if(!deletedWorkout) throw new ResourceNotFoundError(_id);
}




export default {
    getWorkoutsByUser,
    addWorkout,
    editWorkout,
    deleteWorkout
};

