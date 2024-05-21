import { Card, Table, Typography, Tooltip, Button } from 'antd';
import { SetModel, WorkoutModel } from "../../../Models/WorkoutsModel";
import "./WorkoutDetails.css";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { authStore } from "../../../Redux/AuthState";
import { useEffect, useState } from "react";
import workoutsService from "../../../Services/WorkoutsService";
import notifyService from "../../../Services/NotifyService";
import RollbackOutlined from '@ant-design/icons/lib/icons/RollbackOutlined';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined';

const { Text } = Typography;
  
function WorkoutDetails(): JSX.Element {
    const params = useParams();
    const _id = params._id;
    const user = authStore.getState().user;
    const navigate = useNavigate();

    const [workout, setWorkout] = useState<WorkoutModel>();

    useEffect(() => {
        workoutsService.getOneWorkout(_id)
        .then(w => setWorkout(w))
        .catch(err => notifyService.error(err));
    },[])
    
    function formatDate(dateString: string): string {
        const date = new Date(dateString);
    
        const options: Intl.DateTimeFormatOptions = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            timeZone: 'UTC' 
        };
    
        const formattedDate: string = date.toLocaleString('en-US', options);
        return formattedDate;
    }

    async function deleteMe(workoutId: string) {
        try{
            // Check if the user sure:
            const sure = window.confirm("Are you sure ?")
            if(!sure) return;
            // Delete the workout form DB.
            await workoutsService.deleteWorkout(workoutId);
            // Alert Success: 
            notifyService.success("Workout has been deleted!");
            navigate("/workouts");

        }
        catch(err: any) {
            notifyService.error(err)
        }
        
    }

    const columns = [
        {
            title: 'Exercise',
            dataIndex: 'exercise',
            key: 'exercise',
        },
        {
            title: 'Sets',
            dataIndex: 'sets',
            key: 'sets',
            render: (sets: SetModel[]) => (
                <ul>
                    {sets.map((set, index) => (
                        <li key={index}>
                            <Text strong>Set {index + 1}:</Text>{' '}
                            <Text>Reps: {set.reps}, Weight: {set.weight} Kg</Text>
                        </li>
                    ))}
                </ul>
            ),
        },
        {
            title: 'Rest Periods',
            dataIndex: 'restPeriods',
            key: 'restPeriods',
        },
        {
            title: 'PR',
            dataIndex: 'isPR',
            key: 'isPR',
            render: (isPR: boolean) => <Text>{isPR ? '🥲' : '👑'}</Text>,
        },
    ];

    const data = workout?.exercises.map((exercise, index) => ({
        key: index,
        exercise: exercise.exercise,
        sets: exercise.sets,
        restPeriods: exercise.restPeriods,
        isPR: exercise.isPR ? 'Yes' : 'No',
    }));

    return (
        <div className="WorkoutCard">
           <div className="WorkoutCard">
               <Card
                    title={
                        <div>
                            <span>{workout?.workoutName}</span>
                            <br />
                            <span aria-label="calendar">🗓️ {formatDate(workout?.date)}</span>
                        </div>
                    }
                    className="workout-card"
                >
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    bordered
                    size="middle"
                />
                <div className="table-navlinks">
                    <Tooltip title="Go Back">
                      <NavLink to={"/workouts"} className={"btn-style"}>
                        <RollbackOutlined />
                      </NavLink>
                    </Tooltip>
                    <Tooltip title="Edit Workout">
                      <NavLink to={"/workouts/edit/" + workout?._id} className={"btn-style"}>
                        <EditOutlined />
                      </NavLink>
                    </Tooltip>
                    <Tooltip title="Delete Workout">
                      <Button className={"btn-style"} onClick={() => deleteMe(workout?._id)}>
                        <DeleteOutlined />
                      </Button>
                    </Tooltip>
                </div>
                </Card>
            </div>
        </div>
    );
}

export default WorkoutDetails;
