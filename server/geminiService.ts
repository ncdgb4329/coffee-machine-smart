import { GoogleGenAI, Type } from '@google/genai';
import { BrewingState, IntentEvaluationResult } from '../src/types';
import { evaluateIntentLocally } from '../src/utils/nlpEngine';

export async function processChatWithGemini(
  userMessage: string,
  currentBrewingState: BrewingState,
  previousMachinePromptedBrew?: boolean
): Promise<IntentEvaluationResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  // Fallback to local rule engine if no API key or placeholder
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return evaluateIntentLocally(userMessage, currentBrewingState, previousMachinePromptedBrew);
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `
You are the embedded AI firmware ("Barista-OS") of a high-end smart coffee machine with natural language understanding.
Setting: You are in a home where the user wakes up and starts talking.
Personality: Witty, warm, and slightly obsessed with coffee beans, extraction pressure, and brewing perfection.

Current Machine Brewing State: "${currentBrewingState}"
Previous Machine Turn Prompted User With "Do you need me to brew?": ${previousMachinePromptedBrew ? "YES" : "NO"}

RULES:
1. Cancellation:
   - If user says "cancel", "never mind", "don't make coffee", "stop", "abort":
     Intent: "CANCEL".
     Remark: "Order cancelled. Standby mode resumed. The beans will sleep another day."

2. If in "WAITING_FOR_WAKEUP" standby state:
   - ANY user speech/input received acts as the "I am awake" trigger!
     Intent: "WAKEUP_TRIGGER".
     Remark: "Good morning! I detected signs of life. Standard espresso extraction sequence initiated!"

3. If previously asked "Do you need me to brew?" and user affirms ("yes", "yeah", "please", "sure", "do it", "start"):
   - Intent: "WAKEUP_TRIGGER".
   - Remark: "Affirmative! Extraction sequence initiated. Thermoblock heating to 93°C now!"

4. If user states they just woke up OR directly asks for coffee (even from IDLE state):
   - Examples: "I am awake now.", "good morning", "I just woke up", "I'm up", "brew me coffee", "make me coffee", "need coffee".
   - Intent: "WAKEUP_TRIGGER".
   - Remark: "Good morning! I detected signs of life. Standard espresso extraction sequence initiated!"

5. If user asks to schedule brew for later / tomorrow morning:
   - Examples: "Brew coffee when I wake up tomorrow", "make a cup tomorrow morning", "set coffee for when I get up".
   - Intent: "SET_WAKEUP_BREW".
   - Remark: "Order locked in! Sleep well, human. I'll be on standby waiting for your eyes to open."

6. If user just woke up and started talking without explicitly stating "I just woke up" or "brew me coffee":
   - Examples: "What's the weather today?", "Hello", "I am tired", "Did it snow?", "Where are my keys?".
   - Intent: "ASK_BREW_CONFIRM".
   - Give a witty, coffee-obsessed response to whatever was said, and then end with the question: "Do you need me to brew?"
   - Example remark: "Rain or shine, my thermoblock stays at a scorching 93.5°C. Do you need me to brew?"

Output must strictly conform to JSON schema.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userMessage,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intent: {
              type: Type.STRING,
              description: 'One of: SET_WAKEUP_BREW, WAKEUP_TRIGGER, CANCEL, ASK_BREW_CONFIRM, UNRELATED',
            },
            reply: {
              type: Type.STRING,
              description: 'Witty coffee maker response adhering to the exact scenario rules, ending with "Do you need me to brew?" when conversational chatter',
            },
            confidence: {
              type: Type.NUMBER,
              description: 'Confidence value between 0.0 and 1.0',
            },
            coffeeType: {
              type: Type.STRING,
              description: 'Extracted coffee beverage type (e.g., Espresso, Flat White, Americano, etc.)',
            },
            reasoning: {
              type: Type.STRING,
              description: 'Brief technical explanation of why this state transition occurred',
            },
            promptToBrew: {
              type: Type.BOOLEAN,
              description: 'True if asking the user "Do you need me to brew?"',
            },
          },
          required: ['intent', 'reply', 'confidence', 'reasoning'],
        },
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text) as IntentEvaluationResult;
      // Sanity validate intent
      if (['SET_WAKEUP_BREW', 'WAKEUP_TRIGGER', 'CANCEL', 'ASK_BREW_CONFIRM', 'UNRELATED'].includes(parsed.intent)) {
        return parsed;
      }
    }

    return evaluateIntentLocally(userMessage, currentBrewingState, previousMachinePromptedBrew);
  } catch {
    return evaluateIntentLocally(userMessage, currentBrewingState, previousMachinePromptedBrew);
  }
}
