import { createActor } from 'xstate';
import { useSelector } from '@xstate/react';
import { gameMachine, type GameContext } from './game';

const gameActor = createActor(gameMachine);
gameActor.start();

export const useGame = () => {
  const context = useSelector(gameActor, (state) => state.context);
  const currentPhase = useSelector(gameActor, (state) => state.context.currentPhase);
  const activeView = useSelector(gameActor, (state) => state.context.activeView);
  const phaseData = useSelector(gameActor, (state) => state.context.phaseData);

  return {
    context,
    currentPhase,
    activeView,
    phaseData,
    
    startGame: (commanderName: string) => gameActor.send({ type: 'START_GAME', commanderName }),
    changeView: (view: GameContext['activeView']) => gameActor.send({ type: 'CHANGE_VIEW', view }),
    performScan: (area: string) => gameActor.send({ type: 'PERFORM_SCAN', area }),
    discoverClue: (clue: string) => gameActor.send({ type: 'DISCOVER_CLUE', clue }),
    faceChallenge: (challenge: string) => gameActor.send({ type: 'FACE_CHALLENGE', challenge }),
    advancePhase: () => gameActor.send({ type: 'ADVANCE_PHASE' }),
    endGame: (outcome: string) => gameActor.send({ type: 'END_GAME', outcome }),
    send: gameActor.send,
  };
};

export { gameActor };
