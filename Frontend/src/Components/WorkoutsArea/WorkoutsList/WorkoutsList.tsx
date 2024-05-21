import moment from 'moment';
import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';
import { WorkoutModel } from "../../../Models/WorkoutsModel";
import { authStore } from "../../../Redux/AuthState";
import notifyService from "../../../Services/NotifyService";
import workoutsService from "../../../Services/WorkoutsService";
import "./WorkoutsList.css";


function WorkoutsList(): JSX.Element {
    const navigate = useNavigate();
    const user = authStore.getState().user;
    const [workouts,setWorkouts] = useState<WorkoutModel[]>([]);
    const [currentView, setCurrentView] = useState<string>('');
    const localizer = momentLocalizer(moment);

    
    useEffect(() =>{
        if(user){
            workoutsService.getWorkoutsByUser(user._id)
            .then(w => setWorkouts(w))
            .catch(err => notifyService.error(err))
        }
    },[user._id]);

    const events = workouts.map((w) => {
        const dateAndTimeWithoutTime = new Date(w.date);
        dateAndTimeWithoutTime.setHours(0, 0, 0, 0); // Set time to midnight
    
        return {
            id: w._id,
            title: w.workoutName,
            start: dateAndTimeWithoutTime,
            end: dateAndTimeWithoutTime             
        };
    });

    function handleViewChange(view: string) {
        setCurrentView(view);
        console.log(events);
        
    }

    function handleEventSelect(event: any) {
        navigate("/workouts/" + event.id);
    }
    

    return (
        <div className="WorkoutsList">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    className="calendar"
                    views={['month', 'week']}
                    onView={handleViewChange}
                    onSelectEvent={handleEventSelect}
                    />
        </div>
    );
}

export default WorkoutsList;
