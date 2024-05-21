import axios from "axios";
import { WorkoutModel } from "../Models/WorkoutsModel";
import { WorkoutsAction, WorkoutsActionType, workoutsStore } from "../Redux/WorkoutsState";
import appConfig from "../Utils/AppConfig";

class WorkoutsService {
    public async getWorkoutsByUser(userId: string):Promise<WorkoutModel[]> {
        // Get Workouts from the global state:
        let workouts = workoutsStore.getState().workouts;

        // If there no workouts in the global state:
        if(workouts.length === 0){
            // Get response from the backend:
            const response = await axios.get<WorkoutModel[]>(appConfig.workoutsUrl + userId);

            // Extract all workouts: 
            workouts = response.data;

            // Save workouts to global state: 
            const action: WorkoutsAction = { type: WorkoutsActionType.SetWorkouts, payload: workouts };
            workoutsStore.dispatch(action);
        }

        // Return Workouts:
        return workouts;
    }

    public async getOneWorkout(_id: string): Promise<WorkoutModel>{
        // get workouts from global state: 
        let workouts = workoutsStore.getState().workouts;

        // Find desired workout:
        let workout = workouts.find(w => w._id === _id);

        if(!workout){
            // Get workout from backend: 
            const response = await axios.get<WorkoutModel>(appConfig.workoutsUrl + `details/${_id}` );

            // Extract the workout:
            workout = response.data;
        }

        // Return workout:
        return workout;
    }

    public async addWorkout(workout: WorkoutModel): Promise<void> {
        // Send workout to the backend:
        const response = await axios.post<WorkoutModel>(appConfig.workoutsUrl, workout);

        // Extract the added workout sent back from the backend: 
        const addedWorkout = response.data;
        
        // Add the new workout to global state: 
        const action: WorkoutsAction = { type: WorkoutsActionType.AddWorkout, payload: addedWorkout};
        workoutsStore.dispatch(action);
    }

    public async editWorkout(workout: WorkoutModel): Promise<void> {
        // Send workout to the backend:
        const response = await axios.put<WorkoutModel>(appConfig.workoutsUrl + workout._id, workout);

        // Extract the added workout sent back from the backend: 
        const updatedWorkout = response.data;
        
        // Add the new workout to global state: 
        const action: WorkoutsAction = { type: WorkoutsActionType.EditWorkout, payload: updatedWorkout};
        workoutsStore.dispatch(action);
    }

    public async deleteWorkout(workoutId: string): Promise<void> {
        // Delete workout form the database: 
        await axios.delete<WorkoutModel>(appConfig.workoutsUrl + workoutId);

        // Delete the workout form the global state: 
        const action: WorkoutsAction = { type: WorkoutsActionType.DeleteWorkout, payload: workoutId };
        workoutsStore.dispatch(action);
    }

}

const workoutsService = new WorkoutsService();
export default workoutsService;