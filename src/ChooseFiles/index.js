import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../api";
import Header from "../Header.js";
import "./ChooseFiles.css";
import FileTab from "./FileTab";
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
      if (!files?.tasks[0]?.assigned[0]?.solutions) return;
      console.log(files?.tasks[0]?.assigned[0]?.solutions, "solutions");
      handleFile(files?.tasks[0]?.assigned[0]?.solutions[0]);
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
      <div className="chooseFiles">
        {alignment === "question"
          ? files?.questions?.map((file) => (
              <FileTab
                selectedFile={selectedFile}
                key={file._id}
                handleFile={handleFile}
                file={file}
              />
            ))
          : files?.tasks[0]?.assigned[0]?.solutions
          ? files?.tasks[0]?.assigned[0]?.solutions?.map((file) =>
              !file?.isDeleted ? (
                <span
                  disabled
                  className="file"
                  id="solution_file"
                  key={file._id}
                  onClick={() => {
                    handleFile(file);
                  }}
                  style={{
                    border: "1.2px solid #1C84FF",
                    background: "#fff",
                    color: "#1C84FF",
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
