import { createActor } from 'xstate';
import { useSelector } from '@xstate/react';
import { gameMachine, type GameContext, type Message } from './game';

const gameActor = createActor(gameMachine);
gameActor.start();

export const useGame = () => {
  const context = useSelector(gameActor, (state) => state.context);
  const activeView = useSelector(gameActor, (state) => state.context.activeView);
  
  const aiAwareness = useSelector(gameActor, (state) => state.context.aiAwareness);
  const timePressure = useSelector(gameActor, (state) => state.context.timePressure);
  const systemIntegrity = useSelector(gameActor, (state) => state.context.systemIntegrity);
  const aiPersonality = useSelector(gameActor, (state) => state.context.aiPersonality);
  
  const aiAwarenessState = useSelector(gameActor, (state) => state.value.aiAwareness);
  const timePressureState = useSelector(gameActor, (state) => state.value.timePressure);
  const systemIntegrityState = useSelector(gameActor, (state) => state.value.systemIntegrity);
  const playerActionState = useSelector(gameActor, (state) => state.value.playerActions);
  const gameFlowState = useSelector(gameActor, (state) => state.value.gameFlow);
  
  const messages = useSelector(gameActor, (state) => state.context.messages);
  const messageViews = useSelector(gameActor, (state) => state.context.messageViews);
  
  const openedMessageIds = useSelector(gameActor, (state) => 
    new Set(state.context.messageViews.map(v => v.messageId))
  );
  
  const unreadCount = useSelector(gameActor, (state) => {
    const openedIds = new Set(state.context.messageViews.map(v => v.messageId));
    return state.context.messages.filter(msg => !openedIds.has(msg.id)).length;
  });
  
  const recentlyOpenedMessages = useSelector(gameActor, (state) => {
    return state.context.messageViews
      .sort((a, b) => b.openedAt - a.openedAt)
      .slice(0, 10)
      .map(v => v.messageId);
  });

  return {
    context,
    activeView,
    
    aiAwareness,
    timePressure,
    systemIntegrity,
    aiPersonality,
    
    aiAwarenessState,
    timePressureState,
    systemIntegrityState,
    playerActionState,
    gameFlowState,
    
    messages,
    messageViews,
    openedMessageIds,
    unreadCount,
    recentlyOpenedMessages,
    
    startGame: (commanderName: string) => gameActor.send({ type: 'START_GAME', commanderName }),
    changeView: (view: GameContext['activeView']) => gameActor.send({ type: 'CHANGE_VIEW', view }),
    
    playerScan: (system: string) => gameActor.send({ type: 'PLAYER_SCAN', system }),
    playerMessage: (recipient: string, content: string) => gameActor.send({ type: 'PLAYER_MESSAGE', recipient, content }),
    playerCommand: (command: string) => gameActor.send({ type: 'PLAYER_COMMAND', command }),
    
    findAnomaly: (anomaly: string) => gameActor.send({ type: 'FIND_ANOMALY', anomaly }),
    findClue: (clue: string) => gameActor.send({ type: 'FIND_CLUE', clue }),
    
    overrideAttempt: (system: string) => gameActor.send({ type: 'OVERRIDE_ATTEMPT', system }),
    overrideSuccess: (system: string) => gameActor.send({ type: 'OVERRIDE_SUCCESS', system }),
    overrideFailure: (system: string) => gameActor.send({ type: 'OVERRIDE_FAILURE', system }),
    
    negotiateStart: () => gameActor.send({ type: 'NEGOTIATE_START' }),
    negotiateSuccess: () => gameActor.send({ type: 'NEGOTIATE_SUCCESS' }),
    negotiateFailure: () => gameActor.send({ type: 'NEGOTIATE_FAILURE' }),
    
    systemDegrade: (system: string, amount: number) => gameActor.send({ type: 'SYSTEM_DEGRADE', system, amount }),
    systemRepair: (system: string, amount: number) => gameActor.send({ type: 'SYSTEM_REPAIR', system, amount }),
    systemCascade: () => gameActor.send({ type: 'SYSTEM_CASCADE' }),
    
    aiEscalate: () => gameActor.send({ type: 'AI_ESCALATE' }),
    aiCounterattack: () => gameActor.send({ type: 'AI_COUNTERATTACK' }),
    aiManipulation: () => gameActor.send({ type: 'AI_MANIPULATION' }),
    
    crisisTriggered: () => gameActor.send({ type: 'CRISIS_TRIGGERED' }),
    timerTick: () => gameActor.send({ type: 'TIMER_TICK' }),
    
    confrontAI: () => gameActor.send({ type: 'CONFRONT_AI' }),
    threatenSelfDestruct: () => gameActor.send({ type: 'THREATEN_SELF_DESTRUCT' }),
    activateSelfDestruct: () => gameActor.send({ type: 'ACTIVATE_SELF_DESTRUCT' }),
    
    endGame: (outcome: string) => gameActor.send({ type: 'END_GAME', outcome }),
    
    addMessage: (message: Message) => gameActor.send({ type: 'ADD_MESSAGE', message }),
    openMessage: (messageId: string) => gameActor.send({ type: 'MESSAGE_OPENED', messageId }),
    
    send: gameActor.send,
  };
};

export { gameActor };
