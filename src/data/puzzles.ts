export interface MatchPair {
  id: string;
  item: string;
  match: string;
}

export interface RedFlag {
  id: string;
  text: string;
  isRedFlag: boolean;
  explanation: string;
}

export interface Puzzle {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'matching' | 'red-flag';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  maxScore: number;
  timeLimit?: number;
  matchPairs?: MatchPair[];
  redFlags?: RedFlag[];
}

export const puzzles: Puzzle[] = [
  {
    id: 'safety-tools-matching',
    title: 'Safety Tools Match',
    description: 'Match each safety situation with the correct action or tool to use.',
    icon: '🧩',
    type: 'matching',
    difficulty: 'beginner',
    maxScore: 60,
    timeLimit: 90,
    matchPairs: [
      { id: 'm1', item: 'Stalking or being followed', match: 'Call 112 & enter a crowded place' },
      { id: 'm2', item: 'Workplace sexual harassment', match: 'File complaint with ICC (POSH Act)' },
      { id: 'm3', item: 'Receiving obscene messages online', match: 'Report under IT Act Section 67' },
      { id: 'm4', item: 'Domestic violence at home', match: 'Call 181 Women Helpline' },
      { id: 'm5', item: 'Unsafe auto-rickshaw ride', match: 'Share live location & note plate number' },
      { id: 'm6', item: 'Someone takes photos without consent', match: 'Report under IPC Section 354C (Voyeurism)' },
    ],
  },
  {
    id: 'transport-red-flags',
    title: 'Transport Red Flags',
    description: 'Identify which situations are red flags during public transport travel.',
    icon: '🚩',
    type: 'red-flag',
    difficulty: 'beginner',
    maxScore: 80,
    redFlags: [
      { id: 'rf1', text: 'Driver takes a different route than shown on GPS', isRedFlag: true, explanation: 'Route deviation is a major red flag. Always monitor your route on GPS and speak up immediately.' },
      { id: 'rf2', text: 'Driver asks you to confirm your name first', isRedFlag: true, explanation: 'The driver should tell YOU the passenger name. If they ask first, they might not be your assigned driver.' },
      { id: 'rf3', text: 'Vehicle number matches the app booking', isRedFlag: false, explanation: 'A matching vehicle number is a good sign — always verify this before getting in.' },
      { id: 'rf4', text: 'Auto-rickshaw has no visible registration plate', isRedFlag: true, explanation: 'Missing or covered registration plates are serious red flags. Never board such vehicles.' },
      { id: 'rf5', text: 'Driver has their ID card displayed on the dashboard', isRedFlag: false, explanation: 'A visible driver ID is a positive safety indicator.' },
      { id: 'rf6', text: 'The driver insists on not using the meter', isRedFlag: true, explanation: 'Refusing to use the meter is suspicious and may indicate an unlicensed driver.' },
      { id: 'rf7', text: 'Driver offers to take a "shortcut" through isolated lanes', isRedFlag: true, explanation: 'Shortcuts through deserted areas, especially at night, are red flags. Insist on main roads.' },
      { id: 'rf8', text: 'You share your live location with a trusted contact', isRedFlag: false, explanation: 'Sharing live location is one of the best safety practices for any commute.' },
    ],
  },
  {
    id: 'workplace-rights-matching',
    title: 'Know Your Workplace Rights',
    description: 'Match workplace situations with the correct legal protection or action.',
    icon: '⚖️',
    type: 'matching',
    difficulty: 'intermediate',
    maxScore: 60,
    timeLimit: 120,
    matchPairs: [
      { id: 'w1', item: 'Unwanted physical contact by a colleague', match: 'IPC Section 354 (Criminal Force)' },
      { id: 'w2', item: 'Sexually suggestive remarks in office', match: 'IPC Section 354A (Sexual Harassment)' },
      { id: 'w3', item: 'Employer retaliates after harassment complaint', match: 'POSH Act protection against victimization' },
      { id: 'w4', item: 'No Internal Complaints Committee at company', match: 'Approach Local Complaints Committee (LCC)' },
      { id: 'w5', item: 'Insult to modesty of a woman', match: 'IPC Section 509' },
      { id: 'w6', item: 'Demand for sexual favours for promotion', match: 'Quid pro quo harassment under POSH Act' },
    ],
  },
  {
    id: 'online-safety-red-flags',
    title: 'Online Safety Check',
    description: 'Spot the red flags in online interactions and digital safety situations.',
    icon: '💻',
    type: 'red-flag',
    difficulty: 'intermediate',
    maxScore: 80,
    redFlags: [
      { id: 'os1', text: 'Someone you met online insists on meeting at an isolated location', isRedFlag: true, explanation: 'Always meet in public, well-lit places. Insistence on isolation is a major warning sign.' },
      { id: 'os2', text: 'A stranger asks for your home address or workplace details', isRedFlag: true, explanation: 'Never share personal location details with people you don\'t know well. This information can be misused.' },
      { id: 'os3', text: 'You use strong, unique passwords for each account', isRedFlag: false, explanation: 'Using unique passwords is excellent digital hygiene and protects your accounts.' },
      { id: 'os4', text: 'Someone threatens to share your private photos', isRedFlag: true, explanation: 'This is a criminal offense under IPC 354C and IT Act Section 67. Report to cybercrime.gov.in immediately.' },
      { id: 'os5', text: 'A social media account with no photos follows you and sends DMs', isRedFlag: true, explanation: 'Anonymous accounts sending unsolicited messages are often used for harassment or catfishing.' },
      { id: 'os6', text: 'You enable two-factor authentication on your accounts', isRedFlag: false, explanation: 'Two-factor authentication significantly improves your account security.' },
      { id: 'os7', text: 'An "employer" asks for personal photos during an online job interview', isRedFlag: true, explanation: 'Legitimate employers never ask for personal photos. This is likely a scam or exploitation attempt.' },
      { id: 'os8', text: 'You review privacy settings on social media regularly', isRedFlag: false, explanation: 'Regularly reviewing privacy settings helps you control who sees your information.' },
    ],
  },
];
