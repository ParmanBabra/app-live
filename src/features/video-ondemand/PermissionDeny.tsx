import { Box } from "@mui/material";
import { Fragment, useEffect } from "react";
import Typography from "@mui/material/Typography";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";

function PermissionDeny() {
  return (
    <Fragment>
      <Box
        component={"div"}
        sx={{
          height: "calc(100vh - 64px)",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <DoNotDisturbAltIcon sx={{ fontSize: 500, color: "red" }} />
        <Typography variant="h1" sx={{ color: "red" }}>
          Permission Deny
        </Typography>
      </Box>
    </Fragment>
  );
}

export default PermissionDeny;
