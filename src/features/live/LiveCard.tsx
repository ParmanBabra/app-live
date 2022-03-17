import GroupIcon from "@mui/icons-material/Group";
import { Box } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import moment from "moment";
import * as React from "react";
import { LiveData } from "../admin-panel/model";




export const LiveCard: React.FunctionComponent<{
  live: LiveData;
}> = ({ live }) => {
  let liveOn = moment(live.live_date.toDate()).fromNow();
  let show_watching_users = live.show_watching_user as boolean;

  return (
    <Card
      elevation={0}
      sx={{
        overflow: "inherit",
      }}
    >
      <CardHeader
        avatar={<Avatar alt="Remy Sharp" src={live.channel_image} />}
        action={
          show_watching_users && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <GroupIcon />
              <Typography variant="body2" sx={{ px: 1 }}>
                {live.watching_count.toLocaleString()}
              </Typography>
            </Box>
          )
        }
        title={live.title}
        subheader={`Live On : ${liveOn}`}
      />
    </Card>
  );
};
