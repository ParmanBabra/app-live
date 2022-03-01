import { Fragment, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import FlutterDashIcon from "@mui/icons-material/FlutterDash";
import Avatar from "@mui/material/Avatar";
import Login from "./features/login/Login";

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

import Live from "./features/live/Live";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./app/store";
import { logout } from "./features/login/userSlice";
import { ListItemIcon, Menu, MenuItem } from "@mui/material";
import { UserState } from "./features/login/model";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { AdminLive } from "./features/admin-live/AdminLive";
import { Check } from "@mui/icons-material";
import { toggleShowName } from "./features/app/AppSlice";
import PersonIcon from "@mui/icons-material/Person";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";

import logo from "./images/Logo.svg";
import "./App.css"

function App() {
  const user = useSelector((state: RootState) => state.user);
  const app = useSelector((state: RootState) => state.app);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toLink = (to: string) => {
    navigate(to);
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    setAnchorEl(null);
    navigate("/");
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  function renderUser(user: UserState) {
    if (!user.email) return <Fragment></Fragment>;

    return (
      <Fragment>
        <Typography
          variant="h6"
          color="inherit"
          noWrap
          sx={{ display: { xs: "none", md: "inline", lg: "inline" } }}
        >
          {user.name}
        </Typography>
        <IconButton sx={{ ml: 2, color: "#FFF" }} onClick={handleMenu}>
          <MenuIcon />
        </IconButton>

        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => toLink("/")}>
            <ListItemIcon>
              <OndemandVideoIcon />
            </ListItemIcon>
            Live
          </MenuItem>
          {user.isAdmin && (
            <MenuItem onClick={() => toLink("/admin-live")}>
              <ListItemIcon>
                <SupervisorAccountIcon />
              </ListItemIcon>
              Admin Live
            </MenuItem>
          )}
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <AppBar
        position="sticky"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar variant="dense">
          <Avatar
            src={logo}
            variant="rounded"
            className="logo"
            sx={{
              marginRight: 2,
              backgroundColor: "white",
              padding: "5px",
              objectFit: "contain",
            }}
          />
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Event Live
          </Typography>

          {renderUser(user)}
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Routes>
          <Route path="/" element={<Live />} />
          {user.isAdmin && <Route path="/admin-live" element={<AdminLive />} />}
        </Routes>
      </Box>
      <Login />
    </Fragment>
  );
}

export default App;
