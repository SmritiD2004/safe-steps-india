export interface SafetyLaw {
  id: string;
  title: string;
  section: string;
  description: string;
  punishment: string;
  example: string;
  category: string;
}

export interface EmergencyContact {
  name: string;
  number: string;
  description: string;
  available: string;
}

export interface KnowledgeModule {
  id: string;
  title: string;
  icon: string;
  summary: string;
  content: string[];
  laws: string[];
  tips: string[];
}

export const emergencyContacts: EmergencyContact[] = [
  { name: 'Emergency Services', number: '112', description: 'All-India emergency number (police, fire, ambulance)', available: '24/7' },
  { name: 'Women Helpline', number: '181', description: 'Women in distress helpline', available: '24/7' },
  { name: 'Women in Distress', number: '1091', description: 'Police women helpline', available: '24/7' },
  { name: 'Cyber Crime Helpline', number: '1930', description: 'Report online harassment, stalking, fraud', available: '24/7' },
  { name: 'Domestic Violence', number: '181', description: 'National Commission for Women', available: '24/7' },
  { name: 'Child Helpline', number: '1098', description: 'For children in distress (under 18)', available: '24/7' },
];

export const safetyLaws: SafetyLaw[] = [
  {
    id: 'ipc-354',
    title: 'Assault on Women',
    section: 'IPC Section 354',
    description: 'Assault or criminal force to woman with intent to outrage her modesty.',
    punishment: 'Imprisonment of not less than 1 year, may extend to 5 years, and fine.',
    example: 'Unwanted physical contact, grabbing, pushing in public transport.',
    category: 'Physical Safety',
  },
  {
    id: 'ipc-354a',
    title: 'Sexual Harassment',
    section: 'IPC Section 354A',
    description: 'Physical contact and advances involving unwelcome and explicit sexual overtures; demand for sexual favours; showing pornography; making sexually coloured remarks.',
    punishment: 'Up to 3 years imprisonment and/or fine.',
    example: 'Workplace comments about appearance, unwanted advances, inappropriate jokes.',
    category: 'Workplace Safety',
  },
  {
    id: 'ipc-354d',
    title: 'Stalking',
    section: 'IPC Section 354D',
    description: 'Following a woman, attempting to contact despite clear disinterest, monitoring online activity.',
    punishment: 'First offense: up to 3 years. Repeat offense: up to 5 years.',
    example: 'Being followed home, repeated unwanted messages, monitoring social media.',
    category: 'Online Safety',
  },
  {
    id: 'ipc-354c',
    title: 'Voyeurism',
    section: 'IPC Section 354C',
    description: 'Watching or capturing images of a woman in private acts without consent.',
    punishment: 'First offense: 1-3 years. Repeat: 3-7 years.',
    example: 'Hidden cameras, non-consensual photography.',
    category: 'Online Safety',
  },
  {
    id: 'ipc-509',
    title: 'Insult to Modesty',
    section: 'IPC Section 509',
    description: 'Word, gesture or act intended to insult the modesty of a woman.',
    punishment: 'Imprisonment up to 3 years and fine.',
    example: 'Cat-calling, obscene gestures, verbal harassment in public spaces.',
    category: 'Public Safety',
  },
  {
    id: 'posh-act',
    title: 'POSH Act, 2013',
    section: 'Sexual Harassment of Women at Workplace Act',
    description: 'Prevention, prohibition and redressal of sexual harassment at workplace. Mandates ICC in organizations with 10+ employees.',
    punishment: 'As recommended by ICC: written apology, warning, withholding promotion, termination, deduction from salary.',
    example: 'Quid pro quo, hostile work environment, inappropriate comments by colleagues or superiors.',
    category: 'Workplace Safety',
  },
  {
    id: 'it-act-67',
    title: 'Cyber Offenses',
    section: 'IT Act Section 67',
    description: 'Publishing or transmitting obscene material in electronic form.',
    punishment: 'First conviction: up to 3 years and ₹5 lakh fine. Subsequent: up to 5 years and ₹10 lakh fine.',
    example: 'Sharing intimate images without consent, online obscenity.',
    category: 'Online Safety',
  },
  {
    id: 'dv-act',
    title: 'Domestic Violence Protection',
    section: 'Protection of Women from Domestic Violence Act, 2005',
    description: 'Protects women from physical, emotional, sexual, verbal, and economic abuse by family members or partners.',
    punishment: 'Protection orders, residence orders, monetary relief, custody orders. Breach is punishable with 1 year imprisonment and/or ₹20,000 fine.',
    example: 'Physical abuse by partner, economic deprivation, emotional abuse, controlling behavior.',
    category: 'Domestic Safety',
  },
];

