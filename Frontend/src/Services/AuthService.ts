import axios from "axios";
import UserModel from "../Models/UserModel";
import appConfig from "../Utils/AppConfig";
import { AuthAction, AuthActionType, authStore } from "../Redux/AuthState";
import CredentialsModel from "../Models/CredentialsModel";

class AuthService {
    // Register new user: 
    public async register(user: UserModel): Promise<void> {
        
        // Send new user to backend:
        const response = await axios.post<string>(appConfig.registerUrl, user);

        // Extract the token: 
        const token = response.data;

        // Send the token to global state:
        const action: AuthAction = {type: AuthActionType.Register, payload: token};
        authStore.dispatch(action);
    }

    // User login: 
    public async login(credentials: CredentialsModel): Promise<void> {
        
        // Send Credentials to backend: 
        const response = await axios.post<string>(appConfig.loginUrl, credentials);

        // Extract the token: 
        const token = response.data;

        // Send the token to global state: 
        const action: AuthAction = {type: AuthActionType.Login, payload: token};
        authStore.dispatch(action);
    }

    public logout(): void{
        // Call logout in global state: 
        const action: AuthAction = {type: AuthActionType.Logout};
        authStore.dispatch(action);
    }

}

const authService = new AuthService();

export default authService;
