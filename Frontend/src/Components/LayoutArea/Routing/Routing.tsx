import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../../AuthArea/Login/Login";
import Register from "../../AuthArea/Register/Register";
import Home from "../../HomeArea/Home/Home";
import AddProfile from "../../ProfileArea/AddProfile/AddProfile";
import EditProfile from "../../ProfileArea/EditProfile/EditProfile";
import Profile from "../../ProfileArea/Profile/Profile";
import PageNotFound from "../PageNotFound/PageNotFound";
import AddWorkout from "../../WorkoutsArea/AddWorkout/AddWorkout";
import EditWorkout from "../../WorkoutsArea/EditWorkout/EditWorkout";
import WorkoutsList from "../../WorkoutsArea/WorkoutsList/WorkoutsList";
import WorkoutsDetails from "../../WorkoutsArea/WorkoutDetails/WorkoutDetails";

function Routing(): JSX.Element {
    return (
        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/profile/edit/:_id" element={<EditProfile/>} />
            <Route path="/profile/new" element={<AddProfile/>} />
            <Route path="/workouts" element={<WorkoutsList/>} />
            <Route path="/workouts/:_id" element={<WorkoutsDetails/>} />
            <Route path="/workouts/new" element={<AddWorkout/>} />
            <Route path="/workouts/edit/:_id" element={<EditWorkout/>} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
}

export default Routing;
