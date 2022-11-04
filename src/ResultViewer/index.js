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
import PriceModel from "./PriceModel";

function ResultViewer({ orderFile, selectedFileData }) {
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [figModalOpen, setFigModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [snackOpen, setSnackOpen] = useState(false);
  const [OCROutputData, setOCROutputData] = useState("");
  const [OCRImage, setOCRImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [figsList, setFigsList] = useState([]);
  const [selectedFig, setSelectedFig] = useState(null);
  const [text, setText] = useState("");
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
  const [priceModelData, setPriceModelData] = useState({});

  console.log(orderFile, "orderFile");

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

  const handlePaste = (event) => {
    console.log("bbb");
    console.log("hhh", event.clipboardData.files);
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
        console.log(res.data.data, "textttt");
        setOCROutputData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  console.log(figsList, "figsList");
  // funtioncall to save Image to S3
  const handleSave = () => {
    setFigsList([
      ...figsList,
      {
        id: figsList.length,
        file: OCRImage,
        imageURI: URL.createObjectURL(OCRImage),
        questionType: 0,
      },
    ]);
    let formData = new FormData();
    formData.append("file", OCRImage);

    axios
      .post(BASE_URL + "output/photo-url", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        setImgURLList([...imgURLList, res.data.data]);
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
          console.log(x, "saved questions data");
          setSavedQuestionsData(x);
          setCurrentQuestionNumber(x.length - 1);
          setCurentQuestionData(x[x.length - 1]);
          setSelectedOptions({
            type: x[x.length - 1]?.type,
            difficulty: x[x.length - 1]?.difficulty,
            category: x[x.length - 1]?.category,
            instruction: x[x.length - 1]?.instruction,
            deadline: x[x.length - 1]?.deadline,
            lastQuestion: x[x.length - 1]?.lastQuestion,
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

  const handleSaveQuestionData = () => {
    const record = {
      text: text,
      image: imgURLList,
      type: selectedOptions.type,
      category: selectedOptions.category,
      instruction: selectedOptions.instruction,
      lastQuestion: selectedOptions.lastQuestion,
      deadline: selectedOptions.deadline,
      orderId: orderFile._id,
      incrementalId: selectedFileData?.incrementalId,
      questionNumber: 1,
    };
    console.log(record, "record");

    axios
      .post(BASE_URL + "question-meta-data", record)
      .then((res) => {
        console.log(res);
        setSnackOpen(true);
      })
      .catch((err) => console.log(err));
  };

  const getPriceModelData = () => {
    axios
      .post(BASE_URL + "pricemodel/" + "63293d39a0e7afd2bf68f555")
      .then((res) => {
        console.log(res?.data?.data, "price model data");
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
    setCurentQuestionData(savedQuestionsData[currQuestionNumber - 1]);
    setCurrentQuestionNumber(currQuestionNumber - 1);
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

  console.log("selected Questions", selectedOptions);

  const openNextQuestion = () => {
    setCurentQuestionData(savedQuestionsData[currQuestionNumber + 1]);
    setCurrentQuestionNumber(currQuestionNumber + 1);
    setSelectedOptions({
      type: savedQuestionsData[currQuestionNumber + 1]?.type,
      difficulty: savedQuestionsData[currQuestionNumber + 1]?.difficulty,
      category: savedQuestionsData[currQuestionNumber + 1]?.category,
      instruction: savedQuestionsData[currQuestionNumber + 1]?.instruction,
      deadline: savedQuestionsData[currQuestionNumber + 1]?.deadline,
      lastQuestion: savedQuestionsData[currQuestionNumber + 1]?.lastQuestion,
    });
    setFigsList(savedQuestionsData[currQuestionNumber + 1]?.image);
  };

  console.log("currQuestionData", currQuestionData);

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
        <p>
          Question {currQuestionData ? currQuestionData?.questionNumber : 1}
        </p>
        <p>Paste selected text below</p>

        <textarea
          id="text"
          name="text"
          value={currQuestionData ? currQuestionData?.text : ""}
          className="questionContainer__review"
          placeholder="You can paste here and view your text..."
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        {/* <PriceModel priceModelData={setPriceModelData} /> */}
        <div className="resultViewer__figsList">
          {figsList.map((fig) => (
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
            onPaste={handlePaste}
            onClick={(e) => e.preventDefault()}
            type="file"
            ref={inputRef}
            accept="image/*"
            id={"document_attachment_doc"}
            className="custom__input"
          />
        </Stack>
        <SelectOptions
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          priceModelData={priceModelData}
        />
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
