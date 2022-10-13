import { FC } from "react";
import { RefactoredDataType } from "../types";
import Message from "./Message";

interface IDataProps {
  data: RefactoredDataType[];
}

const DataTable: FC<IDataProps> = ({ data }): JSX.Element => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR").format(date);
  };

  return (
    <table className="table-fixed w-full border-collapse">
      <thead>
        <tr>
          <th className="w-1/6">Date</th>
          <th className="">Message</th>
        </tr>
      </thead>
      {data.map((row, index) => {
        return (
          <tbody key={`row-${index}`}>
            <tr>
              <td className="text-center">{formatDate(row.date)}</td>
              <Message message={row.message} />
            </tr>
          </tbody>
        );
      })}
    </table>
  );
};

export default DataTable;
