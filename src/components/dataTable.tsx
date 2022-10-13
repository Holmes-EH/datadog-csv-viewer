import { FC, useState } from "react";
import { RefactoredDataType } from "../types";
import DataRow from "./DataRow";
import Loader from "./Loader";

const DataTable: FC<RefactoredDataType> = ({
  singleDates,
  data,
}): JSX.Element => {
  const [filteredDates, setFilteredDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState<Boolean>(false);
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
  return (
    <>
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
        <table className="table-fixed w-full border-collapse">
          <thead>
            <tr>
              <th className="w-1/6">Date</th>
              <th className="">Message</th>
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
      )}
    </>
  );
};

export default DataTable;
