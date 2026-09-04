---
name: sprintdesk-frontend-experience
description: Persistent frontend, UX, responsive-design, accessibility, motion, and content authority for the SprintDesk marketing website. Use whenever building, reviewing, refactoring, or extending SprintDesk pages or product demonstrations, especially routes such as /, /features, /how-it-works, /solutions/*, /pricing, and /resources/*.
---

# SprintDesk Frontend Experience

Treat this skill as the design and UX authority for the SprintDesk marketing website. The goal is a premium, distinctive, production-grade SaaS experience that feels intelligent, focused, structured, fast, technical, and human.

## Non-negotiable principles

- Make the product UI the primary visual asset. Prefer real product behavior and believable interface states over decorative illustration or abstract effects.
- Optimize for clarity, hierarchy, and editorial composition. Use strong whitespace and a few intentional visual moments.
- Keep SprintDesk visually original. Linear and Notion may inform discipline, density, and storytelling, but do not copy their visual language.
- Do not let the site become a generic SaaS template, component-library demo, interchangeable card collection, or effects showcase.
- Do not change working product behavior to satisfy a visual request.
- Never invent product capabilities, integrations, AI behavior, customer proof, metrics, certifications, enterprise guarantees, pricing limits, discounts, or billing behavior. Verify claims against the working product and approved documentation; flag uncertainty instead of marketing it.

## Before editing

Inspect the existing implementation before changing it:

- Framework, routing, dependencies, and rendering strategy
- Existing components, design tokens, typography, spacing, colors, and animation utilities
- Existing product UI and responsive behavior
- Existing accessibility and SEO implementation

Extend working components where it is clean. Do not rewrite sound architecture for tidiness, create a competing design system, or add unnecessary dependencies. Reuse behavior without forcing every page into the same visual template.

## Visual direction

Use a dark-first system:

- Near-black and deep-charcoal foundations
- Elevated charcoal surfaces with fine borders and minimal shadows
- Off-white primary text and clearly readable muted-gray secondary text
- Restrained indigo/violet with restrained blue/cyan only where it communicates active state, progress, interaction, or important information

Do not turn the site into a purple gradient. Gradients support the identity; they are not the identity. Do not use color as the only status indicator.

Use a strong grid, controlled asymmetry, intentional negative space, occasional overlap, and occasional grid-breaking moments. Asymmetry must improve comprehension, not merely look creative. Not every section needs a card; avoid card-inside-card-inside-card, heavy shadows, excessive radii, and enclosing every section.

## Anti-slop rules

Do not default to:

- Purple or blue/purple gradient backgrounds, neon glow, glassmorphism, floating blobs, particles, or meaningless 3D objects
- Generic giant gradient headlines, huge multi-line copy, or tiny low-contrast body text
- Inter, Roboto, Arial, or Space Grotesk as the marketing default
- Centered hero + dashboard + three cards
- Repeated number/eyebrow/heading/paragraph/checklist/card sections
- Repeated three-card or six-card feature grids, identical card heights, or symmetric alternating sections everywhere
- Stock photography, cartoon illustrations, random floating icons, emoji interface icons, fake analytics, fake testimonials, fake logos, meaningless statistics, or “trusted by thousands” bars
- Generic filler FAQs, newsletter footers, repeated “Get Started / Learn More” button pairs
- Animation on every section, fade-in-up on everything, scale-on-hover everywhere, excessive parallax, infinite marquees, bouncy indicators, or decorative motion without meaning

If the design becomes predictable, change the composition rather than only changing the color.

## Typography

Use Geist for marketing typography unless the existing product interface has a justified different typeface. Do not rewrite existing product UI typography solely for consistency.

- Desktop: H1 56–72px, H2 40–48px, H3 28–36px, body 16–18px, labels 12–14px
- Mobile: H1 36–42px, H2 30–34px, H3 24–28px, body 16–18px
- Body line-height approximately 1.5–1.7; display line-height approximately 1.0–1.15
- Keep headings informative and generally within 2–3 lines. Do not enlarge them just to fill space or make every H2 feel like a hero.
- Keep reading widths comfortable and maintain strong contrast.

Copy must explain what SprintDesk does, who it helps, how it works, what differentiates its workflow, and what outcome the user gets. Avoid generic claims such as “Supercharge your productivity” unless there is a specific strategic reason.

## Page grammar

Every major page has a distinct job. Do not collapse all routes into the homepage structure.

### Homepage `/`

Answer: “Why should I care about SprintDesk?”

Tell an editorial product story: hero → problem/tension → product idea → personal + team distinction → selected capabilities → audience relevance → pricing preview → final CTA. Demonstrate the product and differentiation without turning the page into the full feature catalog or complete workflow story.

### Features `/features`

Answer: “What can SprintDesk actually do?”

Present a capability library with product demonstrations. Cover Capture, Task Management, Sprint Boards, Calendar, Command Center, and Automations. Give each a distinct composition:

- Capture: large inbox demonstration
- Task Management: task detail and organization
- Sprint Boards: large, full-width board
- Calendar: calendar-first composition
- Command Center: manager-visibility composition
- Automations: interactive rule-builder

Do not repeat six identical numbered text-and-card sections.

### How it works `/how-it-works`

Answer: “How does SprintDesk turn incoming work into coordinated execution?”

Make this the primary scroll-storytelling page. Use a persistent workflow index, realistic product-state transitions, controlled scroll interaction, and concise explanatory copy:

`01 Capture → 02 Triage → 03 Focus → 04 Execute → 05 Monitor → 06 Automate`

Let product UI carry most of the explanation. Do not add the full feature catalog, pricing grid, audience grid, or six identical two-column sections.

### Solutions

Routes: `/solutions/managers`, `/solutions/remote-teams`, `/solutions/individuals`.

Use audience-specific product states; do not duplicate the homepage.

- Managers: visibility, workload, ownership, progress, coordination, less status-chasing
- Remote teams: async coordination, shared context, ownership, visibility, fewer scattered updates
- Individuals: capture, personal focus, organization, planning, turning thoughts into actionable work

### Pricing `/pricing`

Make this one of the calmest pages. Prioritize understanding plans, differences, intended audience, and next action. Use clear comparison, concise feature grouping, strong hierarchy, and subtle interaction. Avoid giant dashboards, animated backgrounds, decorative theatrics, excessive cards, and unverified plan claims.

### Resources

Routes: `/resources/blog`, `/resources/guides`, `/resources/templates`.

Keep these editorial and content-first:

- Blog: article hierarchy, readable typography, categories, useful metadata, restrained interaction, strong previews
- Guides: educational progression, useful product screenshots, clear internal linking
- Templates: practical preview, clear use case, product context, useful CTA

Do not reuse the homepage structure.

## Navigation

Desktop navigation is persistent and compact. Use a capability index, not a giant sitemap:

- Product: Overview, Capture Inbox, Task Management, Sprint Boards, Calendar, Command Center, Automations, How It Works
- Solutions: Managers, Remote Teams, Individuals
- Resources: Blog, Guides, Templates
- Pricing

Keep Capture/Triage/Focus/Execute/Monitor/Automate as the workflow story primarily on `/how-it-works`, not inside the Product capability hierarchy. Use the existing approved signup or get-started destination for the primary CTA.

Mobile navigation must be a deliberate mobile menu, not a squeezed desktop dropdown. It must be keyboard accessible, focus-managed, easy to close, clearly hierarchical, touch-friendly, and independent of hover. Never use a hamburger navigation on desktop.

## Responsive behavior

Treat responsive work as a redesign, not desktop squeezed smaller. Check 320px, 375px, 390px, 768px, 1024px, 1280px, 1440px, and 1536px.

Default mobile behavior is a single-column flow with stacked sections, full-width controls, simplified product demonstrations, progressive disclosure, and touch-safe interactions. A compact side-by-side composition is acceptable when it remains readable and intentional.

Never shrink a complex dashboard until it is unreadable. Simplify, stack, crop intentionally, or use horizontal scrolling only when the full state is genuinely useful. Preserve the core product meaning and prevent horizontal overflow.

Interactive targets should generally be at least 44×44px, preferably 48px for important mobile controls. Essential functionality must not require hover or precision tapping. Give every hover interaction an accessible equivalent.

## Accessibility

Every page must provide:

- Semantic HTML and one clear H1
- Logical H2/H3 hierarchy
- Keyboard navigation and clearly visible focus states
- Accessible links, buttons, tabs, and correctly labelled forms
- Correct ARIA only where needed
- At least 4.5:1 contrast for body text and 3:1 for large text; use stronger contrast for critical text where practical
- Meaningful alt text, skip navigation where appropriate, and the correct document language
- Usability at 200% zoom
- Status communication that does not rely on color alone
- Reduced-motion support

Never remove the browser focus outline without replacing it with a stronger visible focus treatment.

## Motion

Motion must explain, orient, confirm, or delight. Prioritize product behavior, then meaningful transitions, then micro-interactions, and use decoration sparingly.

- Homepage: medium motion; prioritize product behavior and selected hero/UI reveals
- Features: medium-high; use interactive demonstrations and product-state transitions, not the same animation six times
- How It Works: high; use scroll-linked workflow transitions and product progression
- Solutions: medium; show audience-specific UI states, not generic cinematic effects
- Pricing: very low; hover, focus, plan selection, and small state changes
- Resources: low; hover, reveal, and navigation feedback
- Footer: almost none beyond hover, focus, and navigation feedback

Timing guidance:

- Instant feedback: 100–150ms
- Standard state transition: 200–300ms
- Layout/content transition: 300–500ms
- Entrance: 500–800ms only when justified

Prefer out-quart `cubic-bezier(0.25,1,0.5,1)`, out-quint `cubic-bezier(0.22,1,0.36,1)`, or out-expo `cubic-bezier(0.16,1,0.3,1)`. Avoid bounce, elastic, excessive spring motion, and cartoon-like easing. Exits should usually be shorter than entrances.

Prefer transform and opacity. Avoid animating width, height, top, left, margin, or padding without a compelling reason. Use `will-change` sparingly. Under `prefers-reduced-motion`, remove non-essential motion, disable scroll-linked effects, reduce transitions, and preserve functionality and hierarchy.

## Product UI realism

Product demonstrations must resemble a real SprintDesk product. Use believable task names, dates, priorities, statuses, assignees, board columns, inbox entries, calendar states, workload states, sprint information, and automation rules. Do not use lorem ipsum, impossible metrics, random charts, fake dashboards, or unrelated decorative UI.

When a marketing claim depends on behavior not verified in code or approved documentation, stop and flag it. Do not call estimated completion “AI prediction” or claim unsupported AI automation.

## Architecture and performance

Prefer reusable areas such as navigation, mobile menu, hero, section heading, product browser, capture inbox, triage, task flow, sprint board, workspace switcher, command center, calendar, automation, audience tabs, pricing preview, final CTA, and editorial article components.

Share behavior and primitives, but allow page-specific composition. Do not make every page a generic universal section.

Prioritize fast first render, optimized images and fonts, efficient SVGs, lazy-loaded non-critical media, minimal client-side JavaScript, code splitting, and server rendering/static generation where appropriate. Avoid heavy background video, unnecessary WebGL, huge images, large client-only bundles, and animation libraries when CSS is sufficient.

## Completion gate

Before declaring frontend work complete, check:

- Composition feels intentional and human-designed; sections have varied rhythm and cards are not overused.
- Typography has clear hierarchy, readable body copy, comfortable line lengths, and no giant filler headings.
- Product UI is realistic, communicates actual SprintDesk behavior, and contains no invented claims.
- Motion has meaning, is restrained, performs well, and supports reduced motion.
- 320/375/390/768/1024/1280/1440/1536px layouts work without accidental overflow; mobile is intentionally recomposed.
- Keyboard navigation, focus, contrast, semantic headings, touch targets, forms, tabs, alt text, zoom, and status indicators are sound.
- There is no generic hero, repetitive card grid, unnecessary gradient, decorative blob, meaningless motion, fake proof, or template-like section parade.

The final standard is simple: do less, but make every important thing intentional. SprintDesk should feel like a real product with a strong point of view. The strongest visual element is usually the product, the strongest interaction is product behavior, and the strongest differentiator is the personal-focus × team-execution workflow.