import { FC, useEffect, useState } from "react";
import { RefactoredDataType, RefactoredRowType } from "../types";
import DataRow from "./DataRow";
import Calculator from "./Calculator";

import { FaSortAmountDownAlt } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { BiError, BiPhoneOutgoing } from "react-icons/bi";

type ErroredUrl = {
  url: string;
  errorCount: number;
};

const DataTable: FC<RefactoredDataType> = ({
  singleDates,
  data,
}): JSX.Element => {
  const [filteredDates, setFilteredDates] = useState<Date[]>([]);
  const [calculating, setCalculating] = useState(false);
  const [displayRows, setDisplayRows] = useState<boolean>(false);
  const [displayDuplicates, setDisplayDuplicates] = useState<boolean>(false);
  const [numberOfErrorResponses, setNumberOfErrorResponses] =
    useState<number>(10);
  const [individualUrlList, setIndividualUrlList] = useState<ErroredUrl[]>([]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR").format(date);
  };

  const verifyChecked = (date: string) => {
    return (
      filteredDates.filter((el) => el.getDate() === new Date(date).getDate())
        .length > 0
    );
  };
  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCalculating(true);
    if (event.target.checked) {
      setFilteredDates([...filteredDates, new Date(event.target.value)]);
      setTimeout(() => {
        setCalculating(false);
      }, 2000);
      return;
    }
    const newFilteredDateList = filteredDates.filter(
      (date: Date) => date.getDate() !== new Date(event.target.value).getDate()
    );
    setFilteredDates(newFilteredDateList);
    setCalculating(false);
  };

  useEffect(() => {
    const individualUrls = () => {
      setIndividualUrlList([]);
      const result: ErroredUrl[] = [];
      const uniqueUrlSet: string[] = [];
      filteredDates.forEach((date) => {
        const filteredData: RefactoredRowType[] = data.filter(
          (row) => row.date.getDate() === date.getDate()
        );

        filteredData.forEach((row) => {
          if (uniqueUrlSet.includes(row.message.http.url)) return;
          if (
            row.message.http.status_code === "404" &&
            !uniqueUrlSet.includes(row.message.http.url)
          ) {
            uniqueUrlSet.push(row.message.http.url);
          }
        });
      });
      uniqueUrlSet.sort();
      uniqueUrlSet.forEach((uniqueUrl) => {
        let count = 0;
        filteredDates.forEach((date) => {
          const filteredData: RefactoredRowType[] = data.filter(
            (row) => row.date.getDate() === date.getDate()
          );
          count += filteredData.filter((row) => {
            return (
              row.message.http.url === uniqueUrl &&
              row.message.http.status_code === "404"
            );
          }).length;
        });
        if (count > numberOfErrorResponses) {
          result.push({ url: uniqueUrl, errorCount: count });
        }
      });

      setIndividualUrlList(result);
    };
    individualUrls();
  }, [numberOfErrorResponses, data, filteredDates]);

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
      {filteredDates.length > 1 ? (
        <button
          onClick={() => setFilteredDates([])}
          className="mx-auto rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-700 hover:text-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:ring hover:ring-blue-500"
        >
          Deselect All
        </button>
      ) : null}
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
                checked={verifyChecked(date)}
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
      {calculating && <Calculator />}
      {filteredDates.length > 0 && (
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
                Total number of 404 : {getStats("404")}
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
          <button
            onClick={() => setDisplayDuplicates(!displayDuplicates)}
            type="button"
            className="my-2 mx-auto rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-700 hover:text-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:ring hover:ring-blue-500"
          >
            {displayDuplicates ? (
              <>Hide duplicate urls</>
            ) : (
              <>Show duplicate urls</>
            )}
          </button>
          {displayDuplicates ? (
            <table className="table-fixed mx-auto border-collapse mb-3">
              <thead>
                <tr>
                  <th>
                    Duplicate Urls with more than{" "}
                    <input
                      className="my-2 rounded-lg text-center w-20 outline outline-2 outline-origins-blue"
                      type="number"
                      min={1}
                      value={numberOfErrorResponses}
                      onChange={(e) => {
                        setNumberOfErrorResponses(parseInt(e.target.value));
                      }}
                    />{" "}
                    404 error responses over selected time span (
                    {individualUrlList.length})
                  </th>
                  <th className="px-3">Number of 404 responses</th>
                </tr>
              </thead>
              <tbody>
                {individualUrlList.map((erroredUrl) => {
                  return (
                    <tr key={erroredUrl.url}>
                      <td>{erroredUrl.url}</td>
                      <td>{erroredUrl.errorCount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : null}
          <button
            onClick={() => setDisplayRows(!displayRows)}
            type="button"
            className="my-2 mx-auto rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-700 hover:text-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:ring hover:ring-blue-500"
          >
            {displayRows ? (
              <>
                Hide Full Table
                <br />
                <sub>Could take a while...</sub>
              </>
            ) : (
              <>
                Show Full Table
                <br />
                <sub>Could take a while...</sub>
              </>
            )}
          </button>
          {displayRows ? (
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
          ) : null}
        </>
      )}
    </>
  );
};

export default DataTable;
