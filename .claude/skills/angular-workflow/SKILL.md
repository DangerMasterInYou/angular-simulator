---
name: angular-workflow
description: Routes the AI agent to specific context and rule files for Angular 22.2.5 and TypeScript 6.0.3 development, enforcing micro-steps and low token usage.
---
# Context Router & Skill Loader
## Rule
Read ONLY the files mapped to the current micro-step. Never load the entire `context/` directory at once.
## Routing Table
- **Starting ANY task or resuming after chat reset** -> Read `context/current_task.md` and `context/tasks.md`.
- **Creating components, services, or refactoring** -> Read `context/architecture.md` (Sections 1 & 2).
- **Working on HTML templates, CSS/SCSS, or UI** -> Read `context/ux-guidelines.md`.
- **Handling >1,000 items, async streams, or performance bottlenecks** -> Read `context/architecture.md` (Section 3).
- **Preparing code or scenarios for unit tests** -> Read `context/architecture.md` (Section 4).
