export interface Faction {
  id: string;
  name: string;
  description: string;
  motto: string;
  color: 'iron' | 'verdant' | 'ember';
  reputation: number; // -100 to 100
  traits: string[];
}

export interface DialogueChoice {
  id: string;
  text: string;
  effects: {
    factionId: string;
    reputationChange: number;
  }[];
  nextNodeId: string | null; // null = end scene (defaults to returning to the chapter hub)

  /**
   * Optional: transition the overall app scene after applying this choice.
   *
   * Used for things like "End of demo" exits.
   */
  nextScene?: GameState['currentScene'];

  /**
   * Marks a mutually-exclusive decision group.
   *
   * If the player has previously selected a different choice in the same group,
   * this choice becomes locked on revisit.
   */
  exclusiveGroup?: string;

  requiredReputation?: { factionId: string; min: number };
  requiresAllSecrets?: string[];
  requiresAnySecrets?: string[];

  /**
   * If true, the UI may omit this option entirely when it is locked due to missing secrets.
   *
   * Intended for “evidence-dependent” options where showing a locked button would be noisy.
   * (Example: multiple summit accusations that only appear once you have a specific proof.)
   */
  hideWhenLockedBySecrets?: boolean;

  /**
   * If set, the UI may omit this option when the player already knows any of these secrets.
   *
   * Intended to reduce redundant options once a “strictly better / more specific” alternative becomes available.
   * (Example: hide a generic summit compromise option once the player has the Greenmarch accord proof.)
   */
  hideWhenHasAnySecrets?: string[];

  revealsInfo?: string;
}

export interface DialogueNode {
  id: string;
  speaker: string;
  speakerFaction?: string;
  text: string;
  choices: DialogueChoice[];
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  triggered: boolean;
  triggerCondition?: {
    factionId: string;
    reputationThreshold: number;
    direction: 'above' | 'below';
  };
}

export type TradeRouteStatus = 'open' | 'embargoed' | 'raided';

export interface TradeRouteState {
  id: string;
  name: string;
  status: TradeRouteStatus;
  affectedFactions: string[];
  /**
   * Explicit endpoints for rendering and future route logic.
   * Optional for backward compatibility with older saves.
   */
  fromRegionId?: string;
  toRegionId?: string;
  embargoedBy?: string;
  untilTurn?: number;
}

export interface RegionState {
  id: string;
  name: string;
  control: string | 'neutral';
  contested?: boolean;
}

export interface WorldState {
  regions: Record<string, RegionState>;
  tradeRoutes: Record<string, TradeRouteState>;
  tensions: Record<string, Record<string, number>>;
  aiMemory: {
    lastOfferTurn: Record<string, number>;
    lastEmbargoTurn: Record<string, number>;
  };
  /** Optional for backward compatibility with older saves. */
  encounterMemory?: {
    lastSeenTurnByTemplateId: Record<string, number>;
    seenThisChapter: Record<string, boolean>;
  };
}

export type SecondaryEncounterKind = 'embargo' | 'raid' | 'skirmish' | 'summit';

export interface SecondaryEncounter {
  id: string;
  /** Optional for backward compatibility with older saves. */
  kind?: SecondaryEncounterKind;
  /** Optional for backward compatibility with older saves. */
  routeId?: string;
  /** Optional for backward compatibility with older saves. */
  regionId?: string;
  title: string;
  description: string;
  relatedFactions: string[];
  expiresOnTurn: number;
}

export interface PlayerProfile {
  name: string;
  pronouns: 'they/them' | 'she/her' | 'he/him';
  portraitId: string;
}

export interface ProjectInstance {
  id: string;
  templateId: string;
  title: string;
  description: string;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  startedTurn: number;
  remainingTurns: number;
}

export interface GameState {
  currentScene: 'title' | 'load' | 'create' | 'game';
  player: PlayerProfile;
  factions: Faction[];
  currentDialogue: DialogueNode | null;
  events: GameEvent[];
  knownSecrets: string[];
  /** Choice ids previously selected, used to prevent re-applying non-repeatable reputation effects. */
  selectedChoiceIds: string[];

  /** Optional: inkjs story state when an Ink-authored conversation is active. */
  ink?: { storyId: 'main'; stateJson: string } | null;

  /**
   * Increments for every player interaction (dialogue choices, end-turn, management actions).
   * Useful for deterministic ordering and debugging.
   */
  stepNumber: number;

  /** Advances only when the player ends the turn (world simulation tick). */
  turnNumber: number;

  chapterId: string;
  chapterTurn: number;
  milestones: string[];

  resources: Record<'coin' | 'influence' | 'supplies' | 'intel', number>;

  projects: ProjectInstance[];

  management: {
    apMax: number;
    apRemaining: number;
    actionsTakenThisTurn: string[];
    lastUsedTurnByActionId: Record<string, number>;
    usedThisChapter: Record<string, boolean>;
  };

  log: string[];
  rngSeed: number;
  world: WorldState;
  pendingEncounter: SecondaryEncounter | null;
}
