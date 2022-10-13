import { ParsedDataType, RefactoredRowType } from "../types";

const refactor = (parsedData: ParsedDataType[]) => {
  const singleDates: Set<string> = new Set();
  const refactoredData: RefactoredRowType[] = [];
  parsedData.forEach((row) => {
    singleDates.add(new Date(row.date).toDateString());
    refactoredData.push({
      date: new Date(row.date),
      message: JSON.parse(row.message),
    });
  });
  return { singleDates: Array.from(singleDates), data: refactoredData };
};

export default refactor;
