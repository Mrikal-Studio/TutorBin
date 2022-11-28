import React, { useEffect, useState } from "react";
import "./ResultViewer.css";
import { Button, Card, Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";
import PreviewModal from "./PreviewModal";
import axios from "axios";
import { BASE_URL } from "../api";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import { Stack } from "@mui/system";
import FigModal from "./FigModal";
import SelectOptions from "./SelectOptions";
import ToggleTab from "./ToggleTab";
import CancelIcon from "@mui/icons-material/Cancel";

function ResultViewer({
  orderFile,
  selectedFileData,
  alignment,
  setAlignment,
}) {
  const [open, setOpen] = useState(false);
  const [figModalOpen, setFigModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [snackOpen, setSnackOpen] = useState(false);
  const [OCROutputData, setOCROutputData] = useState("");
  const [OCRImage, setOCRImage] = useState(null);
  const [loadingOCRData, setLoadingOCRData] = useState(false);
  const [savingOCROutputData, setSavingOCROutputData] = useState(false);
  const [savingQuestionData, setSavingQuestionData] = useState(false);
  const [figsList, setFigsList] = useState([]);
  const [solutionFigsList, setSolutionsFigList] = useState([]);
  const [selectedFig, setSelectedFig] = useState(null);
  const [text, setText] = useState({
    question: "",
    solution: "",
  });
  const [currQuestionNumber, setCurrentQuestionNumber] = useState();
  const [savedQuestionsData, setSavedQuestionsData] = useState([]);
  const [currQuestionData, setCurentQuestionData] = useState();
  const [selectedOptions, setSelectedOptions] = useState({
    type: "",
    difficulty: "",
    category: "",
    instruction: "",
    deadline: "",
    lastQuestion: false,
    dataFromPriceModel: false,
  });
  const [imgURLList, setImgURLList] = useState([]);
  const [solutionimgURLList, setSolutionImgUrlList] = useState([]);
  const [priceModelData, setPriceModelData] = useState({});

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  const handleFigModalOpen = (fig) => {
    setSelectedFig(fig);
    setFigModalOpen(true);
  };
  const handleFigModalClose = () => {
    setFigModalOpen(false);
  };

  const handleFigListClose = (id) => {
    setFigsList((prevState) => prevState.filter((item) => item.id !== id));
  };

  const handlesolutionFigListClose = (id) => {
    setSolutionsFigList((prevState) =>
      prevState.filter((item) => item.id !== id)
    );
  };
  const onSaveFig = () => {};

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };

  const getOCRData = () => {
    setLoadingOCRData(true);
    const formData = new FormData();
    formData.append("file", OCRImage);
    axios
      .post(BASE_URL + "output/text/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setOCROutputData(res.data.data);
        alignment === "question"
          ? setText({ ...text, question: res.data.data })
          : setText({ ...text, solution: res.data.data });
        setLoadingOCRData(false);
        setOpen(false);
      })
      .catch((err) => {
        setLoadingOCRData(false);
        console.log(err);
      });
  };

  const getOCRToText = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post(BASE_URL + "output/text/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setOCROutputData(res.data.data);
        alignment === "question"
          ? setText({ ...text, question: res.data.data })
          : setText({ ...text, solution: res.data.data });
        setLoadingOCRData(false);
      })
      .catch((err) => {
        setLoadingOCRData(false);
        console.log(err);
      });
  };

  const handleSave = () => {
    let formData = new FormData();
    formData.append("file", OCRImage);
    setSavingOCROutputData(true);
    console.log(alignment, "alignment");
    axios
      .post(BASE_URL + "output/photo-url", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setSavingOCROutputData(false);
        if (alignment === "question") {
          console.log(figsList, "figsList");
          setFigsList([
            ...figsList,
            {
              id: figsList.length,
              file: OCRImage,
              imageURI: URL.createObjectURL(OCRImage),
              questionType: 0,
              data: res.data.data,
            },
          ]);
        } else {
          setSolutionsFigList([
            ...solutionFigsList,
            {
              id: solutionFigsList.length,
              file: OCRImage,
              imageURI: URL.createObjectURL(OCRImage),
              questionType: 0,
              data: res.data.data,
            },
          ]);
        }
        // alignment === "question"
        //   ? setImgURLList([...imgURLList, res.data.data])
        //   : setSolutionImgUrlList([...solutionimgURLList, res.data.data]);
        setSnackOpen(true);
        setOpen(false);
        setOCROutputData("");
      })
      .catch((err) => {
        setSavingOCROutputData(false);
        console.log(err);
      });
    console.log(figsList, "yyy");
  };

  // const filterImageList = () => {
  //   figsList.map((item) => {
  //     return item.data;
  //   });
  // };

  function getSavedQuestionData() {
    if (orderFile.incrementalId)
      axios
        .get(BASE_URL + "question-meta-data/" + orderFile.incrementalId)
        .then((res) => {
          console.log(res, "response for question-meta");
          let x = res?.data?.data.sort(
            (a, b) => a.questionNumber - b.questionNumber
          );
          let curr_qno = x[x.length - 1]?.questionNumber
            ? x[x.length - 1]?.questionNumber + 1
            : 1;

          let y = {
            questionNumber: curr_qno,
          };
          setSavedQuestionsData([...x, y]);
          setCurrentQuestionNumber(x.length);
          // setText({ ...text, question: x[x.length - 1]?.text });
          setText({ ...text, question: "" });
          setCurentQuestionData(y);
          setSelectedOptions({
            type: "",
            difficulty: "",
            category: "",
            instruction: "",
            deadline: "",
            lastQuestion: "",
          });
        })
        .catch((err) => console.log(err));
  }

  useEffect(() => {
    getSavedQuestionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderFile]);

  useEffect(() => {
    const fileInput = document.getElementById("document_attachment_doc");

    window.addEventListener("paste", (e) => {
      console.log(e.target, "on paste windows");
      fileInput.files = e.clipboardData.files;
      setPreviewImage(URL.createObjectURL(e.clipboardData.files[0]));
      setOCRImage(e.clipboardData.files[0]);
      if (e.target.id === "textOCR") {
        getOCRToText(e.clipboardData.files[0]);
      } else {
        handleOpen();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetStateHandler = () => {
    setText({ ...text, question: "", solution: "" });
    setSelectedOptions({
      type: "",
      difficulty: "",
      category: "",
      instruction: "",
      deadline: "",
      lastQuestion: false,
      dataFromPriceModel: false,
    });
    setPreviewImage(null);
    setOCRImage(null);
    setFigsList([]);
    setSolutionsFigList([]);
  };
  const handleSaveQuestionData = () => {
    console.log(orderFile, "orderFile");
    let imgURLListToSend = figsList.map((fig) => fig.data);
    let solutionimgURLListToSend = solutionFigsList.map((fig) => fig.data);
    const record = {
      text: text.question,
      image: imgURLListToSend,
      type: selectedOptions.type,
      category: selectedOptions.category,
      instruction: selectedOptions.instruction,
      lastQuestion: selectedOptions.lastQuestion,
      deadline: selectedOptions.deadline,
      orderId: parseInt(orderFile?.incrementalId),
      incrementalId: parseInt(localStorage.getItem("incrementalId")),
      subjectId: orderFile?.subject?.id,
      questionNumber: currQuestionData?.questionNumber
        ? currQuestionData?.questionNumber
        : 1,
      solutions: {
        text: text.solution,
        images: solutionimgURLListToSend,
        fileUrl: "",
      },
      fileUrl: selectedFileData?.fileUrl,
    };

    setSavingQuestionData(true);
    axios
      .post(BASE_URL + "question-meta-data", record)
      .then((res) => {
        setSavingQuestionData(false);
        setSnackOpen(true);
        resetStateHandler();
        let curr_qno = currQuestionData?.questionNumber + 1;

        let x = {
          questionNumber: curr_qno,
        };

        let temp_arr = savedQuestionsData;
        for (let i = 0; i < savedQuestionsData.length; i++) {
          if (temp_arr[i].questionNumber === record.questionNumber)
            temp_arr[i] = record;
        }

        setSavedQuestionsData([...temp_arr, x]);

        setCurentQuestionData(x);
        setText({ ...text, question: "" });
        setCurrentQuestionNumber(currQuestionNumber + 1);
        setSelectedOptions({
          type: "",
          difficulty: "",
          category: "",
          instruction: "",
          deadline: "",
          lastQuestion: "",
        });
      })
      .catch((err) => {
        setSavingQuestionData(false);
        console.log(err);
      });
  };

  const getPriceModelData = () => {
    axios
      .post(BASE_URL + "pricemodel/" + orderFile?.incrementalId)
      .then((res) => {
        setPriceModelData(res?.data?.data);
        setSelectedOptions({
          ...selectedOptions,
          type:
            priceModelData &&
            priceModelData?.questionProperties[1]?.questionType,
          difficulty:
            priceModelData && priceModelData?.questionProperties[1]?.difficulty,
          category:
            priceModelData &&
            priceModelData?.questionProperties[1]?.questiondivision,
          instruction: priceModelData && priceModelData?.comment,
          dataFromPriceModel: true,
        });
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getPriceModelData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openPrevQuestion = () => {
    // if (currQuestionNumber === 0) {
    //   return;
    // }
    setCurentQuestionData(savedQuestionsData[currQuestionNumber - 1]);

    setCurrentQuestionNumber(currQuestionNumber - 1);
    setText({
      ...text,
      question: savedQuestionsData[currQuestionNumber - 1]?.text
        ? savedQuestionsData[currQuestionNumber - 1]?.text
        : "",
      solution: savedQuestionsData[currQuestionNumber - 1]?.solutions?.text
        ? savedQuestionsData[currQuestionNumber - 1]?.solutions?.text
        : "",
    });
    setSelectedOptions({
      type: savedQuestionsData[currQuestionNumber - 1]?.type,
      difficulty: savedQuestionsData[currQuestionNumber - 1]?.difficulty,
      category: savedQuestionsData[currQuestionNumber - 1]?.category,
      instruction: savedQuestionsData[currQuestionNumber - 1]?.instruction,
      deadline: savedQuestionsData[currQuestionNumber - 1]?.deadline,
      lastQuestion: savedQuestionsData[currQuestionNumber - 1]?.lastQuestion,
    });
    setFigsList(savedQuestionsData[currQuestionNumber - 1]?.image);
    setSolutionsFigList(
      savedQuestionsData[currQuestionNumber - 1]?.solutions?.images
    );
  };

  const openNextQuestion = () => {
    if (currQuestionNumber === savedQuestionsData.length - 1) {
      resetStateHandler();
      return;
    }
    setCurentQuestionData(savedQuestionsData[currQuestionNumber + 1]);
    setText({
      ...text,
      question: savedQuestionsData[currQuestionNumber + 1]?.text
        ? savedQuestionsData[currQuestionNumber + 1]?.text
        : "",
      solution: savedQuestionsData[currQuestionNumber + 1]?.solutions?.text
        ? savedQuestionsData[currQuestionNumber + 1]?.solutions?.text
        : "",
    });

    setCurrentQuestionNumber(currQuestionNumber + 1);
    setSelectedOptions({
      type: savedQuestionsData[currQuestionNumber + 1]?.type,
      difficulty: savedQuestionsData[currQuestionNumber + 1]?.difficulty,
      category: savedQuestionsData[currQuestionNumber + 1]?.category,
      instruction:
        savedQuestionsData[currQuestionNumber + 1]?.instruction || "",
      deadline: savedQuestionsData[currQuestionNumber + 1]?.deadline || "",
      lastQuestion: savedQuestionsData[currQuestionNumber + 1]?.lastQuestion,
    });
    savedQuestionsData[currQuestionNumber + 1]?.image
      ? setFigsList(savedQuestionsData[currQuestionNumber + 1]?.image)
      : setFigsList([]);
    savedQuestionsData[currQuestionNumber - 1]?.solutions?.images
      ? setSolutionsFigList(
          savedQuestionsData[currQuestionNumber - 1]?.solutions?.images
        )
      : setSolutionsFigList([]);
  };

  const handleText = (e) => {
    if (alignment === "question") {
      setText({ ...text, question: e.target.value });
    } else {
      setText({ ...text, solution: e.target.value });
    }
  };

  const handleAddOCRText = (e) => {
    console.log(e.target.id, "imageeee");
  };

  return (
    <div className="resultViewer">
      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Saved Successfully!!!
        </Alert>
      </Snackbar>
      <PreviewModal
        open={open}
        handleClose={handleClose}
        previewImage={previewImage}
        handleSave={handleSave}
        loadingOCRData={loadingOCRData}
        savingOCROutputData={savingOCROutputData}
        OCROutputData={OCROutputData}
        setOCROutputData={OCROutputData}
        getOCRData={getOCRData}
      />
      <FigModal
        open={figModalOpen}
        handleClose={handleFigModalClose}
        onSaveFig={onSaveFig}
        selectedFig={selectedFig}
      />
      <Card className="resultViewer__top">
        <div className="resultViewer__cardHeader">
          <ToggleTab alignment={alignment} setAlignment={setAlignment} />
          <p className="resultViewer__dataNumber">
            {alignment === "question" ? "Question No." : "Solution No."}{" "}
            {currQuestionNumber ? currQuestionNumber + 1 : "1"}
          </p>
        </div>
        <p>Paste selected text below</p>

        {alignment === "question" ? (
          <textarea
            id="textOCR"
            name="text"
            value={text?.question}
            className="questionContainer__review"
            placeholder="You can paste here and view your text..."
            onChange={(e) => handleText(e)}
            onPaste={(e) => handleAddOCRText(e)}
          ></textarea>
        ) : (
          <textarea
            id="text"
            name="text"
            value={text?.solution}
            className="questionContainer__review"
            placeholder="You can paste here and view your text..."
            onChange={(e) => handleText(e)}
          ></textarea>
        )}

        {/* <PriceModel priceModelData={setPriceModelData} /> */}
        <div className="resultViewer__figsList">
          {alignment === "question"
            ? figsList?.map((fig) => (
                <div className="figsList">
                  <Stack spacing={1} alignItems="center">
                    {currQuestionNumber === savedQuestionsData.length - 1 ? (
                      <div className="figsListClose">
                        <CancelIcon
                          className="figsList_closeIcon"
                          onClick={() => handleFigListClose(fig.id)}
                        />
                      </div>
                    ) : (
                      ""
                    )}

                    <div>
                      <PermMediaIcon
                        key={fig.id}
                        className="resultViewer__figsIcon"
                        onClick={() => handleFigModalOpen(fig)}
                      />
                    </div>
                    <p>Fig {fig.id}</p>
                  </Stack>
                </div>
              ))
            : solutionFigsList?.map((fig) => (
                <div>
                  <Stack spacing={1} alignItems="center">
                    {currQuestionNumber === savedQuestionsData.length - 1 ? (
                      <div className="figsListClose">
                        <CancelIcon
                          className="figsList_closeIcon"
                          onClick={() => handlesolutionFigListClose(fig.id)}
                        />
                      </div>
                    ) : (
                      ""
                    )}

                    <PermMediaIcon
                      key={fig.id}
                      className="resultViewer__figsIcon"
                      onClick={() => handleFigModalOpen(fig)}
                    />
                    <p>Fig {fig.id}</p>
                  </Stack>
                </div>
              ))}
        </div>
        <Stack spacing={0}>
          <label>Paste snipped image below</label>
          <input
            onClick={(e) => e.preventDefault()}
            type="file"
            accept="image/*"
            id={"document_attachment_doc"}
            className="custom__input"
          />
        </Stack>
        {alignment === "question" ? (
          <SelectOptions
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            priceModelData={priceModelData}
          />
        ) : null}
        <Stack
          spacing={2}
          direction="row"
          className="resultviewer__finalAction"
        >
          {currQuestionNumber !== 0 ? (
            <Button
              variant="contained"
              className="resultViewer__save"
              onClick={openPrevQuestion}
            >
              Back
            </Button>
          ) : null}
          <Button
            variant="contained"
            className="resultViewer__save"
            onClick={handleSaveQuestionData}
          >
            {savingQuestionData ? "Saving..." : "Save"}
          </Button>
          {!(currQuestionNumber === savedQuestionsData.length - 1) ? (
            <Button
              variant="contained"
              className="resultViewer__save"
              onClick={openNextQuestion}
            >
              Skip
            </Button>
          ) : null}
        </Stack>
      </Card>
    </div>
  );
}

export default ResultViewer;
