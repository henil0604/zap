import { CONST } from "@/const";

export interface ZapResponse<Data> {
  error: boolean;
  code: (typeof CONST.RESPONSE_CODES)[keyof typeof CONST.RESPONSE_CODES];
  message?: string;
  data: Data;
}
