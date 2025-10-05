import React from "react";
import { ECHO_VARIATIONS } from "./content";

export const colorizeMessage = (message: string) => {
  if (message.trim().startsWith("Error:")) {
    return <span className="text-destructive">{message}</span>;
  }
  if (message.trim().startsWith("Warning:")) {
    return <span className="text-orange-500">{message}</span>;
  }
  if (message.trim().startsWith("AI:")) {
    return <span className="text-blue-500">{message}</span>;
  }
  return message;
};

export const colorizeMessages = (
  messages: string[],
): (string | React.ReactNode)[] => {
  return messages.map(colorizeMessage);
};

export const getRandomVariation = (input: string): string => {
  const variation =
    ECHO_VARIATIONS[Math.floor(Math.random() * ECHO_VARIATIONS.length)];
  return variation(input);
};

export const parseCommandWithText = (
  command: string,
  commandName: string,
): string | null => {
  const match = command.match(new RegExp(`^${commandName}\\s+(.+)$`, "i"));
  return match && match[1] ? match[1].trim() : null;
};

export const parseCommand = (
  input: string,
): { command: string; args: string } => {
  const trimmed = input.trim();
  const spaceIndex = trimmed.indexOf(" ");

  if (spaceIndex === -1) {
    return { command: trimmed, args: "" };
  }

  return {
    command: trimmed.substring(0, spaceIndex),
    args: trimmed.substring(spaceIndex + 1).trim(),
  };
};
