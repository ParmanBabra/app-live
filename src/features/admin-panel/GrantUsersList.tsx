import DeleteIcon from "@mui/icons-material/Delete";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from "@mui/material";
import React, { Fragment, FunctionComponent } from "react";
import "./GrantUsersList.css";

type DeletingHandler = (email: string) => void;

export const GrantUsersList: FunctionComponent<{
  data: string[] | null | undefined;
  onDeleting: DeletingHandler;
}> = (props) => {
  const { data, onDeleting } = props;

  if (!data || data.length == 0) {
    return <Fragment></Fragment>;
  }

  return (
    <TableContainer
      component={Paper}
      elevation={2}
      className="table-contrainer"
    >
      <Table>
        <TableBody className="body">
          {data.map((email: string) => (
            <TableRow
              key={email}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="td" width={"100%"} scope="row">
                {email}
              </TableCell>
              <TableCell component="td" scope="row">
                <IconButton
                  color="error"
                  onClick={() => {
                    onDeleting(email);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
