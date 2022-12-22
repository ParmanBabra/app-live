import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  defaultChannelImage,
  defaultErrorImage,
  defaultPreLiveImage,
} from "../../app/helper";
import { RootState } from "../../app/store";
import { insertVideo } from "./adminPanelSlice";
import { VideoDataForm } from "./model";
import { VideoForm } from "./VideoForm";

export default function VideoAdd() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loading = useSelector(({ admin }: RootState) => admin.loading);

  const video: VideoDataForm = {
    channel_image: defaultChannelImage,
    error_image: defaultErrorImage,
    pre_live_image: defaultPreLiveImage,
    create_date: new Date(),
    end_live_date: null,
    live_date: null,
    live_url: "",
    title: "",
    grant_users: [],
    report_users: [],
  };

  const handleOnSubmit = async (
    data: VideoDataForm,
    users: string[],
    preLiveImage?: File | null,
    errorImage?: File | null,
    channelImage?: File | null
  ) => {
    await dispatch(
      insertVideo({
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
