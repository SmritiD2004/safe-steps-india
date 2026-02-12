import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, BookOpen, Trophy, Gamepad2, Puzzle, MessageCircle, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';

const navItems = [
  { path: '/', label: 'Home', icon: Shield },
  { path: '/play', label: 'Play', icon: Gamepad2 },
  { path: '/puzzles', label: 'Puzzles', icon: Puzzle },
  { path: '/roleplay', label: 'Role-Play', icon: MessageCircle },
  { path: '/learn', label: 'Learn', icon: BookOpen },
  { path: '/progress', label: 'Progress', icon: Trophy },
];

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { level, totalPoints, avatarEmoji } = useGameStore();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">SafePath</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-x-2 -bottom-3 h-0.5 rounded-full bg-primary"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm sm:flex">
              <span>{avatarEmoji}</span>
              <span className="font-medium text-foreground">Lv.{level}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-primary font-semibold">{totalPoints} pts</span>
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg p-2 text-muted-foreground hover:text-foreground md:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-border bg-card px-4 py-3 md:hidden"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                  location.pathname === item.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm">
              <span>{avatarEmoji}</span>
              <span className="font-medium">Lv.{level}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-primary font-semibold">{totalPoints} pts</span>
            </div>
          </motion.div>
        )}
      </header>
      <main>{children}</main>
    </div>
  );
};

export default AppShell;
