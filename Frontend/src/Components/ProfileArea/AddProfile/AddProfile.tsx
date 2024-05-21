import { useState, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import ProfileModel from "../../../Models/ProfileModel";
import { authStore } from "../../../Redux/AuthState";
import "./AddProfile.css";
import notifyService from "../../../Services/NotifyService";
import profileService from "../../../Services/ProfileService";
import { Grid, Typography, TextField, Button } from "@mui/material";

function AddProfile(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
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

  async function send(profile: ProfileModel) {
    try {
      // Convert FileList (containing single file) into File type:
      profile.image = (profile.image as unknown as FileList)[0];
      profile.userId = user._id;
      await profileService.addProfile(profile);
      notifyService.success("Profile has been added successfully");
      navigate("/profile");
    } catch (err: any) {
      notifyService.error(err);
    }
  }

  return (
    <div className="AddProfile">
      <form onSubmit={handleSubmit(send)}>
        <Grid container spacing={2} className="Box">
          <Typography
            component="h1"
            variant="h5"
            sx={{ mt: 2 }}
            textAlign={"center"}
            className="title"
          >
            Create Profile
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
                  {...register("fatPercentage", {
                    min: {
                      value: 1,
                      message: "* Fat Percentage can't be Lower than 1%!",
                    },
                    max: {
                      value: 50,
                      message: "* Fat Percentage can't be over 50%!",
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
              <img src={selectedImage} />
              <label>🖼️ Add Profile Picture</label>
              <input
                type="file"
                {...register("image")}
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
          </Grid>
          <Grid item xs={8}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ textTransform: "none" }}
            >
              Create
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default AddProfile;
