import { Button, Grid, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
    ExerciseModel,
    SetModel,
    WorkoutModel,
} from "../../../Models/WorkoutsModel";
import { authStore } from "../../../Redux/AuthState";
import notifyService from "../../../Services/NotifyService";
import workoutsService from "../../../Services/WorkoutsService";
import "./EditWorkout.css";
import { RollbackOutlined } from "@ant-design/icons";

function EditWorkout(): JSX.Element {
  const [defaultValues, setDefaultValues] = useState<WorkoutModel>({
    _id: "",
    userId: "",
    workoutName: "",
    date: "",
    exercises: [],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    control,
    setValue,
  } = useForm<WorkoutModel>({ defaultValues });

  const {
    fields: exercises,
    append: appendExercise,
    remove: removeExercise,
  } = useFieldArray<WorkoutModel, "exercises">({ control, name: "exercises" });

  const navigate = useNavigate();
  const params = useParams();
  const workoutId = params._id;
  const user = authStore.getState().user;

  useEffect(() => {
    workoutsService
      .getOneWorkout(workoutId)
      .then((workout) => {
        setDefaultValues(workout);
        setValue("workoutName", workout.workoutName); // Set default value for workout name
        setValue("date", workout.date); // Set default value for date
        workout.exercises.forEach((exercise) => {
            appendExercise(exercise); // Add each exercise to the form
        });
      })
      .catch((err) => notifyService.error(err));
  }, [workoutId]);

  async function send(workout: WorkoutModel) {
    try {
      workout.userId = user._id;
      workout._id = workoutId;
      await workoutsService.editWorkout(workout);
      notifyService.success("Workout has been updated successfully!");
      navigate(`/workouts/${workoutId}`);
    } catch (err: any) {
      notifyService.error(err);
    }
  }

  const handleAddExercise = () => {
    const newExercise: ExerciseModel = {
      exercise: "",
      restPeriods: "",
      sets: [{ reps: 0, weight: 0 }],
    };
    appendExercise(newExercise);
  };

  const handleRemoveExercise = (index: number) => {
    removeExercise(index);
  };

  const handelAddSet = (exerciseIndex: number) => {
    const newSet: SetModel = { reps: 0, weight: 0 };
    // Push the new set to the sets array of the specified exercise
    exercises[exerciseIndex].sets.push(newSet);
    // Trigger re-render to reflect the changes
    trigger();
  };

  const handleRemoveSet = (exerciseIndex: number, setIndex: number) => {
    // Remove the set from the sets array of the specified exercise
    exercises[exerciseIndex].sets.splice(setIndex, 1);
    // Trigger re-render to reflect the changes
    trigger();
  };
  return (
    <div className="EditWorkout">
      <form onSubmit={handleSubmit(send)}>
        <Grid container className="Box">
          <Grid item xs={12}>
            <Typography component="h1" variant="h5" className="title">
              Edit Workout
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ m: 1 }}>
            <TextField
              fullWidth
              label="Workout Name"
              defaultValue={" "}
              inputProps={{ maxLength: 100, minLength: 2 }}
              InputLabelProps={{ shrink: true }}
              sx={{ m: 1 }}
              {...register("workoutName", {
                required: "* Workout name is Required!",
                minLength: {
                  value: 2,
                  message: "* Workout name need to be at least 2 Chars",
                },
                maxLength: {
                  value: 100,
                  message: "* Workout name need to be less then 100 Chars",
                },
              })}
              onBlur={() => trigger("workoutName")}
              error={!!errors.workoutName}
              helperText={errors.workoutName?.message}
            />
          </Grid>
          <Grid item xs={5} sx={{ m: 1 }}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ m: 1 }}
              {...register("date", {
                required: "* Date is Required!",
              })}
              onBlur={() => trigger("date")}
              error={!!errors.date}
              helperText={errors.date?.message}
            />
          </Grid>
          {exercises.map((exercise, exerciseIndex) => (
            <Grid item xs={12} key={exercise.id}>
              <Typography variant="h6" gutterBottom>
                Exercise {exerciseIndex + 1}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Exercise Name"
                    defaultValue={" "}
                    inputProps={{ maxLength: 100, minLength: 2 }}
                    sx={{ m: 1 }}
                    {...register(`exercises.${exerciseIndex}.exercise`, {
                      required: "* Missing Exercise Name!",
                      minLength: {
                        value: 2,
                        message: "* Exercise name need to be at least 2 Chars",
                      },
                      maxLength: {
                        value: 100,
                        message:
                          "* Exercise name need to be less then 100 Chars",
                      },
                    })}
                    onBlur={() =>
                      trigger(`exercises.${exerciseIndex}.exercise`)
                    }
                    error={!!errors.exercises?.[exerciseIndex]?.exercise}
                    helperText={
                      errors.exercises?.[exerciseIndex]?.exercise?.message
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Rest periods (Not Required)"
                    defaultValue={" "}
                    inputProps={{ maxLength: 50, minLength: 2 }}
                    sx={{ m: 1 }}
                    {...register(`exercises.${exerciseIndex}.restPeriods`, {
                      minLength: {
                        value: 2,
                        message: "* Rest periods need to be at least 2 Chars",
                      },
                      maxLength: {
                        value: 100,
                        message: "* Rest periods need to be less then 50 Chars",
                      },
                    })}
                  />
                </Grid>
              </Grid>

              {exercise.sets.map((set, setIndex) => (
                <Grid container spacing={2} key={setIndex}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Set {setIndex + 1}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      fullWidth
                      label="Weight (Kg)"
                      defaultValue={" "}
                      sx={{ m: 1 }}
                      {...register(
                        `exercises.${exerciseIndex}.sets.${setIndex}.weight`,
                        {
                          required: "* Missing Weight!",
                          min: {
                            value: 0,
                            message: "* Weight can't be lower then 1Kg!",
                          },
                          max: {
                            value: 450,
                            message: "* Weight can't be higher then 450Kg!",
                          },
                        }
                      )}
                      onBlur={() =>
                        trigger(
                          `exercises.${exerciseIndex}.sets.${setIndex}.weight`
                        )
                      }
                      error={
                        !!errors.exercises?.[exerciseIndex]?.sets?.[setIndex]
                          ?.weight
                      }
                      helperText={
                        errors.exercises?.[exerciseIndex]?.sets?.[setIndex]
                          ?.weight?.message
                      }
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      fullWidth
                      label="Reps"
                      defaultValue={" "}
                      sx={{ m: 1 }}
                      {...register(
                        `exercises.${exerciseIndex}.sets.${setIndex}.reps`,
                        {
                          required: "* Missing Reps!",
                          min: {
                            value: 1,
                            message: "* Reps can't be lower then 1!",
                          },
                          max: {
                            value: 100,
                            message: "* Reps can't be over then 100 Chars",
                          },
                        }
                      )}
                      onBlur={() =>
                        trigger(
                          `exercises.${exerciseIndex}.sets.${setIndex}.reps`
                        )
                      }
                      error={
                        !!errors.exercises?.[exerciseIndex]?.sets?.[setIndex]
                          ?.reps
                      }
                      helperText={
                        errors.exercises?.[exerciseIndex]?.sets?.[setIndex]
                          ?.reps?.message
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Button
                      type="button"
                      className="button-style"
                      onClick={() => handleRemoveSet(exerciseIndex, setIndex)}
                    >
                      Remove Set
                    </Button>
                  </Grid>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button
                  type="button"
                  className="button-style"
                  onClick={() => handelAddSet(exerciseIndex)}
                >
                  Add Set
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="button"
                  className="button-style"
                  onClick={() => handleRemoveExercise(exerciseIndex)}
                >
                  Remove Exercise
                </Button>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button className="button-style" onClick={handleAddExercise}>
              Add Exercise
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="button-style"
            >
              Update workout
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              type="button"
              variant="contained"
              color="inherit"
              className="button-style"
              onClick={() => navigate("/workouts")}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default EditWorkout;
