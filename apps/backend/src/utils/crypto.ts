import crypto from "node:crypto";

export const HASH_ALGORITHM = "sha256";

export function hash(data: string) {
  return crypto.hash(HASH_ALGORITHM, data);
}
