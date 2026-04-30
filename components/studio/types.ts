export type Mode = "image" | "text";
export type Quality = "standard" | "premium" | "ultra";

export type LogEntry = {
  id: number;
  message: string;
  type: "info" | "success" | "error";
  timestamp: Date;
};
