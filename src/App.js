import { useState } from "react";
import "./App.css";
import ChooseFiles from "./ChooseFiles";
import Header from "./Header.js";
import PDFViewer from "./PDFViewer";
import ResultViewer from "./ResultViewer";

function App() {
  const [viewerInstance, setViewerInstance] = useState();

  const handleSelectInstanceFile = (file) => {
    viewerInstance.UI.loadDocument(file);
  };

  return (
    <div className="app">
      <ChooseFiles handleSelectInstanceFile={handleSelectInstanceFile} />
      <div className="container">
        <PDFViewer setViewerInstance={setViewerInstance} />
        <ResultViewer />
      </div>
    </div>
  );
}

export default App;
