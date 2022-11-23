import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../api";
import Header from "../Header.js";
import "./ChooseFiles.css";
import UpdateOrderModal from "./UpdateOrderModal";

function ChooseFiles({
  handleSelectInstanceFile,
  setSelectedFileData,
  setFiles,
  files,
  alignment,
}) {
  const [selectedFile, setSelectedFile] = useState();
  const [searchOrder, setsearchOrder] = useState();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFile = (file) => {
    handleSelectInstanceFile(file.fileUrl);
    setSelectedFile(file._id);
    setSelectedFileData(file);
  };

  const getFiles = () => {
    axios
      .get(BASE_URL + "orders/")
      .then((res) => {
        console.log("orderedFile", res?.data?.data, "1");
        setFiles(res?.data?.data);
        setSelectedFile(res?.data?.data?.questions[0]?._id);
        setSelectedFileData(res?.data?.data?.questions[0]);
        if (res?.data?.data?.questions.length > 0) {
          handleOpen();
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    axios
      .get(BASE_URL + `orders/?order_id=${searchOrder}`)
      .then((res) => {
        console.log("res of the order by ID", res);
        setFiles(res?.data?.data);
        setSelectedFile(res?.data?.data?.questions[0]?._id);
        setSelectedFileData(res?.data?.data?.questions[0]);
        setsearchOrder();
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchOrder]);

  useEffect(() => {
    getFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!files) return;
    if (alignment === "question") {
      if (!files?.questions) return;
      setSelectedFile(files?.questions[0]?._id);
      setSelectedFileData(files?.questions[0]);
    } else {
      if (!files?.solutions) return;
      handleFile(files?.solutions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alignment, files]);

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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const order_id = urlParams.get("order_id");

    if (order_id) {
      setsearchOrder(order_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header
        selectedOrderId={files?.incrementalId}
        getFiles={getFiles}
        setsearchOrder={setsearchOrder}
      />
      <UpdateOrderModal
        selectedOrderId={files?._id}
        subjectId={files?.subject?.id}
        handleClose={handleClose}
        handleOpen={handleOpen}
        open={open}
      />
      <div className="chooseFiles">
        {alignment === "question" ? (
          files?.questions?.map((file) => (
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
          ))
        ) : files?.solutions ? (
          <span
            disabled
            className="file"
            id="file"
            key={files?.solutions._id}
            onClick={() => {
              if (files?.solutions?.status === "completed") {
                return;
              }
              handleFile(files?.solutions);
            }}
            style={{
              border:
                files?.solutions?.status === "completed"
                  ? "1.2px solid #4BB543"
                  : "1.2px solid #1C84FF",
              background: getBackground(files?.solutions),
              color: getColor(files?.solutions),
            }}
          >
            {files?.solutions.filname}
          </span>
        ) : null}
      </div>
    </>
  );
}

export default ChooseFiles;
