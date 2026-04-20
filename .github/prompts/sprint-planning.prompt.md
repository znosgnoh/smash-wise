# Sprint Planning

Plan the next development sprint. Break down work into actionable, shippable increments.

## Framework

### 1. Sprint Goal
- One sentence describing what this sprint achieves for the user
- Must tie to the core value proposition or a measurable metric

### 2. Backlog Review
- Review the product roadmap for current phase and priorities
- Identify the highest-impact items that are feasible this sprint

### 3. Task Breakdown
For each feature/task:
- **Title:** Action-oriented (e.g., "Add user settings page")
- **Type:** Feature / Bug / Chore / Spike
- **Size:** XS (< 1h) / S (1-3h) / M (3-8h) / L (1-2d) / XL (3-5d)
- **Acceptance criteria:** Clear, testable conditions
- **Dependencies:** What must be done first?

### 4. Sprint Scope Rules
- Total capacity: ~40 hours of focused work
- Mix: 70% features, 20% tech debt/bugs, 10% exploration
- Every task must be demoable or verifiable when "done"
- No task larger than L — break XL items down further
- Always include `pnpm lint` + `pnpm build` passing as acceptance criteria

### 5. Definition of Done
- [ ] Code written and self-reviewed
- [ ] `pnpm lint` passes
- [ ] `pnpm build` succeeds
- [ ] UI matches project design system
- [ ] Animations feel smooth and purposeful
- [ ] Accessible (keyboard nav, semantic HTML, contrast)
- [ ] No console errors or warnings

### 6. Retrospective Questions
After sprint completion:
- What shipped that users would notice?
- What's the one thing that improved the UX most?
- What slowed us down? How to prevent next time?
- What should we stop doing?
