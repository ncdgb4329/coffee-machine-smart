export type SystemState = 'IDLE' | 'LISTENING_PROCESSING' | 'REPLYING';

export type BrewingState = 'IDLE' | 'WAITING_FOR_WAKEUP' | 'BREWING' | 'COFFEE_READY';

export type IntentType = 
  | 'SET_WAKEUP_BREW' 
  | 'WAKEUP_TRIGGER' 
  | 'CANCEL' 
  | 'ASK_BREW_CONFIRM'
  | 'UNRELATED';

export type FlowNodeId = 
  | 'user_input'
  | 'intent_classification'
  | 'wakeup_standby'
  | 'wakeup_trigger'
  | 'brewing_process'
  | 'completion'
  | 'cancel_branch'
  | 'unrelated_branch';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'machine';
  text: string;
  timestamp: string;
  intent?: IntentType;
  confidence?: number;
  coffeeType?: string;
  promptToBrew?: boolean;
}

export interface IntentEvaluationResult {
  intent: IntentType;
  reply: string;
  confidence: number;
  coffeeType?: string;
  reasoning: string;
  promptToBrew?: boolean;
}


export interface BrewingTelemetry {
  progress: number; // 0 to 100
  timeRemaining: number; // seconds
  waterTemp: number; // Celsius, e.g. 93.5
  pressureBars: number; // e.g. 9.0
  currentPhase: 'Grinding Fresh Beans' | 'Tamping & Pre-infusion' | '9-Bar Water Extraction' | 'Crema Development' | 'Extraction Complete';
}
