import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import MenuIcon from "@mui/icons-material/Menu";
import {
    AppBar,
    Avatar,
    Box,
    Container,
    IconButton,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";
import Menu1 from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";
import "./AuthMenu.css";

const name = "Fitness Tracker";
const setting = "Login";

function AuthMenu(): JSX.Element {
  const [user, setUser] = useState<UserModel>();

  useEffect(() => {
    setUser(authStore.getState().user);
    const unsubscribe = authStore.subscribe(() =>
      setUser(authStore.getState().user)
    );
    return unsubscribe;
  }, [user]);

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

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
                <MenuItem key={name} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center" >{name}</Typography>
                </MenuItem>
            </Menu1>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <Typography
                key={name}
                onClick={handleCloseNavMenu}
              >
                {name}
              </Typography>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar src="/static/images/avatar/2.jpg" />
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
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <NavLink className={"navlink-style"} to={`/${setting}`}>{setting}</NavLink>
                </MenuItem>
            </Menu1>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default AuthMenu;
