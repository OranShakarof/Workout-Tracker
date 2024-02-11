import axios from "axios";
import ProfileModel from "../Models/ProfileModel";
import appConfig from "../Utils/AppConfig";
import { ProfileAction, ProfileActionType, profileStore } from "../Redux/ProfileState";

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
    //  public async addProfile(profile: ProfileModel): Promise<void>{
        
    // }

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

}

const profileService = new ProfileService();
export default profileService;