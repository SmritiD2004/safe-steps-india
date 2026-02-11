import { motion } from 'framer-motion';
import { Shield, Gamepad2, BookOpen, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGameStore } from '@/stores/gameStore';
import { scenarios } from '@/data/scenarios';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Gamepad2,
    title: 'Interactive Scenarios',
    description: 'Navigate real-world Indian safety situations with branching storylines and meaningful choices.',
  },
  {
    icon: BookOpen,
    title: 'Know Your Rights',
    description: 'Learn about IPC sections, POSH Act, IT Act, and emergency helplines that protect you.',
  },
  {
    icon: Shield,
    title: 'Build Confidence',
    description: 'Practice safety decision-making in a safe space. Track your growth with our confidence meter.',
  },
  {
    icon: Heart,
    title: 'Trauma-Informed',
    description: 'Designed with care — empowering language, no victim-blaming, and respectful narratives.',
  },
];

const Index = () => {
  const { playerName, completedScenarios } = useGameStore();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Shield className="h-4 w-4" />
              Empowering Women Through Knowledge
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight text-foreground md:text-6xl">
              Your Safety,{' '}
              <span className="text-gradient-hero">Your Power</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              SafePath is a trauma-informed serious game that helps you build safety awareness,
              learn your legal rights, and practice confident decision-making through
              real-world Indian scenarios.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/play">
                <Button size="lg" className="bg-gradient-hero text-primary-foreground shadow-glow gap-2 px-8 hover:opacity-90">
                  {completedScenarios.length > 0 ? 'Continue Playing' : 'Start Your Journey'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/learn">
                <Button size="lg" variant="outline" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  Safety Knowledge
                </Button>
              </Link>
            </div>
            {playerName && (
              <p className="mt-6 text-sm text-muted-foreground">
                Welcome back, <span className="font-semibold text-foreground">{playerName}</span>! You've completed {completedScenarios.length} of {scenarios.length} scenarios.
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-card py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-foreground">
              Learn Safety Through Play
            </h2>
            <p className="mt-3 text-muted-foreground">
              Practice navigating challenging situations in a safe, supportive environment.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-xl border border-border bg-background p-6 shadow-soft transition-all hover:shadow-glow"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Scenarios Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center font-display text-3xl font-bold text-foreground">
            Real Indian Scenarios
          </h2>
          <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
            {scenarios.map((scenario, i) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/play/${scenario.id}`}
                  className="block rounded-xl border border-border bg-card p-5 transition-all hover:shadow-glow hover:border-primary/30"
                >
                  <div className="mb-3 text-3xl">{scenario.icon}</div>
                  <h3 className="font-display text-base font-semibold text-foreground">{scenario.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{scenario.category}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      scenario.difficulty === 'beginner' ? 'bg-safe/10 text-safe' :
                      scenario.difficulty === 'intermediate' ? 'bg-warning/10 text-warning' :
                      'bg-danger/10 text-danger'
                    }`}>
                      {scenario.difficulty}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency */}
      <section className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            In immediate danger? Call{' '}
            <a href="tel:112" className="font-bold text-danger">112</a> (Emergency) ·{' '}
            <a href="tel:181" className="font-bold text-primary">181</a> (Women Helpline) ·{' '}
            <a href="tel:1091" className="font-bold text-primary">1091</a> (Women in Distress)
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;
