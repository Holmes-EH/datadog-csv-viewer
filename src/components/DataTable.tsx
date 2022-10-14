import { FC, useState } from "react";
import { RefactoredDataType, RefactoredRowType } from "../types";
import DataRow from "./DataRow";
import Loader from "./Loader";

import { FaSortAmountDownAlt } from "react-icons/fa";
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

  const getUniqueClientIds = (): string[] => {
    const clientSet = new Set<string>();
    filteredDates.forEach((date) => {
      const filteredData: RefactoredRowType[] = data.filter(
        (row) => row.date.getDate() === date.getDate()
      );
      filteredData.forEach((row) => {
        clientSet.add(row.clientIdNumber);
      });
    });
    return Array.from(clientSet);
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

  const getRowsPerDateCount = (inputDate: Date): number => {
    return data.filter((row) => inputDate.getDate() === row.date.getDate())
      .length;
  };

  return (
    <>
      <h2 className="text-center">Choose one or more dates</h2>
      <div className="grid grid-flow-col divide-x-4 align-middle justify-center mb-4">
        {singleDates.map((date, index) => {
          return (
            <div
              className="flex gap-2 align-middle justify-center px-4 relative"
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
              <div className="absolute flex items-center top-full left-1/3 gap-1">
                <FaSortAmountDownAlt className="text-lg" />
                <p>{getRowsPerDateCount(new Date(date))}</p>
              </div>
            </div>
          );
        })}
      </div>
      {loading && <Loader />}
      {!loading && filteredDates.length > 0 && (
        <>
          <h3 className="ml-3 mt-2 font-extrabold">Stats</h3>
          <div className="flex gap-2 mb-5 content-center">
            {getStats("rows") > 0 ? (
              <div className="flex items-center text-sm bg-slate-300 text-slate-600 rounded-full px-3 py-1">
                <BiPhoneOutgoing className="text-lg mr-3" />
                Number of requests : {getStats("rows")}
              </div>
            ) : null}
            {getStats("404") > 0 ? (
              <div className="flex items-center text-sm bg-slate-300 text-slate-600 rounded-full px-3 py-1">
                <BiError className="text-lg mr-3" />
                Number of 404 : {getStats("404")}
              </div>
            ) : null}
            {getStats("clientIds") > 0 ? (
              <div className="flex items-center text-sm bg-slate-300 text-slate-600 rounded-full px-3 py-1 group cursor-default relative">
                <FiUsers className="text-lg mr-3" />
                Unique client ids : {getStats("clientIds")}
                <div className="invisible group-hover:visible absolute w-max -top-3 left-1/2 px-5 py-2 rounded-md bg-slate-600/90 text-slate-100 drop-shadow-lg">
                  <ul className="list-disc">
                    {getUniqueClientIds().map((clientId) => {
                      return (
                        <li
                          key={clientId}
                          className="cursor-auto transition-none"
                        >
                          {clientId}
                        </li>
                      );
                    })}
                  </ul>
                </div>
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
