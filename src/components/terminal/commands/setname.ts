import type { Command } from "../types";
import { parseCommandWithText } from "../utils";

export const setnameCommand: Command = {
  execute: (input, context) => {
    const { storeData, interactiveCallback } = context;

    if (!storeData || !interactiveCallback) {
      return ["Name change not available."];
    }

    const newName = parseCommandWithText(input, "setname");

    if (newName) {
      storeData(newName);
      return [`Name set to: ${newName}`];
    }

    interactiveCallback(
      "setname",
      "Enter your new name:",
      (userInput: string) => {
        if (userInput && userInput.trim()) {
          storeData(userInput.trim());
          return [`Name set to: ${userInput.trim()}`];
        }
        return ["No name entered. Name not changed."];
      },
    );

    return null;
  },
  description: "Set your commander name",
  usage: "setname <name>",
};
