import { useEffect, useState } from "react";
import "./App.css";
import ChooseFiles from "./ChooseFiles";
import Header from "./Header.js";
import PDFViewer from "./PDFViewer";
import ResultViewer from "./ResultViewer";
import Loader from "../src/Loader/index";
function App() {
  const [viewerInstance, setViewerInstance] = useState();
  const [files, setFiles] = useState({});
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [selectedFileData, setSelectedFileData] = useState({});
  const [alignment, setAlignment] = useState("question");

  const handleSelectInstanceFile = (file) => {
    viewerInstance.UI.loadDocument(file);
  };

  useEffect(() => {
    // debugger
    if (selectedFileData && viewerInstance) {
      handleSelectInstanceFile(selectedFileData?.fileUrl);
      console.log("files", selectedFileData?.fileUrl);
    }
  }, [viewerInstance, selectedFileData]);

  return (
    <div className="app">
      <ChooseFiles
        handleSelectInstanceFile={handleSelectInstanceFile}
        files={files}
        setFiles={setFiles}
        setSelectedFileData={setSelectedFileData}
        selectedFileData={selectedFileData}
        alignment={alignment}
        loadingFiles={loadingFiles}
        setLoadingFiles={setLoadingFiles}
      />
      {loadingFiles ? (
        <Loader />
      ) : (
        <div className="container">
          <PDFViewer setViewerInstance={setViewerInstance} />
          <ResultViewer
            orderFile={files}
            selectedFileData={selectedFileData}
            alignment={alignment}
            setAlignment={setAlignment}
          />
        </div>
      )}
    </div>
  );
}

export default App;
