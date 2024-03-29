import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SendIcon from "@mui/icons-material/Send";
import {
  Checkbox,
  CSSObject,
  FormControlLabel,
  FormGroup,
  Theme,
} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestore, useFirestoreConnect } from "react-redux-firebase";
import { useParams } from "react-router-dom";
import { RootState } from "../../app/store";
import { LiveData } from "../admin-panel/model";
import { grantLive, toggleShowName } from "../app/AppSlice";
import "./Live.css";
import { LiveCard } from "./LiveCard";
import { LiveNotStart } from "./LiveNotStart";
import { Chat } from "./model";
import Video from "./Video";

const drawerMaxWidth = 375;
const drawerMinWidth = 75;
const appBarHeight = 48;
const titleStream = 75;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerMaxWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",

  justifyContent: "flex-start",
  padding: theme.spacing(0, 1),

  // necessary for content to be below app bar
  ...theme.mixins.toolbar,

  minHeight: `${appBarHeight}px !important`,
}));

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerMaxWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

function Live() {
  let { id } = useParams();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [timing, setTiming] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useFirestoreConnect([
    {
      collection: "live",
      doc: id,
    },
    {
      collection: "live",
      doc: id,
      subcollections: [{ collection: "chat" }],
      orderBy: [["create_date", "desc"]],
      //   limit: 10,
      storeAs: "chats",
    }, // or 'todos'
  ]);

  const firestore = useFirestore();
  const user = useSelector((state: RootState) => state.user);
  const app = useSelector((state: RootState) => state.app);
  const chats = useSelector(
    (state: RootState) => state.firestore.ordered.chats
  );

  const row = useSelector((state: RootState) => state.firestore.data.live);

  const updateUserCounting = async () => {
    console.log("update watching count...");
    let doc = await firestore.collection("live").doc(id).get();
    let live: any = doc.data();

    if (!live.watching_users.includes(user.email)) {
      console.log("watching users");
      live.watching_users.push(user.email);
      live.watching_count += 1;
      await firestore.collection("live").doc(id).update(live);
    }

    let watchingRef = await firestore
      .collection("live")
      .doc(id)
      .collection("watching_users")
      .doc(user.email as string)
      .get();

    if (watchingRef.exists) {
      let watching: any = watchingRef.data();
      watching.timing = timing + 1;
      await firestore
        .collection("live")
        .doc(id)
        .collection("watching_users")
        .doc(user.email as string)
        .update(watching);
    } else {
      await firestore
        .collection("live")
        .doc(id)
        .collection("watching_users")
        .doc(user.email as string)
        .set({ email: user.email, timing: timing + 1 });
    }

    setTiming(timing + 1);
  };

  useEffect(() => {
    let updating = setTimeout(updateUserCounting, 10000);

    return function cleanup() {
      clearTimeout(updating);
    };
  });

  useEffect(() => {
    dispatch(grantLive({ email: user.email as string, key: id as string }));
  });

  const handleOnSend = () => {
    if (message.trim() === "") return;
    setMessage("");

    const chatMessage: Chat = {
      email: user.email as string,
      username: app.isShowName ? (user.firstName as string) : "ไม่ระบุชื่อ",
      message: message.trim(),
      create_date: new Date(),
    };
    return firestore
      .collection("live")
      .doc(id)
      .collection("chat")
      .add(chatMessage);
  };

  const renderDrawButton = (opened: boolean) => {
    if (opened) {
      return <KeyboardArrowRightIcon fontSize="small" />;
    } else {
      return <KeyboardArrowLeftIcon fontSize="small" />;
    }
  };

  const renderSectionChat = (opened: boolean, drawed: boolean) => {
    if (!opened) return <Fragment></Fragment>;

    let displayStyle: any = {};
    let displayStyleTextBox: any = {};

    if (!drawed) {
      displayStyle = {
        display: { xs: "block", md: "none", lg: "none" },
        minHeight: { xs: "100px", md: "auto", lg: "auto" },
      };
      displayStyleTextBox = {
        display: { xs: "flex", md: "none", lg: "none" },
      };
    }

    return (
      <Fragment>
        <Box sx={{ overflow: "auto", flexGrow: 1, ...displayStyle }}>
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
                      sx={{
                        whiteSpace: "pre-wrap",
                        display: "inline",
                        wordBreak: "break-word",
                      }}
                    >
                      {chat.message}
                    </Typography>
                  </Box>
                );
              })
            : ""}
        </Box>
        <Divider />
        <FormGroup>
          <FormControlLabel
            sx={{ marginLeft: 0, ...displayStyleTextBox }}
            control={
              <Checkbox
                value={app.isShowName}
                onChange={() => dispatch(toggleShowName())}
                defaultChecked={app.isShowName}
              />
            }
            label="Show Name"
          />
        </FormGroup>
        <Divider sx={{ ...displayStyleTextBox }} />
        <Paper
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            ...displayStyleTextBox,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Send a message"
            inputProps={{ "aria-label": "Send a message" }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e: any) => {
              if (e.key === "Enter" || e.key === "NumpadEnter") {
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
      </Fragment>
    );
  };

  if (!row) {
    return (
      <Fragment>
        <LiveNotStart />
      </Fragment>
    );
  }

  const live = row[id] as LiveData;

  if (!live || live.step === 0 || live.step === 2) {
    return (
      <Fragment>
        <LiveNotStart />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Box
        component="div"
        sx={{
          width: "100vw",
          flexGrow: 1,
          display: "grid",
          gridTemplateRows: "auto",
          ...(drawerOpen
            ? {
                gridTemplateColumns: {
                  xs: "auto",
                  md: `auto ${drawerMaxWidth}px`,
                  lg: `auto ${drawerMaxWidth}px`,
                },
              }
            : {
                gridTemplateColumns: {
                  xs: "auto",
                  md: `auto ${drawerMinWidth}px`,
                  lg: `auto ${drawerMinWidth}px`,
                },
              }),
        }}
      >
        <Box
          component="div"
          sx={{
            display: "flex",
            flexDirection: "column",
            height: {
              xs: "calc(100vh - 48px);",
              md: "calc(100vh - 48px)",
              lg: "calc(100vh - 48px)",
            },
          }}
        >
          <Video
            startLiveDate={live.live_date}
            errorImage={live.error_image}
            preLiveImage={live.pre_live_image}
            soruce={live.live_url}
          />

          <LiveCard live={live} />

          {renderSectionChat(drawerOpen, false)}
        </Box>
        <Drawer
          open={drawerOpen}
          variant="permanent"
          anchor="right"
          sx={{ display: { xs: "none", md: "block", lg: "block" } }}
        >
          <DrawerHeader />
          <Toolbar variant="dense">
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              {renderDrawButton(drawerOpen)}
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

          {renderSectionChat(drawerOpen, true)}
        </Drawer>
      </Box>
    </Fragment>
  );
}

export default Live;
