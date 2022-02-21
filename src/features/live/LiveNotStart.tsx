import { Box } from "@mui/material";
import React from "react";

export const LiveNotStart = () => {
  return (
    <Box sx={{ width: "100vw", height: "calc(100vh - 48px)" }}>
      <img
        src="https://firebasestorage.googleapis.com/v0/b/app-live-36e59.appspot.com/o/stream-ending-soon.jpg?alt=media&token=0ee75532-ce89-47aa-bf43-43a43a659838"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </Box>
  );
};
