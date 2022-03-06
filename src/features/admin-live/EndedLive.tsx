import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { Fragment, useState } from "react";
import ChatIcon from "@mui/icons-material/Chat";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import { useDispatch } from "react-redux";
import { exportChats, exportRegisterUsers, startNewLive } from "./liveSlice";
import { EndLiveRequest } from "./model";
import { Controller, useForm } from "react-hook-form";
import { Cancel, CheckCircle } from "@mui/icons-material";

export const EndedLive = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<EndLiveRequest>();

  const [validateStream, setValidateStream] = useState<boolean>(false);
  const dispatch = useDispatch();

  const onSubmit = async (data: EndLiveRequest) => {
    await dispatch(startNewLive(data));
  };

  const handleExportChats = async () => {
    await dispatch(exportChats());
  };

  const handleExportRegisterUsers = async () => {
    await dispatch(exportRegisterUsers());
  };

  const handleValidateStreamUrl = () => {
    setValidateStream(true);
  };

  return (
    <Fragment>
      <Typography variant="h6" gutterBottom>
        End Live
      </Typography>
      <Grid
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        container
        spacing={3}
      >
        <Grid item xs={12} sm={12}>
          <Controller
            name="live_url"
            defaultValue=""
            control={control}
            rules={{
              required: "Url is required",
              pattern: {
                message: "Url is invalid",
                value:
                  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                required
                label="Live Url"
                variant="standard"
                error={errors.live_url || !validateStream ? true : false}
                helperText={errors.live_url?.message}
                onBlur={(e) => setValidateStream(false)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {validateStream ? (
                        <IconButton color="success" component="span">
                          <CheckCircle />
                        </IconButton>
                      ) : (
                        <IconButton
                          color="error"
                          component="span"
                          onClick={handleValidateStreamUrl}
                        >
                          <Cancel />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={12} sx={{ mt: 1 }}>
          <Button
            type="button"
            fullWidth
            variant="outlined"
            startIcon={<GroupAddIcon />}
            onClick={handleExportRegisterUsers}
          >
            Export Register User
          </Button>
        </Grid>
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
            type="submit"
            fullWidth
            variant="contained"
            startIcon={<OndemandVideoIcon />}
          >
            Start New Live
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  );
};
