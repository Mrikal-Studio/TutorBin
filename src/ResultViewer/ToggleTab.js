import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React from "react";

function ToggleTab({ alignment, setAlignment }) {
  const handleChange = (e) => {
    setAlignment(e.target.value);
  };
  return (
    <ToggleButtonGroup
      color="primary"
      value={alignment}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
    >
      <ToggleButton value="question">Question</ToggleButton>
      <ToggleButton value="solution">Solution</ToggleButton>
    </ToggleButtonGroup>
  );
}

export default ToggleTab;
