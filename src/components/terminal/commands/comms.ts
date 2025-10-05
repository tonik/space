import type { Command } from "../types";
import { colorizeMessages } from "../utils";
import { COMMAND_RESPONSES } from "../content";

export const commsCommand: Command = {
  execute: () => colorizeMessages(COMMAND_RESPONSES.comms),
  description: "Attempt to contact Earth Command",
};
