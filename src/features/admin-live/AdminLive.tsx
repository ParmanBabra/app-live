import React, { Fragment, useState } from "react";
import {
  Box,
  Divider,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { StartLiveForm } from "./StartLiveForm";
import { startLive } from "./liveSlice";
import { useDispatch, useSelector } from "react-redux";
import { useFirestore, useFirestoreConnect } from "react-redux-firebase";
import { RootState } from "../../app/store";
import { Living } from "./Living";
import { EndedLive } from "./EndedLive";

export const AdminLive = () => {
  useFirestoreConnect([
    {
      collection: "live",
      doc: "current",
    }, // or 'todos'
  ]);

  const live = useSelector((state: RootState) => state.firestore.data.live);
  const dispatch = useDispatch();

  function renderForm(activeStep: number | undefined) {
    if (activeStep == undefined) return <Fragment />;

    
    if (activeStep === 0)
      return (
        <StartLiveForm
          onSubmited={async (
            data,
            users,
            preLiveImage,
            errorImage,
            channelImage
          ) => {
            await dispatch(
              startLive({ data, users, errorImage, preLiveImage, channelImage })
            );

            // setActiveStep(1);
          }}
        />
      );
    else if (activeStep === 1) return <Living></Living>;
    else if (activeStep === 2) return <EndedLive></EndedLive>;

    return <Fragment />;
  }

  if (!live) return <Fragment />;

  return (
    <Fragment>
      <Paper
        variant="elevation"
        elevation={3}
        sx={{
          my: { xs: 0, md: 6 },
          p: { xs: 2, md: 3 },
          width: { xs: "100vw", md: "900px", lg: "900px" },
          minHeight: { xs: "calc(100vh - 48px)", md: "auto", lg: "auto" },
        }}
      >
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Admin
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Stepper activeStep={live.current.step} sx={{ pt: 3, pb: 5 }}>
          <Step key={0}>
            <StepLabel>Start Live</StepLabel>
          </Step>
          <Step key={1}>
            <StepLabel>Living</StepLabel>
          </Step>
          <Step key={2}>
            <StepLabel>End Live</StepLabel>
          </Step>
        </Stepper>

        {renderForm(live.current.step)}
      </Paper>
    </Fragment>
  );
};
