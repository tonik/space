import { createActor } from "xstate";
import { gameMachine } from "./game";
import { useMemo, useState, type ReactNode } from "react";
import { Context, createState } from "./context";

export const StateProvider = ({ children }: { children: ReactNode }) => {
  const [actor, setActor] = useState(createState);
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
          actor.stop();
          const newActor = createActor(gameMachine, { snapshot });
          newActor.start();
          newActor.subscribe((state) => {
            localStorage.setItem("gameState", JSON.stringify(state));
          });

          setActor(actor);
        }
      },
    };
  }, [actor]);

  return <Context value={state}>{children}</Context>;
};
