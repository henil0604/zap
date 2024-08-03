import { ZapResponse } from "@/types";

export function createResponse<Data>(
  error: ZapResponse<Data>["error"],
  code: ZapResponse<Data>["code"],
  message?: string,
  data?: Data
) {
  return {
    error,
    code,
    message,
    data,
  };
}
