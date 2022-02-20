import { Button, Grid, Typography } from "@mui/material";
import React, { Fragment } from "react";
import ChatIcon from "@mui/icons-material/Chat";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import { useDispatch } from "react-redux";
import { exportChats, startNewLive } from "./liveSlice";

export const EndedLive = () => {
  const dispatch = useDispatch();

  const handleStartNewLive = async () => {
    await dispatch(startNewLive());
  };

  const handleExportChats = async () => {
    await dispatch(exportChats());
  };

  return (
    <Fragment>
      <Typography variant="h6" gutterBottom>
        End Live
      </Typography>
      <Grid item xs={12} sm={12} sx={{ mt: 1 }}>
        <Button
          type="button"
          fullWidth
          variant="outlined"
          startIcon={<ChatIcon />}
          onClick={handleExportChats}
        >
          Export Chats
        </Button>
      </Grid>
      <Grid item xs={12} sm={12} sx={{ mt: 1 }}>
        <Button
          type="button"
          fullWidth
          variant="contained"
          startIcon={<OndemandVideoIcon />}
          onClick={handleStartNewLive}
        >
          Start New Live
        </Button>
      </Grid>
    </Fragment>
  );
};
