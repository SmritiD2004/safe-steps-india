export type MoveDirection = 'left' | 'right' | 'up' | 'down' | 'center';

export interface DefenseMove {
  id: string;
  name: string;
  icon: string;
  instruction: string;
  direction: MoveDirection;
  cameraAction: string; // what the camera detects
  tapZone: 'top' | 'bottom' | 'left' | 'right' | 'center';
  unlockLevel: number;
  points: number;
  category: 'basic' | 'intermediate' | 'advanced';
}

export interface GameLevel {
  id: number;
  name: string;
  description: string;
  icon: string;
  moves: string[]; // move IDs available
  totalRounds: number;
  timePerMove: number; // ms to react
  minScoreToPass: number;
  requiredLevel: number; // player level needed
  comboChains: boolean;
  maxCombo: number;
}

export const defenseMoves: DefenseMove[] = [
  // Basic moves (Level 1+)
  {
    id: 'block',
    name: 'Block',
    icon: '🛡️',
    instruction: 'Raise your hands to block!',
    direction: 'up',
    cameraAction: 'Raise both hands above shoulders',
    tapZone: 'top',
    unlockLevel: 1,
    points: 10,
    category: 'basic',
  },
  {
    id: 'dodge-left',
    name: 'Dodge Left',
    icon: '⬅️',
    instruction: 'Lean left to dodge!',
    direction: 'left',
    cameraAction: 'Lean your body to the left',
    tapZone: 'left',
    unlockLevel: 1,
    points: 10,
    category: 'basic',
  },
  {
    id: 'dodge-right',
    name: 'Dodge Right',
    icon: '➡️',
    instruction: 'Lean right to dodge!',
    direction: 'right',
    cameraAction: 'Lean your body to the right',
    tapZone: 'right',
    unlockLevel: 1,
    points: 10,
    category: 'basic',
  },
  {
    id: 'step-back',
    name: 'Step Back',
    icon: '🦶',
    instruction: 'Step back to create distance!',
    direction: 'down',
    cameraAction: 'Move backward away from camera',
    tapZone: 'bottom',
    unlockLevel: 2,
    points: 15,
    category: 'basic',
  },

  // Intermediate moves (Level 3+)
  {
    id: 'strike',
    name: 'Palm Strike',
    icon: '✋',
    instruction: 'Push forward with your palm!',
    direction: 'center',
    cameraAction: 'Push hand toward camera quickly',
    tapZone: 'center',
    unlockLevel: 3,
    points: 20,
    category: 'intermediate',
  },
  {
    id: 'push-away',
    name: 'Push Away',
    icon: '🤚',
    instruction: 'Push out with both hands!',
    direction: 'up',
    cameraAction: 'Extend both arms forward',
    tapZone: 'top',
    unlockLevel: 3,
    points: 20,
    category: 'intermediate',
  },
  {
    id: 'power-stance',
    name: 'Power Stance',
    icon: '🧍‍♀️',
    instruction: 'Ground yourself in a power stance!',
    direction: 'down',
    cameraAction: 'Widen your stance, lower center',
    tapZone: 'bottom',
    unlockLevel: 4,
    points: 20,
    category: 'intermediate',
  },

  // Advanced moves (Level 5+)
  {
    id: 'escape-left',
    name: 'Escape Left',
    icon: '🏃‍♀️',
    instruction: 'Quick escape to the left!',
    direction: 'left',
    cameraAction: 'Move sharply to the left',
    tapZone: 'left',
    unlockLevel: 5,
    points: 25,
    category: 'advanced',
  },
  {
    id: 'escape-right',
    name: 'Escape Right',
    icon: '🏃‍♀️',
    instruction: 'Quick escape to the right!',
    direction: 'right',
    cameraAction: 'Move sharply to the right',
    tapZone: 'right',
    unlockLevel: 5,
    points: 25,
    category: 'advanced',
  },
  {
    id: 'shout',
    name: 'Voice Projection',
    icon: '📢',
    instruction: 'SHOUT to project your voice!',
    direction: 'center',
    cameraAction: 'Open mouth wide and project voice',
    tapZone: 'center',
    unlockLevel: 6,
    points: 30,
    category: 'advanced',
  },
];

export const gameLevels: GameLevel[] = [
  {
    id: 1,
    name: 'Awareness Awakening',
    description: 'Learn the basics: blocking and dodging. Take your time — awareness starts here.',
    icon: '🌸',
    moves: ['block', 'dodge-left', 'dodge-right'],
    totalRounds: 8,
    timePerMove: 3000,
    minScoreToPass: 50,
    requiredLevel: 1,
    comboChains: false,
    maxCombo: 1,
  },
  {
    id: 2,
    name: 'Quick Reflexes',
    description: 'Add stepping back to your toolkit. Speed increases — stay sharp!',
    icon: '⚡',
    moves: ['block', 'dodge-left', 'dodge-right', 'step-back'],
    totalRounds: 10,
    timePerMove: 2500,
    minScoreToPass: 60,
    requiredLevel: 1,
    comboChains: false,
    maxCombo: 1,
  },
  {
    id: 3,
    name: 'Stand Your Ground',
    description: 'Learn to strike and push back. Sometimes defense means standing firm.',
    icon: '💪',
    moves: ['block', 'dodge-left', 'dodge-right', 'step-back', 'strike', 'push-away'],
    totalRounds: 12,
    timePerMove: 2200,
    minScoreToPass: 65,
    requiredLevel: 1,
    comboChains: false,
    maxCombo: 1,
  },
  {
    id: 4,
    name: 'Fight or Flight',
    description: 'Master the power stance and decide: stand your ground or escape.',
    icon: '🔥',
    moves: ['block', 'dodge-left', 'dodge-right', 'strike', 'push-away', 'power-stance'],
    totalRounds: 14,
    timePerMove: 2000,
    minScoreToPass: 70,
    requiredLevel: 1,
    comboChains: true,
    maxCombo: 2,
  },
  {
    id: 5,
    name: 'Escape Artist',
    description: 'Practice escape maneuvers. Know when to run — it\'s the smartest defense.',
    icon: '🦋',
    moves: ['dodge-left', 'dodge-right', 'step-back', 'escape-left', 'escape-right', 'strike'],
    totalRounds: 14,
    timePerMove: 1800,
    minScoreToPass: 70,
    requiredLevel: 1,
    comboChains: true,
    maxCombo: 2,
  },
  {
    id: 6,
    name: 'Voice of Power',
    description: 'Your voice is your weapon. Learn to project confidence and command attention.',
    icon: '📢',
    moves: ['block', 'strike', 'push-away', 'shout', 'power-stance', 'escape-left', 'escape-right'],
    totalRounds: 16,
    timePerMove: 1600,
    minScoreToPass: 75,
    requiredLevel: 1,
    comboChains: true,
    maxCombo: 3,
  },
  {
    id: 7,
    name: 'Confidence Master',
    description: 'The ultimate challenge. All moves, fastest speed. Show your full potential!',
    icon: '👑',
    moves: ['block', 'dodge-left', 'dodge-right', 'step-back', 'strike', 'push-away', 'power-stance', 'escape-left', 'escape-right', 'shout'],
    totalRounds: 20,
    timePerMove: 1400,
    minScoreToPass: 80,
    requiredLevel: 1,
    comboChains: true,
    maxCombo: 3,
  },
];

export const getMovesForLevel = (levelId: number): DefenseMove[] => {
  const level = gameLevels.find((l) => l.id === levelId);
  if (!level) return [];
  return level.moves
    .map((mId) => defenseMoves.find((m) => m.id === mId))
    .filter(Boolean) as DefenseMove[];
};
