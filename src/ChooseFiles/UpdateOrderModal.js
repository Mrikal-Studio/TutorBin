import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import {
  Alert,
  Autocomplete,
  InputLabel,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { BASE_URL } from "../api";
import { QUESTION_TYPE } from "../utils/dropDownData";
import { useState } from "react";
import { useEffect } from "react";
import Loader from "../Loader/index";

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

export default function UpdateOrderModal({
  selectedOrderId,
  subjectId,
  handleClose,
  handleOpen,
  open,
}) {
  const [type, setType] = useState("");
  const [Subject, setSubject] = useState("");
  const [Date, setDate] = useState();
  const [subjectData, setSubjectData] = useState([]);
  const [snackOpen, setSnackOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (event) => {
    setType(event.target.value);
  };
  const handleSubject = (event) => {
    setSubject(event.target.value);
  };

  const UpdateData = () => {};

  const getSubjectData = (params = "ana") => {
    setSubject(params);
    let tempdata = [];
    axios
      .get(BASE_URL + `subjects?search=${params}&page=1&limit=5`)
      .then((res) => {
        setIsLoading(false);
        console.log(res?.data?.data, "subject get");
        res?.data?.data?.map((subject) =>
          tempdata.push({
            label: subject?.name,
          })
        );
        setSubjectData(tempdata);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getSubjectData();
  }, []);

  const saveModalData = () => {
    const body = {
      type: type,
      deadline: Date,
      subject: {
        id: subjectId,
        name: Subject?.label,
      },
    };
    axios
      .put(BASE_URL + "orders/" + selectedOrderId, body)
      .then((res) => {
        handleClose();
        setSnackOpen(true);
      })
      .catch((err) => console.log(err));
  };

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
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
          Saved Successfully!!!
        </Alert>
      </Snackbar>
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
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={subjectData}
              onChange={(event, newValue) => {
                setSubject(newValue);
              }}
              onInputChange={(e) => getSubjectData(e.target.value)}
              renderInput={(params) => (
                <TextField {...params} label="Subject" />
              )}
            />
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
