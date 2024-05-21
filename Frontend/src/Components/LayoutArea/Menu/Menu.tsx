import AddIcon from '@mui/icons-material/Add';
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Avatar, Box, Container, IconButton, Toolbar, Tooltip } from "@mui/material";
import Menu1 from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ProfileModel from "../../../Models/ProfileModel";
import { authStore } from "../../../Redux/AuthState";
import { profileStore } from "../../../Redux/ProfileState";
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";
import profileService from "../../../Services/ProfileService";
import "./Menu.css";

const pages = ["Workouts", "Summaries", "Progression"];
const settings = ["Profile", "Edit Profile", "Logout"];

function Menu(): JSX.Element {
  const user = authStore.getState().user;
  const [profile,setProfile] = useState<ProfileModel>();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [activePage, setActivePage] = useState<string>(null);
  const navigate = useNavigate();

  useEffect(() => {
    profileService.getProfileByUser(user._id)
    .then(profile => setProfile(profile))
    .catch((err: any) => notifyService.error(err));
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

  const handleClick = (page: string) => {
    setActivePage(page); 
  };

  const handleCloseUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    const clickedMenuItem = event.currentTarget.textContent;
    setAnchorElUser(null);
    switch(clickedMenuItem){
        case "Profile":
            navigate("/profile");
            handleClick(null);
            break;
        case "Edit Profile":
            navigate("/profile/edit/" + profile._id);
            handleClick(null);
            break;
        case "Logout":
            handelLogout();
            handleClick(null);
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
                      to={`/${page.toLocaleLowerCase()}`}
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
                  onClick={() => setActivePage(page)} // Set active page when clicked
                  to={`/${page.toLocaleLowerCase()}`}
                  className={`pages-style ${activePage === page ? 'active' : ''}`} // Apply 'active' class dynamically
                >
                  {page}
                </NavLink>
              ))}
          </Box>
          {user.role === 1 && <Box sx={{m: 1, cursor: 'pointer'}}>
            <Tooltip title="Add Workout">
                <NavLink to={"/workouts/new"}>
                    <AddIcon className="add-style"/>
                </NavLink>
            </Tooltip>
          </Box>}
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
