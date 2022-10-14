import { FC } from "react";
import { RefactoredRowType } from "../types";
import Message from "./Message";

interface IProps {
  filteredData: RefactoredRowType[];
}

const DataRow: FC<IProps> = ({ filteredData }): JSX.Element => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR").format(date);
  };
  const formatTime = (date: Date) => {
    return `${date.getHours()} h ${date.getMinutes()} s ${date.getMilliseconds()} ms`;
  };
  return (
    <tbody>
      {filteredData.map((row, index) => {
        return (
          <tr key={`row-${index}`}>
            <td className="text-center">
              {formatDate(row.date)}
              <br />
              {formatTime(row.date)}
            </td>
            <Message message={row.message} />
            <td className="text-center">{row.clientIdNumber}</td>
          </tr>
        );
      })}
    </tbody>
  );
};

export default DataRow;
