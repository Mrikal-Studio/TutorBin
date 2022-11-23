import { useEffect, useState } from "react";
import "./App.css";
import ChooseFiles from "./ChooseFiles";
import Loader from ".././src/Loader/index";
import PDFViewer from "./PDFViewer";
import ResultViewer from "./ResultViewer";

function App() {
  const [viewerInstance, setViewerInstance] = useState();
  const [files, setFiles] = useState({});
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [selectedFileData, setSelectedFileData] = useState({});
  const [alignment, setAlignment] = useState("question");
  const [isLoading, setIsLoading] = useState(true);

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

  if (!isLoading) {
    return <Loader />;
  }

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
