import { Fragment, FunctionComponent, useState } from "react";
import { DesktopDateTimePicker } from "@mui/lab";
import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import GroupIcon from "@mui/icons-material/Group";
import VideocamIcon from "@mui/icons-material/Videocam";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { GrantUsersTable } from "./GrantUsersTable";
import { Cancel, CheckCircle } from "@mui/icons-material";
import { excelMap, StartLiveData, UserExcelData } from "./model";
import readXlsxFile from "read-excel-file";
import ReactPlayer from "react-player";
import { PreviewImage } from "./PreviewImage";
import { Box } from "@mui/system";

type SubmitedHandler = (
  data: StartLiveData,
  users: UserExcelData[],
  preLiveImage?: File | null,
  errorImage?: File | null,
  channelImage?: File | null
) => any | Promise<any>;

export const StartLiveForm: FunctionComponent<{
  onSubmited: SubmitedHandler;
}> = ({ onSubmited }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<StartLiveData>();

  const [validateStream, setValidateStream] = useState<boolean>(false);
  const [users, setUsers] = useState<UserExcelData[]>([]);
  const [preLiveImage, setPreLiveImage] = useState<string | null>(
    "https://firebasestorage.googleapis.com/v0/b/app-live-36e59.appspot.com/o/stream-starting-soon.jpg?alt=media&token=0a808da2-9fa5-4adb-8fe1-3c1067a80818"
  );
  const [errorImage, setErrorImage] = useState<string | null>(
    "https://firebasestorage.googleapis.com/v0/b/app-live-36e59.appspot.com/o/error.jpeg?alt=media&token=9062d608-1c69-467f-96b1-b398fdccb059"
  );
  const [channelImage, setChannelImage] = useState<string | null>(
    "https://firebasestorage.googleapis.com/v0/b/app-live-36e59.appspot.com/o/channel.png?alt=media&token=d19a716a-28b5-4a11-881d-4b6b64dc54dd"
  );
  const [files, setFiles] = useState<(File | null)[]>([null, null]);

  const onSubmit: SubmitHandler<StartLiveData> = (data) => {
    if (!validateStream) return;
    const [preLiveImageFile, errorImageFile, channelImageFile] = files;
    onSubmited(data, users, preLiveImageFile, errorImageFile, channelImageFile);
  };

  const handleSelectGrantUsers = async (e: any) => {
    if (e.target.files.length == 0) return;
    let rows = await readXlsxFile(e.target.files[0], { map: excelMap });
    let users = rows.rows as UserExcelData[];
    setUsers(users);
  };

  const handleSelectPreLiveImage = async (e: any) => {
    if (e.target.files.length == 0) return;

    const file: File = e.target.files[0];
    files[0] = file;

    setFiles(files);
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      function () {
        // convert image file to base64 string
        setPreLiveImage(reader.result as string);
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSelectErrorImage = async (e: any) => {
    if (e.target.files.length == 0) return;

    const file: File = e.target.files[0];
    files[1] = file;

    setFiles(files);
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      function () {
        // convert image file to base64 string
        setErrorImage(reader.result as string);
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSelectChannelImage = async (e: any) => {
    if (e.target.files.length == 0) return;

    const file: File = e.target.files[0];
    files[3] = file;

    setFiles(files);
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      function () {
        // convert image file to base64 string
        setChannelImage(reader.result as string);
        console.log("handleSelectChannelImage");
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleValidateStreamUrl = () => {
    console.log("ok")
    const values = getValues();
    const url = values.liveUrl;
    const valid = ReactPlayer.canPlay(url);

    setValidateStream(valid);
  };

  return (
    <Fragment>
      <Typography variant="h6" gutterBottom>
        Start Live
      </Typography>
      <Grid
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        container
        spacing={3}
      >
        <Grid item xs={12} sm={12}>
          <Controller
            name="title"
            defaultValue=""
            control={control}
            rules={{ required: "Title is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                required
                label="Title"
                variant="standard"
                error={errors.title ? true : false}
                helperText={errors.title?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="liveDate"
            control={control}
            defaultValue={null}
            rules={{
              required: "Live date is required",
            }}
            render={({ field }) => (
              <DesktopDateTimePicker
                {...field}
                label="Live Date"
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    required
                    variant="standard"
                    {...params}
                    error={errors.liveDate ? true : false}
                    helperText={errors.liveDate?.message}
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="createDate"
            control={control}
            defaultValue={new Date()}
            render={({ field }) => (
              <DesktopDateTimePicker
                {...field}
                label="Create Date"
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    required
                    variant="standard"
                    {...params}
                    error={errors.createDate ? true : false}
                    helperText={errors.createDate?.message}
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Controller
            name="liveUrl"
            defaultValue=""
            control={control}
            rules={{
              required: "Url is required",
              pattern: {
                message: "Url is invalid",
                value:
                  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                required
                label="Live Url"
                variant="standard"
                error={errors.liveUrl || !validateStream ? true : false}
                helperText={errors.liveUrl?.message}
                onBlur={(e) => setValidateStream(false)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {validateStream ? (
                        <IconButton color="success" component="span">
                          <CheckCircle />
                        </IconButton>
                      ) : (
                        <IconButton
                          color="error"
                          component="span"
                          onClick={handleValidateStreamUrl}
                        >
                          <Cancel />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
          <label htmlFor="pre-live-image-button-file">
            <input
              type="file"
              accept="image/*"
              id="pre-live-image-button-file"
              hidden
              onChange={handleSelectPreLiveImage}
            />
            <Button
              variant="outlined"
              component="span"
              fullWidth
              startIcon={<ImageIcon />}
            >
              Pre Live Image
            </Button>
          </label>
          <PreviewImage src={preLiveImage} />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
          <label htmlFor="error-button-file">
            <input
              type="file"
              accept="image/*"
              id="error-button-file"
              hidden
              onChange={handleSelectErrorImage}
            />
            <Button
              variant="outlined"
              component="span"
              fullWidth
              startIcon={<ImageIcon />}
            >
              Error Image
            </Button>
          </label>
          <PreviewImage src={errorImage} />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            mt: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <label htmlFor="channel-image-button-file" style={{ width: "100%" }}>
            <input
              type="file"
              accept="image/*"
              id="channel-image-button-file"
              hidden
              onChange={handleSelectChannelImage}
            />
            <Button
              variant="outlined"
              component="span"
              fullWidth
              startIcon={<ImageIcon />}
            >
              Channel Icon
            </Button>
          </label>
          <img
            src={channelImage as string}
            alt="image"
            style={{ width: "60px", marginTop: 20 }}
          ></img>
        </Grid>

        <Grid item xs={12} sm={12}>
          <label htmlFor="grant-button-file">
            <input
              type="file"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              id="grant-button-file"
              hidden
              onChange={handleSelectGrantUsers}
            />
            <Button
              variant="outlined"
              component="span"
              fullWidth
              startIcon={<GroupIcon />}
            >
              Update Grant User
            </Button>
          </label>
        </Grid>
        <Grid item xs={12} sm={12}>
          <GrantUsersTable data={users} />
        </Grid>
        <Grid item xs={12} sm={12} sx={{ mt: 1 }}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            // eslint-disable-next-line react/jsx-no-undef
            startIcon={<VideocamIcon />}
          >
            Live
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  );
};
