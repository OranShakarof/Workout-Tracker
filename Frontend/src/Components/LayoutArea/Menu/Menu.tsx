import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar,Avatar,Box,Button,Container,IconButton,Toolbar,Tooltip,Typography }from "@mui/material";
import Menu1 from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import { authStore } from "../../../Redux/AuthState";
import "./Menu.css";
import { NavLink, useNavigate } from "react-router-dom";
import ProfileModel from "../../../Models/ProfileModel";
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";
import profileService from "../../../Services/ProfileService";
import { profileStore } from "../../../Redux/ProfileState";

const pages = ["Workouts", "Summaries", "Progression"];
const settings = ["Profile", "Edit Profile", "Logout"];

function Menu(): JSX.Element {
  const user = authStore.getState().user;
  const [profile,setProfile] = useState<ProfileModel>();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    profileService.getProfileByUser(user._id)
    .then(profile => setProfile(profile))
    .catch((err: any) => notifyService.error(err)) 
  },[user._id])

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    const clickedMenuItem = event.currentTarget.textContent;
    setAnchorElUser(null);
    switch(clickedMenuItem){
        case "Profile":
            navigate("/profile");
            break;
        case "Edit Profile":
            navigate("/profile/edit/" + profile._id);
            break;
        case "Logout":
            handelLogout();
            break;
        }
  };

  function handelLogout(): void{
    authService.logout();
    profileStore.getState().profile = null;
    notifyService.success("Bye Bye...");
    navigate("/login");
}

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <FitnessCenterIcon
            sx={{ display: { xs: "none", md: "flex" }, mr: 2 }}
          />
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <FitnessCenterIcon
              sx={{ display: { xs: "flex", md: "none" }, m: "auto" }}
            />
            <Menu1
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <NavLink
                      key={page}
                      onClick={handleCloseNavMenu}
                      to={`/${page}`}
                      className="navlink-style"
                    >
                      {page}
                </NavLink>
                </MenuItem>
              ))}
            </Menu1>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <NavLink
                key={page}
                onClick={handleCloseNavMenu}
                to={`/${page}`}
                className="pages-style"
              >
                {page}
              </NavLink>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={user?.firstName}
                  src={profile ? profile.imageUrl : "/static/images/avatar/2.jpg"}
                />
              </IconButton>
            </Tooltip>
            <Menu1
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <NavLink className={"navlink-style"} to={`/${setting}`.toLowerCase()}>{setting}</NavLink>
                </MenuItem>
              ))}
            </Menu1>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Menu;
