import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import _ from "lodash";
import { Fragment, useState, useEffect, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect, useFirestore } from "react-redux-firebase";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../app/store";
import Video from "../live/Video";
// import { register } from "./ondemandSlice";

// import "./VideoOnDemand.css";

function AdminPanel() {
  let navigate = useNavigate();
  const firestore = useFirestore();
  useFirestoreConnect([
    {
      collection: "video-on-demand",
      orderBy: ["create_date", "desc"],
    },
  ]);

  let list = [1, 2, 3];

  return (
    <Fragment>
      {list.map((x) => (
        <Paper key={x}>XXXXXX</Paper>
      ))}
    </Fragment>
  );
}

export default AdminPanel;
