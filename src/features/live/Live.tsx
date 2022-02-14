import { Fragment, useState } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { createTheme, styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import {
  useFirestoreConnect,
  useFirestore,
  useFirebase,
} from "react-redux-firebase";

import LoadingButton from "@mui/lab/LoadingButton";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SendIcon from "@mui/icons-material/Send";

import { RootState } from "../../app/store";

import "./Live.css";
import simpleImage from "./../../images/live-streaming.png";
import LiveCard from "./LiveCard";
import { Button } from "@mui/material";

const drawerWidth = 375;
const appBarHeight = 48;
const titleStream = 75;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",

  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  minHeight: `${appBarHeight}px !important`,
  justifyContent: "flex-start",
}));

function Live() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [startIndexChat, setStartIndexChat] = useState(0);

  useFirestoreConnect([
    {
      collection: "live",
      doc: "current",
      subcollections: [{ collection: "chat" }],
      orderBy: [["create_date", "desc"]],
      //   limit: 10,
      storeAs: "chats",
    }, // or 'todos'
  ]);
  const firestore = useFirestore();

  const chats = useSelector(
    (state: RootState) => state.firestore.ordered.chats
  );

  const handleOnSend = () => {
    setMessage("");

    const chatMessage = {
      username: "Parman",
      message: message,
      create_date: new Date(),
    };
    return firestore
      .collection("live")
      .doc("current")
      .collection("chat")
      .add(chatMessage);
  };

  const handleOnLoadMore = async () => {
    setLoading(true);
    await firestore.get({
      collection: "live",
      doc: "current",
      subcollections: [{ collection: "chat" }],
      orderBy: [["create_date", "desc"]],
      //   limit: 10,
      //   startAt: 0,
      //   endAt: 2,
      storeAs: "chats",
    });
    setLoading(false);
  };

  return (
    <Fragment>
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          maxWidth: `calc(100vw - ${drawerWidth}px)`,
          height: "100vh",
        }}
      >
        <DrawerHeader />

        <img
          src={simpleImage}
          alt="Simple"
          style={{
            maxHeight: `calc(100vh - ${appBarHeight}px - ${titleStream}px)`,
          }}
        />
        <LiveCard />
      </Box>
      <Drawer
        open={true}
        variant="persistent"
        anchor="right"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <DrawerHeader />
        <Toolbar variant="dense">
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
          >
            <KeyboardArrowRightIcon fontSize="small" />
          </IconButton>
          <Typography
            variant="subtitle1"
            color="inherit"
            align="center"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            STREAM CHAT
          </Typography>
        </Toolbar>
        <Divider />
        <Box sx={{ overflow: "auto", flexGrow: 1 }}>
          <Typography variant="subtitle2" component="div" px={1} pt={1}>
            Welcome to the chat room!
          </Typography>
          {chats
            ? chats.map((chat: any) => {
                return (
                  <Box key={chat.id} px={2}>
                    <Typography
                      variant="subtitle2"
                      component="span"
                      className="username"
                    >
                      {chat.username}:
                    </Typography>
                    <Typography
                      variant="body2"
                      component="span"
                      className="message"
                    >
                      {chat.message}
                    </Typography>
                  </Box>
                );
              })
            : ""}
          {/* 
          <LoadingButton
            fullWidth
            onClick={handleOnLoadMore}
            loading={loading}
            loadingIndicator="Loading..."
            variant="outlined"
          >
            Load More
          </LoadingButton> 
          */}
        </Box>
        <Divider />
        <Paper
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Send a message"
            inputProps={{ "aria-label": "Send a message" }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e: any) => {
              if (e.code === "Enter" || e.code === "NumpadEnter") {
                handleOnSend();
              }
            }}
          />
          <IconButton
            type="button"
            sx={{ p: "10px" }}
            aria-label="search"
            onClick={handleOnSend}
          >
            <SendIcon />
          </IconButton>
        </Paper>
      </Drawer>
    </Fragment>
  );
}

export default Live;
