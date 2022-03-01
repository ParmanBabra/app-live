import {
  Alert,
  Avatar,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import React, { Fragment, FunctionComponent } from "react";
import { Controller, useForm } from "react-hook-form";
import { RegisterRequest } from "./model";

type EventHandler = () => void;
type SubmitHandler = (data: RegisterRequest) => void;

export const RegisterForm: FunctionComponent<{
  onBack: EventHandler;
  onRegister: SubmitHandler;
  message: string | null;
}> = ({ onBack, onRegister, message }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>();

  return (
    <Fragment>
      <Avatar sx={{ m: 1, width: 52, height: 52, bgcolor: "secondary.main" }}>
        <PersonAddIcon fontSize="large" />
      </Avatar>
      <Typography component="h1" variant="h5">
        Register
      </Typography>
      <Alert severity="error">{message}</Alert>
      <Box
        component="form"
        onSubmit={handleSubmit(onRegister)}
        noValidate
        sx={{ mt: 1, width: "100%" }}
      >
        <Grid item xs={12} sm={12}>
          <Controller
            name="firstName"
            defaultValue=""
            control={control}
            rules={{ required: "First name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                required
                label="First name"
                variant="standard"
                error={errors.firstName ? true : false}
                helperText={errors.firstName?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Controller
            name="lastName"
            defaultValue=""
            control={control}
            rules={{ required: "Last name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                required
                label="Last Name"
                variant="standard"
                error={errors.lastName ? true : false}
                helperText={errors.lastName?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Controller
            name="email"
            defaultValue=""
            control={control}
            rules={{ required: "Email is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                required
                label="Email"
                variant="standard"
                error={errors.email ? true : false}
                helperText={errors.email?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Controller
            name="organization"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Organization"
                variant="standard"
                error={errors.organization ? true : false}
                helperText={errors.organization?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Controller
            name="tel"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Phonenumber"
                variant="standard"
                error={errors.tel ? true : false}
                helperText={errors.tel?.message}
              />
            )}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          sx={{
            mt: 5,
            mb: 1,
            display: "flex",
            gap: 1,
          }}
        >
          <Button type="button" fullWidth variant="outlined" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" fullWidth variant="contained">
            Register
          </Button>
        </Grid>
      </Box>
    </Fragment>
  );
};
