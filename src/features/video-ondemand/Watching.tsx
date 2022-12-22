import { Box } from "@mui/material";
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { useParams } from "react-router-dom";
import { RootState } from "../../app/store";
import { grantVideo, updateReportVideo } from "../app/AppSlice";
import Video from "../live/Video";
import { VideoOnDeamandData } from "./model";
import PermissionDeny from "./PermissionDeny";

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
    if (!videos) {
      return;
    }

    let video = videos[id as string] as VideoOnDeamandData;

    if (!video.grant_users.includes(user.email as string)) {
      return;
    }

    console.log("Update report");

    dispatch(
      updateReportVideo({ key: id as string, email: user.email as string })
    );
  }, [videos]);

  if (!videos) return <Fragment />;

  let video = videos[id as string] as VideoOnDeamandData;

  if (!video.grant_users.includes(user.email as string)) {
    return <PermissionDeny />;
  }
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
