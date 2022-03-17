import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  defaultChannelImage,
  defaultErrorImage,
  defaultPreLiveImage,
} from "../../app/helper";
import { RootState } from "../../app/store";
import { insertLive } from "./adminPanelSlice";
import { LiveForm } from "./LiveForm";
import { LiveDataForm } from "./model";

export default function LiveAdd() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loading = useSelector(({ admin }: RootState) => admin.loading);

  const video: LiveDataForm = {
    channel_image: defaultChannelImage,
    error_image: defaultErrorImage,
    pre_live_image: defaultPreLiveImage,
    create_date: new Date(),
    end_live_date: null,
    live_date: null,
    live_url: "",
    title: "",
    grant_users: [],
    show_watching_user: false,
  };

  const handleOnSubmit = async (
    data: LiveDataForm,
    users: string[],
    preLiveImage?: File | null,
    errorImage?: File | null,
    channelImage?: File | null
  ) => {
    await dispatch(
      insertLive({
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
      isEdit={false}
    />
  );
}
