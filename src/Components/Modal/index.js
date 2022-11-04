import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import "./modal.css";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import {
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { BASE_URL } from "../../api";
import { ASSIGNMENT_TYPE } from "../../utils/dropDownData";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({ selectedOrderId }) {
  const [open, setOpen] = React.useState(true);
  const [age, setAge] = React.useState("");
  const [Subject, setSubject] = React.useState("");
  const [Date, setDate] = React.useState();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  const handleSubject = (event) => {
    setSubject(event.target.value);
  };

  const UpdateData = () => {};

  const saveModalData = () => {
    console.log("age", age);
    console.log("Subject", Subject);
    console.log("Date", Date);

    const body = {
      type: age,
      deadline: Date,
      subject: {
        id: "632ac8c9a7723378033e279c",
        name: Subject,
      },
    };
    axios
      .put(BASE_URL + "orders/" + selectedOrderId, body)
      .then((res) => {
        console.log(res);
        // setSnackOpen(true);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            className="title"
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Update Order Info
          </Typography>
          <div className="Box">
            <InputLabel id="demo-simple-select-label">Deadline</InputLabel>
            <input
              type={"date"}
              onChange={(e) => setDate(e.target.value)}
              value={Date}
            />

            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                className="dropdown"
                id="demo-simple-select"
                value={age}
                label="Type"
                onChange={handleChange}
              >
                <MenuItem value={"Ten"}>Ten</MenuItem>
                <MenuItem value={"Twenty"}>Twenty</MenuItem>
                <MenuItem value={"Thirty"}>Thirty</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Subject</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                className="dropdown"
                id="demo-simple-select"
                value={Subject}
                label="Subject"
                onChange={handleSubject}
              >
                <MenuItem value={"assignment"}>assignment</MenuItem>
                <MenuItem value={"session"}>session</MenuItem>
              </Select>
            </FormControl>
          </div>
          <Stack
            spacing={2}
            direction="row"
            className="resultviewer__finalAction"
          >
            <Button
              variant="contained"
              className="resultViewer__save"
              onClick={saveModalData}
            >
              Save
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
