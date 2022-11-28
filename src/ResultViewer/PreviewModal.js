import { Box, Button, CircularProgress, Modal, Stack } from "@mui/material";
import React from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "#fff",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function PreviewModal({
  open,
  handleClose,
  previewImage,
  handleSave,
  savingOCROutputData,
  OCROutputData,
  setOCROutputData,
  getOCRData,
  loadingOCRData,
}) {
  return (
    <Modal open={open} onClose={handleClose} disableEscapeKeyDown>
      <Box sx={style}>
        <Stack spacing={2}>
          <p className="resultViewer__header">Preview Image</p>
          <img src={previewImage} alt="preview__image" />
          <Stack
            direction="row"
            spacing={2}
            className="resultViewer__actionContainer"
          >
            <Button
              variant="contained"
              className="resultViewer__save"
              onClick={handleSave}
            >
              {savingOCROutputData ? "Saving..." : "Save"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}

export default PreviewModal;
