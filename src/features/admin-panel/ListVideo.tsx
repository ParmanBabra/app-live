import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from "@mui/material";
import { collection, getFirestore, orderBy, query } from "firebase/firestore";
import moment from "moment";
import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../app/store";
import { BackdropLoading } from "../../components/BackdropLoading";
import { usePagination } from "./../../app/use-pagination-firestore";
import { deleteVideo } from "./adminPanelSlice";
import { ConfirmModal } from "./ConfirmModal";
// import { register } from "./ondemandSlice";
import "./ListVideo.css";
import { VideoData } from "./model";

function ListVideo() {
  const db = getFirestore();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  const { items, isLoading, isStart, isEnd, getPrev, getNext } =
    usePagination<VideoData>(
      query(collection(db, "video-on-demand"), orderBy("create_date", "desc")),
      {
        limit: 5,
      }
    );

  const loading = useSelector(({ admin }: RootState) => admin.loading);

  if (isLoading) {
    return <BackdropLoading />;
  }

  const handleOnEdit = (id: string) => {
    navigate(`video/${id}`, { replace: false });
  };

  const handleOnAdd = () => {
    navigate(`video/new`, { replace: false });
  };

  const handleOnDelete = (id: string) => {
    setDeletingKey(id);
    setConfirmDeleteOpen(true);
  };

  const handlePreviewVideo = (id: string) => {
    navigate(`../video-ondemand/${id}`, { replace: true });
  };

  return (
    <Fragment>
      <Box
        className="title-header"
        sx={{
          pb: 4,
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Video On Demand
        </Typography>
        <IconButton
          aria-label="Add"
          color="primary"
          onClick={() => {
            handleOnAdd();
          }}
        >
          <AddCircleIcon fontSize="large" />
        </IconButton>
      </Box>
      {items.length != 0 && (
        <Box
          sx={{
            width: {
              xs: "calc(100vw - 32px)",
              md: "100%",
              lg: "100%",
            },
            overflow: "hidden",
          }}
        >
          <TableContainer component={Paper} elevation={3}>
            <Table aria-label="simple table">
              <TableBody>
                {items.map((row) => (
                  <TableRow key={row.key}>
                    <TableCell
                      align="center"
                      className="avatar-column"
                      sx={{
                        display: {
                          xs: "none",
                          md: "table-cell",
                          lg: "table-cell",
                        },
                      }}
                    >
                      <ButtonBase
                        className="btn-image-preview"
                        sx={{ height: 128 }}
                        onClick={() => handlePreviewVideo(row.key)}
                      >
                        <img
                          className="image-preview"
                          alt={row.title}
                          src={row.pre_live_image}
                        />
                        <PlayCircleIcon
                          sx={{
                            display: "none",
                            position: "absolute",
                            height: "100%",
                            width: "100%",
                            padding: "22px",
                          }}
                          color="disabled"
                          className="icon-preview"
                        />
                      </ButtonBase>
                    </TableCell>
                    <TableCell style={{ verticalAlign: "top", width: "100%" }}>
                      <Box className="card-cell">
                        <Avatar className="avatar" src={row.channel_image} />

                        <Typography
                          variant="subtitle2"
                          component="div"
                          className="label-title"
                        >
                          Title:
                        </Typography>
                        <Typography
                          variant="caption"
                          display="block"
                          className="title"
                        >
                          {row.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          display="block"
                          gutterBottom
                          className="live-on"
                        >
                          Live On: {moment(row.live_date.toDate()).fromNow()}
                        </Typography>
                        <Box
                          sx={{
                            display: {
                              xs: "flex",
                              md: "none",
                              lg: "none",
                            },
                          }}
                          className="action-mobile"
                        >
                          <IconButton aria-label="play" color="primary">
                            <PlayCircleIcon />
                          </IconButton>
                          <IconButton
                            aria-label="edit"
                            onClick={() => handleOnEdit(row.key)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            color="error"
                            onClick={() => handleOnDelete(row.key)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        display: {
                          xs: "none",
                          md: "table-cell",
                          lg: "table-cell",
                        },
                      }}
                    >
                      <Box className="action-column">
                        <Button
                          className="rect-button"
                          variant="outlined"
                          startIcon={<EditIcon />}
                          onClick={() => handleOnEdit(row.key)}
                        >
                          Edit
                        </Button>
                        <Button
                          className="rect-button"
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleOnDelete(row.key)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box className="pagination">
              <Button type="button" onClick={getPrev} disabled={isStart}>
                Previous
              </Button>
              <Button type="button" onClick={getNext} disabled={isEnd}>
                Next
              </Button>
            </Box>
          </TableContainer>
        </Box>
      )}
      <ConfirmModal
        loading={loading}
        open={confirmDeleteOpen}
        title="Confirm"
        detail="Are you sure do you want to delete this video?"
        onCancel={() => {
          setConfirmDeleteOpen(false);
        }}
        onConfirm={async () => {
          await dispatch(deleteVideo(deletingKey as string));
          setConfirmDeleteOpen(false);
        }}
      />
    </Fragment>
  );
}

export default ListVideo;
