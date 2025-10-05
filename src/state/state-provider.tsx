import { createActor } from "xstate";
import { gameMachine } from "./game";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Context, createState } from "./context";

export const StateProvider = ({ children }: { children: ReactNode }) => {
  const [actor, setActor] = useState(() => createState());

  useEffect(() => {
    actor.start();

    actor.start();
    actor.subscribe((state) => {
      localStorage.setItem("gameState", JSON.stringify(state));
    });
    return () => {
      actor.stop();
    };
  }, [actor]);

  const state = useMemo(() => {
    return {
      actor,
      saveGameState: () => {
        const state = actor.getPersistedSnapshot();
        const existingSavesRaw = localStorage.getItem("saves") ?? "[]";
        const existingSaves = JSON.parse(existingSavesRaw);

        localStorage.setItem(
          "saves",
          JSON.stringify([...existingSaves, state]),
        );
      },
      loadGameState: (index?: number) => {
        const existingSavesRaw = localStorage.getItem("saves") ?? "[]";
        const existingSaves = JSON.parse(existingSavesRaw);
        const snapshot = existingSaves[index ?? existingSaves.length - 1];

        if (snapshot) {
          const newActor = createActor(gameMachine, { snapshot });
          setActor(newActor);
        }
      },
    };
  }, [actor]);

  return <Context value={state}>{children}</Context>;
};
