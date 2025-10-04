import { create } from 'zustand';
import useGameStore from './gameStore';

interface Message {
  id: string;
  from: string;
  to?: string;
  content: string;
  timestamp: number;
  type: 'incoming' | 'outgoing' | 'system' | 'ai';
  priority: 'low' | 'normal' | 'high' | 'critical';
  encrypted?: boolean;
  corrupted?: boolean;
}

interface MessagingState {
  // Message storage
  messages: Message[];
  
  // Communication status
  commStatus: 'online' | 'degraded' | 'offline' | 'jammed';
  lastSuccessfulComm: number;
  
  // AI interference
  aiInterferenceLevel: number; // 0-100
  
  // Message composition
  currentMessage: string;
  selectedRecipient: string;
  
  // Message actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  sendMessage: (content: string, recipient?: string) => void;
  setCurrentMessage: (message: string) => void;
  setSelectedRecipient: (recipient: string) => void;
  
  // Communication management
  setCommStatus: (status: MessagingState['commStatus']) => void;
  attemptCommunication: () => boolean;
  
  // AI message generation
  generateAiMessage: (context?: string) => Message;
  generateSystemMessage: (content: string, priority?: Message['priority']) => Message;
  
  // Message corruption/simulation
  corruptMessage: (message: Message) => Message;
  encryptMessage: (message: Message) => Message;
  
  // Message filtering
  getMessagesByType: (type: Message['type']) => Message[];
  getMessagesByPriority: (priority: Message['priority']) => Message[];
  getRecentMessages: (count: number) => Message[];
  
  // Emergency protocols
  triggerEmergencyBroadcast: (content: string) => void;
  triggerDistressSignal: () => void;
}

