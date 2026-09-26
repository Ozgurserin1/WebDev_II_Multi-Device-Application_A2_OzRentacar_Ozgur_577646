import fs from "fs";

export function readJsonFile(fileUrl) {
  return JSON.parse(fs.readFileSync(fileUrl, "utf8"));
}
