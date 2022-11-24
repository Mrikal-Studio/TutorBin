import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";

function FileSupportedDialog({ handleClose, open, selectedFileData }) {
  const handleOk = () => {
    handleClose();
    window.open(selectedFileData?.fileUrl, "_blank");
  };
  return (
    <Dialog open={open} keepMounted onClose={handleClose}>
      <DialogTitle>{"File format not supported!!!"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Currently only pdf, PDF, jpeg, jpg, png, PNG, JPEG and JPG extensions
          are supported. Please open the file in your system and take
          screenshot.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOk}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}

export default FileSupportedDialog;
