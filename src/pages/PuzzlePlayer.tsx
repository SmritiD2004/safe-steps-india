import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { puzzles, MatchPair, RedFlag } from '@/data/puzzles';
import { useGameStore } from '@/stores/gameStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, XCircle, Timer, Trophy, RotateCcw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// ─── Matching Puzzle ───────────────────────────────────────

interface MatchingPuzzleProps {
  pairs: MatchPair[];
  timeLimit?: number;
  maxScore: number;
  onComplete: (score: number) => void;
}

const MatchingPuzzle = ({ pairs, timeLimit, maxScore, onComplete }: MatchingPuzzleProps) => {
  const [shuffledMatches, setShuffledMatches] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [connections, setConnections] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, boolean> | null>(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit || 0);
  const [submitted, setSubmitted] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  useEffect(() => {
    const shuffled = [...pairs.map(p => p.match)].sort(() => Math.random() - 0.5);
    setShuffledMatches(shuffled);
  }, [pairs]);

  useEffect(() => {
    if (!timeLimit || submitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, timeLimit, submitted]);

  const handleItemClick = (itemId: string) => {
    if (submitted) return;
    setSelectedItem(itemId);
  };

  const handleMatchClick = (matchText: string) => {
    if (submitted || !selectedItem) return;
    setConnections(prev => ({ ...prev, [selectedItem]: matchText }));
    setSelectedItem(null);
  };

  // Drag-and-drop handlers
  const handleDragStart = (itemId: string) => {
    if (submitted) return;
    setDraggedItem(itemId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('ring-2', 'ring-primary');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('ring-2', 'ring-primary');
  };

  const handleDrop = (e: React.DragEvent, matchText: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove('ring-2', 'ring-primary');
    if (draggedItem && !submitted) {
      setConnections(prev => ({ ...prev, [draggedItem]: matchText }));
      setDraggedItem(null);
    }
  };

  const handleSubmit = () => {
    const res: Record<string, boolean> = {};
    pairs.forEach(p => {
      res[p.id] = connections[p.id] === p.match;
    });
    setResults(res);
    setSubmitted(true);

    const correct = Object.values(res).filter(Boolean).length;
    const score = Math.round((correct / pairs.length) * maxScore);
    onComplete(score);
  };

  const allConnected = Object.keys(connections).length === pairs.length;

  return (
    <div className="space-y-6">
      {timeLimit && (
        <div className="flex items-center gap-2 text-sm">
          <Timer className={`h-4 w-4 ${timeLeft < 15 ? 'text-danger' : 'text-muted-foreground'}`} />
          <span className={`font-mono font-medium ${timeLeft < 15 ? 'text-danger' : 'text-foreground'}`}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
          <Progress value={(timeLeft / (timeLimit)) * 100} className="h-2 flex-1" />
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Drag a situation on the left onto the correct action on the right. You can also click to select and match.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Items (left) */}
        <div className="space-y-2">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Situations</h3>
          {pairs.map(p => {
            const isConnected = !!connections[p.id];
            const isCorrect = results ? results[p.id] : null;
            return (
              <motion.div
                key={p.id}
                draggable={!submitted}
                onDragStart={() => handleDragStart(p.id)}
                onClick={() => handleItemClick(p.id)}
                className={`cursor-grab rounded-lg border p-3 text-sm transition-all active:cursor-grabbing ${
                  submitted
                    ? isCorrect
                      ? 'border-safe bg-safe/5'
                      : 'border-danger bg-danger/5'
                    : selectedItem === p.id
                    ? 'border-primary bg-primary/5 shadow-glow'
                    : isConnected
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-border bg-card hover:border-primary/30'
                }`}
                layout
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-foreground">{p.item}</span>
                  {submitted && (
                    isCorrect
                      ? <CheckCircle className="h-4 w-4 shrink-0 text-safe" />
                      : <XCircle className="h-4 w-4 shrink-0 text-danger" />
                  )}
                </div>
                {isConnected && (
                  <div className="mt-1.5 text-xs text-primary">
                    → {connections[p.id]}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Matches (right) */}
        <div className="space-y-2">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions / Rights</h3>
          {shuffledMatches.map(match => {
            const isUsed = Object.values(connections).includes(match);
            return (
              <div
                key={match}
                onClick={() => handleMatchClick(match)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, match)}
                className={`rounded-lg border p-3 text-sm transition-all ${
                  submitted
                    ? 'border-border bg-muted/50'
                    : isUsed
                    ? 'border-primary/20 bg-primary/5 opacity-60'
                    : selectedItem
                    ? 'border-dashed border-primary/40 bg-card cursor-pointer hover:bg-primary/5'
                    : 'border-border bg-card'
                }`}
              >
                <span className="text-foreground">{match}</span>
              </div>
            );
          })}
        </div>
      </div>

      {!submitted && (
        <Button
          onClick={handleSubmit}
          disabled={!allConnected}
          className="w-full bg-gradient-hero text-primary-foreground gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          Check Answers ({Object.keys(connections).length}/{pairs.length})
        </Button>
      )}
    </div>
  );
};

// ─── Red Flag Puzzle ───────────────────────────────────────

interface RedFlagPuzzleProps {
  flags: RedFlag[];
  maxScore: number;
  onComplete: (score: number) => void;
}

const RedFlagPuzzle = ({ flags, maxScore, onComplete }: RedFlagPuzzleProps) => {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleAnswer = (id: string) => {
    if (submitted) return;
    setAnswers(prev => {
      const copy = { ...prev };
      if (copy[id] !== undefined) {
        delete copy[id];
      } else {
        copy[id] = true; // marked as red flag
      }
      return copy;
    });
  };

  const markSafe = (id: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [id]: false }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    let correct = 0;
    flags.forEach(f => {
      const userSaysRedFlag = answers[f.id] === true;
      const userSaysSafe = answers[f.id] === false;
      if ((f.isRedFlag && userSaysRedFlag) || (!f.isRedFlag && userSaysSafe)) {
        correct++;
      }
    });
    const score = Math.round((correct / flags.length) * maxScore);
    onComplete(score);
  };

  const allAnswered = flags.every(f => answers[f.id] !== undefined);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        For each situation, decide if it's a 🚩 <strong>Red Flag</strong> or ✅ <strong>Safe</strong>.
      </p>

      <div className="space-y-3">
        {flags.map(flag => {
          const answer = answers[flag.id];
          const isCorrect = submitted
            ? (flag.isRedFlag && answer === true) || (!flag.isRedFlag && answer === false)
            : null;

          return (
            <motion.div
              key={flag.id}
              layout
              className={`rounded-xl border p-4 transition-all ${
                submitted
                  ? isCorrect
                    ? 'border-safe bg-safe/5'
                    : 'border-danger bg-danger/5'
                  : 'border-border bg-card'
              }`}
            >
              <p className="mb-3 text-sm font-medium text-foreground">{flag.text}</p>

              {!submitted ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleAnswer(flag.id)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      answer === true
                        ? 'bg-danger/10 text-danger ring-1 ring-danger/30'
                        : 'bg-muted text-muted-foreground hover:bg-danger/10 hover:text-danger'
                    }`}
                  >
                    🚩 Red Flag
                  </button>
                  <button
                    onClick={() => markSafe(flag.id)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      answer === false
                        ? 'bg-safe/10 text-safe ring-1 ring-safe/30'
                        : 'bg-muted text-muted-foreground hover:bg-safe/10 hover:text-safe'
                    }`}
                  >
                    ✅ Safe
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs font-medium">
                    {isCorrect ? (
                      <span className="text-safe flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" /> Correct!
                      </span>
                    ) : (
                      <span className="text-danger flex items-center gap-1">
                        <XCircle className="h-3.5 w-3.5" /> {flag.isRedFlag ? 'This IS a red flag' : 'This is actually safe'}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setExpandedId(expandedId === flag.id ? null : flag.id)}
                    className="text-xs text-primary hover:underline"
                  >
                    {expandedId === flag.id ? 'Hide explanation' : 'Why?'}
                  </button>
                  <AnimatePresence>
                    {expandedId === flag.id && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-2 text-xs text-muted-foreground overflow-hidden"
                      >
                        {flag.explanation}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {!submitted && (
        <Button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="w-full bg-gradient-hero text-primary-foreground gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          Check Answers
        </Button>
      )}
    </div>
  );
};

// ─── Puzzle Player ─────────────────────────────────────────

const PuzzlePlayer = () => {
  const { puzzleId } = useParams<{ puzzleId: string }>();
  const navigate = useNavigate();
  const { addPoints, adjustConfidence } = useGameStore();

  const puzzle = puzzles.find(p => p.id === puzzleId);
  const [score, setScore] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  if (!puzzle) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground">Puzzle not found</h1>
        <Button variant="outline" onClick={() => navigate('/puzzles')} className="mt-4">
          Back to Puzzles
        </Button>
      </div>
    );
  }

  const handleComplete = (earnedScore: number) => {
    setScore(earnedScore);
    setCompleted(true);
    addPoints(earnedScore);
    const pct = earnedScore / puzzle.maxScore;
    adjustConfidence(pct >= 0.8 ? 8 : pct >= 0.5 ? 3 : -2);
  };

  const percentage = score !== null ? Math.round((score / puzzle.maxScore) * 100) : 0;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <button
        onClick={() => navigate('/puzzles')}
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Puzzles
      </button>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{puzzle.icon}</span>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">{puzzle.title}</h1>
            <p className="text-sm text-muted-foreground">{puzzle.description}</p>
          </div>
        </div>
      </div>

      {completed && score !== null ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-border bg-card p-8 text-center shadow-soft"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">Puzzle Complete!</h2>
          <p className="mt-2 text-4xl font-bold text-primary">{percentage}%</p>
          <p className="mt-1 text-sm text-muted-foreground">
            You scored {score} out of {puzzle.maxScore} points
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            {percentage >= 80
              ? '🌟 Excellent! You have strong safety awareness.'
              : percentage >= 50
              ? '👍 Good effort! Review the explanations to strengthen your knowledge.'
              : '📚 Keep learning! Check the Learn section for more safety information.'}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setScore(null);
                setCompleted(false);
              }}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" /> Try Again
            </Button>
            <Button
              onClick={() => navigate('/puzzles')}
              className="bg-gradient-hero text-primary-foreground gap-2"
            >
              More Puzzles
            </Button>
          </div>
        </motion.div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          {puzzle.type === 'matching' && puzzle.matchPairs && (
            <MatchingPuzzle
              pairs={puzzle.matchPairs}
              timeLimit={puzzle.timeLimit}
              maxScore={puzzle.maxScore}
              onComplete={handleComplete}
            />
          )}
          {puzzle.type === 'red-flag' && puzzle.redFlags && (
            <RedFlagPuzzle
              flags={puzzle.redFlags}
              maxScore={puzzle.maxScore}
              onComplete={handleComplete}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PuzzlePlayer;
