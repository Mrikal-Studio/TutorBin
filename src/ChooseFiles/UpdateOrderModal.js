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
  open,
}) {
  const [typeData, setTypeData] = useState(QUESTION_TYPE);
  const [type, setType] = useState("");
  const [selectedSubject, setSelectedSubject] = useState({ label: null });
  const [date, setDate] = useState();
  const [subjectData, setSubjectData] = useState([]);
  const [submittingSubjectData, setSubmittingSubjectData] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const handleChange = (event) => {
    setType(event.target.value);
  };

  const getSubjectData = (params = "ana") => {
    let tempdata = [];
    axios
      .get(BASE_URL + `subjects?search=${params}&page=1&limit=5`)
      .then((res) => {
        res?.data?.data?.map((subject) =>
          tempdata.push({
            label: subject?.name,
          })
        );
        setSubjectData(tempdata);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getOrdersData = (params = "ana") => {
    fetch(BASE_URL + `orders/?search=${params}&page=1&limit=5`)
      .then((res) => res.json())
      .then((data) => {
        setTypeData([...typeData, data.data.type]);
        setType(data.data.type);
        setSelectedSubject({ label: data.data.subject?.name });

        const orderDate = new Date(data.data.deadline);
        const requiredFormat = `${orderDate.getUTCFullYear()}-${String(
          orderDate.getUTCMonth() + 1
        ).padStart(2, "0")}-${String(orderDate.getUTCDate()).padStart(2, "0")}`;
        setDate(requiredFormat);
      });
  };

  useEffect(() => {
    getSubjectData();
    getOrdersData();
  }, []);

  const saveModalData = () => {
    const body = {
      type: type,
      deadline: date,
      subject: {
        id: subjectId,
        name: selectedSubject?.label,
      },
    };
    setSubmittingSubjectData(true);
    axios
      .put(BASE_URL + "orders/" + selectedOrderId, body)
      .then((res) => {
        setSubmittingSubjectData(false);
        handleClose();
        setSnackOpen(true);
      })
      .catch((err) => {
        setSubmittingSubjectData(false);
        console.log(err);
      });
  };

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };

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
              value={date}
              className="custom__datefield"
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select value={type} label="Type" onChange={handleChange}>
                {typeData?.map((data, idx) => (
                  <MenuItem value={data} key={idx} defaultValue="essay">
                    {data}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {subjectData ? (
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={subjectData}
                value={selectedSubject?.label}
                onChange={(event, newValue) => {
                  setSelectedSubject(newValue);
                }}
                onInputChange={(e) => getSubjectData(e?.target.value)}
                renderInput={(params) => (
                  <TextField {...params} label="Subject" />
                )}
              />
            ) : null}
          </Stack>
          <Stack
            spacing={2}
            direction="row"
            className="resultviewer__finalAction"
          >
            <Button
              variant="contained"
              className="resultViewer__cancel"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              className="resultViewer__save"
              onClick={saveModalData}
            >
              {submittingSubjectData ? "Saving..." : "Save"}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
