import {
  Box
} from "@mui/material";
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { useParams } from "react-router-dom";
import { RootState } from "../../app/store";
import { grantVideo } from "../app/AppSlice";
import Video from "../live/Video";
import { VideoOnDeamandData } from "./model";


function Watching() {
  let { id } = useParams();
  let dispatch = useDispatch();
  useFirestoreConnect([
    {
      collection: "video-on-demand",
      doc: id,
    },
  ]);

  const user = useSelector((state: RootState) => state.user);

  const videos = useSelector(
    (state: RootState) => state.firestore.data["video-on-demand"]
  );

  useEffect(() => {
    dispatch(grantVideo({ email: user.email as string, key: id as string }));
  });

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
        {/* <Button
          type="button"
          onClick={async () => {
            await dispatch(register(id as string));
          }}
        >
          Register
        </Button> */}
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
