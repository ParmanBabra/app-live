import { CheckCircle } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Backdrop,
  Box,
  Button,
  Fade,
  InputAdornment,
  Modal,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import React, { FunctionComponent } from "react";
import { Controller, useForm } from "react-hook-form";
import "./ConfirmModal.css";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  p: 4,
};

export type EndLiveForm = {
  live_url: string;
};

type SubmitedHandler = (data: EndLiveForm) => any | Promise<any>;

type EventHandler = () => any | Promise<any>;

export const ToOnDemandModal: FunctionComponent<{
  open: boolean;
  loading: boolean;
  onCancel: EventHandler;
  onSubmit: SubmitedHandler;
}> = ({ open, loading, onCancel, onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
    trigger,
  } = useForm<EndLiveForm>({
    defaultValues: {
      live_url: "",
    },
  });

  return (
    <Modal
      open={open}
      onClose={onCancel}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Paper sx={style}>
          <Typography variant="h6" component="h2">
            Live To Video On Demand
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="live_url"
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
                  error={errors.live_url ? true : false}
                  helperText={errors.live_url?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <CheckCircle />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Box className="actions" sx={{ mt: 2 }}>
              <LoadingButton loading={loading} type="submit" variant="outlined">
                To Video
              </LoadingButton>
              <Button type="button" variant="outlined" onClick={onCancel}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
};
