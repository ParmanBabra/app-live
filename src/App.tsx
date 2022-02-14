import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import FlutterDashIcon from "@mui/icons-material/FlutterDash";
import Avatar from "@mui/material/Avatar";
import Login from "./features/login/Login";

import Live from "./features/live/Live";

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
        <Live />
      </Box>
      <Login open={true} />
    </React.Fragment>
  );
}

export default App;
