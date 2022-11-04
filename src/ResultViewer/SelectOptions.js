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

function SelectOptions() {
  return (
    <Box sx={{ flexGrow: 1, marginTop: "2rem" }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Select label="Type" className="selectOptions__dropdown">
            {QUESTION_TYPE?.map((data, idx) => (
              <MenuItem value={data} key={idx}>
                {data}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={6}>
          <Select label="Difficulty" className="selectOptions__dropdown">
            {QUESTION_DIFFICULTY?.map((data, idx) => (
              <MenuItem value={data} key={idx}>
                {data}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        {/* <Grid item xs={8}>
          <Select label="Category" className="selectOptions__dropdown">
            {QUESTION_CATEGORY?.map((data, idx) => (
              <MenuItem value={data} key={idx}>
                {data}
              </MenuItem>
            ))}
          </Select>
        </Grid> */}
      </Grid>
    </Box>
  );
}

export default SelectOptions;
