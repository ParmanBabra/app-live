import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Fade, Modal, Paper, Backdrop, SxProps, Theme } from "@mui/material";
import { RootState } from "../../app/store";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { RegisterRequest } from "./model";
import { register } from "./userSlice";

const style: SxProps<Theme> = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: { xs: "100%", md: "auto", lg: "auto" },
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  overflow: "auto",
};

export interface LoginProps {}

export default function Login(props: LoginProps) {
  const user = useSelector((state: RootState) => state.user);
  const [Open, setOpen] = useState(!user.isLogin);
  const [registerMessage, setRegisterMessage] = useState<string | null>(null);
  const [state, setState] = useState(0);
  const dispatch = useDispatch();

  const handleSubmitLogin = () => {
    setOpen(false);
  };

  const handleRegister = (message: string) => {
    setState(1);
    setRegisterMessage(message);
  };

  const handleBack = () => {
    setState(0);
  };

  const handleSubmitRegister = async (data: RegisterRequest) => {
    await dispatch(register(data));
    setState(0);
    setOpen(false);
  };

  const renderForms = (state: number) => {
    if (state === 0) {
      return (
        <LoginForm onLogin={handleSubmitLogin} onRegister={handleRegister} />
      );
    } else if (state === 1) {
      return (
        <RegisterForm
          onRegister={handleSubmitRegister}
          onBack={handleBack}
          message={registerMessage}
        />
      );
    }
  };

  useEffect(() => {
    if (user.isLogin) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [user.isLogin]);

  return (
    <Modal
      open={Open}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={Open}>
        <Paper sx={style} elevation={2}>
          {renderForms(state)}
        </Paper>
      </Fade>
    </Modal>
  );
}
