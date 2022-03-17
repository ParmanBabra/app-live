import { CheckCircle, Group, Image } from "@mui/icons-material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import { DesktopDateTimePicker, LoadingButton } from "@mui/lab";
import {
  Alert,
  AlertTitle,
  Button,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Switch,
  TextField,
  Typography
} from "@mui/material";
import _ from "lodash";
import { FunctionComponent, useMemo, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import readXlsxFile from "read-excel-file";
import { emailValidate } from "../../app/helper";
import { GrantUsersList } from "./GrantUsersList";
import { excelMap, LiveDataForm, UserInExcel } from "./model";
import { PreviewImage } from "./PreviewImage";

type SubmitedHandler = (
  data: LiveDataForm,
  users: string[],
  preLiveImage?: File | null,
  errorImage?: File | null,
  channelImage?: File | null
) => any | Promise<any>;

export const LiveForm: FunctionComponent<{
  data: LiveDataForm;
  onSubmited: SubmitedHandler;
  loading: boolean;
  isEdit: boolean;
}> = (props) => {
  let { data, onSubmited, loading, isEdit } = props;

  const refForm = useRef<HTMLFormElement>(null);
  const refInputAddUser = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
    trigger,
  } = useForm<LiveDataForm>({
    defaultValues: useMemo(() => {
      return data;
    }, [data]),
  });

  const [validateGrantUsers, setValidateGrantUsers] = useState<boolean>(true);
  const [errorsGrantUser, setErrorsGrantUser] = useState<string[]>([]);
  const [citeralUser, setCiteralUser] = useState<string>("");
  const [users, setUsers] = useState<string[]>(data.grant_users);
  const [filterUsers, setFilterUsers] = useState<string[]>(data.grant_users);
  const [preLiveImage, setPreLiveImage] = useState<string | null>(
    data.pre_live_image
  );
  const [errorImage, setErrorImage] = useState<string | null>(data.error_image);
  const [channelImage, setChannelImage] = useState<string | null>(
    data.channel_image
  );
  const [files, setFiles] = useState<(File | null)[]>([null, null, null]);

  const onSubmit: SubmitHandler<LiveDataForm> = (data) => {
    const [preLiveImageFile, errorImageFile, channelImageFile] = files;
    onSubmited(data, users, preLiveImageFile, errorImageFile, channelImageFile);
  };

  const handleSelectGrantUsers = async (e: any) => {
    if (e.target.files.length == 0) return;
    let rows = await readXlsxFile(e.target.files[0], { schema: excelMap });
    if (rows.errors.length != 0) {
      let errors = rows.errors.map((x) => `(${x.row}) ${x.error}: ${x.value} `);

      updateUsers([], citeralUser);
      setValidateGrantUsers(false);
      setErrorsGrantUser(errors);
      return;
    }

    let users = rows.rows as UserInExcel[];
    users = _.values(_.keyBy(users, "register_email")) as UserInExcel[];
    let mappedUser = users.map((x) => x.register_email);

    updateUsers(mappedUser, citeralUser);
    setValidateGrantUsers(true);
    setErrorsGrantUser([]);
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
    files[2] = file;

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

  const handleAddGrantUser = (email: string) => {
    if (emailValidate.test(email)) {
      let usersList = [...users];
      if (!usersList.includes(email)) {
        usersList.push(email);

        updateUsers(usersList, citeralUser);
      }

      let textBox = refInputAddUser.current;

      if (textBox) textBox.value = "";
    } else {
      //handle Error
    }
  };

  const handleOnDelete = (email: string) => {
    let usersList = [...users];

    if (usersList.includes(email)) {
      _.remove(usersList, (x) => x === email);

      updateUsers(usersList, citeralUser);
    }
  };

  const updateUsers = (emails: string[], citeral: string) => {
    let filtered = emails.filter((x) => x.startsWith(citeral));
    setFilterUsers(filtered);
    setUsers(emails);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h6" gutterBottom>
        Live
      </Typography>
      <Grid
        ref={refForm}
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        container
        spacing={2}
      >
        <Grid item xs={12} sm={12}>
          <Controller
            name="title"
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
            name="live_date"
            control={control}
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
                    error={errors.live_date ? true : false}
                    helperText={errors.live_date?.message}
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="create_date"
            control={control}
            render={({ field }) => (
              <DesktopDateTimePicker
                {...field}
                disabled={isEdit}
                label="Create Date"
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    required
                    variant="standard"
                    {...params}
                    error={errors.create_date ? true : false}
                    helperText={errors.create_date?.message}
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Controller
            name="show_watching_user"
            defaultValue={false}
            control={control}
            render={({ field }) => {
              return (
                <FormControlLabel
                  {...field}
                  control={<Switch checked={field.value} />}
                  label="Show Watching User"
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Controller
            name="live_url"
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
                error={errors.live_url ? true : false}
                helperText={errors.live_url?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CheckCircle />
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
              startIcon={<Image />}
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
              startIcon={<Image />}
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
              startIcon={<Image />}
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
      </Grid>

      <Grid container spacing={1}>
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
              startIcon={<Group />}
            >
              Upload Grant User
            </Button>
          </label>
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            // {...field}
            value={citeralUser}
            onChange={(e) => {
              let citeral = e.target.value;
              let filtered = users.filter((x) => x.startsWith(citeral));
              setFilterUsers(filtered);
              setCiteralUser(citeral);
            }}
            fullWidth
            label="Search Grant User"
            variant="standard"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            inputRef={refInputAddUser}
            fullWidth
            label="Add Grant User"
            variant="standard"
            onKeyUp={(e) => {
              e.stopPropagation();
              if (e.key === "Enter" || e.key === "NumpadEnter") {
                let target: any = e.target;
                const email = target.value.toLowerCase();

                handleAddGrantUser(email);
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    color="primary"
                    type="button"
                    onClick={() => {
                      let input = refInputAddUser.current;

                      if (input != null) {
                        const email = input.value.toLowerCase();
                        handleAddGrantUser(email);
                      }
                    }}
                  >
                    <AddCircleIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          {!validateGrantUsers && (
            <Alert severity="error" style={{ marginBottom: "10px" }}>
              <AlertTitle>Error</AlertTitle>
              {errorsGrantUser.map((message, index) => (
                <div key={index}>{message}</div>
              ))}
            </Alert>
          )}
          <GrantUsersList data={filterUsers} onDeleting={handleOnDelete} />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} sx={{ mt: 1 }}>
          <LoadingButton
            loading={useMemo(() => {
              return loading;
            }, [loading])}
            type="button"
            fullWidth
            variant="contained"
            onClick={(e) => {
              handleSubmit(onSubmit)();
            }}
          >
            Save
          </LoadingButton>
        </Grid>
      </Grid>
    </Container>
  );
};
