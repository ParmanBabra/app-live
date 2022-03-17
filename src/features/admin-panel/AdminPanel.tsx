import { Button, Container, Divider } from "@mui/material";
import _ from "lodash";
import { Fragment } from "react";
import { useDispatch } from "react-redux";
import { exportAllUsers } from "./adminPanelSlice";
import ListLive from "./ListLive";

import ListVideo from "./ListVideo";

function AdminPanel() {
  const dispatch = useDispatch();

  const handleExportAllUsers = async () => {
    await dispatch(exportAllUsers());
  };
  return (
    <Fragment>
      <Container sx={{ py: 8 }}>
        <ListVideo />
        <Divider sx={{ my: 5 }} />
        <ListLive />
      </Container>
    </Fragment>
  );
}

export default AdminPanel;