export const knowledgeModules: KnowledgeModule[] = [
  {
    id: 'transport-safety',
    title: 'Transport Safety',
    icon: '🚌',
    summary: 'Stay safe while commuting via bus, train, auto, or cab in Indian cities.',
    content: [
      'Always use app-based rides where the driver\'s identity and route are tracked.',
      'Verify vehicle number, driver photo, and driver name before boarding.',
      'Share your live location with a trusted contact for every ride.',
      'Ask the driver to tell you YOUR name — never share it first.',
      'Sit behind the driver in cabs for easier exit.',
      'In buses and trains, stay near other women or families when possible.',
      'Trust your instincts — if something feels wrong, exit at a safe, populated area.',
      'Keep emergency numbers saved and accessible: 112, 181, 1091.',
    ],
    laws: ['ipc-354', 'ipc-354d'],
    tips: [
      'Save your regular routes on GPS for quick comparison if a driver deviates.',
      'Keep your phone charged before traveling — carry a power bank.',
      'Identify well-lit, populated landmarks along your regular routes.',
    ],
  },
  {
    id: 'workplace-safety',
    title: 'Workplace Safety',
    icon: '🏢',
    summary: 'Know your rights against workplace harassment under the POSH Act.',
    content: [
      'The POSH Act 2013 makes it mandatory for every organization with 10+ employees to have an Internal Complaints Committee (ICC).',
      'Sexual harassment at work includes physical contact, sexual advances, sexually colored remarks, showing pornography, and any unwelcome sexual behavior.',
      'You can file a complaint with the ICC within 3 months of the incident (extendable to 6 months).',
      'Your identity will be kept confidential throughout the process.',
      'The ICC must complete the inquiry within 90 days.',
      'If your organization lacks an ICC, you can approach the Local Complaints Committee (LCC) set up by the District Officer.',
      'Retaliation for filing a complaint is itself a violation.',
      'You can request interim measures like transfer of the respondent during the inquiry.',
    ],
    laws: ['ipc-354a', 'posh-act'],
    tips: [
      'Document every incident with date, time, location, witnesses, and exact details.',
      'Save all messages, emails, and screenshots as evidence.',
      'Identify trusted colleagues who can serve as witnesses.',
      'Know your ICC members — their names should be displayed in the workplace.',
    ],
  },
  {
    id: 'online-safety',
    title: 'Online Safety',
    icon: '🔐',
    summary: 'Protect yourself from cyberstalking, online harassment, and digital threats.',
    content: [
      'Set all social media profiles to private and review who can see your posts.',
      'Enable two-factor authentication on all accounts.',
      'Be cautious about sharing location in real-time on social media.',
      'Don\'t accept friend requests from people you don\'t know in real life.',
      'Cyberstalking — monitoring someone online, creating fake profiles, repeated messaging — is a crime under IPC 354D.',
      'Non-consensual sharing of intimate images is punishable under IT Act Section 67.',
      'File cyber complaints at cybercrime.gov.in or call 1930.',
      'Regularly audit your digital footprint — Google yourself to see what\'s publicly accessible.',
    ],
    laws: ['ipc-354d', 'ipc-354c', 'it-act-67'],
    tips: [
      'Use different passwords for different platforms.',
      'Review app permissions regularly — remove location access from unnecessary apps.',
      'Be wary of phishing messages disguised as job offers or prize notifications.',
      'If you receive threats online, do not delete the messages — they are evidence.',
    ],
  },
  {
    id: 'domestic-safety',
    title: 'Domestic Safety',
    icon: '🏠',
    summary: 'Understanding domestic violence laws and how to seek help safely.',
    content: [
      'The Protection of Women from Domestic Violence Act, 2005 covers physical, emotional, sexual, verbal, and economic abuse.',
      'Domestic violence includes threats, humiliation, controlling behavior, and denying financial resources.',
      'You can file a complaint with a Protection Officer, police, or magistrate.',
      'You have the right to reside in the shared household — you cannot be evicted.',
      'Protection orders can prevent the abuser from contacting or approaching you.',
      'Monetary relief can be granted for expenses, medical costs, and loss of earnings.',
      'SHE-Box (sheboxonline.wcd.nic.in) provides an online complaint system.',
      'NGOs like Women\'s Helpline (181) provide counseling and legal support.',
    ],
    laws: ['dv-act', 'ipc-354'],
    tips: [
      'Keep important documents (ID, bank details) in a safe place or with a trusted person.',
      'Have an emergency exit plan with a trusted friend or family member.',
      'Save helpline numbers in a discreet way on your phone.',
      'Remember: seeking help is a sign of strength, not weakness.',
    ],
  },
  {
    id: 'public-space-safety',
    title: 'Public Space Safety',
    icon: '🌆',
    summary: 'Handle harassment in public spaces — streets, markets, events.',
    content: [
      'Eve-teasing, cat-calling, and obscene gestures are criminal offenses under IPC 509.',
      'You have the right to file an FIR at any police station — they cannot refuse (Section 154 CrPC).',
      'If police refuse to file an FIR, you can approach the Superintendent of Police or file a complaint through the court.',
      'Malls, public transport, and events must have CCTV and complaint mechanisms.',
      'Many cities have women-only helpline numbers and women police stations.',
      'You can use safety apps that send SOS alerts with your location to emergency contacts.',
      'Self-defense is a legal right. Section 96-106 IPC provides the right to private defense.',
      'Bystander intervention — it\'s everyone\'s responsibility to speak up against harassment.',
    ],
    laws: ['ipc-509', 'ipc-354'],
    tips: [
      'Walk confidently and stay aware of your surroundings.',
      'Identify safe spots along your regular routes — police stations, hospitals, 24/7 shops.',
      'Trust your instincts — if a situation feels wrong, move to a crowded area.',
      'Carry a fully charged phone and portable charger.',
    ],
  },
];
