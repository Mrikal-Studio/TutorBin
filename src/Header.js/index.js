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
import OutlinedInput from "@mui/material/OutlinedInput";

function Header({ selectedOrderId, getFiles, setsearchOrder }) {
  const [snackOpen, setSnackOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isCompletingOrder, setIsCompletingOrder] = useState(false);

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };

  const handleCompleteOrder = () => {
    setIsCompletingOrder(true);
    axios
      .put(BASE_URL + "orders/complete/" + selectedOrderId)
      .then((res) => {
        setIsCompletingOrder(false);
        console.log(res);
        setSnackOpen(true);
      })
      .catch((err) => {
        setIsCompletingOrder(false);
        console.log(err);
      });
  };

  const getLatestOrder = () => {
    getFiles();
  };

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
            alt="logo"
            width="128"
            height="35"
            src="https://static.tutorbin.com/static/logo/tblogo-new.png"
          ></img>
        </div>
        <Stack direction={"row"} spacing={3} alignItems="center">
          <p style={{ fontSize: "0.9rem", fontWeight: "500" }}>
            Order No. {selectedOrderId}
          </p>
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
            {isCompletingOrder ? "Completing Order..." : "Complete Order"}
          </Button>
          <OutlinedInput
            id="outlined-adornment-password"
            type={"text"}
            onChange={(e) => setSearchText(e.target.value)}
            className="searchBar"
            autoFocus={false}
            endAdornment={
              <InputAdornment position="end">
                <IconButton edge="end">
                  <SearchIcon onClick={() => setsearchOrder(searchText)} />
                </IconButton>
              </InputAdornment>
            }
          />
        </Stack>
      </div>
    </div>
  );
}

export default Header;
