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
import { useParams } from "react-router-dom";
import { RootState } from "../../app/store";
import Video from "../live/Video";
import { VideoOnDeamandData } from "./model";

import "./VideoOnDemand.css";

function Watching() {
  let { id } = useParams();
  useFirestoreConnect([
    {
      collection: "video-on-demand",
      doc: id,
    },
  ]);

  const videos = useSelector(
    (state: RootState) => state.firestore.data["video-on-demand"]
  );

  if (!videos) return <Fragment />;

  let video = videos[id] as VideoOnDeamandData;

  return (
    <Fragment>
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100vw",
        }}
      >
        <Video
          title={video.title}
          soruce={video.live_url}
          startLiveDate={video.live_date}
          preLiveImage={video.pre_live_image}
          errorImage={video.error_image}
        />
      </Box>
    </Fragment>
  );
}

export default Watching;
