import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import {
  QUESTION_CATEGORY,
  QUESTION_DIFFICULTY,
  QUESTION_TYPE,
} from "../utils/dropDownData";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
} from "@mui/material";

function SelectOptions({ setSelectedOptions, selectedOptions }) {
  const handleTypeChange = (e) => {
    setSelectedOptions({ ...selectedOptions, type: e.target.value });
  };
  const handleDifficultyChange = (e) => {
    setSelectedOptions({ ...selectedOptions, difficulty: e.target.value });
  };
  const handleCategoryChange = (e) => {
    setSelectedOptions({ ...selectedOptions, category: e.target.value });
  };
  return (
    <Box sx={{ flexGrow: 1, marginTop: "2rem" }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Type</InputLabel>
            <Select
              label="Type"
              className="selectOptions__dropdown"
              onChange={handleTypeChange}
            >
              {QUESTION_TYPE?.map((data, idx) => (
                <MenuItem value={data} key={idx}>
                  {data}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Difficulty</InputLabel>
            <Select
              label="Difficulty"
              className="selectOptions__dropdown"
              onChange={handleDifficultyChange}
            >
              {QUESTION_DIFFICULTY?.map((data, idx) => (
                <MenuItem value={data} key={idx}>
                  {data}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={8}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              label="Category"
              className="selectOptions__dropdown"
              onChange={handleCategoryChange}
            >
              {QUESTION_CATEGORY[selectedOptions.type]?.map((data, idx) => (
                <MenuItem value={data} key={idx}>
                  {data}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <InputLabel id="demo-simple-select-label">Instructions</InputLabel>
          <textarea
            id="text"
            name="text"
            className="questionContainer__review"
            placeholder="Please add instructions..."
            onChange={(e) =>
              setSelectedOptions({
                ...selectedOptions,
                instruction: e.target.value,
              })
            }
          ></textarea>
        </Grid>
        <Grid item xs={12}>
          <InputLabel id="demo-simple-select-label">Deadline</InputLabel>
          <input
            type="date"
            id="end"
            name="deadline"
            min="2022-09-01"
            className="selectOptions__date"
            onChange={(e) =>
              setSelectedOptions({
                ...selectedOptions,
                deadline: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                onChange={(e) =>
                  setSelectedOptions({
                    ...selectedOptions,
                    lastQuestion: !selectedOptions.lastQuestion,
                  })
                }
              />
            }
            label="Is this your last question?"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default SelectOptions;
