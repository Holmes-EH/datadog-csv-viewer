import { useState, useRef } from "react";
import Papa from "papaparse";
import { RefactoredDataType, ParseResultData } from "./types";
import refactor from "./utils/refactor";

import DataTable from "./components/DataTable";

import "./App.css";
import { TbFileAnalytics, TbPlayerEject } from "react-icons/tb";

function App() {
  const inputFile = useRef<HTMLInputElement>(null);
  const [csvData, setCsvData] = useState<RefactoredDataType>();
  const commonConfig: {} = { delimiter: ",", skipEmptyLines: true };

  const loadFileHandler = async (event: any) => {
    Papa.parse(event.target.files[0], {
      ...commonConfig,
      header: true,
      complete: (result: ParseResultData) => {
        const { data, errors } = result;
        if (errors && errors.length > 0) {
          console.error(`Parsing produced some errors`);
          console.table(errors);
        }
        if (data) {
          setCsvData(refactor(data));
        }
      },
    });
  };

  const loadFile = () => {
    if (!inputFile.current) return;
    inputFile.current.click();
  };
  const ejectFile = () => {
    setCsvData({ singleDates: [], data: [] });
  };

  return (
    <div className="flex flex-col content-center min-h-screen">
      <header className="mx-3 my-1 grid grid-cols-2 items-center place-content-between">
        <h2>Datadog csv export viewer</h2>
        {!csvData || csvData.data.length === 0 ? (
          <button
            type="button"
            className="ml-auto inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-700 hover:text-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:ring hover:ring-blue-500"
            onClick={loadFile}
          >
            <TbFileAnalytics className="text-2xl mr-2" />
            Load file
          </button>
        ) : (
          <button
            type="button"
            className="ml-auto inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-700 hover:text-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:ring-blue-500"
            onClick={ejectFile}
          >
            <TbPlayerEject className="text-2xl mr-2" />
            Eject file
          </button>
        )}
        <input
          type="file"
          id="file"
          ref={inputFile}
          style={{ display: "none" }}
          onChange={loadFileHandler}
        />
      </header>
      <main className="p-3 grow flex flex-col">
        {csvData && csvData.data.length > 0 && (
          <DataTable singleDates={csvData.singleDates} data={csvData.data} />
        )}
      </main>
    </div>
  );
}

export default App;
