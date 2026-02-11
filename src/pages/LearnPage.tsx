import { useState } from 'react';
import { motion } from 'framer-motion';
import { knowledgeModules, safetyLaws, emergencyContacts } from '@/data/safetyKnowledge';
import { useGameStore } from '@/stores/gameStore';
import { Phone, BookOpen, Scale, ChevronDown, ChevronUp, Shield } from 'lucide-react';

const LearnPage = () => {
  const { knowledgeModulesRead, markKnowledgeRead } = useGameStore();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [expandedLaw, setExpandedLaw] = useState<string | null>(null);

  const toggleModule = (id: string) => {
    if (expandedModule === id) {
      setExpandedModule(null);
    } else {
      setExpandedModule(id);
      markKnowledgeRead(id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="mb-2 font-display text-3xl font-bold text-foreground">Safety Knowledge</h1>
      <p className="mb-10 text-muted-foreground">Empower yourself with knowledge about your rights, safety practices, and emergency resources.</p>

      {/* Emergency Contacts */}
      <section className="mb-12">
        <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-foreground">
          <Phone className="h-5 w-5 text-danger" /> Emergency Helplines
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {emergencyContacts.map((c) => (
            <a
              key={c.number}
              href={`tel:${c.number}`}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-soft transition-all hover:shadow-glow hover:border-primary/30"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-lg font-bold text-danger">
                {c.number}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.description}</p>
                <p className="text-xs text-safe">{c.available}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Knowledge Modules */}
      <section className="mb-12">
        <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-foreground">
          <BookOpen className="h-5 w-5 text-primary" /> Safety Modules
        </h2>
        <div className="space-y-3">
          {knowledgeModules.map((mod, i) => {
            const isExpanded = expandedModule === mod.id;
            const isRead = knowledgeModulesRead.includes(mod.id);
            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card shadow-soft overflow-hidden"
              >
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{mod.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{mod.title}</p>
                      <p className="text-xs text-muted-foreground">{mod.summary}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isRead && <span className="text-xs text-safe font-medium">✓ Read</span>}
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </button>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    className="border-t border-border px-5 pb-5 pt-4"
                  >
                    <ul className="mb-4 space-y-2">
                      {mod.content.map((item, idx) => (
                        <li key={idx} className="flex gap-2 text-sm text-foreground">
                          <span className="mt-1 text-primary">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
                      <p className="mb-2 text-xs font-semibold text-primary flex items-center gap-1">
                        <Shield className="h-3 w-3" /> Safety Tips
                      </p>
                      <ul className="space-y-1">
                        {mod.tips.map((tip, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground">💡 {tip}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Legal Rights */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-foreground">
          <Scale className="h-5 w-5 text-empowerment" /> Your Legal Rights
        </h2>
        <div className="space-y-3">
          {safetyLaws.map((law) => {
            const isExpanded = expandedLaw === law.id;
            return (
              <div key={law.id} className="rounded-xl border border-border bg-card shadow-soft overflow-hidden">
                <button
                  onClick={() => setExpandedLaw(isExpanded ? null : law.id)}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{law.title}</p>
                    <p className="text-xs text-empowerment font-medium">{law.section}</p>
                  </div>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>
                {isExpanded && (
                  <div className="border-t border-border px-4 pb-4 pt-3 space-y-2">
                    <p className="text-sm text-foreground">{law.description}</p>
                    <div className="rounded-lg bg-danger/5 p-2.5">
                      <p className="text-xs font-semibold text-danger">Punishment</p>
                      <p className="text-xs text-foreground">{law.punishment}</p>
                    </div>
                    <div className="rounded-lg bg-muted p-2.5">
                      <p className="text-xs font-semibold text-muted-foreground">Example</p>
                      <p className="text-xs text-foreground">{law.example}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default LearnPage;
