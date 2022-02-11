import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { createTheme, styled } from "@mui/material/styles";

import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import FlutterDashIcon from "@mui/icons-material/FlutterDash";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SendIcon from "@mui/icons-material/Send";
import Login from "./features/login/Login";


import LiveCard from "./features/live/LiveCard";
import simpleImage from "./images/live-streaming.png";

const drawerWidth = 375;
const appBarHeight = 48;
const titleStream = 75;

const theme = createTheme();

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",

  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  minHeight: `${appBarHeight}px !important`,
  justifyContent: "flex-start",
}));

function App() {
  return (
    <React.Fragment>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar variant="dense">
          <FlutterDashIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            [ App Name ]
          </Typography>
          <Typography variant="h6" color="inherit" noWrap>
            [ User Name ]
          </Typography>
          <IconButton sx={{ ml: 2 }}>
            <Avatar sx={{ width: 32, height: 32 }}>N</Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Box
          component="div"
          sx={{
            display: "flex",
            flexDirection: "column",
            maxWidth: `calc(100vw - ${drawerWidth}px)`,
            height: "100vh",
          }}
        >
          <DrawerHeader />

          <img
            src={simpleImage}
            alt="Simple"
            style={{
              maxHeight: `calc(100vh - ${appBarHeight}px - ${titleStream}px)`,
            }}
          />
          <LiveCard />
        </Box>
        <Drawer
          open={true}
          variant="persistent"
          anchor="right"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <DrawerHeader />
          <Toolbar variant="dense">
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeftIcon fontSize="small" />
              ) : (
                <KeyboardArrowRightIcon fontSize="small" />
              )}
            </IconButton>
            <Typography
              variant="subtitle1"
              color="inherit"
              align="center"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              STREAM CHAT
            </Typography>
          </Toolbar>
          <Divider />
          <Box sx={{ overflow: "auto", flexGrow: 1 }}></Box>
          <Divider />
          <Paper
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Send a message"
              inputProps={{ "aria-label": "Send a message" }}
            />
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
              <SendIcon />
            </IconButton>
          </Paper>
        </Drawer>
      </Box>
      <Login open={true} />
    </React.Fragment>
  );
}

export default App;
