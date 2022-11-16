import { useEffect, useState } from "react";
import "./App.css";
import ChooseFiles from "./ChooseFiles";
import Header from "./Header.js";
import PDFViewer from "./PDFViewer";
import ResultViewer from "./ResultViewer";

function App() {
  const [viewerInstance, setViewerInstance] = useState();
  const [files, setFiles] = useState({});
  const [selectedFileData, setSelectedFileData] = useState({});
  const [alignment, setAlignment] = useState("question");

  const handleSelectInstanceFile = (file) => {
    console.log(file, "hjiujhjikjhjikj fileee");
    viewerInstance.UI.loadDocument(file);
  };

  console.log(viewerInstance, "hey");

  useEffect(() => {
    // debugger
    if (selectedFileData && viewerInstance) {
      handleSelectInstanceFile(selectedFileData?.fileUrl);
      console.log("files", selectedFileData?.fileUrl);
    }
  }, [viewerInstance, selectedFileData]);
  console.log(files, "heyyyooooooooooooo");

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
