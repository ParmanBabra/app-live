import _ from "lodash";
import { QRCodeCanvas } from "qrcode.react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../app/store";
import { BackdropLoading } from "../../components/BackdropLoading";
import { updateLive } from "./adminPanelSlice";
import { LiveForm } from "./LiveForm";
import { LiveDataForm } from "./model";

export default function LiveEdit() {
  let { id } = useParams();
  useFirestoreConnect([
    {
      collection: "live",
      doc: id,
    },
  ]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // eslint-disable-next-line no-restricted-globals
  const qrLocation = `${location.origin}?returnPath=live/${id}`;

  const dataVideo = useSelector(
    ({ firestore: { data } }: RootState) => data["live"] && data["live"][id]
  );

  const loading = useSelector(({ admin }: RootState) => admin.loading);

  if (!dataVideo) return <BackdropLoading />;

  const video: LiveDataForm = _.map([dataVideo], (x) => {
    return {
      ...x,
      ...{
        create_date: x.create_date?.toDate(),
        live_date: x.live_date?.toDate(),
        end_live_date: x.end_live_date?.toDate(),
      },
    };
  })[0];

  const handleOnSubmit = async (
    data: LiveDataForm,
    users: string[],
    preLiveImage?: File | null,
    errorImage?: File | null,
    channelImage?: File | null
  ) => {
    await dispatch(
      updateLive({
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
    <LiveForm
      onSubmited={handleOnSubmit}
      data={video}
      loading={loading}
      isEdit={true}
    >
      <QRCodeCanvas size={200} includeMargin={true}  value={qrLocation} />
    </LiveForm>
  );
}
