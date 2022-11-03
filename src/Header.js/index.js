import { Alert, Button, Snackbar, Stack } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../api";
import "./Header.css";

function Header({ selectedOrderId, getFiles }) {
  const [snackOpen, setSnackOpen] = useState(false);

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
      <p>PDF Viewer and OCR Reader</p>
      <Stack direction={"row"} spacing={3} alignItems="center">
        <p>Order No. {selectedOrderId}</p>
        {/* <Button variant="contained" className="header__getLatestOrder">
          Get New Order
        </Button> */}
        <Button
          variant="contained"
          className="header__getLatestOrder"
          onClick={getLatestOrder}
        >
          Get Latest Order
        </Button>
        <Button
          variant="contained"
          className="header__getLatestOrder"
          onClick={handleCompleteOrder}
        >
          Complete Order
        </Button>
      </Stack>
    </div>
  );
}

export default Header;
