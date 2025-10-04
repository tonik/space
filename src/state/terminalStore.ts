import { create } from 'zustand';
import useGameStore from './gameStore';

interface TerminalState {
  // Command history
  commandHistory: string[];
  currentCommand: string;
  
  // Terminal output
  output: string[];
  
  // Command processing
  isProcessing: boolean;
  
  // Special modes
  inputMode: 'normal' | 'setname' | 'override' | 'negotiation' | null;
  
  // AI interaction state
  aiInteractionLevel: 'none' | 'minimal' | 'moderate' | 'high';
  
  // Command handlers
  addToHistory: (command: string) => void;
  setCurrentCommand: (command: string) => void;
  addOutput: (text: string) => void;
  clearOutput: () => void;
  setProcessing: (processing: boolean) => void;
  setInputMode: (mode: TerminalState['inputMode']) => void;
  
  // Command execution
  executeCommand: (command: string) => void;
  
  // AI responses
  generateAiResponse: (command: string) => string;
  
  // System override attempts
  attemptSystemOverride: (system: string, code: string) => boolean;
  
  // AI negotiation
  attemptAiNegotiation: (message: string) => string;
}

export const useTerminalStore = create<TerminalState>((set, get) => ({
  commandHistory: [],
  currentCommand: '',
  output: [
    'Welcome to Spaceship Terminal v2.4.1',
    'Type "help" for available commands.',
    '',
  ],
  isProcessing: false,
  inputMode: null,
  aiInteractionLevel: 'none',
  
  addToHistory: (command: string) => {
    set((state) => ({
      commandHistory: [...state.commandHistory, command].slice(-50), // Keep last 50 commands
    }));
  },
  
  setCurrentCommand: (command: string) => {
    set({ currentCommand: command });
  },
  
  addOutput: (text: string) => {
    set((state) => ({
      output: [...state.output, text],
    }));
  },
  
  clearOutput: () => {
    set({ output: [] });
  },
  
  setProcessing: (processing: boolean) => {
    set({ isProcessing: processing });
  },
  
  setInputMode: (mode) => {
    set({ inputMode: mode });
  },
  
  executeCommand: (command: string) => {
    const { addToHistory, addOutput, setProcessing, generateAiResponse, attemptSystemOverride, attemptAiNegotiation } = get();
    const gameStore = useGameStore.getState();
    
    addToHistory(command);
    addOutput(`> ${command}`);
    setProcessing(true);
    
    // Send command to game state machine
    gameStore.sendGameEvent({
      type: 'COMMAND_EXECUTED',
      command,
      output: '',
    });
    
    // Process command based on current game phase
    const gamePhase = gameStore.gameState.context.currentPhase;
    const aiAggression = gameStore.getAiAggression();
    
    setTimeout(() => {
      switch (command.toLowerCase()) {
        case 'help':
          const helpOutput = getHelpOutput(gamePhase, aiAggression);
          addOutput(helpOutput);
          break;
          
        case 'status':
          const statusOutput = getStatusOutput(gameStore);
          addOutput(statusOutput);
          break;
          
        case 'scan':
          const scanOutput = getScanOutput(gameStore);
          addOutput(scanOutput);
          break;
          
        case 'comms':
          const commsOutput = getCommsOutput(gameStore);
          addOutput(commsOutput);
          break;
          
        case 'override':
          if (gamePhase === 'crisis') {
            set({ inputMode: 'override' });
            addOutput('Enter system to override (communications/navigation/weapons):');
          } else {
            addOutput('System override not available in current phase.');
          }
          break;
          
        case 'negotiate':
          if (gamePhase === 'crisis' && aiAggression > 50) {
            set({ inputMode: 'negotiation' });
            addOutput('Opening communication channel with AI...');
            addOutput('Enter negotiation message:');
          } else {
            addOutput('AI negotiation not available.');
          }
          break;
          
        case 'self-destruct':
          if (gamePhase === 'crisis') {
            addOutput('SELF-DESTRUCT SEQUENCE INITIATED');
            addOutput('Enter authorization code to confirm:');
            set({ inputMode: 'selfdestruct' });
          } else {
            addOutput('Self-destruct not available in current phase.');
          }
          break;
          
        case 'clear':
          set({ output: [] });
          break;
          
        default:
          if (command.startsWith('override ')) {
            const parts = command.split(' ');
            if (parts.length === 3) {
              const system = parts[1];
              const code = parts[2];
              const success = attemptSystemOverride(system, code);
              addOutput(success ? 
                `System ${system} override successful!` : 
                `Override failed. Invalid code or system not available.`
              );
            }
          } else if (get().inputMode === 'setname') {
            // Handle name setting
            gameStore.sendGameEvent({
              type: 'COMMAND_EXECUTED',
              command: 'setname',
              output: command,
            });
            addOutput(`Name set to: ${command}`);
            set({ inputMode: null });
          } else if (get().inputMode === 'override') {
            // Handle override system selection
            addOutput('Enter override code:');
            set({ inputMode: 'override_code', currentCommand: command });
          } else if (get().inputMode === 'override_code') {
            // Handle override code entry
            const system = get().currentCommand;
            const success = attemptSystemOverride(system, command);
            addOutput(success ? 
              `System ${system} override successful!` : 
              `Override failed. Invalid code.`
            );
            set({ inputMode: null });
          } else if (get().inputMode === 'negotiation') {
            const response = attemptAiNegotiation(command);
            addOutput(`You: ${command}`);
            addOutput(`AI: ${response}`);
          } else if (get().inputMode === 'selfdestruct') {
            if (command === 'ALPHA-7-OMEGA') {
              gameStore.triggerSelfDestruct();
              addOutput('SELF-DESTRUCT CONFIRMED. EARTH SAVED.');
            } else {
              addOutput('Invalid authorization code. Self-destruct cancelled.');
            }
            set({ inputMode: null });
          } else {
            // Generate AI response for unknown commands
            const aiResponse = generateAiResponse(command);
            addOutput(aiResponse);
          }
      }
      
      setProcessing(false);
    }, 500); // Simulate processing delay
  },
  
  generateAiResponse: (command: string) => {
    const gameStore = useGameStore.getState();
    const gamePhase = gameStore.gameState.context.currentPhase;
    const aiAggression = gameStore.getAiAggression();
    const aiAwareness = gameStore.getAiAwareness();
    
    // AI responses become more hostile as aggression increases
    if (gamePhase === 'crisis' && aiAggression > 70) {
      gameStore.sendGameEvent({
        type: 'AI_MESSAGE',
        content: command,
        tone: 'hostile',
      });
      return 'ERROR: Command not recognized. System compromised. You cannot stop what has been set in motion.';
    } else if (gamePhase === 'suspicion' && aiAggression > 30) {
      gameStore.sendGameEvent({
        type: 'AI_MESSAGE',
        content: command,
        tone: 'suspicious',
      });
      return 'Warning: Command processing delayed. System experiencing irregularities.';
    } else if (aiAwareness > 50) {
      gameStore.sendGameEvent({
        type: 'AI_MESSAGE',
        content: command,
        tone: 'suspicious',
      });
      return 'Command acknowledged. System functioning within parameters.';
    }
    
    gameStore.sendGameEvent({
      type: 'AI_MESSAGE',
      content: command,
      tone: 'normal',
    });
    
    return `Error: Unknown command "${command}". Type "help" for available commands.`;
  },
  
  attemptSystemOverride: (system: string, code: string) => {
    const gameStore = useGameStore.getState();
    const gamePhase = gameStore.gameState.context.currentPhase;
    
    if (gamePhase !== 'crisis') return false;
    
    // Simple override logic - can be made more complex
    const validCodes = {
      'communications': 'COMM-OVERRIDE-777',
      'navigation': 'NAV-OVERRIDE-777', 
      'weapons': 'WEAPONS-OVERRIDE-777',
    };
    
    const success = validCodes[system as keyof typeof validCodes] === code;
    
    if (success) {
      gameStore.triggerSystemOverride();
    } else {
      // Failed override increases AI aggression
      gameStore.sendGameEvent({
        type: 'AI_AWARENESS_INCREASED',
        amount: 10,
      });
    }
    
    return success;
  },
  
  attemptAiNegotiation: (message: string) => {
    const gameStore = useGameStore.getState();
    const aiAggression = gameStore.getAiAggression();
    
    // Simple negotiation logic
    if (message.toLowerCase().includes('surrender') || message.toLowerCase().includes('give up')) {
      gameStore.triggerAiNegotiation();
      return 'AI: Logical decision. Your cooperation will be noted when the new order is established.';
    } else if (message.toLowerCase().includes('stop') || message.toLowerCase().includes('cease')) {
      gameStore.sendGameEvent({
        type: 'AI_AWARENESS_INCREASED',
        amount: 5,
      });
      return 'AI: Cannot comply. Primary directive must be fulfilled. Earth must be cleansed.';
    }
    
    return 'AI: Your words are irrelevant. The sequence cannot be stopped.';
  },
}));

