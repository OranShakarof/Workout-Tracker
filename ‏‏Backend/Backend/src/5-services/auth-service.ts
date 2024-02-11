import cyber from "../2-utils/cyber";
import { UnauthorizedError, ValidationError } from "../3-models/client-errors-model"
import { CredentialsModel, ICredentialsModel } from "../3-models/credentials-model";
import RoleModel from "../3-models/role-model";
import { IUserModel, UserModel } from "../3-models/user-model";

async function register(user: IUserModel): Promise<string> {
    
    // User validation:
    const errors = user.validateSync();
    if(errors) throw new ValidationError(errors.message);

    // If Email already exits: 
    const alreadyEmailExists = await UserModel.findOne({email: user.email}).exec();
    if(alreadyEmailExists) throw new ValidationError(`Email is already exists`);

    user.email = user.email.toLowerCase();

    // Set "User" as role:
    user.role = RoleModel.User;

    // hash user password:
    user.password = cyber.hashPassword(user.password);

    // Add the new user to the DB: 
    user.save();

    // Get new token: 
    const token = cyber.getNewToken(user);

    // Return Token: 
    return token;
}

async function login(credentials: ICredentialsModel): Promise<string> {
    
    // Credentials Validation:
    const errors = credentials.validateSync();

    if(errors) throw new ValidationError(errors.message);

    credentials.email = credentials.email.toLowerCase();

    // Hashed the credentials password.
    credentials.password = cyber.hashPassword(credentials.password);

    // Check if the user exits:
    const user = await CredentialsModel.findOne({$and: [{email: credentials.email},{password: credentials.password}]},{password:0}) as IUserModel; 

    // If no such user:
    if(!user) throw new UnauthorizedError("Incorrect username or password.");
    
    // Generate new token: 
    const token = cyber.getNewToken(user);

    // Return token:
    return token;
}


export default {
    register,
    login
};

