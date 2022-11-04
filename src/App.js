import { useState } from "react";
import "./App.css";
import ChooseFiles from "./ChooseFiles";
import Header from "./Header.js";
import PDFViewer from "./PDFViewer";
import ResultViewer from "./ResultViewer";

function App() {
  const [viewerInstance, setViewerInstance] = useState();
  const [files, setFiles] = useState({});
  const [selectedFileData, setSelectedFileData] = useState({});

  const handleSelectInstanceFile = (file) => {
    console.log(file, "hjiujhjikjhjikj fileee");
    // viewerInstance.UI.loadDocument(file);
  };

  console.log(files, "heyyyooooooooooooo")

  return (
    <div className="app">
      <ChooseFiles
        handleSelectInstanceFile={handleSelectInstanceFile}
        files={files}
        setFiles={setFiles}
        setSelectedFileData={setSelectedFileData}
      />
      <div className="container">
        <PDFViewer />
        <ResultViewer orderFile={files} selectedFileData={selectedFileData} />
      </div>
    </div>
  );
}

export default App;
