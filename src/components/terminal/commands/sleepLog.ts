import type { Command } from "../types";
import { colorizeMessages } from "../utils";
import { COMMAND_RESPONSES } from "../content";

export const sleepLogCommand: Command = {
  execute: () => colorizeMessages(COMMAND_RESPONSES.sleepLog),
  description: "Access crew sleep logs",
  usage: "sleep log",
  aliases: ["sleep log"],
};
