import { useState, useEffect } from "react";
import UserModel from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";
import AuthMenu from "../../AuthArea/AuthMenu/AuthMenu";
import Menu from "../Menu/Menu";
import Routing from "../Routing/Routing";
import "./Layout.css";

function Layout(): JSX.Element {
    const [user,setUser] = useState<UserModel>();

    useEffect(() => {
        setUser(authStore.getState().user);
        const unsubscribe = authStore.subscribe(() => setUser(authStore.getState().user));
        return unsubscribe;
    },[user]);
    
    return (
        <div className="Layout">
            
            {user && <Menu />}
            {!user && <AuthMenu />}
            

            <Routing />
            
        </div>
    );
}

export default Layout;
