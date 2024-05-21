import axios from "axios";
import ProfileModel from "../Models/ProfileModel";
import { ProfileAction, ProfileActionType, profileStore } from "../Redux/ProfileState";
import appConfig from "../Utils/AppConfig";

class ProfileService{
    // Get Profile:
    public async getProfileByUser(userId: string): Promise<ProfileModel>{
        let profile = profileStore.getState().profile;

        if(!profile){
            // Get the profile from the backend:
            const response = await axios.get<ProfileModel>(appConfig.profileUrl + userId);
            
            // Extract the profile: 
            profile = response.data;
            
            // Send profile to global state: 
            const action: ProfileAction = {type: ProfileActionType.SetProfile, payload: profile};
            profileStore.dispatch(action);
        }

        // Return Profile:
        return profile;
    }

    // Add Profile:
    public async addProfile(profile: ProfileModel): Promise<void>{
        
        // The additional image that send with the data.
        const options = {
            headers: { "Content-Type": "multipart/form-data" } // Include files in the request.
        }

        // Send Profile to backend: 
        const response = await axios.post<ProfileModel>(appConfig.profileUrl, profile, options);

        // Extract the added profile sent back from the backend:
        const addedProfile = response.data;
    
        // Add the profile global state:
        const action: ProfileAction = {type: ProfileActionType.AddProfile, payload: addedProfile };
        profileStore.dispatch(action);    
    }

    // Edit Profile:
    public async editProfile(profile: ProfileModel): Promise<void>{

        // The additional image that send with the data.
        const options = {
            headers: { "Content-Type": "multipart/form-data" } // Include files in the request.
        }

        // Send Profile to backend: 
        const response = await axios.put<ProfileModel>(appConfig.profileUrl + profile._id, profile, options);

        // Extract the updated profile sent back from the backend:
        const updatedProfile = response.data;

        // Update the profile global state:
        const action: ProfileAction = {type: ProfileActionType.EditProfile, payload: updatedProfile };
        profileStore.dispatch(action);
        
    }

    public async deleteProfile(_id: string) {
        // Delete Profile in backend:
        await axios.delete(appConfig.profileUrl + _id);

        // Delete the profile from the global state:
        const action: ProfileAction = { type: ProfileActionType.DeleteProfile, payload: _id };
        profileStore.dispatch(action);
    }

}

const profileService = new ProfileService();
export default profileService;