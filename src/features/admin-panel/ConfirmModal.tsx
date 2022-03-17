import { LoadingButton } from "@mui/lab";
import {
  Backdrop,
  Box,
  Button,
  Fade,
  Modal,
  Paper,
  Typography
} from "@mui/material";
import React, { FunctionComponent } from "react";
import "./ConfirmModal.css";


const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  p: 4,
};

type EventHandler = () => any | Promise<any>;

export const ConfirmModal: FunctionComponent<{
  open: boolean;
  loading: boolean;
  onCancel: EventHandler;
  onConfirm: EventHandler;
  title: string;
  detail: string;
}> = ({ open, loading, onCancel, onConfirm, title, detail }) => {
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
            {title}
          </Typography>
          <Typography sx={{ mt: 2 }}>{detail}</Typography>

          <Box className="actions" sx={{ mt: 2 }}>
            <LoadingButton
              loading={loading}
              type="button"
              variant="outlined"
              color="error"
              onClick={onConfirm}
            >
              Confirm
            </LoadingButton>
            <Button type="button" variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
};
