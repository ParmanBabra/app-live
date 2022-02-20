import React, { useEffect, useRef, useState } from "react";
// import videojs from "video.js";
// import "videojs-mobile-ui";
// import "video.js/dist/video-js.css";
// import Plyr, { APITypes, PlyrProps, PlyrInstance } from "plyr-react";
// import "plyr-react/dist/plyr.css";
import { Box, SxProps, Theme } from "@mui/material";
// import Hls from "hls.js";

import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

interface Props {
  maxHeight?: string;
  soruce: string;
  startLiveDate: Date;
  errorImage: string;
  preLiveImage: string;
}

export const Video = (props: Props) => {
  const user = useSelector((state: RootState) => state.user);
  const playerRef = React.useRef<any>(null);
  let iamge: string = "";

  const getDiffTick = (props: Props) => {
    const now: Date = new Date();
    let startLiveDate: any = props.startLiveDate;
    startLiveDate = startLiveDate.toDate();

    return startLiveDate.getTime() - now.getTime();
  };

  let diffDate = getDiffTick(props);

  if (!ReactPlayer.canPlay(props.soruce)) {
    iamge = props.errorImage;
  }

  if (diffDate > 0) {
    iamge = props.preLiveImage;
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

  return (
    <Box
      component="div"
      sx={{
        maxHeight: props.maxHeight,
        maxWidth: "100%",
      }}
    >
      {iamge != "" ? (
        <img src={iamge} alt="Error Image" style={{ width: "100%" }}></img>
      ) : (
        <ReactPlayer
          ref={playerRef}
          url={props.soruce}
          muted
          playing={user.isLogin}
          controls
          width="100%"
          height="100%"
          onReady={(e) => {
            //   e.player.player.player.play();
            //   const video: HTMLVideoElement = e.player.player.player;
            //   console.dir(video);
            //   video.play();
          }}
          onError={(e) => {
            console.log(e);
          }}
          config={{
            file: {
              hlsOptions: {
                autoStartLoad: true,
              },
              forceHLS: true,
              hlsVersion: "1.1.5",
            },
          }}
          style={{ backgroundColor: "#000" }}
        />
      )}
    </Box>
  );
};

export default Video;
