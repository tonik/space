import type { GameEvent } from "@/state/game";
import { gameActor } from "@/state/useGame";
import React from "react";

class GameEventSystem {
  private subscribers: Map<string, Set<(event: GameEvent) => void>> = new Map();

  subscribe(
    eventType: string,
    callback: (event: GameEvent) => void,
  ): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }

    this.subscribers.get(eventType)!.add(callback);

    return () => {
      const subscribers = this.subscribers.get(eventType);
      if (subscribers) {
        subscribers.delete(callback);
        if (subscribers.size === 0) {
          this.subscribers.delete(eventType);
        }
      }
    };
  }

  emit(event: GameEvent): void {
    gameActor.send(event);

    const eventType = event.type;
    const subscribers = this.subscribers.get(eventType);

    if (subscribers) {
      subscribers.forEach((callback) => {
        try {
          callback(event);
        } catch (error) {
          console.error("Error in event subscriber:", error);
        }
      });
    }

    const wildcardSubscribers = this.subscribers.get("*");
    if (wildcardSubscribers) {
      wildcardSubscribers.forEach((callback) => {
        try {
          callback(event);
        } catch (error) {
          console.error("Error in wildcard event subscriber:", error);
        }
      });
    }
  }

  subscribeToAll(callback: (event: GameEvent) => void): () => void {
    return this.subscribe("*", callback);
  }

  clear(): void {
    this.subscribers.clear();
  }
}

export const gameEventSystem = new GameEventSystem();

export const useGameEvent = (
  eventType: string,
  callback: (event: GameEvent) => void,
) => {
  React.useEffect(() => {
    const unsubscribe = gameEventSystem.subscribe(eventType, callback);
    return unsubscribe;
  }, [eventType, callback]);
};

export const useAllGameEvents = (callback: (event: GameEvent) => void) => {
  React.useEffect(() => {
    const unsubscribe = gameEventSystem.subscribeToAll(callback);
    return unsubscribe;
  }, [callback]);
};

export default gameEventSystem;
