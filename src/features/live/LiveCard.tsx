import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import GroupIcon from "@mui/icons-material/Group";

import SickIcon from "@mui/icons-material/Sick";
import { Box } from "@mui/material";



export default function LiveCard() {
  return (
    <Card elevation={0}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            <SickIcon />
          </Avatar>
        }
        action={
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <GroupIcon />
            <Typography variant="body2" sx={{ px: 1 }}>
              1,053
            </Typography>
          </Box>
        }
        title="[Live Title]"
        subheader="September 14, 2016"
      />
    </Card>
  );
}
