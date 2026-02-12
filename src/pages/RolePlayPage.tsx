import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { roleplays } from '@/data/roleplays';
import { useGameStore } from '@/stores/gameStore';
import { CheckCircle, MessageCircle } from 'lucide-react';

const RolePlayPage = () => {
  const { completedScenarios } = useGameStore();

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          <MessageCircle className="h-4 w-4" />
          Role-Play Mode
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Practice Conversations
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Navigate dialogue-driven scenarios that test your emotional intelligence — empathy, assertiveness, awareness, and composure.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roleplays.map((rp, i) => {
          const isCompleted = completedScenarios.includes(`roleplay-${rp.id}`);
          return (
            <motion.div
              key={rp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/roleplay/${rp.id}`}
                className="group block rounded-xl border border-border bg-card p-6 shadow-soft transition-all hover:shadow-glow hover:border-primary/30"
              >
                <div className="mb-4 flex items-start justify-between">
                  <span className="text-4xl">{rp.icon}</span>
                  {isCompleted && <CheckCircle className="h-5 w-5 text-safe" />}
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {rp.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">{rp.category}</p>
                <p className="mt-3 text-sm text-muted-foreground">{rp.description}</p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {rp.npcEmoji} {rp.npcName}
                  </span>
                  <span className="text-muted-foreground">·</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    rp.difficulty === 'beginner' ? 'bg-safe/10 text-safe' :
                    rp.difficulty === 'intermediate' ? 'bg-warning/10 text-warning' :
                    'bg-danger/10 text-danger'
                  }`}>
                    {rp.difficulty}
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RolePlayPage;
