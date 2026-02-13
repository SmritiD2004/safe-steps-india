
# AI Safety Coach NPC for SafePath

## Overview
Add a persistent AI Safety Coach ("Diya") powered by Lovable AI that provides personalized safety guidance, post-scenario feedback, and adaptive learning recommendations. The coach will be accessible as a floating chat widget throughout the app and will have deep context about the player's progress, completed scenarios, and knowledge gaps.

## What Gets Built

### 1. Backend: Lovable Cloud Edge Function
**File: `supabase/functions/safety-coach/index.ts`**

A Supabase Edge Function that calls the Lovable AI Gateway with a trauma-informed system prompt. The prompt includes:
- SafePath's role as a women's safety educator in India
- All Indian safety laws (IPC 354, POSH Act, IT Act, etc.)
- Emergency helpline numbers
- Strict trauma-informed language guidelines (no victim-blaming, empowering tone)
- Player context (level, confidence score, completed scenarios, badges) sent with each request
- Adaptive difficulty: if confidence is low, the coach is more encouraging; if high, it challenges with deeper questions

Uses streaming SSE for real-time token-by-token responses. Handles 429/402 rate limit errors gracefully.

### 2. Frontend: Streaming Chat Client
**File: `src/lib/safetyCoachStream.ts`**

A reusable streaming function that connects to the edge function, parses SSE line-by-line, and emits tokens via callbacks. Handles errors, rate limits, and displays appropriate toast messages.

### 3. Frontend: AI Coach Chat Component
**File: `src/components/SafetyCoach.tsx`**

A floating chat widget (bottom-right corner) with:
- Collapsible button showing Diya's avatar emoji
- Chat panel with message history (user + assistant messages)
- Markdown rendering for AI responses using a simple prose formatter
- Streaming text display (tokens appear as they arrive)
- Pre-built quick-action buttons: "Review my last scenario", "What should I learn next?", "Explain my rights", "Safety tip"
- Player context automatically included in every request
- Loading state with pulsing indicator

### 4. Integration Points

- **AppShell.tsx**: Add the `SafetyCoach` component so it appears on every page
- **ScenarioPlayer.tsx**: After completing a scenario, offer a "Talk to Diya about this" button that opens the coach with context about the scenario result
- **RolePlayPlayer.tsx**: Same post-completion integration
- **ProgressPage.tsx**: Add a "Get personalized recommendations" button

### 5. Adaptive Difficulty Logic
The system prompt dynamically adjusts based on player state sent from the client:
- Confidence below 40: Extra encouraging, focuses on small wins
- Confidence 40-70: Balanced guidance with practical tips
- Confidence above 70: Challenges with deeper legal knowledge and edge cases
- Recommends unplayed scenarios and unread knowledge modules

## Technical Details

### Edge Function System Prompt Structure
The system prompt will contain:
- Identity: "You are Diya, SafePath's AI Safety Coach"
- Indian legal knowledge (all IPC sections, POSH Act, IT Act, DV Act)
- Emergency contacts (112, 181, 1091, 1930)
- Trauma-informed guidelines
- Dynamic player context placeholder filled per request

### Config
- Model: `google/gemini-3-flash-preview` (default)
- Streaming enabled
- JWT verification disabled (anonymous play support)
- CORS configured for preview domain

### New Files
| File | Purpose |
|------|---------|
| `supabase/functions/safety-coach/index.ts` | Edge function calling Lovable AI |
| `supabase/config.toml` | Supabase config with function registration |
| `src/lib/safetyCoachStream.ts` | SSE streaming client |
| `src/components/SafetyCoach.tsx` | Floating chat widget UI |

### Modified Files
| File | Change |
|------|--------|
| `src/components/AppShell.tsx` | Add SafetyCoach component |
| `src/pages/ScenarioPlayer.tsx` | Add "Talk to Diya" post-completion button |
| `src/pages/RolePlayPlayer.tsx` | Add "Talk to Diya" post-completion button |
| `src/pages/ProgressPage.tsx` | Add "Get recommendations" button |

### Dependencies
- Lovable Cloud must be enabled (will be set up first)
- `LOVABLE_API_KEY` is auto-provisioned -- no user action needed
