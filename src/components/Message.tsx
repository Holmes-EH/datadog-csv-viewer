import { FC } from "react";
import { MessageType } from "../types";

interface IProps {
  message: MessageType;
}

const Message: FC<IProps> = ({ message }): JSX.Element => {
  const { duration, service, http } = message;
  return (
    <td>
      <div className="flex gap-5 px-1 py-2 align-middle">
        {http.status_code === "200" ? (
          <span className="rounded my-auto bg-lime-600 text-stone-50 px-2">
            200
          </span>
        ) : (
          <span className="rounded my-auto bg-red-600 text-stone-50 px-2">
            {http.status_code}
          </span>
        )}
        <p className="text-sm self-center">{http.url}</p>
      </div>
      <table className="table-fixed w-full border-collapse">
        <tbody>
          <tr className="text-left border-t-2 border-black border-dotted">
            <th className="border-none pl-4">Duration</th>
            <th className="border-none">Service Name</th>
          </tr>
          <tr>
            <td className="border-none pl-8">
              {Number(duration / 1e6).toFixed(2)} ms
            </td>
            <td className="border-none pl-4">{service}</td>
          </tr>
        </tbody>
      </table>
    </td>
  );
};

export default Message;
