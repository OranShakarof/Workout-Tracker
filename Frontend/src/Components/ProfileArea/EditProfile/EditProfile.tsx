import { Grid, Typography, TextField, Button } from "@mui/material";
import { send } from "process";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import "./EditProfile.css";
import { useState, ChangeEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { authStore } from "../../../Redux/AuthState";
import ProfileModel from "../../../Models/ProfileModel";
import profileService from "../../../Services/ProfileService";
import notifyService from "../../../Services/NotifyService";

function EditProfile(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
  } = useForm<ProfileModel>();
  const [selectedImage, setSelectedImage] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const _id = params._id;
  const user = authStore.getState().user;

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      const newImageUrl = URL.createObjectURL(event.target.files[0]);
      setSelectedImage(newImageUrl);
    }
  }

  useEffect(() => {
    profileService
      .getProfileByUser(user._id)
      .then((profile) => {
        setValue("height", profile.height);
        setValue("weight", profile.weight);
        setValue("weightGoal", profile.weightGoal);
        setValue("fatPercentage", profile.fatPercentage);

        // Set the existing image URL:
        setSelectedImage(profile.imageUrl);
      })
      .catch((err: any) => notifyService.error(err));
  }, [user._id]);

  async function send(profile: ProfileModel) {
    try {
      profile._id = _id;
      profile.image = (profile.image as unknown as FileList)[0];
      await profileService.editProfile(profile);
      notifyService.success("Profile has been updated successfully");
      navigate("/profile");
    } catch (err: any) {
      notifyService.error(err);
    }
  }

  return (
    <div className="EditProfile">
      <form onSubmit={handleSubmit(send)}>
        <Grid container spacing={2} className="Box">
          <Typography
            component="h1"
            variant="h5"
            sx={{ mt: 2 }}
            textAlign={"center"}
          >
            Edit Profile
          </Typography>
          <Grid item xs={12} sm={12}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={6}>
                <TextField
                  type="number"
                  fullWidth
                  label="Height (cm)"
                  defaultValue={" "}
                  inputProps={{ max: 250, min: 80 }}
                  InputLabelProps={{ shrink: true }}
                  {...register("height", {
                    required: "* Height is required!",
                    min: {
                      value: 80,
                      message: "* Height needs to be at least 80cm!",
                    },
                    max: {
                      value: 250,
                      message: "* Height needs to be less than 250cm!",
                    },
                  })}
                  onBlur={() => trigger("height")}
                  error={!!errors.height}
                  helperText={errors.height?.message}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <TextField
                  type="number"
                  fullWidth
                  label="Weight (kg)"
                  defaultValue={" "}
                  inputProps={{ max: 450, min: 30 }}
                  InputLabelProps={{ shrink: true }}
                  {...register("weight", {
                    required: "* Weight is required!",
                    min: {
                      value: 30,
                      message: "* Weight needs to be at least 30kg!",
                    },
                    max: {
                      value: 450,
                      message: "* Weight needs to be less than 450kg!",
                    },
                  })}
                  onBlur={() => trigger("weight")}
                  error={!!errors.weight}
                  helperText={errors.weight?.message}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField  
                        fullWidth
                        type="number"
                        label="Fat %"
                        defaultValue={0}
                        {...register("fatPercentage",{
                            min:{
                                value: 1,
                                message: "* Fat Percentage can't be Lower than 1%!"
                            },
                            max:{
                                value: 50,
                                message: "* Fat Percentage can't be over 50%!"
                            },
                        })}
                        onBlur={() => trigger("fatPercentage")}
                        error={!!errors.fatPercentage}
                        helperText={errors.fatPercentage?.message}
                    />
                </Grid>
              <Grid item xs={6} sm={6}>
                <TextField
                  type="number"
                  fullWidth
                  label="Weight goal (kg)"
                  defaultValue={" "}
                  inputProps={{ max: 350, min: 40 }}
                  InputLabelProps={{ shrink: true }}
                  {...register("weightGoal", {
                    required: "* weight goal is required!",
                    min: {
                      value: 40,
                      message: "* Weight Goal need to be at leasts 40kg !",
                    },
                    max: {
                      value: 350,
                      message: "* Weight Goal need to be less than 350kg!",
                    },
                  })}
                  onBlur={() => trigger("weightGoal")}
                  error={!!errors.weightGoal}
                  helperText={errors.weightGoal?.message}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <div className="image-input-container">
              <img src={selectedImage} alt="Selected Profile Pic" />
              <label>Change Image</label>
              <input
                type="file"
                {...register("image")}
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ textTransform: "none" }}
            >
              Update
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{
                mb: 2,
                textTransform: "none",
                backgroundColor: "white",
                color: "black",
                "&:hover": { backgroundColor: "grey" },
              }}
            >
              <NavLink className="cancelStyle" to="/profile">
                Cancel
              </NavLink>
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default EditProfile;
