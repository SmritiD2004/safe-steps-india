import { motion } from 'framer-motion';
import { useGameStore, BADGES } from '@/stores/gameStore';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Brain, Award, RotateCcw, MessageCircle } from 'lucide-react';
import { scenarios } from '@/data/scenarios';
import progressHero from '@/assets/progress-hero.jpg';

const ProgressPage = () => {
  const {
    playerName, avatarEmoji, level, totalPoints, confidenceScore,
    scenarioResults, badges, completedScenarios, knowledgeModulesRead, resetProgress,
  } = useGameStore();

  const completionPct = Math.round((completedScenarios.length / scenarios.length) * 100);
  const nextLevelPoints = level * 100;
  const levelProgress = ((totalPoints % 100) / 100) * 100;

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Hero Banner */}
      <div className="mb-8 flex flex-col md:flex-row items-center gap-8 rounded-2xl bg-gradient-to-br from-secondary/5 via-empowerment/5 to-background p-6 md:p-8">
        <div className="flex-1">
          <h1 className="font-display text-3xl font-bold text-foreground">Your Progress</h1>
          <p className="mt-2 text-muted-foreground">Track your safety learning journey, earn badges, and build confidence.</p>
        </div>
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          src={progressHero}
          alt="Trophy with stars and progress chart"
          className="w-48 md:w-56 rounded-2xl shadow-warm object-cover"
        />
      </div>

      {/* Player Card */}
      <div className="mb-8 rounded-2xl bg-gradient-hero p-6 text-primary-foreground shadow-glow">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/20 text-4xl">
            {avatarEmoji}
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">{playerName || 'Anonymous Player'}</h2>
            <p className="opacity-80">Level {level} · {totalPoints} Total Points</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm opacity-80">
            <span>Level Progress</span>
            <span>{totalPoints % 100}/{100} pts to Level {level + 1}</span>
          </div>
          <div className="mt-1.5 h-2 rounded-full bg-primary-foreground/20 overflow-hidden">
            <div className="h-full rounded-full bg-primary-foreground transition-all" style={{ width: `${levelProgress}%` }} />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { icon: Target, label: 'Scenarios Done', value: `${completedScenarios.length}/${scenarios.length}`, color: 'text-primary' },
          { icon: Brain, label: 'Confidence', value: `${confidenceScore}%`, color: 'text-safe' },
          { icon: Award, label: 'Badges', value: `${badges.length}/${BADGES.length}`, color: 'text-empowerment' },
          { icon: Trophy, label: 'Modules Read', value: `${knowledgeModulesRead.length}/5`, color: 'text-warning' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4 shadow-soft text-center">
            <stat.icon className={`mx-auto mb-2 h-6 w-6 ${stat.color}`} />
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Confidence Meter */}
      <div className="mb-8 rounded-xl border border-border bg-card p-5 shadow-soft">
        <h3 className="mb-3 font-display text-lg font-semibold text-foreground flex items-center gap-2">
          <Brain className="h-5 w-5 text-safe" /> Confidence Meter
        </h3>
        <Progress value={confidenceScore} className="h-3 bg-safe" />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>Building awareness</span>
          <span>Confident & empowered</span>
        </div>
      </div>

      {/* Completion */}
      <div className="mb-8 rounded-xl border border-border bg-card p-5 shadow-soft">
        <h3 className="mb-3 font-display text-lg font-semibold text-foreground">Overall Completion</h3>
        <Progress value={completionPct} className="h-3" />
        <p className="mt-2 text-sm text-muted-foreground">{completionPct}% of scenarios completed</p>
      </div>

      {/* Badges */}
      <div className="mb-8">
        <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Badges</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {BADGES.map((badge) => {
            const earned = badges.find((b) => b.id === badge.id);
            return (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.05 }}
                className={`rounded-xl border p-4 text-center transition-all ${
                  earned
                    ? 'border-primary/30 bg-primary/5 shadow-glow'
                    : 'border-border bg-muted/50 opacity-50'
                }`}
              >
                <div className="mb-2 text-3xl">{badge.icon}</div>
                <p className="text-xs font-semibold text-foreground">{badge.name}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">{badge.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Scenario History */}
      {scenarioResults.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Scenario History</h3>
          <div className="space-y-2">
            {scenarioResults.map((result, i) => {
              const sc = scenarios.find((s) => s.id === result.scenarioId);
              const pct = Math.round((result.score / result.maxScore) * 100);
              return (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{sc?.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{sc?.title}</p>
                      <p className="text-xs text-muted-foreground">{new Date(result.completedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className={`text-sm font-bold ${pct >= 80 ? 'text-safe' : pct >= 50 ? 'text-warning' : 'text-danger'}`}>
                    {result.score}/{result.maxScore}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Get Recommendations */}
      <div className="mb-8 rounded-xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🪔</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Get Personalized Recommendations</p>
            <p className="text-xs text-muted-foreground">Ask Diya for guidance based on your progress</p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('open-safety-coach', {
                detail: { message: 'Based on my current progress, what should I focus on next? Give me personalized recommendations.' }
              }));
            }}
            className="gap-2 bg-gradient-hero text-primary-foreground"
          >
            <MessageCircle className="h-3.5 w-3.5" /> Ask Diya
          </Button>
        </div>
      </div>

      {/* Reset */}
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="mb-3 text-sm text-muted-foreground">Want to start fresh? This will reset all your progress, scores, and badges.</p>
        <Button variant="outline" size="sm" onClick={resetProgress} className="gap-2 text-danger border-danger/30 hover:bg-danger/5">
          <RotateCcw className="h-3.5 w-3.5" /> Reset All Progress
        </Button>
      </div>
    </div>
  );
};

export default ProgressPage;
