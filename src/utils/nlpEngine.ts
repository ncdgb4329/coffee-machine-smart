import { BrewingState, IntentEvaluationResult, IntentType } from '../types';

/**
 * Deterministic Natural Language Understanding (NLU) rule engine for Smart Coffee Simulator.
 * Dynamically evaluates intent when waking up, starting conversation, or setting schedules.
 */

// Cancellation patterns
const CANCEL_PATTERNS = [
  /\b(cancel|stop|abort|halt|never\s*mind|don'?t\s*make|no\s*coffee|forget\s*it|dismiss|scratch\s*that|disarm)\b/i,
  /\b(change\s*my\s*mind|skip\s*it|turned\s*off)\b/i
];

// CLEAR awakening and morning brew triggers:
// Expressions that clearly state the user is awake or directly requesting coffee right now
const CLEAR_WAKEUP_BREW_PATTERNS = [
  /\b(i\s*am\s*awake(\s*now)?|i'?m\s*awake(\s*now)?|awake\s*now|woke\s*up|just\s*woke\s*up|i\s*just\s*woke\s*up|waking\s*up\s*now)\b/i,
  /\b(good\s*morning|morning!*|morning\s*(barista|coffee|machine|everyone)?)\b/i,
  /\b(i'?m\s*up|i\s*am\s*up|finally\s*up|got\s*up|out\s*of\s*bed|just\s*got\s*out\s*of\s*bed|eyes\s*are\s*open|rise\s*and\s*shine)\b/i,
  /\b(brew\s*(me\s*)?(a\s*)?(coffee|espresso|cup|latte|cappuccino|caffeine)?(\s*please|\s*now)?)\b/i,
  /\b(make\s*(me\s*)?(a\s*)?(coffee|espresso|cup|latte)?(\s*please|\s*now)?)\b/i,
  /\b(start\s*brewing|pour\s*(me\s*)?a\s*cup|time\s*for\s*coffee|need\s*coffee|get\s*me\s*caffeine|i\s*need\s*my\s*coffee)\b/i,
  /\b(brew\s*now|make\s*it\s*now|espresso\s*now)\b/i
];

// Affirmative responses to "Do you need me to brew?"
const AFFIRMATIVE_BREW_PATTERNS = [
  /^(yes|yeah|yep|yup|sure|please|definitely|absolutely|do\s*it|make\s*it|brew\s*it|go\s*for\s*it|start|ok|okay|yes\s*please)$/i,
  /\b(yes\s*please|yeah\s*brew|yes\s*brew|do\s*brew|make\s*coffee|yes\s*i\s*do|yes\s*need|start\s*the\s*brew)\b/i
];

// Future / scheduled wake-up brew patterns (e.g. setting an alarm brew for later or tomorrow)
const SCHEDULED_WAKEUP_PATTERNS = [
  /\b(brew\s*coffee\s*when\s*i\s*wake\s*up|brew\s*when\s*i\s*wake\s*up)\b/i,
  /\b(make\s*(a\s*)?cup\s*tomorrow\s*morning|tomorrow\s*morning|in\s*the\s*morning)\b/i,
  /\b(first\s*thing\s*when\s*i'?m\s*up|first\s*thing\s*in\s*the\s*morning|when\s*i\s*get\s*up\s*tomorrow)\b/i,
  /\b(set\s*(a\s*)?brew\s*for\s*morning|schedule\s*(a\s*)?(coffee|brew|espresso))\b/i,
  /\b(when\s*my\s*alarm\s*goes\s*off|for\s*when\s*i\s*wake\s*up)\b/i
];

// Coffee beverage type extractor
export function extractCoffeeType(text: string): string {
  const normalized = text.toLowerCase();
  if (normalized.includes('double espresso')) return 'Double Espresso';
  if (normalized.includes('espresso')) return 'Espresso';
  if (normalized.includes('cappuccino')) return 'Cappuccino';
  if (normalized.includes('latte')) return 'Café Latte';
  if (normalized.includes('flat white')) return 'Flat White';
  if (normalized.includes('americano')) return 'Caffè Americano';
  if (normalized.includes('macchiato')) return 'Macchiato';
  if (normalized.includes('mocha')) return 'Mocha';
  if (normalized.includes('dark roast')) return 'Dark Roast Blend';
  if (normalized.includes('ristretto')) return 'Ristretto';
  if (normalized.includes('cold brew')) return 'Cold Brew';
  return 'Artisan Espresso';
}

/**
 * Evaluates the user input with respect to current brewing state and wake-up context.
 */
export function evaluateIntentLocally(
  rawInput: string,
  currentBrewingState: BrewingState,
  previousMachinePromptedBrew?: boolean
): IntentEvaluationResult {
  const text = rawInput.trim();
  const coffeeType = extractCoffeeType(text);

  // 1. Explicit cancellation check
  const isCancel = CANCEL_PATTERNS.some((pattern) => pattern.test(text));
  if (isCancel) {
    if (currentBrewingState === 'WAITING_FOR_WAKEUP' || currentBrewingState === 'BREWING') {
      return {
        intent: 'CANCEL',
        reply: 'Order cancelled. Standby mode resumed. The beans will sleep another day.',
        confidence: 0.99,
        coffeeType,
        reasoning: 'Explicit cancellation command received. Resetting hardware to idle.',
      };
    } else {
      return {
        intent: 'CANCEL',
        reply: 'No brew was currently in progress, but standby remains safely disarmed.',
        confidence: 0.95,
        coffeeType,
        reasoning: 'Cancellation received while already idle; system confirmed at rest.',
      };
    }
  }

  // 2. If the machine is already in WAITING_FOR_WAKEUP standby state:
  // "Any user input received after a wake-up brew has been requested acts as the 'I am awake' trigger."
  if (currentBrewingState === 'WAITING_FOR_WAKEUP') {
    const wakeUpReplies = [
      'Good morning! I detected signs of life. Standard espresso extraction sequence initiated!',
      `Vital signs verified! Commencing ${coffeeType} extraction sequence immediately. Rise and shine!`,
      `You're up! Boiler is pressurized at 9 BAR. Grinding premium beans right now!`,
      `Acoustic sensors picked up your voice! Fresh ${coffeeType} starting right now!`
    ];
    const reply = wakeUpReplies[Math.floor(Math.random() * wakeUpReplies.length)];

    return {
      intent: 'WAKEUP_TRIGGER',
      reply,
      confidence: 0.99,
      coffeeType,
      reasoning: 'User input received while in WAITING_FOR_WAKEUP standby. Initiating immediate brew sequence.',
    };
  }

  // 3. If currently brewing
  if (currentBrewingState === 'BREWING') {
    return {
      intent: 'UNRELATED',
      reply: 'Hold tight! I am currently in the middle of 9-bar high-pressure extraction. Do not distract the barista!',
      confidence: 0.9,
      coffeeType,
      reasoning: 'Machine is actively executing hydraulic extraction.',
    };
  }

  // 4. If coffee is already ready
  if (currentBrewingState === 'COFFEE_READY') {
    return {
      intent: 'UNRELATED',
      reply: 'Your fresh brew is already sitting on the warmer! Grab your mug before the crema settles.',
      confidence: 0.9,
      coffeeType,
      reasoning: 'Coffee is finished and awaiting pickup.',
    };
  }

  // 5. User affirms a previous prompt: "Do you need me to brew?"
  if (previousMachinePromptedBrew && AFFIRMATIVE_BREW_PATTERNS.some((p) => p.test(text))) {
    return {
      intent: 'WAKEUP_TRIGGER',
      reply: `Affirmative! Extraction sequence initiated for your ${coffeeType}. Thermoblock heating to 93°C now!`,
      confidence: 0.99,
      coffeeType,
      reasoning: 'User confirmed morning brew in response to machine inquiry.',
    };
  }

  // 6. User explicitly states they just woke up OR directly asks to brew coffee ("I am awake now", "good morning", "I just woke up", "brew me coffee", etc.)
  const isClearWakeUpOrBrew = CLEAR_WAKEUP_BREW_PATTERNS.some((pattern) => pattern.test(text));
  if (isClearWakeUpOrBrew) {
    const directReplies = [
      'Good morning! I detected signs of life. Standard espresso extraction sequence initiated!',
      `You're awake! Say no more. Commencing ${coffeeType} extraction sequence immediately!`,
      `Good morning! Acoustic sensors verified you're out of bed. 9-bar espresso extraction sequence initiated!`,
      `Freshly awakened human detected! Grinding premium beans for your ${coffeeType} right now.`
    ];
    return {
      intent: 'WAKEUP_TRIGGER',
      reply: directReplies[Math.floor(Math.random() * directReplies.length)],
      confidence: 0.98,
      coffeeType,
      reasoning: 'Clear awakening utterance or direct coffee command detected ("I am awake now" / "Good morning"). Initiating immediate brew.',
    };
  }

  // 7. Future wake-up brew schedule request ("Brew coffee when I wake up tomorrow", "make a cup tomorrow morning")
  const isScheduleRequest = SCHEDULED_WAKEUP_PATTERNS.some((pattern) => pattern.test(text));
  if (isScheduleRequest) {
    return {
      intent: 'SET_WAKEUP_BREW',
      reply: 'Order locked in! Sleep well, human. I\'ll be on standby waiting for your eyes to open.',
      confidence: 0.97,
      coffeeType,
      reasoning: 'Detected future wake-up brew scheduling. Box B armed to Standby / Waiting for Wake-Up.',
    };
  }

  // 8. General conversational chatter / user hypothetically just woke up and started talking
  // Rule: "unless it clearly states i just woke up or brew me coffee, witty response to whatever was said then question 'do you need me to brew?'"
  const conversationalResponses = [
    {
      match: /\b(weather|rain|sunny|cold|hot|temperature)\b/i,
      reply: `Rain or shine, my thermoblock stays at a scorching 93.5°C. Do you need me to brew?`,
    },
    {
      match: /\b(time|clock|hour|late|early)\b/i,
      reply: `According to my internal bean clock, it's peak extraction hour. Do you need me to brew?`,
    },
    {
      match: /\b(joke|funny|laugh)\b/i,
      reply: `Why did the coffee file a police report? It got mugged! Do you need me to brew?`,
    },
    {
      match: /\b(hello|hey|hi|yo)\b/i,
      reply: `Greetings, human! My sensors are registering morning presence. Do you need me to brew?`,
    },
    {
      match: /\b(tired|sleepy|yawn|exhausted)\b/i,
      reply: `I can hear the drowsiness in your vocal cords. A fresh ${coffeeType} solves that immediately. Do you need me to brew?`,
    },
  ];

  for (const item of conversationalResponses) {
    if (item.match.test(text)) {
      return {
        intent: 'ASK_BREW_CONFIRM',
        reply: item.reply,
        confidence: 0.94,
        coffeeType,
        reasoning: 'Morning conversation detected without explicit brew command. Replied wittily and asked "Do you need me to brew?".',
        promptToBrew: true,
      };
    }
  }

  // Default conversational fallback: Witty remark to whatever was said + question: "Do you need me to brew?"
  const fallbackReplies = [
    `Fascinating morning thought! But my neural network is calibrated for crema thickness and extraction yield. Do you need me to brew?`,
    `That's nice, but my main brain is 99% focused on roasting coffee beans. Do you need me to brew?`,
    `I hear you! Sounds like someone who could use a fresh jolt of specialty caffeine. Do you need me to brew?`,
    `Noted! My boiler is at pressure and beans are primed. Do you need me to brew?`
  ];

  return {
    intent: 'ASK_BREW_CONFIRM',
    reply: fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)],
    confidence: 0.92,
    coffeeType,
    reasoning: 'General morning speech detected. Responded with coffee persona and asked "Do you need me to brew?".',
    promptToBrew: true,
  };
}
