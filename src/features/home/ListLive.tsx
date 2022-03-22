import React from "react";
import "./ListLive.css";

import { Carousel } from "react-responsive-carousel";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import "./ListLive.css";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useFirestoreConnect } from "react-redux-firebase";
import { LiveData } from "../admin-panel/model";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { Box, useMediaQuery, useTheme } from "@mui/material";

export const ListLive = () => {
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  useFirestoreConnect([
    {
      collection: "live",
      where: [
        ["grant_users", "array-contains", user.email],
        ["step", "==", 1],
      ],
      orderBy: ["create_date", "desc"],
    },
  ]);

  const theme = useTheme();

  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  const liveList = useSelector(
    (state: RootState) => state.firestore.data["live"]
  );

  const lives = _.values(liveList) as LiveData[];

  const handleClickLive = (key: string) => {
    navigate(`/live/${key}`, { replace: true });
  };

  console.log(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        padding: {
          xs: "0px 0px",
          md: "0px 75px",
          lg: "0px 75px",
        },
      }}
    >
      <Carousel
        selectedItem={0}
        centerMode={true}
        centerSlidePercentage={80}
        showStatus={false}
        showThumbs={false}
        autoPlay={true}
        infiniteLoop={true}
        interval={5000}
        transitionTime={500}
      >
        {lives.map((item, index) => (
          <div
            className="item"
            key={index}
            onClick={() => handleClickLive(item.id)}
          >
            <div className="icon">
              <PlayCircleIcon
                sx={{ width: "100%", height: "100%", opacity: 0.5 }}
              />
            </div>
            <span className="label-live">
              <PlayArrowIcon />
              Live
            </span>
            <img
              src={item.pre_live_image}
              className={matches ? "image-sm" : ""}
            />
          </div>
        ))}
      </Carousel>
    </Box>
  );
};
