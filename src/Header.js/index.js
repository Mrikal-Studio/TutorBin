import {
  Alert,
  Button,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../api";
import "./Header.css";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";

function Header({ selectedOrderId, getFiles, setsearchOrder }) {
  const [snackOpen, setSnackOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };

  const handleCompleteOrder = () => {
    axios
      .put(BASE_URL + "orders/complete/" + selectedOrderId)
      .then((res) => {
        console.log(res);
        setSnackOpen(true);
      })
      .catch((err) => console.log(err));
  };

  const getLatestOrder = () => {
    getFiles();
  };

  const getNewOrder = () => {};

  return (
    <div>
      <div className="header">
        <Snackbar
          open={snackOpen}
          autoHideDuration={6000}
          onClose={handleSnackClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Order Completed Successfully!!!
          </Alert>
        </Snackbar>
        <div>
          <img
            className="logo"
            src="https://static.tutorbin.com/static/logo/tblogo-new.png"
          ></img>
        </div>
        <Stack direction={"row"} spacing={3} alignItems="center">
          <p style={{ fontSize: "0.8rem", fontWeight: "400" }}>
            Order No. {selectedOrderId}
          </p>
          {/* <Button variant="contained" className="header__getLatestOrder">
          Get New Order
        </Button> */}
          <Button
            style={{
              fontSize: "0.8rem",
              borderColor: "#D3D3D3",
              fontWeight: "600",
            }}
            variant="outlined"
            className="header__getLatestOrder"
            onClick={getLatestOrder}
          >
            Get Latest Order
          </Button>
          <Button
            style={{
              fontSize: "0.8rem",
              borderColor: "#D3D3D3",
              fontWeight: "600",
            }}
            variant="outlined"
            className="header__getLatestOrder"
            onClick={handleCompleteOrder}
          >
            Complete Order
          </Button>
          <OutlinedInput
            id="outlined-adornment-password"
            type={"text"}
            onChange={(e) => setSearchText(e.target.value)}
            className="searchBar"
            endAdornment={
              <InputAdornment position="end">
                <IconButton edge="end">
                  <SearchIcon onClick={() => setsearchOrder(searchText)} />
                </IconButton>
              </InputAdornment>
            }
            label="Search Order"
          />
        </Stack>
      </div>
    </div>
  );
}

export default Header;
