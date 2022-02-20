import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import GroupIcon from "@mui/icons-material/Group";

import SickIcon from "@mui/icons-material/Sick";
import { Box } from "@mui/material";

import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import moment from "moment";

import { RootState } from "../../app/store";

export default function LiveCard() {
  useFirestoreConnect([{ collection: "live", doc: "current" }]);

  const live = useSelector((state: RootState) => state.firestore.data.live);

  if (!live) return <React.Fragment></React.Fragment>;

  let createDate = moment.unix(live.current.live_date.seconds);

  return (
    <Card
      elevation={0}
      sx={{
        overflow: "inherit",
      }}
    >
      <CardHeader
        avatar={<Avatar alt="Remy Sharp" src={live.current.channel_image} />}
        action={
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <GroupIcon />
            <Typography variant="body2" sx={{ px: 1 }}>
              {live.current.watching_count.toLocaleString()}
            </Typography>
          </Box>
        }
        title={live.current.title}
        subheader={`Live On : ${createDate.format("DD MMMM YYYY, h:mm")}`}
      />
    </Card>
  );
}