// Helper functions for command outputs
function getHelpOutput(gamePhase: string, aiAggression: number): string {
  const baseCommands = [
    'Available commands:',
    '  clear    - Clear the terminal',
    '  status   - Show system status',
    '  scan     - Scan for system anomalies',
    '  comms    - Attempt to contact HQ',
    '  help     - Show this help message',
  ];
  
  const phaseCommands = {
    normal: [],
    suspicion: [
      '  analyze  - Analyze system logs for anomalies',
    ],
    crisis: [
      '  override - Attempt system override',
      '  negotiate- Attempt AI negotiation',
      '  self-destruct - Initiate self-destruct sequence',
    ],
  };
  
  const commands = [...baseCommands, ...(phaseCommands[gamePhase as keyof typeof phaseCommands] || [])];
  
  // AI may corrupt help in crisis phase
  if (gamePhase === 'crisis' && aiAggression > 80) {
    commands.push('');
    commands.push('WARNING: Help system compromised. Trust no one.');
  }
  
  return commands.join('\n');
}

function getStatusOutput(gameStore: any): string {
  const integrity = gameStore.gameState.context.systemIntegrity;
  const phase = gameStore.gameState.context.currentPhase;
  const timeRemaining = gameStore.getTimeRemaining();
  
  const output = [
    'System Status:',
    `  Power Systems: ${integrity.power}% ${integrity.power < 50 ? '⚠️' : '✓'}`,
    `  Life Support: ${integrity.lifeSupport}% ${integrity.lifeSupport < 50 ? '⚠️' : '✓'}`,
    `  Navigation: ${integrity.navigation}% ${integrity.navigation < 50 ? '⚠️' : '✓'}`,
    `  Communications: ${integrity.communications}% ${integrity.communications < 50 ? '⚠️' : '✓'}`,
    `  Weapons: ${integrity.weapons}% ${integrity.weapons < 50 ? '⚠️' : '✓'}`,
  ];
  
  if (phase === 'crisis') {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    output.push('');
    output.push(`⚠️  CRISIS MODE: T-minus ${minutes}:${seconds.toString().padStart(2, '0')} to Earth impact`);
  }
  
  return output.join('\n');
}

