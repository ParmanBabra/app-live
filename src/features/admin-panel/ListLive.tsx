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
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { collection, getFirestore, orderBy, query } from "firebase/firestore";
import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../app/store";
import { BackdropLoading } from "../../components/BackdropLoading";
import { usePagination } from "./../../app/use-pagination-firestore";
import {
  deleteLive,
  endLive,
  exportChats,
  exportRegisterUsers,
  toVideo,
} from "./adminPanelSlice";
import { ConfirmModal } from "./ConfirmModal";
import { EndLiveRequest, LiveData } from "./model";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import moment from "moment";

import "./ListLive.css";
import { EndLiveForm, ToOnDemandModal } from "./ToOnDemandModal";

function ListLive() {
  const db = getFirestore();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentStepMenu, setCurrentStepMenu] = useState<number | null>(null);
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const [toOnDemand, setToOnDemand] = useState(false);

  const { items, isLoading, isStart, isEnd, getPrev, getNext } =
    usePagination<LiveData>(
      query(collection(db, "live"), orderBy("step", "asc")),
      {
        limit: 5,
      }
    );

  const loading = useSelector(({ admin }: RootState) => admin.loading);

  if (isLoading) {
    return <BackdropLoading />;
  }

  const handleOnEdit = () => {
    navigate(`live/${currentKey}`, { replace: false });
    setAnchorEl(null);
    setCurrentStepMenu(null);
    setCurrentKey(null);
  };

  const handleOnAdd = () => {
    navigate(`live/new`, { replace: false });
  };

  const handleOnDelete = () => {
    setDeletingKey(currentKey);
    setConfirmDeleteOpen(true);

    setAnchorEl(null);
    setCurrentStepMenu(null);
    setCurrentKey(null);
  };

  const handlePreviewVideo = (id: string) => {
    navigate(`../live/${id}`, { replace: true });
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>, row: LiveData) => {
    setAnchorEl(event.currentTarget);
    setCurrentStepMenu(row.step);
    setCurrentKey(row.id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentStepMenu(null);
    setCurrentKey(null);
  };

  const handleEndLive = async () => {
    await dispatch(endLive(currentKey as string));
    setAnchorEl(null);
    setCurrentStepMenu(null);
    setCurrentKey(null);
  };

  const handleExportChat = async () => {
    await dispatch(exportChats(currentKey as string));
    setAnchorEl(null);
    setCurrentStepMenu(null);
    setCurrentKey(null);
  };

  const handleExportRegisterUser = async () => {
    await dispatch(exportRegisterUsers(currentKey as string));
    setAnchorEl(null);
    setCurrentStepMenu(null);
    setCurrentKey(null);
  };

  const handleToOnDemand = () => {
    setToOnDemand(true);
    setAnchorEl(null);
    setCurrentStepMenu(null);
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
          Lives
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
                  <TableRow key={row.id}>
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
                        onClick={() => handlePreviewVideo(row.id)}
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

                        <Box className="box-title">
                          <Typography
                            variant="subtitle2"
                            component="div"
                            className="label-title"
                          >
                            Title:
                          </Typography>

                          {row.step === 1 && (
                            <LiveTvIcon className="live-icon" color="error" />
                          )}
                        </Box>

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
                          {/* {row.step === 1 && (
                            <IconButton
                              aria-label="edit"
                              onClick={() => handleOnEdit(row.id)}
                            >
                              <EditIcon />
                            </IconButton>
                          )} */}
                          {/* <IconButton
                            aria-label="delete"
                            color="error"
                            onClick={() => handleOnDelete(row.id)}
                          >
                            <DeleteIcon />
                          </IconButton> */}
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
                        verticalAlign: "top",
                      }}
                    >
                      <Box className="action-column">
                        <IconButton
                          sx={{ ml: 2 }}
                          onClick={(e) => handleMenu(e, row)}
                        >
                          <MoreVertIcon />
                        </IconButton>
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
        detail="Are you sure do you want to delete this live?"
        onCancel={() => {
          setConfirmDeleteOpen(false);
        }}
        onConfirm={async () => {
          await dispatch(deleteLive(deletingKey as string));
          setConfirmDeleteOpen(false);
        }}
      />

      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {currentStepMenu === 1 && (
          <MenuItem onClick={() => handleOnEdit()}>Edit</MenuItem>
        )}

        {currentStepMenu === 1 && (
          <MenuItem onClick={() => handleEndLive()}>End Live</MenuItem>
        )}

        {currentStepMenu === 2 && (
          <MenuItem onClick={() => handleExportChat()}>Export Chat</MenuItem>
        )}
        {currentStepMenu === 2 && (
          <MenuItem onClick={() => handleExportRegisterUser()}>
            Export Register User
          </MenuItem>
        )}
        {currentStepMenu === 2 && (
          <MenuItem onClick={() => handleToOnDemand()}>
            To Video On Demand
          </MenuItem>
        )}

        <MenuItem onClick={() => handleOnDelete()} color="error">
          Delete
        </MenuItem>
      </Menu>

      <ToOnDemandModal
        open={toOnDemand}
        loading={loading}
        key={currentKey}
        onCancel={() => {
          setToOnDemand(false);
        }}
        onSubmit={async (data: EndLiveForm) => {
          await dispatch(
            toVideo({ live_url: data.live_url, key: currentKey as string })
          );
          setToOnDemand(false);
          setCurrentKey(null);
        }}
      ></ToOnDemandModal>
    </Fragment>
  );
}

export default ListLive;
