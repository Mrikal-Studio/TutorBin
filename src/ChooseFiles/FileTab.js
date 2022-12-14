import React from "react";
import { supportedFiles } from "../utils/supportedFile";

function FileTab({ file, handleFile, selectedFile, handleDialogOpen }) {
  const getBackground = (file) => {
    if (file.hasOwnProperty("status")) {
      if (file?.status === "completed") {
        return "#4BB543";
      } else {
        if (selectedFile === file?._id) {
          return "#00A5E4";
        } else {
          return "white";
        }
      }
    } else {
      if (selectedFile === file?._id) {
        return "#00A5E4";
      } else {
        return "white";
      }
    }
  };

  const getColor = (file) => {
    if (file.hasOwnProperty("status")) {
      if (file?.status === "completed") {
        return "#fff";
      } else {
        if (selectedFile === file?._id) {
          return "white";
        } else {
          return "#00A5E4";
        }
      }
    } else {
      if (selectedFile === file?._id) {
        return "white";
      } else {
        return "#00A5E4";
      }
    }
  };
  return (
    <span
      disabled
      className="file"
      key={file?._id}
      onClick={() => {
        let format = file?.fileName.split(".").pop();
        if (!supportedFiles?.includes(format)) {
          handleDialogOpen();
        }
        if (file?.status === "completed") {
          return;
        }
        localStorage.setItem("incrementalId", file?.incrementalId);
        handleFile(file);
      }}
      style={{
        border:
          file?.status === "completed"
            ? "1.2px solid #4BB543"
            : "1.2px solid #1C84FF",
        background: getBackground(file),
        color: getColor(file),
      }}
    >
      {file?.fileName}
    </span>
  );
}

export default FileTab;
