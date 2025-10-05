import type { Command } from "../types";
import { parseCommandWithText, getRandomVariation } from "../utils";

export const echoCommand: Command = {
  execute: (input, context) => {
    const { interactiveCallback } = context;
    const text = parseCommandWithText(input, "echo");

    if (text) {
      return [getRandomVariation(text)];
    }

    if (interactiveCallback) {
      interactiveCallback(
        "echo",
        "Enter text to echo:",
        (userInput: string) => {
          if (userInput && userInput.trim()) {
            return [getRandomVariation(userInput)];
          }
          return ["No text provided."];
        },
      );
      return null;
    }

    return [
      "Usage: echo <text>",
      "Example: echo hello world",
      "No text provided.",
    ];
  },
  description: "Repeat input",
  usage: "echo <text>",
};
