import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { puzzles } from '@/data/puzzles';
import { Puzzle, Target } from 'lucide-react';
import puzzleHero from '@/assets/puzzle-hero.jpg';

const PuzzlePage = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      {/* Hero Banner */}
      <div className="mb-8 flex flex-col md:flex-row items-center gap-8 rounded-2xl bg-gradient-to-br from-accent/5 via-primary/5 to-background p-6 md:p-8">
        <div className="flex-1">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Puzzle className="h-4 w-4" />
            Puzzle Mode
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Safety Puzzles</h1>
          <p className="mt-2 text-muted-foreground">
            Test your safety knowledge with drag-and-drop matching and red flag identification challenges.
          </p>
        </div>
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          src={puzzleHero}
          alt="Colorful puzzle pieces floating with sparkles"
          className="w-48 md:w-56 rounded-2xl shadow-warm object-cover"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {puzzles.map((puzzle, i) => (
          <motion.div
            key={puzzle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={`/puzzles/${puzzle.id}`}
              className="group block rounded-xl border border-border bg-card p-6 shadow-soft transition-all hover:shadow-glow hover:border-primary/30"
            >
              <div className="mb-4 flex items-start justify-between">
                <span className="text-4xl">{puzzle.icon}</span>
                <div className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {puzzle.type === 'matching' ? (
                    <>
                      <Target className="h-3 w-3" />
                      Match
                    </>
                  ) : (
                    <>
                      🚩
                      <span>Red Flags</span>
                    </>
                  )}
                </div>
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {puzzle.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{puzzle.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  puzzle.difficulty === 'beginner' ? 'bg-safe/10 text-safe' :
                  puzzle.difficulty === 'intermediate' ? 'bg-warning/10 text-warning' :
                  'bg-danger/10 text-danger'
                }`}>
                  {puzzle.difficulty}
                </span>
                <span className="text-xs text-muted-foreground">
                  {puzzle.maxScore} pts max
                  {puzzle.timeLimit && ` · ${puzzle.timeLimit}s`}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PuzzlePage;
