import { Container } from "@mui/material";
import React, { Fragment } from "react";
import { ListLive } from "./ListLive";
import { ListVideo } from "./ListVideo";

function Home() {
  return (
    <Fragment>
      <ListLive />
      
      <Container sx={{ py: 8 }}>
        <ListVideo />
      </Container>
    </Fragment>
  );
}

export default Home;
