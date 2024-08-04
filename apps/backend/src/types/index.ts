import { CONST } from "@/const";
import { Session, User } from "lucia";

export interface ZapResponse<Data> {
  error: boolean;
  code: (typeof CONST.RESPONSE_CODES)[keyof typeof CONST.RESPONSE_CODES];
  message?: string;
  data: Data;
}

export type HonoVariables = {
  user: User | null;
  session: Session | null;
};
