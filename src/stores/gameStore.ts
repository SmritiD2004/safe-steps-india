import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
}

export interface ScenarioResult {
  scenarioId: string;
  score: number;
  maxScore: number;
  choices: string[];
  completedAt: string;
}

export interface PlayerState {
  playerName: string;
  avatarEmoji: string;
  level: number;
  totalPoints: number;
  confidenceScore: number;
  scenarioResults: ScenarioResult[];
  badges: Badge[];
  completedScenarios: string[];
  knowledgeModulesRead: string[];
  setPlayerName: (name: string) => void;
  setAvatarEmoji: (emoji: string) => void;
  addPoints: (points: number) => void;
  adjustConfidence: (delta: number) => void;
  completeScenario: (result: ScenarioResult) => void;
  earnBadge: (badge: Badge) => void;
  markKnowledgeRead: (moduleId: string) => void;
  resetProgress: () => void;
}

const BADGES: Badge[] = [
  { id: 'first-step', name: 'First Step', description: 'Complete your first scenario', icon: '🌱' },
  { id: 'aware', name: 'Situationally Aware', description: 'Score 80%+ on a scenario', icon: '👁️' },
  { id: 'knowledge-seeker', name: 'Knowledge Seeker', description: 'Read 3 safety modules', icon: '📚' },
  { id: 'confident', name: 'Growing Confidence', description: 'Reach confidence score of 70', icon: '💪' },
  { id: 'protector', name: 'Self-Protector', description: 'Complete 3 scenarios', icon: '🛡️' },
  { id: 'champion', name: 'Safety Champion', description: 'Earn 500 total points', icon: '🏆' },
];

export const useGameStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      playerName: '',
      avatarEmoji: '👩',
      level: 1,
      totalPoints: 0,
      confidenceScore: 30,
      scenarioResults: [],
      badges: [],
      completedScenarios: [],
      knowledgeModulesRead: [],

      setPlayerName: (name) => set({ playerName: name }),
      setAvatarEmoji: (emoji) => set({ avatarEmoji: emoji }),

      addPoints: (points) => {
        const newTotal = get().totalPoints + points;
        const newLevel = Math.floor(newTotal / 100) + 1;
        set({ totalPoints: newTotal, level: newLevel });
        if (newTotal >= 500 && !get().badges.find(b => b.id === 'champion')) {
          get().earnBadge({ ...BADGES.find(b => b.id === 'champion')!, earnedAt: new Date().toISOString() });
        }
      },

      adjustConfidence: (delta) => {
        const newScore = Math.max(0, Math.min(100, get().confidenceScore + delta));
        set({ confidenceScore: newScore });
        if (newScore >= 70 && !get().badges.find(b => b.id === 'confident')) {
          get().earnBadge({ ...BADGES.find(b => b.id === 'confident')!, earnedAt: new Date().toISOString() });
        }
      },

      completeScenario: (result) => {
        const state = get();
        const newResults = [...state.scenarioResults, result];
        const newCompleted = [...new Set([...state.completedScenarios, result.scenarioId])];
        set({ scenarioResults: newResults, completedScenarios: newCompleted });

        // Badge checks
        if (newCompleted.length === 1 && !state.badges.find(b => b.id === 'first-step')) {
          get().earnBadge({ ...BADGES.find(b => b.id === 'first-step')!, earnedAt: new Date().toISOString() });
        }
        if (newCompleted.length >= 3 && !state.badges.find(b => b.id === 'protector')) {
          get().earnBadge({ ...BADGES.find(b => b.id === 'protector')!, earnedAt: new Date().toISOString() });
        }
        if (result.score / result.maxScore >= 0.8 && !state.badges.find(b => b.id === 'aware')) {
          get().earnBadge({ ...BADGES.find(b => b.id === 'aware')!, earnedAt: new Date().toISOString() });
        }
      },

      earnBadge: (badge) => {
        set((s) => ({ badges: [...s.badges, badge] }));
      },

      markKnowledgeRead: (moduleId) => {
        const state = get();
        if (state.knowledgeModulesRead.includes(moduleId)) return;
        const newRead = [...state.knowledgeModulesRead, moduleId];
        set({ knowledgeModulesRead: newRead });
        if (newRead.length >= 3 && !state.badges.find(b => b.id === 'knowledge-seeker')) {
          get().earnBadge({ ...BADGES.find(b => b.id === 'knowledge-seeker')!, earnedAt: new Date().toISOString() });
        }
      },

      resetProgress: () => set({
        level: 1,
        totalPoints: 0,
        confidenceScore: 30,
        scenarioResults: [],
        badges: [],
        completedScenarios: [],
        knowledgeModulesRead: [],
      }),
    }),
    { name: 'safepath-game-store' }
  )
);

export { BADGES };
