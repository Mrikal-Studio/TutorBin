import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { InputLabel, Stack } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { BASE_URL } from "../api";
import { QUESTION_TYPE } from "../utils/dropDownData";
import { useState } from "react";

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

export default function UpdateOrderModal({ selectedOrderId, subjectId }) {
  const [open, setOpen] = useState(true);
  const [type, setType] = useState("");
  const [Subject, setSubject] = useState("");
  const [Date, setDate] = useState();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event) => {
    setType(event.target.value);
  };
  const handleSubject = (event) => {
    setSubject(event.target.value);
  };

  const UpdateData = () => {};

  const saveModalData = () => {
    console.log("type", type);
    console.log("Subject", Subject);
    console.log("Date", Date);

    const body = {
      type: type,
      deadline: Date,
      subject: {
        id: subjectId,
        name: Subject,
      },
    };
    axios
      .put(BASE_URL + "orders/" + selectedOrderId, body)
      .then((res) => {
        console.log(res, "update wala order bey");
        // setSnackOpen(true);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <p className="title">Update Order Info</p>
          <Stack spacing={2}>
            <InputLabel>Deadline</InputLabel>
            <input
              type={"date"}
              onChange={(e) => setDate(e.target.value)}
              value={Date}
              className="custom__datefield"
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select value={type} label="Type" onChange={handleChange}>
                {QUESTION_TYPE?.map((data, idx) => (
                  <MenuItem value={data} key={idx} defaultValue="essay">
                    {data}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Subject</InputLabel>
              <Select value={Subject} label="Subject" onChange={handleSubject}>
                <MenuItem value={"assignment"}>assignment</MenuItem>
                <MenuItem value={"session"}>session</MenuItem>
              </Select>
            </FormControl>
          </Stack>
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
