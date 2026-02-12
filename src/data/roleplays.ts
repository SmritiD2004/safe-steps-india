export interface DialogueResponse {
  id: string;
  text: string;
  emotionalIntelligence: {
    empathy: number;      // -10 to +10
    assertiveness: number; // -10 to +10
    awareness: number;     // -10 to +10
    composure: number;     // -10 to +10
  };
  npcReaction: string;
  npcEmotion: 'grateful' | 'neutral' | 'uncomfortable' | 'upset' | 'relieved' | 'supportive';
  nextNodeId?: string;
  points: number;
}

export interface DialogueNode {
  id: string;
  speaker: 'npc' | 'narrator';
  speakerName?: string;
  speakerEmoji?: string;
  text: string;
  context: string;
  responses: DialogueResponse[];
  isEnding?: boolean;
  endingSummary?: string;
  endingType?: 'empowered' | 'supportive' | 'missed-opportunity';
  lawReference?: string;
}

export interface RolePlay {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  setting: string;
  npcName: string;
  npcEmoji: string;
  nodes: Record<string, DialogueNode>;
  startNodeId: string;
  maxEIScore: number;
  maxPoints: number;
}

export const roleplays: RolePlay[] = [
  {
    id: 'friend-in-trouble',
    title: 'A Friend Reaches Out',
    description: 'Your college friend confides that she\'s being stalked by an ex. Navigate this sensitive conversation with empathy and helpful guidance.',
    category: 'Supporting Others',
    icon: '💬',
    difficulty: 'beginner',
    setting: 'College canteen in Delhi',
    npcName: 'Meera',
    npcEmoji: '👩‍🎓',
    maxEIScore: 40,
    maxPoints: 120,
    startNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        speaker: 'npc',
        speakerName: 'Meera',
        speakerEmoji: '👩‍🎓',
        text: '"Hey... can I talk to you about something? I don\'t know who else to tell. My ex, Vikram, keeps showing up outside my hostel. He messages me 50 times a day. I blocked him but he made new accounts..."',
        context: 'Meera looks anxious, fidgeting with her dupatta. She seems scared but also embarrassed.',
        responses: [
          {
            id: 'listen-first',
            text: '"I\'m really glad you told me, Meera. That sounds incredibly stressful. Take your time — I\'m here to listen."',
            emotionalIntelligence: { empathy: 8, assertiveness: 2, awareness: 5, composure: 7 },
            npcReaction: 'Meera\'s shoulders relax slightly. She takes a deep breath and continues sharing.',
            npcEmotion: 'relieved',
            nextNodeId: 'opened-up',
            points: 30,
          },
          {
            id: 'jump-to-action',
            text: '"Oh my god, you need to go to the police right now! Why haven\'t you filed a complaint yet?"',
            emotionalIntelligence: { empathy: -2, assertiveness: 8, awareness: 3, composure: -3 },
            npcReaction: 'Meera flinches and looks down. "I... I was afraid people would judge me for dating him in the first place..."',
            npcEmotion: 'uncomfortable',
            nextNodeId: 'defensive',
            points: 10,
          },
          {
            id: 'minimize',
            text: '"Are you sure you\'re not overreacting? Maybe he just misses you. Boys can be like that."',
            emotionalIntelligence: { empathy: -8, assertiveness: -2, awareness: -5, composure: 3 },
            npcReaction: 'Meera\'s eyes fill with tears. "I knew nobody would understand..." She starts to close off.',
            npcEmotion: 'upset',
            nextNodeId: 'closed-off',
            points: 0,
          },
        ],
      },
      'opened-up': {
        id: 'opened-up',
        speaker: 'npc',
        speakerName: 'Meera',
        speakerEmoji: '👩‍🎓',
        text: '"He even followed me to my part-time job last week. The security guard noticed and asked him to leave, but he came back the next day. I feel like I can\'t go anywhere safely anymore."',
        context: 'Meera is opening up more, trusting you with details. She seems scared but also relieved to finally share.',
        responses: [
          {
            id: 'validate-inform',
            text: '"What you\'re describing is stalking, Meera, and it\'s a crime under Section 354D. You\'re not overreacting at all. Would you like to know what options you have?"',
            emotionalIntelligence: { empathy: 7, assertiveness: 6, awareness: 9, composure: 8 },
            npcReaction: '"It\'s... actually a crime? I didn\'t know there was a specific law for this. Yes, tell me more."',
            npcEmotion: 'relieved',
            nextNodeId: 'informed-options',
            points: 30,
          },
          {
            id: 'offer-help',
            text: '"That\'s really scary. You shouldn\'t have to deal with this alone. Can I walk with you to places for a while? And maybe we can figure out a safety plan together?"',
            emotionalIntelligence: { empathy: 9, assertiveness: 4, awareness: 5, composure: 6 },
            npcReaction: '"You\'d really do that? That means so much to me. But I think I need something more permanent..."',
            npcEmotion: 'grateful',
            nextNodeId: 'informed-options',
            points: 25,
          },
          {
            id: 'confront-him',
            text: '"I\'ll talk to Vikram myself. He needs to know this isn\'t okay."',
            emotionalIntelligence: { empathy: 3, assertiveness: 7, awareness: -3, composure: -2 },
            npcReaction: '"No, please don\'t! That might make things worse. He can get really aggressive..."',
            npcEmotion: 'uncomfortable',
            nextNodeId: 'informed-options',
            points: 10,
          },
        ],
      },
      'defensive': {
        id: 'defensive',
        speaker: 'npc',
        speakerName: 'Meera',
        speakerEmoji: '👩‍🎓',
        text: '"I\'m scared of going to the police. What if they don\'t believe me? What if Vikram finds out and gets angrier? I just... I needed someone to understand."',
        context: 'Meera seems hesitant now. Your earlier reaction made her second-guess telling you.',
        responses: [
          {
            id: 'course-correct',
            text: '"I\'m sorry, Meera. I didn\'t mean to pressure you. Your feelings are completely valid. Let\'s talk about what YOU feel comfortable doing first."',
            emotionalIntelligence: { empathy: 8, assertiveness: 3, awareness: 7, composure: 6 },
            npcReaction: 'Meera looks up, some trust restored. "Thank you. I think I just need to know my options..."',
            npcEmotion: 'relieved',
            nextNodeId: 'informed-options',
            points: 25,
          },
          {
            id: 'insist-police',
            text: '"But seriously, the police is the only real solution. You have to file an FIR."',
            emotionalIntelligence: { empathy: -3, assertiveness: 8, awareness: 2, composure: -1 },
            npcReaction: '"Maybe... maybe I shouldn\'t have brought this up." Meera pulls back.',
            npcEmotion: 'upset',
            nextNodeId: 'missed-ending',
            points: 5,
          },
        ],
      },
      'closed-off': {
        id: 'closed-off',
        speaker: 'npc',
        speakerName: 'Meera',
        speakerEmoji: '👩‍🎓',
        text: '"Forget I said anything. It\'s not a big deal." Meera starts gathering her things to leave.',
        context: 'Meera is shutting down. This is a crucial moment to reconnect.',
        responses: [
          {
            id: 'apologize-reconnect',
            text: '"Wait, Meera. I\'m sorry — that was dismissive of me. What you\'re going through IS a big deal, and I want to help. Please, sit down."',
            emotionalIntelligence: { empathy: 9, assertiveness: 5, awareness: 8, composure: 7 },
            npcReaction: 'Meera pauses, then slowly sits back down. "Do you really mean that?"',
            npcEmotion: 'relieved',
            nextNodeId: 'informed-options',
            points: 20,
          },
          {
            id: 'let-go',
            text: '"Okay, if you say so. Let me know if you need anything."',
            emotionalIntelligence: { empathy: -5, assertiveness: -3, awareness: -6, composure: 2 },
            npcReaction: 'Meera walks away. She doesn\'t bring it up again and distances herself from you.',
            npcEmotion: 'upset',
            nextNodeId: 'missed-ending',
            points: 0,
          },
        ],
      },
      'informed-options': {
        id: 'informed-options',
        speaker: 'narrator',
        text: 'You explain to Meera that under IPC Section 354D, stalking is punishable with up to 3 years imprisonment. She can file a complaint at any police station, and they cannot refuse to register it. You also share the Women Helpline number 181.',
        context: 'Meera is listening carefully, taking it all in.',
        responses: [
          {
            id: 'empower-choice',
            text: '"These are your options, Meera. Whatever you decide, I\'ll support you. You don\'t have to do anything right now — but know that you have rights and people who care."',
            emotionalIntelligence: { empathy: 9, assertiveness: 5, awareness: 8, composure: 9 },
            npcReaction: '"Thank you. I think... I want to call that helpline first. Will you be there when I do?"',
            npcEmotion: 'grateful',
            nextNodeId: 'empowered-ending',
            points: 30,
          },
          {
            id: 'plan-together',
            text: '"Let\'s make a safety plan together. We can document everything, tell the hostel warden, and you can decide about filing a complaint when you\'re ready."',
            emotionalIntelligence: { empathy: 7, assertiveness: 7, awareness: 8, composure: 7 },
            npcReaction: '"A plan... yes, that makes me feel more in control. Let\'s do that."',
            npcEmotion: 'supportive',
            nextNodeId: 'supportive-ending',
            points: 25,
          },
        ],
      },
      'empowered-ending': {
        id: 'empowered-ending',
        speaker: 'narrator',
        text: 'Meera calls the Women Helpline (181) with you beside her. The counselor is supportive and guides her through her options. Meera decides to file a complaint. Over the next weeks, with support from the hostel administration and police, the stalking stops. Meera tells you: "You were the first person who made me feel like I wasn\'t crazy for being scared."',
        context: 'Resolution — Meera gets help and feels empowered.',
        isEnding: true,
        endingType: 'empowered',
        endingSummary: 'You showed exceptional emotional intelligence — listening without judgment, validating feelings, sharing knowledge, and empowering Meera to make her own choices. This is the gold standard for supporting someone in crisis.',
        lawReference: 'IPC Section 354D: Stalking is punishable with up to 3 years imprisonment on first conviction. Cyberstalking falls under IT Act Section 67. An FIR cannot be refused by police (Section 154 CrPC). Women Helpline: 181.',
        responses: [],
      },
      'supportive-ending': {
        id: 'supportive-ending',
        speaker: 'narrator',
        text: 'You and Meera create a detailed safety plan. She documents all incidents, the hostel warden is informed, and security is tightened. Meera gradually feels more in control. She later decides to file a formal complaint with confidence.',
        context: 'Resolution — Meera has a support system and a plan.',
        isEnding: true,
        endingType: 'supportive',
        endingSummary: 'You provided strong practical support and helped Meera feel in control. Creating a safety plan together is an excellent way to support someone facing harassment.',
        lawReference: 'Under Section 354D IPC, stalking is a cognizable offense. The victim can also seek a protection order under DV Act, 2005 if applicable. File cybercrime complaints at cybercrime.gov.in.',
        responses: [],
      },
      'missed-ending': {
        id: 'missed-ending',
        speaker: 'narrator',
        text: 'Meera doesn\'t reach out again. Weeks later, you hear from another friend that the situation escalated before Meera finally got help from a counselor. She\'s safe now, but the delay in support made things harder for her.',
        context: 'Resolution — Meera eventually gets help, but the conversation could have gone better.',
        isEnding: true,
        endingType: 'missed-opportunity',
        endingSummary: 'This was a learning moment. When someone confides in you, the first response matters enormously. Listening without judgment, validating their experience, and offering informed options can make a life-changing difference.',
        lawReference: 'Remember: Stalking is a crime (IPC 354D). If someone confides in you, believe them first. Share helpline numbers: 181 (Women Helpline), 1091 (Women in Distress), 112 (Emergency).',
        responses: [],
      },
    },
  },
  {
    id: 'workplace-confrontation',
    title: 'The Office Confrontation',
    description: 'A male colleague makes an inappropriate joke in a meeting. Navigate the situation with emotional intelligence.',
    category: 'Workplace Communication',
    icon: '🏢',
    difficulty: 'intermediate',
    setting: 'Conference room at an IT company in Pune',
    npcName: 'Colleague Group',
    npcEmoji: '👥',
    maxEIScore: 40,
    maxPoints: 120,
    startNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        speaker: 'narrator',
        text: 'During a team meeting, your colleague Rohit makes a "joke" about women not understanding technical architecture. A few people laugh uncomfortably. Your manager stays silent. You notice Priya, a junior developer, looking visibly hurt.',
        context: 'Team meeting with 8 people. Rohit is a senior developer. Your manager Sunita is present but didn\'t react.',
        responses: [
          {
            id: 'address-calmly',
            text: '"Rohit, I don\'t think that\'s accurate or appropriate. Women contribute significantly to tech architecture — including people in this room."',
            emotionalIntelligence: { empathy: 5, assertiveness: 9, awareness: 8, composure: 8 },
            npcReaction: 'The room goes quiet. Rohit looks surprised. "I was just joking, don\'t be so sensitive." Priya looks at you with gratitude.',
            npcEmotion: 'neutral',
            nextNodeId: 'pushback',
            points: 30,
          },
          {
            id: 'check-priya',
            text: 'You make eye contact with Priya and give her a reassuring look. After the meeting, you approach her privately.',
            emotionalIntelligence: { empathy: 9, assertiveness: 3, awareness: 7, composure: 7 },
            npcReaction: 'Priya looks relieved that someone noticed. After the meeting, she says: "Thank you for checking on me. That comment really bothered me."',
            npcEmotion: 'grateful',
            nextNodeId: 'private-support',
            points: 25,
          },
          {
            id: 'laugh-along',
            text: 'Laugh politely to avoid confrontation and continue with the meeting agenda.',
            emotionalIntelligence: { empathy: -5, assertiveness: -7, awareness: -3, composure: 5 },
            npcReaction: 'The meeting continues. Rohit feels emboldened. Priya disengages from the discussion entirely.',
            npcEmotion: 'upset',
            nextNodeId: 'missed-workplace',
            points: 0,
          },
        ],
      },
      'pushback': {
        id: 'pushback',
        speaker: 'npc',
        speakerName: 'Rohit',
        speakerEmoji: '🧑‍💻',
        text: '"Come on, it was just a joke. Why does everything have to be so politically correct these days? I didn\'t mean anything by it."',
        context: 'Rohit is defensive. Others are watching to see how this plays out. Your manager is still silent.',
        responses: [
          {
            id: 'firm-professional',
            text: '"Intent doesn\'t erase impact, Rohit. Under POSH guidelines, such comments can constitute harassment. Let\'s maintain a professional environment for everyone."',
            emotionalIntelligence: { empathy: 4, assertiveness: 9, awareness: 9, composure: 9 },
            npcReaction: 'Rohit goes quiet. Sunita (manager) finally speaks: "That\'s a fair point. Let\'s be mindful of our language in professional settings."',
            npcEmotion: 'neutral',
            nextNodeId: 'empowered-workplace',
            points: 30,
          },
          {
            id: 'redirect-constructive',
            text: '"I\'m sure you didn\'t mean harm. But let\'s focus on making sure everyone on the team feels valued. Priya, would you like to share your thoughts on the architecture?"',
            emotionalIntelligence: { empathy: 7, assertiveness: 6, awareness: 8, composure: 9 },
            npcReaction: 'The tension eases. Priya, surprised but pleased, shares her ideas confidently. The meeting gets back on track.',
            npcEmotion: 'supportive',
            nextNodeId: 'supportive-workplace',
            points: 25,
          },
        ],
      },
      'private-support': {
        id: 'private-support',
        speaker: 'npc',
        speakerName: 'Priya',
        speakerEmoji: '👩‍💻',
        text: '"It\'s not the first time he\'s said something like that. Last week he told me I got the project because of \'diversity hiring.\' I don\'t know if I should report it..."',
        context: 'A quiet corner after the meeting. Priya is confiding in you.',
        responses: [
          {
            id: 'inform-empower',
            text: '"That\'s definitely not okay, Priya. The POSH Act covers exactly this kind of behavior. You have the right to file with the ICC. Would you like me to tell you more about the process?"',
            emotionalIntelligence: { empathy: 7, assertiveness: 7, awareness: 9, composure: 8 },
            npcReaction: '"There\'s actually a law for this? Yes, please tell me more. I want to know my options."',
            npcEmotion: 'relieved',
            nextNodeId: 'empowered-workplace',
            points: 30,
          },
          {
            id: 'document-together',
            text: '"Let\'s start by documenting every incident — dates, what was said, who was present. That way, if you decide to report, you have strong evidence."',
            emotionalIntelligence: { empathy: 6, assertiveness: 6, awareness: 8, composure: 8 },
            npcReaction: '"That\'s smart. I\'ve been keeping some messages but I didn\'t think to document the verbal stuff. Will you help me?"',
            npcEmotion: 'grateful',
            nextNodeId: 'supportive-workplace',
            points: 25,
          },
        ],
      },
      'empowered-workplace': {
        id: 'empowered-workplace',
        speaker: 'narrator',
        text: 'Your intervention set a new tone. The team becomes more conscious of inclusive language. Priya gains confidence and later presents her architecture design, which is well-received. The manager schedules a POSH awareness session for the team.',
        context: 'Positive workplace change initiated by your actions.',
        isEnding: true,
        endingType: 'empowered',
        endingSummary: 'You demonstrated excellent emotional intelligence — balancing assertiveness with professionalism, citing legal awareness, and creating space for others. Your actions improved the entire team dynamic.',
        lawReference: 'Under POSH Act 2013, sexual harassment includes sexually colored remarks, unwelcome comments, and hostile work environment. Every organization with 10+ employees must have an ICC. Complaints must be resolved within 90 days.',
        responses: [],
      },
      'supportive-workplace': {
        id: 'supportive-workplace',
        speaker: 'narrator',
        text: 'While the immediate situation wasn\'t addressed publicly, your private support empowers Priya. She documents the incidents and later approaches the ICC with a well-documented case. She credits your guidance as the turning point.',
        context: 'Priya takes action with your support.',
        isEnding: true,
        endingType: 'supportive',
        endingSummary: 'You provided valuable support behind the scenes. While addressing harassment publicly is ideal, supporting someone privately is also powerful. Your knowledge of POSH Act helped Priya take informed action.',
        lawReference: 'POSH Act makes it mandatory for employers to provide a safe working environment. Retaliation against a complainant is prohibited. The ICC must include an external member.',
        responses: [],
      },
      'missed-workplace': {
        id: 'missed-workplace',
        speaker: 'narrator',
        text: 'The meeting continues as if nothing happened. Rohit\'s comments become more frequent. Priya eventually requests a team transfer, and the toxic dynamic persists. Months later, Priya mentions she wishes someone had spoken up.',
        context: 'The silence was interpreted as acceptance.',
        isEnding: true,
        endingType: 'missed-opportunity',
        endingSummary: 'Staying silent in the face of inappropriate behavior can unintentionally normalize it. Being an upstander — someone who speaks up — creates safer spaces for everyone. It takes practice, and that\'s what this mode is for.',
        lawReference: 'Under POSH Act, bystanders can support complaints. Everyone has a role in maintaining a harassment-free workplace. If you witness harassment, you can support the affected person in documenting and reporting.',
        responses: [],
      },
    },
  },
  {
    id: 'online-pressure',
    title: 'Digital Boundaries',
    description: 'Someone you met online is pressuring you to share personal photos. Practice setting digital boundaries with emotional intelligence.',
    category: 'Digital Safety',
    icon: '📱',
    difficulty: 'advanced',
    setting: 'Online messaging conversation',
    npcName: 'Arjun',
    npcEmoji: '🧑',
    maxEIScore: 40,
    maxPoints: 120,
    startNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        speaker: 'npc',
        speakerName: 'Arjun',
        speakerEmoji: '🧑',
        text: '"Hey, we\'ve been talking for 2 months now 😊 I really feel a connection. I sent you my photos — would you send me some too? Just between us, I promise."',
        context: 'You met Arjun on a social media platform 2 months ago. He\'s been friendly and attentive. This is the first time he\'s asked for personal photos.',
        responses: [
          {
            id: 'firm-boundary',
            text: '"I enjoy our conversations, but I\'m not comfortable sharing personal photos online. That\'s a boundary I keep for my own safety."',
            emotionalIntelligence: { empathy: 5, assertiveness: 9, awareness: 8, composure: 9 },
            npcReaction: '"Come on, don\'t you trust me? I thought we had something special. I wouldn\'t ask if I didn\'t care about you."',
            npcEmotion: 'uncomfortable',
            nextNodeId: 'guilt-trip',
            points: 30,
          },
          {
            id: 'deflect',
            text: '"Haha, maybe later! Let\'s talk about something else 😅"',
            emotionalIntelligence: { empathy: 3, assertiveness: -2, awareness: 2, composure: 4 },
            npcReaction: '"Later? Like when? I feel like you don\'t trust me. I shared mine first to show I trust you..."',
            npcEmotion: 'uncomfortable',
            nextNodeId: 'guilt-trip',
            points: 10,
          },
          {
            id: 'ask-why',
            text: '"Why is sharing photos so important to you? We can know each other through conversations."',
            emotionalIntelligence: { empathy: 6, assertiveness: 6, awareness: 7, composure: 7 },
            npcReaction: '"I just want to feel closer to you. Everyone does this — it\'s normal. Don\'t you want to take this forward?"',
            npcEmotion: 'neutral',
            nextNodeId: 'guilt-trip',
            points: 20,
          },
        ],
      },
      'guilt-trip': {
        id: 'guilt-trip',
        speaker: 'npc',
        speakerName: 'Arjun',
        speakerEmoji: '🧑',
        text: '"If you really cared about me, you\'d trust me with this. I\'ve told you so many personal things. Are you saying all of that meant nothing? Maybe this isn\'t going to work if you can\'t even do this one thing..."',
        context: 'Classic emotional manipulation — guilt-tripping, conditional affection, and ultimatum. Red flags are present.',
        responses: [
          {
            id: 'recognize-manipulation',
            text: '"Arjun, someone who truly cares wouldn\'t pressure me or make me feel guilty for having boundaries. That\'s a red flag for me. I need to step back from this conversation."',
            emotionalIntelligence: { empathy: 4, assertiveness: 10, awareness: 10, composure: 9 },
            npcReaction: '"Wow, you\'re really going to throw this away over nothing? Fine, your loss." He becomes hostile, confirming the red flag.',
            npcEmotion: 'upset',
            nextNodeId: 'empowered-digital',
            points: 30,
          },
          {
            id: 'seek-advice',
            text: '"I need to think about this. Let me talk to a friend first." You screenshot the conversation and share it with a trusted friend.',
            emotionalIntelligence: { empathy: 5, assertiveness: 5, awareness: 8, composure: 7 },
            npcReaction: '"Why do you need to involve others? This is between us. Don\'t share our private conversations."',
            npcEmotion: 'uncomfortable',
            nextNodeId: 'supported-digital',
            points: 25,
          },
          {
            id: 'give-in-partially',
            text: '"Okay, maybe just one normal photo... just my face, nothing else."',
            emotionalIntelligence: { empathy: 2, assertiveness: -5, awareness: -3, composure: -2 },
            npcReaction: '"See, that wasn\'t so hard! Now how about a few more? Maybe something a bit more personal?"',
            npcEmotion: 'neutral',
            nextNodeId: 'escalation-digital',
            points: 5,
          },
        ],
      },
      'escalation-digital': {
        id: 'escalation-digital',
        speaker: 'narrator',
        text: 'The requests escalate. Once a small boundary is crossed, the pressure increases. This is a common pattern in online grooming and image-based abuse.',
        context: 'Critical learning moment about escalation patterns.',
        responses: [
          {
            id: 'stop-now',
            text: '"I\'m not comfortable with this anymore. I shouldn\'t have sent that photo. I\'m going to block you now."',
            emotionalIntelligence: { empathy: 3, assertiveness: 8, awareness: 7, composure: 6 },
            npcReaction: '"If you block me, I\'ll share what you already sent. Think carefully."',
            npcEmotion: 'upset',
            nextNodeId: 'threat-response',
            points: 20,
          },
          {
            id: 'report-immediately',
            text: 'Screenshot everything, block him, and report the profile. Then reach out to cybercrime.gov.in.',
            emotionalIntelligence: { empathy: 3, assertiveness: 9, awareness: 9, composure: 8 },
            npcReaction: 'Arjun is blocked and reported. His threatening behavior is now documented.',
            npcEmotion: 'neutral',
            nextNodeId: 'supported-digital',
            points: 25,
          },
        ],
      },
      'threat-response': {
        id: 'threat-response',
        speaker: 'narrator',
        text: 'Threatening to share someone\'s images is a criminal offense under IT Act Section 67 and IPC Section 354C (voyeurism). You have legal options.',
        context: 'Important legal knowledge about image-based abuse.',
        responses: [
          {
            id: 'take-action',
            text: 'Screenshot the threats, block him, report to cybercrime.gov.in, and inform a trusted adult.',
            emotionalIntelligence: { empathy: 3, assertiveness: 9, awareness: 10, composure: 8 },
            npcReaction: 'You take decisive action. The threats are documented as evidence for a potential cybercrime complaint.',
            npcEmotion: 'neutral',
            nextNodeId: 'supported-digital',
            points: 30,
          },
        ],
      },
      'empowered-digital': {
        id: 'empowered-digital',
        speaker: 'narrator',
        text: 'You block Arjun and report his profile. You recognize the manipulation pattern: love-bombing → building trust → testing boundaries → guilt-tripping → threatening. This awareness will protect you in future interactions.',
        context: 'You identified and shut down a manipulation attempt.',
        isEnding: true,
        endingType: 'empowered',
        endingSummary: 'Outstanding emotional intelligence! You recognized guilt-tripping and manipulation, held your boundary firmly, and prioritized your safety. You understand that genuine connection never requires sacrificing your boundaries.',
        lawReference: 'IT Act Section 67: Publishing obscene material is punishable with up to 5 years. IPC 354C: Voyeurism is punishable with up to 3 years. Non-consensual sharing of intimate images is a cybercrime. Report at cybercrime.gov.in or call 1930 (Cyber Crime Helpline).',
        responses: [],
      },
      'supported-digital': {
        id: 'supported-digital',
        speaker: 'narrator',
        text: 'With support from your friend and proper documentation, you handle the situation effectively. The screenshots serve as evidence. You learn about cybercrime reporting and feel more confident about setting digital boundaries.',
        context: 'Resolved with support and documentation.',
        isEnding: true,
        endingType: 'supportive',
        endingSummary: 'You sought help and documented evidence — both crucial steps. Remember: sharing screenshots with trusted people is NOT a betrayal of privacy when someone is manipulating you. Your safety always comes first.',
        lawReference: 'File cybercrime complaints at cybercrime.gov.in or call 1930. Under IT Act, sharing intimate images without consent is punishable. The Cyber Crime Helpline (1930) operates 24/7.',
        responses: [],
      },
    },
  },
];
