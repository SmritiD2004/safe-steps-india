import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { scenarios, type ScenarioNode, type ScenarioChoice } from '@/data/scenarios';
import { useGameStore } from '@/stores/gameStore';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Shield, ChevronRight, RotateCcw, Home, BookOpen, MessageCircle } from 'lucide-react';

const ScenarioPlayer = () => {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const navigate = useNavigate();
  const scenario = scenarios.find((s) => s.id === scenarioId);
  const { addPoints, adjustConfidence, completeScenario } = useGameStore();

  const [currentNodeId, setCurrentNodeId] = useState(scenario?.startNodeId || '');
  const [score, setScore] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<ScenarioChoice | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [riskHistory, setRiskHistory] = useState<number[]>([]);

  const handleChoice = useCallback((choice: ScenarioChoice) => {
    setSelectedChoice(choice);
    setShowFeedback(true);
    setScore((s) => s + choice.points);
    setChoices((c) => [...c, choice.id]);
    adjustConfidence(choice.confidenceDelta);
    addPoints(choice.points);
  }, [adjustConfidence, addPoints]);

  const handleContinue = useCallback(() => {
    if (!selectedChoice || !scenario) return;
    setShowFeedback(false);

    if (selectedChoice.nextNodeId && scenario.nodes[selectedChoice.nextNodeId]) {
      const nextNode = scenario.nodes[selectedChoice.nextNodeId];
      setCurrentNodeId(selectedChoice.nextNodeId);
      setRiskHistory((h) => [...h, nextNode.riskIndicator]);
    }
    setSelectedChoice(null);
  }, [selectedChoice, scenario.nodes]);

  const handleFinish = useCallback(() => {
    completeScenario({
      scenarioId: scenario.id,
      score,
      maxScore: scenario.maxScore,
      choices,
      completedAt: new Date().toISOString(),
    });
    navigate('/play');
  }, [completeScenario, scenario, score, choices, navigate]);

  if (!scenario) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-foreground">Scenario not found</h2>
        <Button onClick={() => navigate('/play')} className="mt-4">Back to Scenarios</Button>
      </div>
    );
  }

  const currentNode: ScenarioNode = scenario.nodes[currentNodeId];

  const riskColor = currentNode.riskIndicator > 60 ? 'text-danger' :
    currentNode.riskIndicator > 30 ? 'text-warning' : 'text-safe';

  const riskBg = currentNode.riskIndicator > 60 ? 'bg-danger' :
    currentNode.riskIndicator > 30 ? 'bg-warning' : 'bg-safe';

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{scenario.category}</p>
          <h1 className="font-display text-xl font-bold text-foreground">{scenario.title}</h1>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Score</p>
          <p className="text-lg font-bold text-primary">{score}/{scenario.maxScore}</p>
        </div>
      </div>

      {/* Risk Meter */}
      <div className="mb-6 rounded-xl border border-border bg-card p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <AlertTriangle className="h-4 w-4" /> Risk Level
          </span>
          <span className={`font-semibold ${riskColor}`}>
            {currentNode.riskIndicator}%
          </span>
        </div>
        <Progress value={currentNode.riskIndicator} className={`h-2 ${riskBg}`} />
      </div>

      {/* Scenario Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentNodeId + (showFeedback ? '-feedback' : '')}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
            {/* Narrative */}
            <p className="text-base leading-relaxed text-foreground">{currentNode.narrative}</p>
            <p className="mt-3 rounded-lg bg-muted px-4 py-2.5 text-sm italic text-muted-foreground">
              📍 {currentNode.situation}
            </p>

            {/* Choices or Ending */}
            {currentNode.isEnding ? (
              <div className="mt-6">
                <div className={`rounded-lg p-4 ${
                  currentNode.endingType === 'empowered' ? 'bg-safe/10 border border-safe/20' :
                  currentNode.endingType === 'safe' ? 'bg-primary/10 border border-primary/20' :
                  'bg-warning/10 border border-warning/20'
                }`}>
                  <div className="mb-2 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold text-foreground">
                      {currentNode.endingType === 'empowered' ? '✨ Empowered Ending' :
                       currentNode.endingType === 'safe' ? '✅ Safe Ending' :
                       '⚠️ Risky Ending — Learning Moment'}
                    </span>
                  </div>
                  {currentNode.reflection && (
                    <p className="text-sm text-foreground leading-relaxed">{currentNode.reflection}</p>
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

                <div className="mt-6 flex items-center gap-3">
                  <p className="text-sm text-muted-foreground">
                    Final Score: <span className="font-bold text-primary">{score}/{scenario.maxScore}</span>
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button onClick={handleFinish} className="bg-gradient-hero text-primary-foreground gap-2">
                    <Home className="h-4 w-4" /> Finish
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentNodeId(scenario.startNodeId);
                      setScore(0);
                      setChoices([]);
                      setRiskHistory([]);
                    }}
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" /> Replay
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Dispatch a custom event to open the coach with context
                      window.dispatchEvent(new CustomEvent('open-safety-coach', {
                        detail: { message: `I just completed the scenario "${scenario.title}" with a score of ${score}/${scenario.maxScore}. Can you review my performance and give me feedback?` }
                      }));
                    }}
                    className="gap-2 border-primary/30 text-primary hover:bg-primary/5"
                  >
                    <MessageCircle className="h-4 w-4" /> Talk to Diya
                  </Button>
                </div>
              </div>
            ) : showFeedback && selectedChoice ? (
              <div className="mt-6">
                <div className={`rounded-lg border p-4 ${
                  selectedChoice.riskLevel === 'low' ? 'bg-safe/10 border-safe/20' :
                  selectedChoice.riskLevel === 'medium' ? 'bg-warning/10 border-warning/20' :
                  'bg-danger/10 border-danger/20'
                }`}>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider ${
                    selectedChoice.riskLevel === 'low' ? 'text-safe' :
                    selectedChoice.riskLevel === 'medium' ? 'text-warning' : 'text-danger'
                  }">
                    {selectedChoice.riskLevel === 'low' ? '✅ Good Choice' :
                     selectedChoice.riskLevel === 'medium' ? '⚡ Moderate Risk' :
                     '⚠️ High Risk'} · +{selectedChoice.points} pts
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">{selectedChoice.feedback}</p>
                </div>
                <Button onClick={handleContinue} className="mt-4 gap-2">
                  Continue <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">What do you do?</p>
                {currentNode.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoice(choice)}
                    className="w-full rounded-lg border border-border bg-background p-4 text-left text-sm text-foreground transition-all hover:border-primary/40 hover:shadow-glow active:scale-[0.99]"
                  >
                    {choice.text}
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

export default ScenarioPlayer;
