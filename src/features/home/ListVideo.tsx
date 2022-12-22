import {
  Avatar,
  Box,
  Card,
  CardHeader,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { useFirestore, useFirestoreConnect } from "react-redux-firebase";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../app/store";
import { VideoOnDeamandData } from "../video-ondemand/model";
import _ from "lodash";

import "./ListVideo.css";
import contract from "./../../images/contract.png";

export const ListVideo = () => {
  const user = useSelector((state: RootState) => state.user);
  let navigate = useNavigate();
  const firestore = useFirestore();
  useFirestoreConnect([
    {
      collection: "video-on-demand",
      where: ["grant_users", "array-contains", user.email],
      orderBy: ["create_date", "desc"],
    },
  ]);

  const videoList = useSelector(
    (state: RootState) => state.firestore.data["video-on-demand"]
  );

  const videos = _.values(videoList) as VideoOnDeamandData[];

  const handleClickVideo = (key: string) => {
    navigate(`/video-ondemand/${key}`, { replace: true });
  };

  function listingVideo(videos: VideoOnDeamandData[]) {
    if (videos.length === 0) {
      return (
        <Grid item xs={12}>
          <img src={contract} style={{ width: "100%" }} />
        </Grid>
      );
    }

    return videos.map((video) => (
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
    ));
  }

  return (
    <Fragment>
      <Box
        sx={{
          bgcolor: "background.paper",
          pb: 3,
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          align="left"
          color="text.primary"
          gutterBottom
        >
          Video On Demand
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {listingVideo(videos)}
      </Grid>
    </Fragment>
  );
};