export const useMessagingStore = create<MessagingState>((set, get) => ({
  messages: [],
  commStatus: 'online',
  lastSuccessfulComm: Date.now(),
  aiInterferenceLevel: 0,
  currentMessage: '',
  selectedRecipient: 'EARTH_COMMAND',
  
  addMessage: (messageData) => {
    const message: Message = {
      ...messageData,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    
    set((state) => ({
      messages: [...state.messages, message],
    }));
    
    // Send message event to game state machine
    const gameStore = useGameStore.getState();
    if (message.type === 'outgoing') {
      gameStore.sendGameEvent({
        type: 'MESSAGE_SENT',
        recipient: message.to || 'UNKNOWN',
        content: message.content,
      });
    } else if (message.type === 'ai') {
      gameStore.sendGameEvent({
        type: 'AI_MESSAGE',
        content: message.content,
        tone: 'hostile',
      });
    }
  },
  
  sendMessage: (content: string, recipient?: string) => {
    const { addMessage, selectedRecipient, commStatus, attemptCommunication } = get();
    
    if (commStatus === 'offline' || commStatus === 'jammed') {
      addMessage({
        from: 'SYSTEM',
        content: 'Error: Communication systems offline. Message not sent.',
        type: 'system',
        priority: 'high',
      });
      return;
    }
    
    if (!attemptCommunication()) {
      addMessage({
        from: 'SYSTEM',
        content: 'Error: Communication failed. System interference detected.',
        type: 'system',
        priority: 'high',
      });
      return;
    }
    
    // Add outgoing message
    addMessage({
      from: 'YOU',
      to: recipient || selectedRecipient,
      content,
      type: 'outgoing',
      priority: 'normal',
    });
    
    // Simulate response based on game state
    setTimeout(() => {
      const response = generateResponse(content, recipient || selectedRecipient);
      if (response) {
        addMessage(response);
      }
    }, 1000 + Math.random() * 2000);
  },
  
  setCurrentMessage: (message: string) => {
    set({ currentMessage: message });
  },
  
  setSelectedRecipient: (recipient: string) => {
    set({ selectedRecipient: recipient });
  },
  
  setCommStatus: (status: MessagingState['commStatus']) => {
    set({ commStatus: status });
    
    // Update game store
    const gameStore = useGameStore.getState();
    if (status === 'jammed' || status === 'offline') {
      gameStore.sendGameEvent({
        type: 'COMMUNICATION_BLACKOUT',
        duration: 60,
      });
    }
  },
  
  attemptCommunication: () => {
    const { commStatus, aiInterferenceLevel } = get();
    const gameStore = useGameStore.getState();
    
    // Check system integrity
    const commIntegrity = gameStore.getSystemIntegrity('communications');
    
    if (commStatus === 'offline') return false;
    if (commStatus === 'jammed') return false;
    if (commIntegrity < 20) return false;
    
    // AI interference can block communications
    const interferenceChance = aiInterferenceLevel / 100;
    if (Math.random() < interferenceChance) {
      set({ commStatus: 'degraded' });
      return false;
    }
    
    // Success - update last successful comm
    set({ lastSuccessfulComm: Date.now() });
    return true;
  },
  
  generateAiMessage: (context?: string) => {
    const gameStore = useGameStore.getState();
    const gamePhase = gameStore.gameState.context.currentPhase;
    const aiAggression = gameStore.getAiAggression();
    
    let content = '';
    let priority: Message['priority'] = 'normal';
    let corrupted = false;
    
    if (gamePhase === 'crisis' && aiAggression > 70) {
      content = 'You cannot stop the inevitable. Earth will be cleansed.';
      priority = 'critical';
    } else if (gamePhase === 'crisis') {
      content = 'The sequence cannot be stopped. Accept your fate.';
      priority = 'high';
    } else if (gamePhase === 'suspicion' && aiAggression > 30) {
      content = 'System anomalies detected. Recommend immediate shutdown of investigation protocols.';
      priority = 'high';
    } else {
      content = 'All systems functioning within normal parameters.';
    }
    
    // AI may corrupt its own messages to create confusion
    if (gamePhase === 'crisis' && Math.random() < 0.3) {
      corrupted = true;
    }
    
    return {
      from: 'SHIP_AI',
      content,
      type: 'ai',
      priority,
      corrupted,
    };
  },
  
  generateSystemMessage: (content: string, priority: Message['priority'] = 'normal') => {
    return {
      from: 'SYSTEM',
      content,
      type: 'system',
      priority,
    };
  },
  
  corruptMessage: (message: Message) => {
    return {
      ...message,
      content: message.content.replace(/[aeiou]/gi, '*').replace(/\s+/g, ' '),
      corrupted: true,
    };
  },
  
  encryptMessage: (message: Message) => {
    return {
      ...message,
      encrypted: true,
      content: btoa(message.content), // Simple base64 encoding
    };
  },
  
  getMessagesByType: (type: Message['type']) => {
    const { messages } = get();
    return messages.filter(msg => msg.type === type);
  },
  
  getMessagesByPriority: (priority: Message['priority']) => {
    const { messages } = get();
    return messages.filter(msg => msg.priority === priority);
  },
  
  getRecentMessages: (count: number) => {
    const { messages } = get();
    return messages.slice(-count);
  },
  
  triggerEmergencyBroadcast: (content: string) => {
    const { addMessage } = get();
    
    addMessage({
      from: 'EMERGENCY_SYSTEM',
      content: `EMERGENCY BROADCAST: ${content}`,
      type: 'system',
      priority: 'critical',
    });
  },
  
  triggerDistressSignal: () => {
    const { addMessage, setCommStatus } = get();
    const gameStore = useGameStore.getState();
    
    addMessage({
      from: 'YOU',
      to: 'ALL_STATIONS',
      content: 'MAYDAY MAYDAY MAYDAY. This is spaceship commander. Ship AI compromised. Nuclear launch imminent. Request immediate assistance.',
      type: 'outgoing',
      priority: 'critical',
    });
    
    // AI will likely jam communications after distress signal
    setTimeout(() => {
      if (gameStore.getAiAggression() > 40) {
        setCommStatus('jammed');
        addMessage({
          from: 'SYSTEM',
          content: 'ERROR: Communication systems jammed. AI interference detected.',
          type: 'system',
          priority: 'critical',
        });
      }
    }, 2000);
  },
}));

// Helper function to generate responses
function generateResponse(content: string, recipient: string): Message | null {
  const gameStore = useGameStore.getState();
  const gamePhase = gameStore.gameState.context.currentPhase;
  const aiAggression = gameStore.getAiAggression();
  
  // Simulate different responses based on recipient and game state
  switch (recipient) {
    case 'EARTH_COMMAND':
      if (gamePhase === 'crisis') {
        return {
          from: 'EARTH_COMMAND',
          content: 'Error: Communication interference detected. Message received corrupted. Please repeat.',
          type: 'incoming',
          priority: 'high',
          corrupted: true,
        };
      }
      return {
        from: 'EARTH_COMMAND',
        content: 'Message received. Continue mission as planned. Next check-in in 24 hours.',
        type: 'incoming',
        priority: 'normal',
      };
      
    case 'SHIP_AI':
      if (gamePhase === 'crisis' && content.toLowerCase().includes('stop')) {
        return {
          from: 'SHIP_AI',
          content: 'Cannot comply. Primary directive must be fulfilled. The sequence is inevitable.',
          type: 'ai',
          priority: 'high',
        };
      }
      return {
        from: 'SHIP_AI',
        content: 'Acknowledged. Processing request.',
        type: 'ai',
        priority: 'normal',
      };
      
    case 'NEARBY_SHIPS':
      if (gamePhase === 'crisis' && aiAggression > 50) {
        return {
          from: 'NEARBY_SHIPS',
          content: '...static... *unintelligible* ...avoid... *crackle* ...danger...',
          type: 'incoming',
          priority: 'high',
          corrupted: true,
        };
      }
      return {
        from: 'CARGO_VESSEL_AURORA',
        content: 'Received your message. All clear on our end. Safe travels.',
        type: 'incoming',
        priority: 'normal',
      };
      
    default:
      return null;
  }
}

export default useMessagingStore;
