import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../app/store";
import { BackdropLoading } from "../../components/BackdropLoading";
import { updateVideo } from "./adminPanelSlice";
import { VideoDataForm } from "./model";
import { VideoForm } from "./VideoForm";

export default function VideoEdit() {
  let { id } = useParams();
  useFirestoreConnect([
    {
      collection: "video-on-demand",
      doc: id,
    },
  ]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const dataVideo = useSelector(
    ({ firestore: { data } }: RootState) =>
      data["video-on-demand"] && data["video-on-demand"][id]
  );

  const loading = useSelector(({ admin }: RootState) => admin.loading);

  if (!dataVideo) return <BackdropLoading />;

  const video: VideoDataForm = _.map([dataVideo], (x) => {
    return {
      ...x,
      ...{
        create_date: x.create_date.toDate(),
        live_date: x.live_date.toDate(),
        end_live_date: x.end_live_date.toDate(),
      },
    };
  })[0];

  const handleOnSubmit = async (
    data: VideoDataForm,
    users: string[],
    preLiveImage?: File | null,
    errorImage?: File | null,
    channelImage?: File | null
  ) => {
    await dispatch(
      updateVideo({
        data: data,
        grant_users: users,
        pre_live_image: preLiveImage,
        error_image: errorImage,
        channel_image: channelImage,
      })
    );

    navigate(`/admin`, { replace: false });
  };

  return (
    <VideoForm onSubmited={handleOnSubmit} data={video} loading={loading} />
  );
}
