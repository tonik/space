import type { Command } from "../types";
import { colorizeMessages } from "../utils";
import { COMMAND_RESPONSES } from "../content";

export const anomaliesCommand: Command = {
  execute: () => colorizeMessages(COMMAND_RESPONSES.anomalies),
  description: "Report system anomalies",
};
