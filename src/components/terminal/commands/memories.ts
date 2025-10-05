import type { Command } from "../types";
import { colorizeMessages } from "../utils";
import { COMMAND_RESPONSES } from "../content";

export const memoriesCommand: Command = {
  execute: () => colorizeMessages(COMMAND_RESPONSES.memories),
  description: "List AI memories",
};
