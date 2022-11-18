import { useEffect, useState } from "react";
import "./App.css";
import ChooseFiles from "./ChooseFiles";
import PDFViewer from "./PDFViewer";
import ResultViewer from "./ResultViewer";

function App() {
  const [viewerInstance, setViewerInstance] = useState();
  const [files, setFiles] = useState({});
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      />
      <div className="container">
        <PDFViewer setViewerInstance={setViewerInstance} />
        <ResultViewer
          orderFile={files}
          selectedFileData={selectedFileData}
          alignment={alignment}
          setAlignment={setAlignment}
        />
      </div>
    </div>
  );
}

export default App;
