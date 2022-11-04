import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../api";
import Header from "../Header.js";
import "./ChooseFiles.css";

function ChooseFiles({
  handleSelectInstanceFile,
  setSelectedFileData,
  selectedFileData,
  setFiles,
  files,
}) {
  const [selectedFile, setSelectedFile] = useState();

  const handleFile = (file) => {
    handleSelectInstanceFile(file.fileUrl);
    setSelectedFile(file._id);
    setSelectedFileData(file);
  };

  const getFiles = () => {
    axios
      .get(BASE_URL + "orders/")
      .then((res) => {
        console.log(res?.data?.data, "1");
        setFiles(res?.data?.data);
        setSelectedFile(res?.data?.data?.questions[0]?._id);
        setSelectedFileData(res?.data?.data?.questions[0]);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getFiles();
  }, []);

  // Color for selected files
  const getColor = (status) => {
    if (status === "pending") {
      return "lightgrey";
    }
    if (status === "ongoing") {
      return "#16ad5b";
    }
    if (status === "completed") {
      return "#fb3836";
    }
  };
  console.log(selectedFileData, "leloooooooooo");
  return (
    <>
      <Header selectedOrderId={files?.incrementalId} getFiles={getFiles} />
      <div className="chooseFiles">
        {files?.questions?.map((file) => (
          <span
            className="file"
            id="file"
            key={file._id}
            onClick={() => handleFile(file)}
            style={{
              border: "1.2px solid #1C84FF",
              background: selectedFile === file._id ? "#1C84FF" : "white",
              color: selectedFile === file._id ? "white" : "#1C84FF",
            }}
          >
            {file.fileName}
          </span>
        ))}
      </div>
    </>
  );
}

export default ChooseFiles;
