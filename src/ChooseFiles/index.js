import { Alert, Snackbar, Stack } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../api";
import Header from "../Header.js";
import { supportedFiles } from "../utils/supportedFile";
import "./ChooseFiles.css";
import FileSupportedDialog from "./FileSupportedDialog";
import FileTab from "./FileTab";
import UpdateOrderModal from "./UpdateOrderModal";

function ChooseFiles({
  handleSelectInstanceFile,
  setSelectedFileData,
  setFiles,
  files,
  alignment,
  selectedFileData,
}) {
  const [selectedFile, setSelectedFile] = useState();
  const [searchOrder, setsearchOrder] = useState();
  const [showNotFoundError, setShowNotFoundError] = useState(false);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleFile = (file) => {
    handleSelectInstanceFile(file.fileUrl);
    setSelectedFile(file._id);
    setSelectedFileData(file);
  };

  const getFiles = () => {
    axios
      .get(BASE_URL + "orders/")
      .then((res) => {
        setFiles(res?.data?.data);
        setSelectedFile(res?.data?.data?.questions[0]?._id);
        setSelectedFileData(res?.data?.data?.questions[0]);
        let format = res?.data?.data?.questions[0]?.fileName.split(".").pop();
        if (!supportedFiles?.includes(format)) {
          handleDialogOpen();
        }
        if (
          !(
            res?.data?.data?.questions.some((data) => data.status) &&
            res?.data?.data?.questions.some(
              (data) => data.status === "completed"
            )
          )
        ) {
          handleOpen();
        }

        alignment === "question" &&
          localStorage.setItem(
            "incrementalId",
            res?.data?.data?.questions[0]?.incrementalId
          );
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setShowNotFoundError(false);
    axios
      .get(BASE_URL + `orders/?order_id=${searchOrder}`)
      .then((res) => {
        setFiles(res?.data?.data);
        let format = res?.data?.data?.questions[0]?.fileName.split(".").pop();
        if (!supportedFiles?.includes(format)) {
          handleDialogOpen();
        }
        if (
          !(
            res?.data?.data?.questions.some((data) => data.status) &&
            res?.data?.data?.questions.some(
              (data) => data.status === "completed"
            )
          )
        ) {
          handleOpen();
        }
        alignment === "question" &&
          localStorage.setItem(
            "incrementalId",
            res?.data?.data?.questions[0]?.incrementalId
          );
        setSelectedFile(res?.data?.data?.questions[0]?._id);
        setSelectedFileData(res?.data?.data?.questions[0]);
        setsearchOrder();
      })
      .catch((err) => {
        if (searchOrder != null && searchOrder.length !== 0) {
          setShowNotFoundError(true);
          window.setTimeout(() => {
            setShowNotFoundError(false);
          }, 5000);
        }
        console.error(err);
      });
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
      localStorage.setItem("incrementalId", files?.questions[0]?.incrementalId);
      setSelectedFileData(files?.questions[0]);
    } else {
      if (
        !files?.tasks[0]?.assigned.some((data) =>
          data.hasOwnProperty("solutions")
        )
      )
        return;
      let solutionList = [
        ...(files?.tasks?.map((task) =>
          task?.assigned?.map((data) => data?.solutions || []).flat()
        ) || []),
      ].flat();

      console.log(solutionList, "solutionList");
      let format = solutionList[0]?.fileName?.split(".").pop();
      if (!supportedFiles?.includes(format)) {
        handleDialogOpen();
      }
      handleFile(solutionList[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alignment, files]);

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
      {showNotFoundError ? (
        <Alert
          severity="error"
          sx={{ width: "fit-content", margin: "0 auto" }}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          No order found By this id !
        </Alert>
      ) : null}
      <UpdateOrderModal
        selectedOrderId={files?._id}
        subjectId={files?.subject?.id}
        handleClose={handleClose}
        handleOpen={handleOpen}
        open={open}
      />
      <FileSupportedDialog
        handleClose={handleDialogClose}
        open={dialogOpen}
        selectedFileData={selectedFileData}
      />
      <div className="chooseFiles">
        {alignment === "question"
          ? files?.questions?.map((file) => (
              <FileTab
                selectedFile={selectedFile}
                key={file._id}
                handleFile={handleFile}
                file={file}
                handleDialogOpen={handleDialogOpen}
              />
            ))
          : [
              ...(files?.tasks?.map((task) =>
                task?.assigned?.map((data) => data?.solutions || []).flat()
              ) || []),
            ]
              .flat()
              .map((file) =>
                !file?.isDeleted ? (
                  <FileTab
                    selectedFile={selectedFile}
                    key={file._id}
                    handleFile={handleFile}
                    file={file}
                    handleDialogOpen={handleDialogOpen}
                  />
                ) : null
              )}
      </div>
    </>
  );
}

export default ChooseFiles;
