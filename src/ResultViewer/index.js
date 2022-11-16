import React, { useEffect, useId, useRef, useState } from "react";
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
  const [loading, setLoading] = useState(false);
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

  const onSaveFig = () => {};

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };

  // function call to get OCR output text
  const getOCRData = () => {
    setLoading(true);
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
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  // funtion call to save Image to S3
  const handleSave = () => {
    if (alignment === "question") {
      setFigsList([
        ...figsList,
        {
          id: figsList.length,
          file: OCRImage,
          imageURI: URL.createObjectURL(OCRImage),
          questionType: 0,
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
        },
      ]);
    }
    let formData = new FormData();
    formData.append("file", OCRImage);

    axios
      .post(BASE_URL + "output/photo-url", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        alignment === "question"
          ? setImgURLList([...imgURLList, res.data.data])
          : setSolutionImgUrlList([...imgURLList, res.data.data]);
        setSnackOpen(true);
        setOpen(false);
        setOCROutputData("");
      })
      .catch((err) => console.log(err));
  };

  function getSavedQuestionData() {
    if (orderFile._id)
      axios
        .get(BASE_URL + "question-meta-data/" + orderFile._id)
        .then((res) => {
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
          setText({ ...text, question: x[x.length - 1]?.text });
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
  }, [orderFile]);

  useEffect(() => {
    const fileInput = document.getElementById("document_attachment_doc");

    window.addEventListener("paste", (e) => {
      fileInput.files = e.clipboardData.files;
      setPreviewImage(URL.createObjectURL(e.clipboardData.files[0]));
      setOCRImage(e.clipboardData.files[0]);
      handleOpen();
    });
    //api to get all the saved questions by orderid
  }, []);

  const resetStateHandler = () => {
    setText({ question: "", solution: "" });
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
  };
  const handleSaveQuestionData = () => {
    const record = {
      text: text.question,
      image: imgURLList,
      type: selectedOptions.type,
      category: selectedOptions.category,
      instruction: selectedOptions.instruction,
      lastQuestion: selectedOptions.lastQuestion,
      deadline: selectedOptions.deadline,
      orderId: orderFile._id,
      incrementalId: selectedFileData?.incrementalId,
      //questionNumber: 1,
      questionNumber: currQuestionData?.questionNumber
        ? currQuestionData?.questionNumber
        : 1,
      solutions: {
        text: text.solution,
        images: solutionimgURLList,
        fileUrl: "",
      },
      fileUrl: "",
    };

    axios
      .post(BASE_URL + "question-meta-data", record)
      .then((res) => {
        setSnackOpen(true);
        resetStateHandler();
      })
      .catch((err) => console.log(err));

    let curr_qno = currQuestionData?.questionNumber + 1;

    let x = {
      questionNumber: curr_qno,
    };

    let temp_arr = savedQuestionsData;
    for (let i = 0; i < savedQuestionsData.length; i++) {
      if (temp_arr[i].questionNumber == record.questionNumber)
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
    // setFigsList(savedQuestionsData[currQuestionNumber + 1]?.image);
  };

  const getPriceModelData = () => {
    axios
      .post(BASE_URL + "pricemodel/" + "63293d39a0e7afd2bf68f555")
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
  }, []);

  const openPrevQuestion = () => {
    if (currQuestionNumber === 0) {
      return;
    }
    setCurentQuestionData(savedQuestionsData[currQuestionNumber - 1]);
    setCurrentQuestionNumber(currQuestionNumber - 1);
    setText({
      ...text,
      question: savedQuestionsData[currQuestionNumber - 1]?.text,
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
  };

  const openNextQuestion = () => {
    if (currQuestionNumber === savedQuestionsData.length - 1) {
      resetStateHandler();
      return;
    }
    setCurentQuestionData(savedQuestionsData[currQuestionNumber + 1]);
    setText({
      ...text,
      question: savedQuestionsData[currQuestionNumber + 1]?.text,
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
    setFigsList(savedQuestionsData[currQuestionNumber + 1]?.image);
  };

  const handleText = (e) => {
    if (alignment === "question") {
      setText({ ...text, question: e.target.value });
    } else {
      setText({ ...text, solution: e.target.value });
    }
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
        OCROutputData={OCROutputData}
        setOCROutputData={OCROutputData}
        getOCRData={getOCRData}
        loading={loading}
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
            Question {currQuestionNumber + 1}
          </p>
        </div>
        <p>Paste selected text below</p>

        {alignment === "question" ? (
          <textarea
            id="text"
            name="text"
            value={text?.question}
            className="questionContainer__review"
            placeholder="You can paste here and view your text..."
            onChange={(e) => handleText(e)}
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
                <Stack spacing={1} alignItems="center">
                  <PermMediaIcon
                    key={fig.id}
                    className="resultViewer__figsIcon"
                    onClick={() => handleFigModalOpen(fig)}
                  />
                  <p>Fig {fig.id}</p>
                </Stack>
              ))
            : solutionFigsList?.map((fig) => (
                <Stack spacing={1} alignItems="center">
                  <PermMediaIcon
                    key={fig.id}
                    className="resultViewer__figsIcon"
                    onClick={() => handleFigModalOpen(fig)}
                  />
                  <p>Fig {fig.id}</p>
                </Stack>
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
          <Button
            variant="contained"
            className="resultViewer__save"
            onClick={openPrevQuestion}
          >
            Back
          </Button>
          <Button
            variant="contained"
            className="resultViewer__save"
            onClick={handleSaveQuestionData}
          >
            Save
          </Button>
          <Button
            variant="contained"
            className="resultViewer__save"
            onClick={openNextQuestion}
          >
            Skip
          </Button>
        </Stack>
      </Card>
    </div>
  );
}

export default ResultViewer;
