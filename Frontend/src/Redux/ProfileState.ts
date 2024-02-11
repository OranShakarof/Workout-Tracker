import { createStore } from "redux";
import ProfileModel from "../Models/ProfileModel";

// 1. Global State: 
export default class ProfileState {
    public profile: ProfileModel = null;
}

// 2. Action Type:
export enum ProfileActionType {
    SetProfile = "SetProfile",
    AddProfile = "AddProfile",
    EditProfile = "EditProfile",
    DeleteProfile = "DeleteProfile",
}

// 3. Action: 
export interface ProfileAction {
    type: ProfileActionType,
    payload?: any; // The data related to that action. 
}

// 4. Reducer: 
export function profileReducer(currentState = new ProfileState(), action: ProfileAction): ProfileState {
    const newState = {...currentState}; // Duplicate the global state.

    // Change the duplicated global state according the action: 
    switch(action.type){
        case ProfileActionType.SetProfile: 
        case ProfileActionType.AddProfile: 
        case ProfileActionType.EditProfile: 
            newState.profile = action.payload; // Save the profile into global state:
            break;
        
        case ProfileActionType.DeleteProfile: 
            newState.profile = null;
            break;
    }

    return newState; // Return the change duplicated global state:

}

// 5. Store: 
export const profileStore = createStore(profileReducer);

