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
  OCROutputData,
  setOCROutputData,
  getOCRData,
  loading,
}) {
  return (
    <Modal open={open} onClose={handleClose} disableEscapeKeyDown>
      <Box sx={style}>
        <Stack spacing={2}>
          <p className="resultViewer__header">Preview Image</p>
          <img src={previewImage} alt="preview__image" />
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                height: "5rem",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <textarea
              id="review"
              name="review"
              className="questionContainer__review"
              placeholder="You can paste here and view your text..."
              style={{ display: OCROutputData ? "block" : "none" }}
              value={OCROutputData}
              onChange={(e) => setOCROutputData(e.target.value)}
            ></textarea>
          )}

          <Stack
            direction="row"
            spacing={2}
            className="resultViewer__actionContainer"
          >
            <Button
              variant="contained"
              className="resultViewer__save"
              onClick={getOCRData}
            >
              View OCR
            </Button>
            <Button
              variant="contained"
              className="resultViewer__save"
              onClick={handleSave}
            >
              Save
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}

export default PreviewModal;
