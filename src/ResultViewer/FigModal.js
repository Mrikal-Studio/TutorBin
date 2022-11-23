import { Modal } from "@mui/material";
import { Box, Stack } from "@mui/system";
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

function FigModal({ open, handleClose, selectedFig }) {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Stack spacing={2}>
          <img
            src={selectedFig?.imageURI ? selectedFig?.imageURI : selectedFig}
            alt="preview__image"
          />
        </Stack>
      </Box>
    </Modal>
  );
}

export default FigModal;
