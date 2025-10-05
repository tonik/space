import type { GameContext } from "@/state/types";
import React from "react";

export type StoreDataCallback = (data: string) => void;
export type InteractiveCallback = (
  type: string,
  prompt: string,
  callback: (input: string) => string[] | null,
) => void;

export interface CommandContext {
  storeData?: StoreDataCallback;
  currentName?: string;
  interactiveCallback?: InteractiveCallback;
  commandCounts?: Record<string, number>;
  mission?: GameContext["mission"];
}

export type CommandResult = string[] | React.ReactNode | null;

export interface Command {
  execute: (input: string, context: CommandContext) => CommandResult;
  description: string;
  usage?: string;
  aliases?: string[];
}

export type CommandRegistry = Record<string, Command>;
