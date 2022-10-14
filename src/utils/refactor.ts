import { ParsedDataType, RefactoredRowType } from "../types";

const extractClientProjectNumber = (url: string) => {
  const clientIdMatch: RegExpMatchArray | null = url.match(/\/.[0-9a-z-]*\//g);
  if (clientIdMatch !== null) {
    return clientIdMatch[0].slice(1, -1);
  } else {
    return "No Id";
  }
};

const refactor = (parsedData: ParsedDataType[]) => {
  const singleDates: Set<string> = new Set();
  const refactoredData: RefactoredRowType[] = [];
  parsedData.forEach((row) => {
    singleDates.add(new Date(row.date).toDateString());
    refactoredData.push({
      date: new Date(row.date),
      message: JSON.parse(row.message),
      clientIdNumber: extractClientProjectNumber(
        JSON.parse(row.message).http.url
      ),
    });
  });
  return { singleDates: Array.from(singleDates), data: refactoredData };
};

export default refactor;
