import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../../AuthArea/Login/Login";
import Register from "../../AuthArea/Register/Register";
import Home from "../../HomeArea/Home/Home";
import Profile from "../../ProfileArea/Profile/Profile";
import PageNotFound from "../PageNotFound/PageNotFound";
import EditProfile from "../../ProfileArea/EditProfile/EditProfile";

function Routing(): JSX.Element {
    return (
        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/profile/edit/:_id" element={<EditProfile/>} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
}

export default Routing;
