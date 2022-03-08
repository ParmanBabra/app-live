import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import _ from "lodash";
import { Fragment, useState, useEffect, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect, useFirestore } from "react-redux-firebase";
import { RootState } from "../../app/store";
import { VideoOnDeamandData } from "./model";
import { useNavigate } from "react-router-dom";

import "./VideoOnDemand.css";

function VideoOnDemand() {
  const user = useSelector((state: RootState) => state.user);
  let navigate = useNavigate();
  const firestore = useFirestore();
  useFirestoreConnect([
    {
      collection: "video-on-demand",
      // where: ["grant_users", "array-contains", user.email],
      orderBy: ["create_date", "desc"],
    },
  ]);

  const videoList = useSelector(
    (state: RootState) => state.firestore.data["video-on-demand"]
  );

  const videos = _.values(videoList) as VideoOnDeamandData[];

  const handleClickVideo = (key: string) => {
    navigate(`${key}`, { replace: true });
  };
  return (
    <Fragment>
      <Container sx={{ py: 8 }}>
        <Box
          sx={{
            bgcolor: "background.paper",
            pb: 3,
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Video On Demand
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {videos.map((video) => (
            <Grid item key={video.key} xs={12} sm={6} md={4}>
              <Card
                onClick={() => handleClickVideo(video.key)}
                elevation={3}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                className="video-card"
              >
                <CardMedia
                  component="img"
                  image={video.pre_live_image}
                  alt={video.title}
                />
                <CardHeader
                  avatar={<Avatar alt="Remy Sharp" src={video.channel_image} />}
                  title={video.title}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Fragment>
  );
}

export default VideoOnDemand;
