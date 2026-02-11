import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { scenarios } from '@/data/scenarios';
import { useGameStore } from '@/stores/gameStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, CheckCircle } from 'lucide-react';

const avatarOptions = ['👩', '👩‍💼', '👩‍🎓', '👩‍💻', '👩‍🔬', '👩‍⚕️', '🧕', '👩‍🦱', '👩‍🦰', '👱‍♀️'];

const PlayPage = () => {
  const { playerName, avatarEmoji, setPlayerName, setAvatarEmoji, completedScenarios } = useGameStore();
  const [showSetup, setShowSetup] = useState(!playerName);
  const [nameInput, setNameInput] = useState(playerName);

  const handleStartSetup = () => {
    if (nameInput.trim()) {
      setPlayerName(nameInput.trim());
      setShowSetup(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <AnimatePresence mode="wait">
        {showSetup ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-auto max-w-md"
          >
            <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
              <h2 className="mb-2 font-display text-2xl font-bold text-foreground">Welcome to SafePath</h2>
              <p className="mb-6 text-sm text-muted-foreground">
                Choose your avatar and name to begin your safety learning journey.
                You can play anonymously — no personal data is collected.
              </p>

              <label className="mb-2 block text-sm font-medium text-foreground">Choose Your Avatar</label>
              <div className="mb-6 flex flex-wrap gap-2">
                {avatarOptions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setAvatarEmoji(emoji)}
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-all ${
                      avatarEmoji === emoji
                        ? 'bg-primary/10 ring-2 ring-primary shadow-glow'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                    aria-label={`Select avatar ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <label className="mb-2 block text-sm font-medium text-foreground">Your Name (optional)</label>
              <Input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter a name or nickname"
                className="mb-6"
                onKeyDown={(e) => e.key === 'Enter' && handleStartSetup()}
              />

              <Button
                onClick={handleStartSetup}
                className="w-full bg-gradient-hero text-primary-foreground gap-2"
                disabled={!nameInput.trim()}
              >
                Begin Journey <ArrowRight className="h-4 w-4" />
              </Button>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Your progress is saved locally. No account needed.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="scenarios"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold text-foreground">Choose a Scenario</h1>
              <p className="mt-2 text-muted-foreground">
                Each scenario presents a real-world situation. Your choices matter and affect your safety score.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {scenarios.map((scenario, i) => {
                const isCompleted = completedScenarios.includes(scenario.id);
                return (
                  <motion.div
                    key={scenario.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={`/play/${scenario.id}`}
                      className="group block rounded-xl border border-border bg-card p-6 shadow-soft transition-all hover:shadow-glow hover:border-primary/30"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <span className="text-4xl">{scenario.icon}</span>
                        {isCompleted && (
                          <CheckCircle className="h-5 w-5 text-safe" />
                        )}
                      </div>
                      <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {scenario.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">{scenario.category}</p>
                      <p className="mt-3 text-sm text-muted-foreground">{scenario.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          scenario.difficulty === 'beginner' ? 'bg-safe/10 text-safe' :
                          scenario.difficulty === 'intermediate' ? 'bg-warning/10 text-warning' :
                          'bg-danger/10 text-danger'
                        }`}>
                          {scenario.difficulty}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {scenario.maxScore} pts max
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlayPage;
