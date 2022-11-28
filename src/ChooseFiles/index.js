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
      if (
        !files?.tasks[0]?.assigned.some((data) =>
          data.hasOwnProperty("solutions")
        )
      )
        return;
      let solutionList = [
        ...files?.tasks[0]?.assigned?.map((data) => data?.solutions),
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
          : files?.tasks[0]?.assigned.some((data) =>
              data.hasOwnProperty("solutions")
            )
          ? [...files?.tasks[0]?.assigned?.map((data) => data?.solutions)]
              .flat()
              .map((file) =>
                !file?.isDeleted ? (
                  <span
                    disabled
                    className="file"
                    id="solution_file"
                    key={file._id}
                    onClick={() => {
                      let format = file?.fileName.split(".").pop();
                      if (!supportedFiles?.includes(format)) {
                        handleDialogOpen();
                      }
                      handleFile(file);
                    }}
                    style={{
                      border: "1.2px solid #1C84FF",
                      background:
                        selectedFile === file?._id ? "#00A5E4" : "white",
                      color: selectedFile === file?._id ? "white" : "#00A5E4",
                    }}
                  >
                    {file.fileName}
                  </span>
                ) : null
              )
          : null}
      </div>
    </>
  );
}

export default ChooseFiles;
