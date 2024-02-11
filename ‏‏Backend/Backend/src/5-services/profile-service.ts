import appConfig from "../2-utils/app-config";
import imageHelper from "../2-utils/image-helper";
import { ResourceNotFoundError, ValidationError,  } from "../3-models/client-errors-model"; 
import { IProfileModel, ProfileModel } from "../3-models/profile-model";


async function getProfileByUser(userId: string): Promise<IProfileModel> {
    const profile = await ProfileModel.findOne({userId: userId}).exec();
    if(!profile) throw new ResourceNotFoundError(userId);

    // Manipulate the profile object to include the imageUrl field
    profile.imageUrl = `${appConfig.prodDomain}/api/profile-image/${profile.imageName}`;
    
    return profile;
}

async function addProfile(profile: IProfileModel): Promise<IProfileModel> {
    
    // Validate: 
    const errors = profile.validateSync();
    if(errors) throw new ValidationError(errors.message);

    // Save image:
    const imageName = await imageHelper.saveImage(profile.image);

    // Save imageName: 
    profile.imageName = imageName;
    
    // Remove given image from profile object before saving to the database:
    profile.image = undefined;

    // Save the profile in database:
    await profile.save();

    // Get image url: 
    profile.imageUrl = `${appConfig.prodDomain}/api/profile-image/${imageName}`;

    // return added profile:
    return profile;
}

async function updateProfile(profile: IProfileModel): Promise<IProfileModel> {
    // Validate:
    const errors = profile.validateSync();
    if(errors) throw new ValidationError(errors.message);

    // Get old image:
    const oldImage = await getOldImage(profile._id);
    let imageName = oldImage;

    // If client sent image to update:
    if(profile.image){

        // Update image: 
        imageName = await imageHelper.updateImage(profile.image, oldImage);
        profile.imageName = imageName;

    }
    // Remove given image from profile object:
    profile.image = undefined;

    const updatedProfile = await ProfileModel.findByIdAndUpdate(profile._id, profile, {returnOriginal: false}).exec();
    if(!updatedProfile) throw new ResourceNotFoundError(profile._id);

    // Get image url: 
    updatedProfile.imageUrl = `${appConfig.prodDomain}/api/profile-image/${imageName}`;

    // Return the updated profile:
    return updatedProfile;
}

async function deleteProfile(_id: string): Promise<void> {

    // Take old image: 
    const oldImage = await getOldImage(_id);

    // Delete that image: 
    await imageHelper.deleteImage(oldImage);

    const deletedProfile = await ProfileModel.findByIdAndDelete(_id).exec();
    if(!deletedProfile) throw new ResourceNotFoundError(_id);
}

// Get image name: 
async function getOldImage(_id: string): Promise<string>{
    const profile = await ProfileModel.findOne({ _id }).exec();
    if(!profile) return null;
    const imageName = profile.imageName;
    return imageName;
}

export default {
    getProfileByUser,
    addProfile,
    updateProfile,
    deleteProfile
};

