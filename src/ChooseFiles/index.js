import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../api";
import Header from "../Header.js";
import "./ChooseFiles.css";
import UpdateOrderModal from "./UpdateOrderModal";

function ChooseFiles({
  handleSelectInstanceFile,
  setSelectedFileData,
  selectedFileData,
  setFiles,
  files,
}) {
  const [selectedFile, setSelectedFile] = useState();
  const [searchOrder, setsearchOrder] = useState();

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

  console.log("searchOrder", searchOrder);

  const searchById = () => {
    axios
      .get(BASE_URL + `orders/?order_id=${searchOrder}`)
      .then((res) => {
        console.log("res of the order by ID", res);
        setFiles(res?.data?.data);
        setSelectedFile(res?.data?.data?.questions[0]?._id);
        setSelectedFileData(res?.data?.data?.questions[0]);
        setsearchOrder();
        // set(true);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getFiles();
  }, []);

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
    <>
      <Header
        selectedOrderId={files?.incrementalId}
        getFiles={getFiles}
        setsearchOrder={setsearchOrder}
        searchById={searchById}
      />
      <UpdateOrderModal
        selectedOrderId={files?._id}
        subjectId={files?.subject?.id}
      />
      <div className="chooseFiles">
        {files?.questions?.map((file) => (
          <span
            disabled
            className="file"
            id="file"
            key={file._id}
            onClick={() => {
              if (file?.status === "completed") {
                return;
              }
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
            {file.fileName}
          </span>
        ))}
      </div>
    </>
  );
}

export default ChooseFiles;
