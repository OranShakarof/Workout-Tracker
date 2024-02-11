import { ResourceNotFoundError, ValidationError } from "../../../Shared/models/client-errors-model";
import appConfig from "../2-utils/app-config";
import imageHelper from "../2-utils/image-helper";
import { IWeeklyProgressModel, WeeklyProgressModel } from "../3-models/weekly-progress-model";

async function getAllWeeklyProgressesByUser(userId: string): Promise<IWeeklyProgressModel[]> {
    const weeklyProgresses = await WeeklyProgressModel.find({userId: userId}).exec();
    if(!weeklyProgresses || weeklyProgresses.length === 0) throw new ResourceNotFoundError(userId);

    // Manipulate each weekly progress document to include the imageUrl field
    const manipulatedProgresses = weeklyProgresses.map(weeklyProgress => ({
       ...weeklyProgress.toObject(),
       imageUrl: `${appConfig.prodDomain}/api/weekly-progress-image/${weeklyProgress.imageName}`,
    })) as IWeeklyProgressModel[];

    return manipulatedProgresses;
}

async function addWeeklyProgress(weeklyProgress: IWeeklyProgressModel): Promise<IWeeklyProgressModel> {
    
    // Validate: 
    const errors = weeklyProgress.validateSync();
    if(errors) throw new ValidationError(errors.message);

    // Save image: 
    weeklyProgress.imageName = await imageHelper.saveImage(weeklyProgress.image);

    // Remove given image from weekly progress object before saving to the database:
    weeklyProgress.image = undefined;

    // Save the weekly progress in database:
    await weeklyProgress.save();

    // Get image url:
    weeklyProgress.imageUrl = `${appConfig.prodDomain}/api/weekly-progress-image/${weeklyProgress.imageName}`;

    // Return added weekly progress:
    return weeklyProgress;

}

async function updateWeeklyProgress(weeklyProgress: IWeeklyProgressModel): Promise<IWeeklyProgressModel> {
    
    // Validate: 
    const errors = weeklyProgress.validateSync();
    if(errors) throw new ValidationError(errors.message);

    // Get old image: 
    const oldImage = await getOldImage(weeklyProgress._id);
    let imageName = oldImage;

    // If Client sent image to update: 
    if(weeklyProgress.image) {
        // Update image:
        imageName = await imageHelper.updateImage(weeklyProgress.image, oldImage);
        weeklyProgress.imageName = imageName;
    }

    // Remove given image from weekly progress object before saving to the database:
    weeklyProgress.image = undefined;

    // Update the weekly progress in database:
    const updatedWeeklyProgress = await WeeklyProgressModel.findByIdAndUpdate(weeklyProgress._id, weeklyProgress, {returnOriginal: false}).exec();
    if(!updatedWeeklyProgress) throw new ResourceNotFoundError(weeklyProgress._id);

    // Get image URL:
    updatedWeeklyProgress.imageUrl = `${appConfig.prodDomain}/api/weekly-progress-image/${imageName}`;

    // Return the updated Weekly progress:
    return updatedWeeklyProgress;
}

async function deleteWeeklyProgress(_id: string): Promise<void> {
    // Take old image:
    const oldImage = await getOldImage(_id);

    // delete that Image: 
    await imageHelper.deleteImage(oldImage);

    // Delete the weekly progress:
    const deletedWeeklyProgress = await WeeklyProgressModel.findByIdAndRemove(_id).exec();
    if(!deletedWeeklyProgress) throw new ResourceNotFoundError(_id);
}

// Get image name: 
async function getOldImage(_id: string): Promise<string>{
    const weeklyProgress = await WeeklyProgressModel.findOne({ _id }).exec();
    if(!weeklyProgress) return null;
    const imageName = weeklyProgress.imageName;
    return imageName;
}


export default {
    getAllWeeklyProgressesByUser,
    addWeeklyProgress,
    updateWeeklyProgress,
    deleteWeeklyProgress
}
