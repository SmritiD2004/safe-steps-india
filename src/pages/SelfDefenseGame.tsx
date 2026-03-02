import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gameLevels, getMovesForLevel, DefenseMove } from '@/data/selfDefenseMoves';
import { useGameStore } from '@/stores/gameStore';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Camera, Hand, ArrowLeft, Trophy, RotateCcw,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Circle,
  Video, VideoOff, Zap, Star, Timer
} from 'lucide-react';
import { GameSounds, Haptics } from '@/lib/gameAudio';
import { useParticleBurst, ParticleLayer } from '@/components/ParticleBurst';

type GamePhase = 'setup' | 'countdown' | 'playing' | 'feedback' | 'results';
type InputMode = 'tap' | 'camera';

interface RoundResult {
  move: DefenseMove;
  reacted: boolean;
  reactionTime: number;
  correct: boolean;
}

const SelfDefenseGame = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { addPoints, adjustConfidence, completeScenario } = useGameStore();

  const level = gameLevels.find((l) => l.id === Number(levelId));
  const moves = level ? getMovesForLevel(level.id) : [];

  const [phase, setPhase] = useState<GamePhase>('setup');
  const [inputMode, setInputMode] = useState<InputMode>('tap');
  const [countdown, setCountdown] = useState(3);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentMove, setCurrentMove] = useState<DefenseMove | null>(null);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'miss' | null>(null);
  const [moveStartTime, setMoveStartTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevFrameRef = useRef<ImageData | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const moveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animFrameRef = useRef<number>(0);
  const { particles, burst } = useParticleBurst();

  // Camera setup
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 320, height: 240 },
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setInputMode('camera');
    } catch {
      setCameraError(true);
      setInputMode('tap');
    }
  }, []);

  const stopCamera = useCallback(() => {
    cameraStream?.getTracks().forEach((t) => t.stop());
    setCameraStream(null);
    cancelAnimationFrame(animFrameRef.current);
  }, [cameraStream]);

  useEffect(() => () => { stopCamera(); }, []);

  // Motion detection via frame differencing
  const detectMotion = useCallback((): MoveDirection | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return null;

    const w = 320, h = 240;
    canvasRef.current.width = w;
    canvasRef.current.height = h;
    ctx.drawImage(videoRef.current, 0, 0, w, h);
    const currentFrame = ctx.getImageData(0, 0, w, h);

    if (!prevFrameRef.current) {
      prevFrameRef.current = currentFrame;
      return null;
    }

    // Compare regions
    const regions = { left: 0, right: 0, top: 0, bottom: 0, center: 0 };
    const threshold = 30;
    const prev = prevFrameRef.current.data;
    const curr = currentFrame.data;

    for (let i = 0; i < curr.length; i += 16) {
      const diff = Math.abs(curr[i] - prev[i]) + Math.abs(curr[i + 1] - prev[i + 1]) + Math.abs(curr[i + 2] - prev[i + 2]);
      if (diff > threshold) {
        const pixelIndex = i / 4;
        const x = pixelIndex % w;
        const y = Math.floor(pixelIndex / w);

        if (x < w * 0.33) regions.right += diff; // mirrored
        else if (x > w * 0.66) regions.left += diff; // mirrored
        if (y < h * 0.4) regions.top += diff;
        else if (y > h * 0.6) regions.bottom += diff;
        if (x > w * 0.25 && x < w * 0.75 && y > h * 0.25 && y < h * 0.75) regions.center += diff;
      }
    }

    prevFrameRef.current = currentFrame;

    const motionThreshold = 15000;
    const max = Math.max(regions.left, regions.right, regions.top, regions.bottom, regions.center);
    if (max < motionThreshold) return null;

    if (max === regions.top) return 'up';
    if (max === regions.bottom) return 'down';
    if (max === regions.left) return 'left';
    if (max === regions.right) return 'right';
    return 'center';
  }, []);

  type MoveDirection = 'left' | 'right' | 'up' | 'down' | 'center';

  // Start game
  const startGame = () => {
    setPhase('countdown');
    setCountdown(3);
    setCurrentRound(0);
    setResults([]);
    setCombo(0);
    setMaxCombo(0);
  };

  // Countdown
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdown <= 0) {
      GameSounds.countdownGo();
      Haptics.heavy();
      setPhase('playing');
      return;
    }
    GameSounds.countdown();
    Haptics.light();
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  // Next move logic
  const nextMove = useCallback(() => {
    if (!level) return;
    if (currentRound >= level.totalRounds) {
      setPhase('results');
      return;
    }
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    setCurrentMove(randomMove);
    setMoveStartTime(Date.now());
    setTimeLeft(level.timePerMove);
    setShowFeedback(null);

    moveTimerRef.current = setTimeout(() => {
      // Time expired — miss
      handleMiss(randomMove);
    }, level.timePerMove);
  }, [level, moves, currentRound]);

  useEffect(() => {
    if (phase === 'playing' && currentMove === null) {
      const delay = setTimeout(nextMove, 500);
      return () => clearTimeout(delay);
    }
  }, [phase, currentMove, nextMove]);

  // Time left countdown
  useEffect(() => {
    if (phase !== 'playing' || !currentMove || !level) return;
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - moveStartTime;
      const remaining = Math.max(0, level.timePerMove - elapsed);
      setTimeLeft(remaining);
    }, 50);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, currentMove, moveStartTime, level]);

  // Camera motion detection loop
  useEffect(() => {
    if (phase !== 'playing' || inputMode !== 'camera' || !currentMove) return;

    const loop = () => {
      const direction = detectMotion();
      if (direction && currentMove && direction === currentMove.direction) {
        handleCorrect(currentMove);
        return;
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [phase, inputMode, currentMove, detectMotion]);

  const handleCorrect = (move: DefenseMove) => {
    if (moveTimerRef.current) clearTimeout(moveTimerRef.current);
    const reactionTime = Date.now() - moveStartTime;
    const newCombo = combo + 1;
    if (newCombo >= 3) { GameSounds.combo(); } else { GameSounds.correct(); }
    Haptics.success();
    // Particle burst at center of viewport
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    burst(cx, cy, newCombo >= 3 ? 20 : 12);
    setCombo(newCombo);
    setMaxCombo((m) => Math.max(m, newCombo));
    setResults((r) => [...r, { move, reacted: true, reactionTime, correct: true }]);
    setShowFeedback('correct');
    setCurrentMove(null);
    setCurrentRound((r) => r + 1);
  };

  const handleMiss = (move: DefenseMove) => {
    if (moveTimerRef.current) clearTimeout(moveTimerRef.current);
    GameSounds.miss();
    Haptics.error();
    setCombo(0);
    setResults((r) => [...r, { move, reacted: false, reactionTime: level?.timePerMove || 0, correct: false }]);
    setShowFeedback('miss');
    setCurrentMove(null);
    setCurrentRound((r) => r + 1);
  };

  // Tap handler
  const handleTap = (zone: string) => {
    if (phase !== 'playing' || !currentMove) return;
    GameSounds.tap();
    Haptics.light();
    if (zone === currentMove.tapZone) {
      handleCorrect(currentMove);
    }
  };

  // Calculate final score
  const correctCount = results.filter((r) => r.correct).length;
  const totalRounds = level?.totalRounds || 1;
  const scorePercent = Math.round((correctCount / totalRounds) * 100);
  const avgReactionTime = results.filter((r) => r.correct).length > 0
    ? Math.round(results.filter((r) => r.correct).reduce((s, r) => s + r.reactionTime, 0) / results.filter((r) => r.correct).length)
    : 0;
  const passed = scorePercent >= (level?.minScoreToPass || 50);

  // Submit results
  useEffect(() => {
    if (phase !== 'results' || !level) return;
    if (passed) { GameSounds.levelComplete(); } else { GameSounds.levelFail(); }
    Haptics.heavy();
    const pointsEarned = correctCount * 10 + maxCombo * 5;
    addPoints(pointsEarned);
    adjustConfidence(passed ? 5 : -2);
    if (passed) {
      completeScenario({
        scenarioId: `selfdefense-${level.id}`,
        score: correctCount,
        maxScore: totalRounds,
        choices: results.map((r) => `${r.move.name}: ${r.correct ? 'hit' : 'miss'}`),
        completedAt: new Date().toISOString(),
      });
    }
  }, [phase]);

  if (!level) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Level not found.</p>
        <Button onClick={() => navigate('/self-defense')} className="mt-4">Back to Levels</Button>
      </div>
    );
  }

  const tapZoneIcon: Record<string, React.ReactNode> = {
    top: <ChevronUp className="h-8 w-8" />,
    bottom: <ChevronDown className="h-8 w-8" />,
    left: <ChevronLeft className="h-8 w-8" />,
    right: <ChevronRight className="h-8 w-8" />,
    center: <Circle className="h-8 w-8" />,
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <ParticleLayer particles={particles} />
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => navigate('/self-defense')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="text-right">
          <p className="font-display text-sm font-semibold text-foreground">{level.icon} {level.name}</p>
          <p className="text-xs text-muted-foreground">Level {level.id}</p>
        </div>
      </div>

      {/* Setup Phase */}
      {phase === 'setup' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center py-10">
          <h2 className="font-display text-2xl font-bold text-foreground">{level.icon} {level.name}</h2>
          <p className="text-muted-foreground">{level.description}</p>

          <div className="flex justify-center gap-3 flex-wrap">
            {moves.map((m) => (
              <span key={m.id} className="flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground">
                {m.icon} {m.name}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              onClick={() => { setInputMode('tap'); startGame(); }}
              size="lg"
              className="gap-2"
            >
              <Hand className="h-4 w-4" /> Play with Tap Mode
            </Button>
            <Button
              onClick={async () => { await startCamera(); startGame(); }}
              size="lg"
              variant="outline"
              className="gap-2"
            >
              <Camera className="h-4 w-4" /> Play with Camera
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            {level.totalRounds} rounds · {(level.timePerMove / 1000).toFixed(1)}s per move · {level.minScoreToPass}% to pass
          </p>
        </motion.div>
      )}

      {/* Countdown */}
      {phase === 'countdown' && (
        <div className="flex flex-col items-center justify-center py-20">
          <motion.div
            key={countdown}
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="font-display text-8xl font-bold text-primary"
          >
            {countdown || 'GO!'}
          </motion.div>
          <p className="mt-4 text-sm text-muted-foreground">
            {inputMode === 'camera' ? '📷 Camera mode active' : '👆 Tap mode active'}
          </p>
        </div>
      )}

      {/* Playing Phase */}
      {phase === 'playing' && (
        <div className="space-y-4">
          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground">{currentRound}/{totalRounds}</span>
            <Progress value={(currentRound / totalRounds) * 100} className="h-2 flex-1" />
            <div className="flex items-center gap-1 text-xs font-medium text-warning">
              <Zap className="h-3 w-3" /> ×{combo}
            </div>
          </div>

          {/* Timer bar */}
          {level && (
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className={`h-full rounded-full transition-colors ${
                  timeLeft > level.timePerMove * 0.5 ? 'bg-safe' :
                  timeLeft > level.timePerMove * 0.25 ? 'bg-warning' : 'bg-danger'
                }`}
                style={{ width: `${(timeLeft / level.timePerMove) * 100}%` }}
              />
            </div>
          )}

          {/* Camera feed */}
          {inputMode === 'camera' && (
            <div className="relative mx-auto w-64 h-48 rounded-xl overflow-hidden border-2 border-primary/30 bg-black">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-danger/80 px-2 py-0.5 text-[10px] font-bold text-white">
                <Video className="h-2.5 w-2.5" /> LIVE
              </div>
            </div>
          )}

          {/* Current Move Prompt */}
          <AnimatePresence mode="wait">
            {currentMove && (
              <motion.div
                key={currentMove.id + currentRound}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="text-center py-4"
              >
                <div className="text-5xl mb-3">{currentMove.icon}</div>
                <p className="font-display text-xl font-bold text-foreground">{currentMove.instruction}</p>
                {inputMode === 'camera' && (
                  <p className="mt-1 text-xs text-muted-foreground">{currentMove.cameraAction}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feedback flash */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`text-center py-2 text-lg font-bold ${
                  showFeedback === 'correct' ? 'text-safe' : 'text-danger'
                }`}
              >
                {showFeedback === 'correct' ? '✓ Nice!' : '✗ Missed!'}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tap zones (only in tap mode) */}
          {inputMode === 'tap' && (
            <div className="relative mx-auto w-64 h-64">
              {/* Top */}
              <button
                onClick={() => handleTap('top')}
                className={`absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-xl flex items-center justify-center transition-all ${
                  currentMove?.tapZone === 'top'
                    ? 'bg-primary text-primary-foreground scale-110 shadow-glow animate-pulse'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {tapZoneIcon.top}
              </button>
              {/* Bottom */}
              <button
                onClick={() => handleTap('bottom')}
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-xl flex items-center justify-center transition-all ${
                  currentMove?.tapZone === 'bottom'
                    ? 'bg-primary text-primary-foreground scale-110 shadow-glow animate-pulse'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {tapZoneIcon.bottom}
              </button>
              {/* Left */}
              <button
                onClick={() => handleTap('left')}
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-16 h-16 rounded-xl flex items-center justify-center transition-all ${
                  currentMove?.tapZone === 'left'
                    ? 'bg-primary text-primary-foreground scale-110 shadow-glow animate-pulse'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {tapZoneIcon.left}
              </button>
              {/* Right */}
              <button
                onClick={() => handleTap('right')}
                className={`absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 rounded-xl flex items-center justify-center transition-all ${
                  currentMove?.tapZone === 'right'
                    ? 'bg-primary text-primary-foreground scale-110 shadow-glow animate-pulse'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {tapZoneIcon.right}
              </button>
              {/* Center */}
              <button
                onClick={() => handleTap('center')}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  currentMove?.tapZone === 'center'
                    ? 'bg-primary text-primary-foreground scale-110 shadow-glow animate-pulse'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {tapZoneIcon.center}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results Phase */}
      {phase === 'results' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 py-6">
          <div className="text-center">
            <div className="text-6xl mb-3">{passed ? '🎉' : '💪'}</div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              {passed ? 'Level Complete!' : 'Keep Practicing!'}
            </h2>
            <p className="mt-1 text-muted-foreground">
              {passed ? 'Great reflexes! You\'re building real confidence.' : 'Don\'t give up — every attempt makes you stronger.'}
            </p>
          </div>

          {/* Score card */}
          <div className="rounded-2xl bg-gradient-hero p-6 text-primary-foreground text-center">
            <div className="text-5xl font-bold font-display">{scorePercent}%</div>
            <p className="text-sm opacity-80 mt-1">{correctCount}/{totalRounds} reactions correct</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <Timer className="mx-auto mb-1 h-5 w-5 text-primary" />
              <p className="text-lg font-bold text-foreground">{avgReactionTime}ms</p>
              <p className="text-[10px] text-muted-foreground">Avg Reaction</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <Zap className="mx-auto mb-1 h-5 w-5 text-warning" />
              <p className="text-lg font-bold text-foreground">×{maxCombo}</p>
              <p className="text-[10px] text-muted-foreground">Max Combo</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <Star className="mx-auto mb-1 h-5 w-5 text-empowerment" />
              <p className="text-lg font-bold text-foreground">+{correctCount * 10 + maxCombo * 5}</p>
              <p className="text-[10px] text-muted-foreground">Points Earned</p>
            </div>
          </div>

          {/* Move breakdown */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Round Breakdown</h3>
            <div className="max-h-48 overflow-y-auto space-y-1.5">
              {results.map((r, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span>{r.move.icon}</span>
                    <span className="text-foreground">{r.move.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {r.correct && <span className="text-muted-foreground">{r.reactionTime}ms</span>}
                    <span className={r.correct ? 'text-safe font-medium' : 'text-danger font-medium'}>
                      {r.correct ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={() => { setPhase('setup'); setResults([]); }} variant="outline" className="flex-1 gap-2">
              <RotateCcw className="h-4 w-4" /> Retry
            </Button>
            {passed && level.id < gameLevels.length ? (
              <Button onClick={() => navigate(`/self-defense/${level.id + 1}`)} className="flex-1 gap-2 bg-gradient-hero text-primary-foreground">
                <Trophy className="h-4 w-4" /> Next Level
              </Button>
            ) : (
              <Button onClick={() => navigate('/self-defense')} className="flex-1 gap-2">
                <ArrowLeft className="h-4 w-4" /> All Levels
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SelfDefenseGame;
