import { RefactoredDataType, ParsedDataType } from "../types";

const refactor = (parsedData: ParsedDataType[]) => {
  return parsedData.map((row) => {
    const refactoredObject: RefactoredDataType = {
      date: new Date(row.date),
      message: JSON.parse(row.message),
    };
    return refactoredObject;
  });
};

export default refactor;
