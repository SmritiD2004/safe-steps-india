import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gameLevels, defenseMoves } from '@/data/selfDefenseMoves';
import { useGameStore } from '@/stores/gameStore';
import { CheckCircle, Zap, Lock, Timer, Target } from 'lucide-react';
import selfdefenseHero from '@/assets/selfdefense-hero.jpg';

const SelfDefensePage = () => {
  const { completedScenarios, totalPoints } = useGameStore();

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Hero Banner */}
      <div className="mb-8 flex flex-col md:flex-row items-center gap-8 rounded-2xl bg-gradient-to-br from-danger/5 via-primary/5 to-background p-6 md:p-8">
        <div className="flex-1">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-danger/10 px-3 py-1 text-sm font-medium text-danger">
            <Zap className="h-4 w-4" />
            Self-Defense Mode
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Reaction Training
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Train your reflexes with camera-based motion detection or on-screen reactions.
            Master blocks, dodges, strikes, and escape moves through progressive levels.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['🛡️ Block', '⬅️ Dodge', '✋ Strike', '🏃‍♀️ Escape', '📢 Voice'].map((move) => (
              <span key={move} className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                {move}
              </span>
            ))}
          </div>
        </div>
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          src={selfdefenseHero}
          alt="Shield with fist representing self-defense empowerment"
          className="w-48 md:w-56 rounded-2xl shadow-warm object-cover"
        />
      </div>

      {/* Mode Info */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
          <div className="mb-2 text-2xl">📷</div>
          <h3 className="font-display text-sm font-semibold text-foreground">Camera Mode</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Use your webcam to detect real body movements — blocks, dodges, and strikes are tracked in real-time.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
          <div className="mb-2 text-2xl">👆</div>
          <h3 className="font-display text-sm font-semibold text-foreground">Tap Mode</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Tap on-screen targets to react. Works on all devices — perfect for mobile or when camera isn't available.
          </p>
        </div>
      </div>

      {/* Level Cards */}
      <h2 className="mb-4 font-display text-xl font-bold text-foreground">Training Levels</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {gameLevels.map((level, i) => {
          const isCompleted = completedScenarios.includes(`selfdefense-${level.id}`);
          const movesAvailable = level.moves.length;
          const prevCompleted = level.id === 1 || completedScenarios.includes(`selfdefense-${level.id - 1}`);
          const isLocked = !prevCompleted && level.id > 2;

          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              {isLocked ? (
                <div className="rounded-xl border border-border bg-muted/50 p-6 opacity-60">
                  <div className="mb-4 flex items-start justify-between">
                    <span className="text-3xl">{level.icon}</span>
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-muted-foreground">
                    {level.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">Complete previous level to unlock</p>
                </div>
              ) : (
                <Link
                  to={`/self-defense/${level.id}`}
                  className="group block rounded-xl border border-border bg-card p-6 shadow-soft transition-all hover:shadow-glow hover:border-primary/30"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <span className="text-3xl">{level.icon}</span>
                    {isCompleted && <CheckCircle className="h-5 w-5 text-safe" />}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {level.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{level.description}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3" /> {movesAvailable} moves
                    </span>
                    <span className="flex items-center gap-1">
                      <Timer className="h-3 w-3" /> {(level.timePerMove / 1000).toFixed(1)}s
                    </span>
                    <span>{level.totalRounds} rounds</span>
                    {level.comboChains && (
                      <span className="rounded-full bg-warning/10 px-2 py-0.5 text-warning font-medium">
                        Combos ×{level.maxCombo}
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      level.id <= 2 ? 'bg-safe/10 text-safe' :
                      level.id <= 4 ? 'bg-warning/10 text-warning' :
                      level.id <= 6 ? 'bg-danger/10 text-danger' :
                      'bg-primary/10 text-primary'
                    }`}>
                      Level {level.id}
                    </span>
                  </div>
                </Link>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SelfDefensePage;
