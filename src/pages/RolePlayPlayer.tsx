import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { roleplays, type DialogueResponse } from '@/data/roleplays';
import { useGameStore } from '@/stores/gameStore';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MessageCircle, Shield, Home, RotateCcw, BookOpen, Heart, Zap, Eye, Brain } from 'lucide-react';

const npcEmotionConfig: Record<string, { label: string; color: string }> = {
  grateful: { label: 'Grateful', color: 'text-safe' },
  neutral: { label: 'Neutral', color: 'text-muted-foreground' },
  uncomfortable: { label: 'Uncomfortable', color: 'text-warning' },
  upset: { label: 'Upset', color: 'text-danger' },
  relieved: { label: 'Relieved', color: 'text-primary' },
  supportive: { label: 'Supportive', color: 'text-safe' },
};

const eiDimensions = [
  { key: 'empathy' as const, label: 'Empathy', icon: Heart, color: 'bg-pink-500' },
  { key: 'assertiveness' as const, label: 'Assertiveness', icon: Zap, color: 'bg-amber-500' },
  { key: 'awareness' as const, label: 'Awareness', icon: Eye, color: 'bg-cyan-500' },
  { key: 'composure' as const, label: 'Composure', icon: Brain, color: 'bg-violet-500' },
];

const RolePlayPlayer = () => {
  const { roleplayId } = useParams<{ roleplayId: string }>();
  const navigate = useNavigate();
  const roleplay = roleplays.find((r) => r.id === roleplayId);
  const { addPoints, adjustConfidence, completeScenario } = useGameStore();

  const [currentNodeId, setCurrentNodeId] = useState(roleplay?.startNodeId || '');
  const [score, setScore] = useState(0);
  const [eiScores, setEiScores] = useState({ empathy: 0, assertiveness: 0, awareness: 0, composure: 0 });
  const [selectedResponse, setSelectedResponse] = useState<DialogueResponse | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [conversationLog, setConversationLog] = useState<string[]>([]);

  const handleResponse = useCallback((response: DialogueResponse) => {
    setSelectedResponse(response);
    setShowFeedback(true);
    setScore((s) => s + response.points);
    setEiScores((prev) => ({
      empathy: prev.empathy + response.emotionalIntelligence.empathy,
      assertiveness: prev.assertiveness + response.emotionalIntelligence.assertiveness,
      awareness: prev.awareness + response.emotionalIntelligence.awareness,
      composure: prev.composure + response.emotionalIntelligence.composure,
    }));
    setConversationLog((log) => [...log, response.id]);
    addPoints(response.points);
    const avgDelta = (response.emotionalIntelligence.empathy + response.emotionalIntelligence.composure) / 2;
    adjustConfidence(Math.round(avgDelta));
  }, [addPoints, adjustConfidence]);

  const handleContinue = useCallback(() => {
    if (!selectedResponse) return;
    setShowFeedback(false);
    if (selectedResponse.nextNodeId) {
      setCurrentNodeId(selectedResponse.nextNodeId);
    }
    setSelectedResponse(null);
  }, [selectedResponse]);

  const handleFinish = useCallback(() => {
    if (!roleplay) return;
    completeScenario({
      scenarioId: `roleplay-${roleplay.id}`,
      score,
      maxScore: roleplay.maxPoints,
      choices: conversationLog,
      completedAt: new Date().toISOString(),
    });
    navigate('/roleplay');
  }, [completeScenario, roleplay, score, conversationLog, navigate]);

  const resetGame = useCallback(() => {
    if (!roleplay) return;
    setCurrentNodeId(roleplay.startNodeId);
    setScore(0);
    setEiScores({ empathy: 0, assertiveness: 0, awareness: 0, composure: 0 });
    setSelectedResponse(null);
    setShowFeedback(false);
    setConversationLog([]);
  }, [roleplay]);

  if (!roleplay) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-foreground">Role-play not found</h2>
        <Button onClick={() => navigate('/roleplay')} className="mt-4">Back to Role-Plays</Button>
      </div>
    );
  }

  const currentNode = roleplay.nodes[currentNodeId];
  const totalEI = eiScores.empathy + eiScores.assertiveness + eiScores.awareness + eiScores.composure;
  const eiPercent = Math.max(0, Math.min(100, (totalEI / roleplay.maxEIScore) * 100));

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{roleplay.category}</p>
          <h1 className="font-display text-xl font-bold text-foreground">{roleplay.title}</h1>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Score</p>
          <p className="text-lg font-bold text-primary">{score}/{roleplay.maxPoints}</p>
        </div>
      </div>

      {/* EI Meter */}
      <div className="mb-6 rounded-xl border border-border bg-card p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Brain className="h-4 w-4" /> Emotional Intelligence
          </span>
          <span className="font-semibold text-primary">{Math.round(eiPercent)}%</span>
        </div>
        <Progress value={eiPercent} className="h-2 bg-primary" />
        <div className="mt-3 grid grid-cols-4 gap-2">
          {eiDimensions.map((dim) => (
            <div key={dim.key} className="text-center">
              <dim.icon className="mx-auto h-3.5 w-3.5 text-muted-foreground" />
              <p className="mt-0.5 text-[10px] text-muted-foreground">{dim.label}</p>
              <p className={`text-xs font-semibold ${eiScores[dim.key] >= 0 ? 'text-safe' : 'text-danger'}`}>
                {eiScores[dim.key] > 0 ? '+' : ''}{eiScores[dim.key]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Dialogue Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentNodeId + (showFeedback ? '-fb' : '')}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
            {/* Speaker */}
            {currentNode.speaker === 'npc' && currentNode.speakerName && (
              <div className="mb-3 flex items-center gap-2">
                <span className="text-2xl">{currentNode.speakerEmoji}</span>
                <span className="text-sm font-semibold text-foreground">{currentNode.speakerName}</span>
              </div>
            )}

            {/* Dialogue */}
            <p className="text-base leading-relaxed text-foreground">{currentNode.text}</p>
            {currentNode.context && (
              <p className="mt-3 rounded-lg bg-muted px-4 py-2.5 text-sm italic text-muted-foreground">
                📍 {currentNode.context}
              </p>
            )}

            {/* Ending */}
            {currentNode.isEnding ? (
              <div className="mt-6">
                <div className={`rounded-lg p-4 ${
                  currentNode.endingType === 'empowered' ? 'bg-safe/10 border border-safe/20' :
                  currentNode.endingType === 'supportive' ? 'bg-primary/10 border border-primary/20' :
                  'bg-warning/10 border border-warning/20'
                }`}>
                  <div className="mb-2 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold text-foreground">
                      {currentNode.endingType === 'empowered' ? '✨ Empowered Ending' :
                       currentNode.endingType === 'supportive' ? '✅ Supportive Ending' :
                       '⚠️ Missed Opportunity — Learning Moment'}
                    </span>
                  </div>
                  {currentNode.endingSummary && (
                    <p className="text-sm text-foreground leading-relaxed">{currentNode.endingSummary}</p>
                  )}
                </div>

                {currentNode.lawReference && (
                  <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <BookOpen className="h-3.5 w-3.5" /> Know Your Rights
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{currentNode.lawReference}</p>
                  </div>
                )}

                {/* EI Summary */}
                <div className="mt-4 rounded-lg border border-border bg-muted/50 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Emotional Intelligence Report
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {eiDimensions.map((dim) => (
                      <div key={dim.key} className="flex items-center gap-2">
                        <dim.icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{dim.label}:</span>
                        <span className={`text-sm font-bold ${eiScores[dim.key] >= 0 ? 'text-safe' : 'text-danger'}`}>
                          {eiScores[dim.key] > 0 ? '+' : ''}{eiScores[dim.key]}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Final Score: <span className="font-bold text-primary">{score}/{roleplay.maxPoints}</span>
                    {' · '}EI Score: <span className="font-bold text-primary">{Math.round(eiPercent)}%</span>
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Button onClick={handleFinish} className="bg-gradient-hero text-primary-foreground gap-2">
                    <Home className="h-4 w-4" /> Finish
                  </Button>
                  <Button variant="outline" onClick={resetGame} className="gap-2">
                    <RotateCcw className="h-4 w-4" /> Replay
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('open-safety-coach', {
                        detail: { message: `I just finished the role-play "${roleplay.title}" with a score of ${score}/${roleplay.maxPoints} and EI score of ${Math.round(eiPercent)}%. Can you give me feedback on my emotional intelligence and suggest how I can improve?` }
                      }));
                    }}
                    className="gap-2 border-primary/30 text-primary hover:bg-primary/5"
                  >
                    <MessageCircle className="h-4 w-4" /> Talk to Diya
                  </Button>
                </div>
              </div>
            ) : showFeedback && selectedResponse ? (
              <div className="mt-6">
                {/* NPC Reaction */}
                <div className="rounded-lg border border-border bg-muted/50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    <span className={`text-xs font-semibold ${npcEmotionConfig[selectedResponse.npcEmotion]?.color || 'text-muted-foreground'}`}>
                      {roleplay.npcName} feels {npcEmotionConfig[selectedResponse.npcEmotion]?.label || selectedResponse.npcEmotion}
                    </span>
                    <span className="text-xs text-muted-foreground">· +{selectedResponse.points} pts</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{selectedResponse.npcReaction}</p>
                </div>

                {/* EI delta mini */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {eiDimensions.map((dim) => {
                    const val = selectedResponse.emotionalIntelligence[dim.key];
                    if (val === 0) return null;
                    return (
                      <span
                        key={dim.key}
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                          val > 0 ? 'bg-safe/10 text-safe' : 'bg-danger/10 text-danger'
                        }`}
                      >
                        <dim.icon className="h-3 w-3" />
                        {dim.label} {val > 0 ? '+' : ''}{val}
                      </span>
                    );
                  })}
                </div>

                <Button onClick={handleContinue} className="mt-4 gap-2">
                  Continue <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">How do you respond?</p>
                {currentNode.responses.map((response) => (
                  <button
                    key={response.id}
                    onClick={() => handleResponse(response)}
                    className="w-full rounded-lg border border-border bg-background p-4 text-left text-sm text-foreground transition-all hover:border-primary/40 hover:shadow-glow active:scale-[0.99]"
                  >
                    {response.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RolePlayPlayer;
