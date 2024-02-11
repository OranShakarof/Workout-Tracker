import PhotoIcon from '@mui/icons-material/Photo';
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import ButtonGroup from "@mui/joy/ButtonGroup";
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Chip from "@mui/joy/Chip";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import { Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import ProfileModel from "../../../Models/ProfileModel";
import { authStore } from "../../../Redux/AuthState";
import notifyService from "../../../Services/NotifyService";
import profileService from "../../../Services/ProfileService";
import "./Profile.css";
import { useNavigate } from 'react-router-dom';

function Profile(): JSX.Element {
  const user = authStore.getState()?.user;
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileModel>();

  useEffect(() => {
    profileService
      .getProfileByUser(user._id)
      .then((profile) => setProfile(profile))
      .catch((err) => notifyService.error(err));
  }, [user._id]);

  function handleEditClick() {
    navigate("/profile/edit/" + profile._id);
  }
  return (
    <div className="Profile">
      <Card
        sx={{
          width: 320,
          maxWidth: "100%",
          boxShadow: "lg",
        }}
      >
        <CardContent sx={{ alignItems: "center", textAlign: "center" }}>
          <Avatar
            src={profile?.imageUrl}
            sx={{ "--Avatar-size": "4rem" }}
          />
          <Chip
            size="sm"
            variant="soft"
            color="primary"
            sx={{
              mt: -1,
              mb: 1,
              border: "3px solid",
              borderColor: "background.surface",
            }}
          >
            GYM-Bro
          </Chip>
          <Typography level="title-lg">{`${user.firstName} ${user.lastName}`}</Typography>
          <Typography level="body-sm" sx={{ maxWidth: "24ch" }}>
            <Typography className="paragraph">Height: {profile?.height}cm</Typography>
            <Typography className="paragraph">Weight: {profile?.weight}kg</Typography>
            <Typography className="paragraph">Fat percentage: {profile?.fatPercentage}%</Typography>
            <Typography className="paragraph" sx={{fontWeight: 700}}>Goal: {profile?.weightGoal}kg</Typography>
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 2,
              "& > button": { borderRadius: "2rem" },
            }}
          >
            <IconButton size="sm" variant="plain" color="neutral">
                <Tooltip title="Gallery">
                    <PhotoIcon/>
                </Tooltip>
            </IconButton>
            <IconButton size="sm" variant="plain" color="neutral">
                <Tooltip title="Workouts">
                    <SportsMartialArtsIcon/>
                </Tooltip>
            </IconButton>
          </Box>
        </CardContent>
        <CardOverflow sx={{ bgcolor: "background.level1" }}>
          <CardActions buttonFlex="1">
            <ButtonGroup
              variant="outlined"
              sx={{ bgcolor: "background.surface" }}
            >
              <Button onClick={handleEditClick}>Edit Profile</Button>
              <Button>Progression</Button>
            </ButtonGroup>
          </CardActions>
        </CardOverflow>
      </Card>
    </div>
  );
}

export default Profile;
