import { Modal } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

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
          <img src={selectedFig?.imageURI?selectedFig?.imageURI:selectedFig} alt="preview__image" />
          {/* <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Question Type
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel value="MCQ" control={<Radio />} label="MCQ" />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="Lab Project"
                control={<Radio />}
                label="Lab Project"
              />
              <FormControlLabel
                value="disabled"
                control={<Radio />}
                label="other"
              />
            </RadioGroup>
          </FormControl> */}
        </Stack>
      </Box>
    </Modal>
  );
}

export default FigModal;
