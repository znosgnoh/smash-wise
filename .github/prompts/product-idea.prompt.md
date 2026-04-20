# Product Idea Refinement

Take a rough product idea and refine it into a comprehensive product bible (`docs/main-idea.md`) by running it through multiple specialist perspectives.

## Input

The user provides a raw product idea — anywhere from a one-liner to a rough brainstorm. This prompt transforms it into a structured, deeply thought-out product document.

## Multi-Agent Workflow

Run the idea through these agents **in sequence**, building on each previous output:

### Step 1: Product Manager (`product-manager`)
- Clarify the core value proposition — what job does this product do?
- Define what it IS and what it is NOT
- Identify target personas (2-3) with demographics, wants, and pains
- Establish the core user loop (open → action → reward → return)
- Set success criteria and north star metric
- Define product phases (MVP → Phase 2 → Phase 3 → Phase 4)
- Flag anti-goals and scope boundaries

### Step 2: UI/UX Designer (`ui-ux-designer`)
- Define the visual direction (theme, colors, typography, effects)
- Map game/product states to UI treatments
- List core screens and their primary purpose
- Break down key UI components
- Establish UX rules and interaction principles
- Define responsive strategy (mobile-first breakpoints)

### Step 3: Tech Architect (`tech-architect`)
- Recommend tech stack with reasoning
- Design state management architecture
- Define data models and relationships
- Plan the persistence strategy (MVP → production)
- Outline API and mutation patterns
- Create a scalability roadmap across phases

### Step 4: Growth Hacker (`growth-hacker`)
- Define the AARRR funnel for this product
- Identify the activation moment
- Design retention hooks
- Map the competitive landscape
- Plan acquisition channels
- Suggest referral/viral mechanics

### Step 5: Copywriter (`copywriter`)
- Establish brand voice and tone guidelines
- Define product vocabulary (always use / never use)
- Write key UI copy: onboarding, empty states, errors, celebrations
- Create tagline options

### Step 6: Data Analyst (`data-analyst`)
- Define the metrics framework (north star + input/output metrics)
- Design the event tracking schema
- Establish targets per phase
- Plan behavioral segmentation

## Output Structure

Compile all agent outputs into a single `docs/main-idea.md` with this structure:

```markdown
# Smash Wise — Product Bible

> Single source of truth for vision, design, and technical direction.

## 1. Vision & Philosophy
- What it is / what it is not
- Core philosophy and beliefs
- Core user loop diagram

## 2. Target Users
- Primary persona
- Secondary persona(s)
- Language guide (preferred vs forbidden terms)

## 3. Core Experience
- Feature breakdown by phase
- Interaction patterns
- Feedback and reward systems

## 4. UI/UX Direction
- Visual design (theme, colors, typography, effects)
- Core screens and components
- State → UI mapping
- UX rules

## 5. Technical Architecture
- Tech stack table
- State management strategy
- Data models
- API patterns
- Scalability roadmap

## 6. Growth & Metrics
- AARRR funnel
- Competitive landscape
- Core metrics framework
- Targets per phase

## 7. Brand Voice
- Tone and principles
- Key copy examples
- Vocabulary guide

## 8. Product Phases
- Phase 1: MVP — scope and success gate
- Phase 2: Persistence — scope and success gate
- Phase 3: Growth — scope and success gate
- Phase 4: Scale — scope and success gate
```

## Process Rules

1. **Start with the user's raw idea** — don't ask for more detail upfront; each agent extracts what they need
2. **Each agent builds on previous outputs** — the tech architect reads the product manager's personas and the designer's screens
3. **Challenge assumptions** — agents should flag risks and anti-patterns, not just agree
4. **Keep it opinionated** — make decisions, don't present options. The user can override later.
5. **Output a single file** — `docs/main-idea.md` should be self-contained and readable end-to-end
6. **Include diagrams as ASCII/text** — no external image dependencies
7. **Use math notation** for formulas (KaTeX-compatible) when applicable
