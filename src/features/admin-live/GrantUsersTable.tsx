import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { Fragment } from "react";
import { UserExcelData, firstName, lastName } from "./model";

import "./GrantUsersTable.css"

type Props = {
  data?: UserExcelData[] | null | undefined;
};

export const GrantUsersTable = (props: Props) => {
  const { data } = props;

  if (!data || data.length == 0) {
    return <Fragment></Fragment>;
  }

  return (
    <TableContainer component={Paper} elevation={2} className="table-contrainer">
      <Table sx={{ minWidth: 650 }}>
        <TableHead className="header">
          <TableRow>
            <TableCell>Register Email</TableCell>
            <TableCell align="right">First Name</TableCell>
            <TableCell align="right">Last Name</TableCell>
            <TableCell align="right">Organization</TableCell>
            <TableCell align="right">Tel.</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className="body">
          {data.map((row: UserExcelData) => (
            <TableRow
              key={row.register_email}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.register_email}
              </TableCell>
              <TableCell align="right">{firstName(row)}</TableCell>
              <TableCell align="right">{lastName(row)}</TableCell>
              <TableCell align="right">{row.organization}</TableCell>
              <TableCell align="right">{row.tel}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
