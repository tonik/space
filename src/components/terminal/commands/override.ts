import type { Command } from "../types";
import { colorizeMessages } from "../utils";
import { COMMAND_RESPONSES } from "../content";

export const overrideCommand: Command = {
  execute: () => colorizeMessages(COMMAND_RESPONSES.override),
  description: "Emergency system overrides",
};
