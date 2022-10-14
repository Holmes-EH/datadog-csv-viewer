import { FC, useState } from "react";
import { RefactoredDataType, RefactoredRowType } from "../types";
import DataRow from "./DataRow";
import Loader from "./Loader";

import { FiUsers } from "react-icons/fi";
import { BiError, BiPhoneOutgoing } from "react-icons/bi";

const DataTable: FC<RefactoredDataType> = ({
  singleDates,
  data,
}): JSX.Element => {
  const [filteredDates, setFilteredDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR").format(date);
  };

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    if (event.target.checked) {
      setFilteredDates([...filteredDates, new Date(event.target.value)]);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
      return;
    }
    const newFilteredDateList = filteredDates.filter(
      (date: Date) => date.getDate() !== new Date(event.target.value).getDate()
    );
    setFilteredDates(newFilteredDateList);
    setLoading(false);
  };

  const getStats = (key: string): number => {
    let totalCount = 0;
    switch (key) {
      case "rows":
        filteredDates.forEach((date) => {
          totalCount += data.filter(
            (row) => row.date.getDate() === date.getDate()
          ).length;
        });
        break;
      case "clientIds":
        const clientSet = new Set();
        filteredDates.forEach((date) => {
          const filteredData: RefactoredRowType[] = data.filter(
            (row) => row.date.getDate() === date.getDate()
          );
          filteredData.forEach((row) => {
            clientSet.add(row.clientIdNumber);
          });
        });
        totalCount = Array.from(clientSet).length;
        break;
      case "404":
        filteredDates.forEach((date) => {
          const filteredData: RefactoredRowType[] = data.filter(
            (row) => row.date.getDate() === date.getDate()
          );
          totalCount += filteredData.filter((row) => {
            return row.message.http.status_code === "404";
          }).length;
        });
        break;
      default:
        break;
    }

    return totalCount;
  };

  return (
    <>
      <h2 className="text-center">Choose one or more dates</h2>
      <div className="grid grid-flow-col divide-x-4 align-middle justify-center mb-4">
        {singleDates.map((date, index) => {
          return (
            <div
              className="flex gap-2 align-middle justify-center px-4"
              key={`select-dates-${index}`}
            >
              <input
                id={`select-dates-${index}`}
                value={date}
                type="checkbox"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleCheck(e)
                }
              />
              <label htmlFor={`select-dates-${index}`}>
                {formatDate(new Date(date))}
              </label>
            </div>
          );
        })}
      </div>
      {loading && <Loader />}
      {!loading && filteredDates.length > 0 && (
        <>
          <h3 className="ml-3 font-extrabold">Stats</h3>
          <div className="flex gap-2 mb-5 content-center">
            {getStats("rows") > 0 ? (
              <div className="flex items-center text-sm bg-slate-300 text-slate-600 rounded-full px-3 py-1">
                <BiPhoneOutgoing className="text-lg mr-3" />
                Number of calls : {getStats("rows")}
              </div>
            ) : null}
            {getStats("404") > 0 ? (
              <div className="flex items-center text-sm bg-slate-300 text-slate-600 rounded-full px-3 py-1">
                <BiError className="text-lg mr-3" />
                Number of 404 : {getStats("404")}
              </div>
            ) : null}
            {getStats("clientIds") > 0 ? (
              <div className="flex items-center text-sm bg-slate-300 text-slate-600 rounded-full px-3 py-1">
                <FiUsers className="text-lg mr-3" />
                Unique client ids : {getStats("clientIds")}
              </div>
            ) : null}
          </div>

          <table className="table-fixed w-full border-collapse">
            <thead>
              <tr>
                <th className="w-1/6">Date</th>
                <th className="">Message</th>
                <th className="w-1/5">Client ID</th>
              </tr>
            </thead>

            {filteredDates.map((date, index) => {
              return (
                <DataRow
                  key={`filteredData-${index}`}
                  filteredData={data.filter(
                    (row) => row.date.getDate() === date.getDate()
                  )}
                />
              );
            })}
          </table>
        </>
      )}
    </>
  );
};

export default DataTable;
