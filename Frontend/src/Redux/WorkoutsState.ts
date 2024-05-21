import { createStore } from "redux";
import { WorkoutModel } from "../Models/WorkoutsModel";

// 1. Global State:
export default class WorkoutsState {
    public workouts: WorkoutModel[] = [];
}

// 2. Action type: 
export enum WorkoutsActionType {
    SetWorkouts = "SetWorkouts",
    AddWorkout = "AddWorkout",
    EditWorkout = "EditWorkout",
    DeleteWorkout = "DeleteWorkout"
}

// 3. Action:
export interface WorkoutsAction {
    type: WorkoutsActionType,
    payload?: any;
}

// 4. Reducer: 
export function workoutsReducer(currentState = new WorkoutsState(), action: WorkoutsAction): WorkoutsState{
    const newState = {...currentState}; 
    switch(action.type){

        case WorkoutsActionType.SetWorkouts:
            newState.workouts = action.payload;
            break;

        case WorkoutsActionType.AddWorkout:
            newState.workouts.push(action.payload);
            break;

        case WorkoutsActionType.EditWorkout: 
            const indexToUpdate = newState.workouts.findIndex(w => w._id === action.payload._id); // Find the index of the workout to update.
            if(indexToUpdate >=0 ) newState.workouts[indexToUpdate] = action.payload;
            break;
            
        case WorkoutsActionType.DeleteWorkout: 
            const indexToDelete = newState.workouts.findIndex(w => w._id === action.payload); // Find the index of the workout to update.
            if(indexToDelete >=0 ) newState.workouts.splice(indexToDelete,1);
            break;            
        }

        return newState
}

// 5. Store: 
export const workoutsStore = createStore(workoutsReducer);