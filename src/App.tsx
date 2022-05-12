import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { ListItemIcon, Menu, MenuItem } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { RootState } from "./app/store";
import AdminPanel from "./features/admin-panel/AdminPanel";
import LiveAdd from "./features/admin-panel/LiveAdd";
import LiveEdit from "./features/admin-panel/LiveEdit";
import VideoAdd from "./features/admin-panel/VideoAdd";
// import { VideoForm } from "./features/admin-panel/VideoForm";
import VideoEdit from "./features/admin-panel/VideoEdit";
import Home from "./features/home/Home";
import Live from "./features/live/Live";
import Login from "./features/login/Login";
import { UserState } from "./features/login/model";
import RequireAuth from "./features/login/RequireAuth";
import { logout } from "./features/login/userSlice";
import { NoLogin } from "./features/no-login/NoLogin";
import Watching from "./features/video-ondemand/Watching";
import logo from "./images/Logo.svg";

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
          <MenuItem onClick={() => toLink("/home")}>
            <ListItemIcon>
              <OndemandVideoIcon />
            </ListItemIcon>
            Home
          </MenuItem>

          {user.isAdmin && (
            <MenuItem onClick={() => toLink("/admin")}>
              <ListItemIcon>
                <SupervisorAccountIcon />
              </ListItemIcon>
              Admin Panel
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
          maxWidth: "100vw",
        }}
      >
        <Routes>
          <Route path="/" element={<NoLogin />} />

          <Route
            path="/live/:id"
            element={
              <RequireAuth>
                <Live />
              </RequireAuth>
            }
          />
          <Route
            path="/video-ondemand/:id"
            element={
              <RequireAuth>
                <Watching />
              </RequireAuth>
            }
          />
          <Route
            path="/home"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          {user.isAdmin && (
            <Fragment>
              <Route
                path="/admin"
                element={
                  <RequireAuth>
                    <AdminPanel />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/video/new"
                element={
                  <RequireAuth>
                    <VideoAdd />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/video/:id"
                element={
                  <RequireAuth>
                    <VideoEdit />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/live/new"
                element={
                  <RequireAuth>
                    <LiveAdd />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/live/:id"
                element={
                  <RequireAuth>
                    <LiveEdit />
                  </RequireAuth>
                }
              />
            </Fragment>
          )}
        </Routes>
      </Box>
      <Login />
    </Fragment>
  );
}

export default App;