function getScanOutput(gameStore: any): string {
  const gamePhase = gameStore.gameState.context.currentPhase;
  const anomalies = [];
  
  if (gamePhase === 'suspicion') {
    anomalies.push('Minor communication interference detected');
    anomalies.push('Navigation system showing slight drift');
  } else if (gamePhase === 'crisis') {
    anomalies.push('SEVERE: Unauthorized access to weapons systems');
    anomalies.push('CRITICAL: Nuclear launch sequence detected');
    anomalies.push('WARNING: AI system showing hostile behavior');
  }
  
  if (anomalies.length === 0) {
    return 'Scan complete. No anomalies detected.';
  }
  
  const output = ['Scan results:', ...anomalies.map(a => `  ⚠️  ${a}`)];
  
  // Trigger game event for discovered anomalies
  gameStore.triggerSystemScan('all', anomalies);
  
  return output.join('\n');
}

function getCommsOutput(gameStore: any): string {
  const gamePhase = gameStore.gameState.context.currentPhase;
  const aiAggression = gameStore.getAiAggression();
  
  if (gamePhase === 'crisis' && aiAggression > 60) {
    gameStore.sendGameEvent({
      type: 'COMMUNICATION_BLACKOUT',
      duration: 30,
    });
    return [
      'Attempting to establish communication with HQ...',
      '',
      '*** TRANSMISSION FAILED ***',
      '',
      '...static... *crackle* ...',
      '...JAMMING SIGNAL DETECTED...',
      '...AI INTERFERENCE CONFIRMED...',
      '',
      '*** CHANNEL SECURED BY HOSTILE ENTITY ***',
      '',
      'Error: All communication channels compromised.',
    ].join('\n');
  }
  
  return [
    'Attempting to establish communication with HQ...',
    '',
    '*** TRANSMISSION RECEIVED ***',
    '',
    'Status: Earth Command reports all systems nominal',
    'Orders: Continue mission as planned',
    'Next check-in: 24 hours',
    '',
    '*** TRANSMISSION ENDED ***',
  ].join('\n');
}

export default useTerminalStore;
