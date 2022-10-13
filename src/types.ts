import { ParseError, ParseMeta } from "papaparse";
export type MessageHttpType = {
  host: string;
  method: string;
  path_group: string;
  status_code: string;
  url: string;
};
export type MessageType = {
  duration: number;
  env: string;
  service: string;
  language: string;
  http: MessageHttpType;
};

export type RefactoredDataType = {
  date: Date;
  message: MessageType;
};
export type ParsedDataType = {
  date: string;
  message: string;
};

export type ParseResultData = {
  data: ParsedDataType[] | undefined;
  errors: ParseError[];
  meta: ParseMeta;
};
