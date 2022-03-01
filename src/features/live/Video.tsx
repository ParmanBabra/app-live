import React, { useEffect, useRef, useState } from "react";
import { Box, SxProps, Theme } from "@mui/material";

import { ErrorTypes } from "hls.js";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

import "./Video.css";

const OvenPlayer = require("ovenplayer");

interface Props {
  maxHeight?: string;
  soruce: string;
  startLiveDate: Date;
  errorImage: string;
  preLiveImage: string;
}

export const Video = (props: Props) => {
  const user = useSelector((state: RootState) => state.user);
  const [player, setPlayer] = useState<any>();
  const playerRef = React.useRef<any>(null);
  let image: string = "";

  const getDiffTick = (props: Props) => {
    const now: Date = new Date();
    let startLiveDate: any = props.startLiveDate;
    startLiveDate = startLiveDate.toDate();

    return startLiveDate.getTime() - now.getTime();
  };

  let diffDate = getDiffTick(props);

  if (diffDate > 0) {
    image = props.preLiveImage;
  }

  const [living, setLiving] = useState(diffDate <= 0);

  useEffect(() => {
    let timer = setInterval(() => {
      let diffDate = getDiffTick(props);
      let living = diffDate <= 0;
      setLiving(living);
      if (living) {
        clearInterval(timer);
      }
    }, 1000);
  }, [living]);

  useEffect(() => {
    if (!living) return;

    const player = OvenPlayer.create(playerRef.current.id, {
      autoStart: true,
      autoFallback: true,
      mute: true,
      sources: [
        {
          type: "hls",
          file: props.soruce,
        },
      ],
      webrtcConfig: {
        timeoutMaxRetry: 4,
        connectionTimeout: 10000,
        playoutDelayHint: 10,
      },
    });

    setPlayer(player);
  }, [props.soruce, living]);

  return (
    <Box
      component="div"
      sx={{
        maxHeight: props.maxHeight,
        maxWidth: "100%",
      }}
    >
      {image != "" ? (
        <img
          src={image}
          alt="Error Image"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        ></img>
      ) : (
        <div ref={playerRef} id="player"></div>
      )}
    </Box>
  );
};

export default Video;
