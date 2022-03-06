import {
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { RootState } from "../../app/store";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import LiveCard from "../live/LiveCard";
import Video from "../live/Video";
import { endLive } from "./liveSlice";

export const Living = () => {
  useFirestoreConnect([
    {
      collection: "live",
      doc: "current",
    },
  ]);

  const live = useSelector((state: RootState) => state.firestore.data.live);
  const dispatch = useDispatch();

  if (!live) return <Fragment></Fragment>;

  const handleEndLive = async () => {
    await dispatch(endLive());
  };
  
  return (
    <Fragment>
      <Typography variant="h6" gutterBottom>
        Living
      </Typography>
      {live.current && (
        <Video
          startLiveDate={live.current.live_date}
          errorImage={live.current.error_image}
          preLiveImage={live.current.pre_live_image}
          soruce={live.current.live_url}
        />
      )}

      <LiveCard />
      <Divider sx={{ mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Watching User ({live.current.watching_count.toLocaleString()})
      </Typography>
      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          minHeight: 200,
          maxHeight: 200,
          overflow: "auto",
        }}
        aria-label="contacts"
      >
        {live.current.watching_users.map((email: string) => {
          return (
            <ListItem disablePadding key={email}>
              <ListItemButton>
                <ListItemText inset primary={email} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Grid item xs={12} sm={12} sx={{ mt: 1 }}>
        <Button
          type="button"
          fullWidth
          variant="contained"
          startIcon={<VideocamOffIcon />}
          onClick={handleEndLive}
        >
          End Live
        </Button>
      </Grid>
    </Fragment>
  );
};
