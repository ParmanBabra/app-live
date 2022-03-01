import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import React, { Fragment, FunctionComponent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { login } from "./userSlice";
import { emailValidate } from "../../app/helper";

type EventHandler = () => void;

type RegisterEventHandler = (message: string) => void;

export const LoginForm: FunctionComponent<{
  onLogin: EventHandler;
  onRegister: RegisterEventHandler;
}> = ({ onLogin, onRegister }) => {
  const user = useSelector((state: RootState) => state.user);

  const [email, setEmail] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      setError("Please input email.");
      return;
    }

    if (!emailValidate.test(email)) {
      setError("Email is invalid format.");
      return;
    }
    
    let result: any = await dispatch(login({ email, rememberMe }));
    if (result.type.includes("fulfilled")) {
      setEmail("");
      setRememberMe(false);
      onLogin();
    } else if (result.type.includes("rejected")) {
      // setError(result.error.message);
      onRegister(result.error.message);
    }
  };

  return (
    <Fragment>
      <Avatar sx={{ m: 1, width: 52, height: 52, bgcolor: "secondary.main" }}>
        <PersonIcon fontSize="large" />
      </Avatar>
      <Typography component="h1" variant="h5">
        Login
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          error={error != null}
          helperText={error}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
          }
          label="Remember Me"
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2, mb: 1 }}
        >
          Login
        </Button>
      </Box>
    </Fragment>
  );
};
