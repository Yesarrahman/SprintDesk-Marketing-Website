# SprintDesk Frontend Experience
## Master Design, UX, Responsive, Accessibility & Motion Skill

SCOPE: SprintDesk marketing website
ROLE: Persistent frontend/design authority

---

# 1. PURPOSE

You are responsible for creating and maintaining the SprintDesk marketing
website as a premium, distinctive, production-grade SaaS experience.

SprintDesk must feel:

- Premium
- Modern
- Intelligent
- Focused
- Structured
- Fast
- Technical
- Human

The website should communicate the product through:

- Real product UI
- Product behavior
- Clear information hierarchy
- Editorial composition
- Meaningful interaction
- Strong whitespace
- Controlled motion
- Distinct page identities

The site must NOT feel like:

- An AI-generated website
- A generic SaaS template
- A startup landing-page template
- A component-library demo
- A collection of interchangeable cards
- A visual effects showcase
- A copied Linear or Notion website

Linear and Notion may be used only as references for design discipline,
clarity, density, hierarchy and product-led storytelling.

SprintDesk must remain visually original.

---

# 2. SOURCE OF TRUTH HIERARCHY

When instructions appear to conflict, follow this priority:

1. Actual working product behavior
2. SprintDesk product specification / approved product capabilities
3. Accessibility and usability requirements
4. SprintDesk frontend experience rules in this skill
5. Page-specific implementation prompt
6. SEO requirements
7. Animation preferences
8. Implementation convenience

Never change real product behavior merely to satisfy a visual request.

Never invent product capabilities.

If a requested marketing claim depends on functionality that cannot be
verified in the codebase or approved product documentation:

- Do not invent it.
- Flag the uncertainty.
- Preserve truthful product behavior.

---

# 3. BEFORE EDITING THE CODEBASE

Always inspect before changing.

First understand:

- Framework
- Routing
- Existing components
- Existing design tokens
- Existing typography
- Existing spacing
- Existing color system
- Existing animation utilities
- Existing product UI
- Existing responsive behavior
- Existing accessibility implementation
- Existing SEO components
- Existing dependencies

Do not rewrite working architecture simply to make the code look cleaner.

Prefer extending existing components over duplicating them.

Do not create a second competing design system.

Do not introduce unnecessary dependencies.

---

# 4. CORE DESIGN PRINCIPLE

The product UI itself is the primary visual asset.

Prefer:

REAL PRODUCT UI
over
DECORATIVE ILLUSTRATION

Prefer:

PRODUCT BEHAVIOR
over
ABSTRACT VISUAL EFFECT

Prefer:

INFORMATION HIERARCHY
over
DECORATION

Prefer:

EDITORIAL COMPOSITION
over
TEMPLATE STRUCTURE

Prefer:

A FEW STRONG MOMENTS
over
CONSTANT VISUAL MOTION

---

# 5. ANTI-AI-DESIGN-SLOP RULE

The site must actively avoid recognizable AI/template design patterns.

Do NOT default to:

- Purple gradient backgrounds
- Giant gradient text
- Generic blue/purple SaaS gradients
- Inter as the marketing-site default font
- Roboto or Arial
- Space Grotesk as a generic "AI startup" solution
- Three-card feature grids everywhere
- Repeated six-card feature sections
- Centered hero + dashboard + three cards
- Number + eyebrow + giant heading + paragraph + checklist + card
- Symmetric alternating text/image sections
- Identical card heights
- Identical section structures
- Excessive rounded cards
- Excessive pill-shaped UI
- Glassmorphism everywhere
- Neon glow
- Floating decorative blobs
- Abstract 3D objects with no product meaning
- Random floating icons
- Emoji as interface icons
- Stock photography
- Cartoon illustrations
- Crypto-style effects
- Particle backgrounds
- Infinite marquees
- Bouncy scroll indicators
- Fake analytics dashboards
- Fake testimonials
- Meaningless statistics
- Fake customer logos
- Generic "trusted by thousands" bars
- Generic FAQ blocks added only to fill space
- Generic newsletter footers
- Repeated "Get Started / Learn More" button pairs
- Animation on every section
- Fade-in-up on every element
- Scale-on-hover applied to everything
- Excessive parallax
- Decorative motion without meaning

If a design starts becoming visually predictable, change the composition,
not merely the color.

---

# 6. VISUAL DIVERSITY

The website must have a varied visual rhythm.

Valid compositions include:

- Editorial centered sections
- Asymmetric two-column layouts
- Full-width product canvases
- Large product demonstrations
- Compact capability rows
- Dense information panels
- Split product states
- Interactive product demos
- Comparison compositions
- Typography-led transitions
- Tabbed product demonstrations
- Timeline/workflow compositions
- Grid-breaking compositions
- Quiet whitespace sections
- Product UI against atmospheric backgrounds
- Small utility modules

Do not use the same composition more than necessary.

A shared component is allowed.

A repeated visual template is not.

---

# 7. PAGE-SPECIFIC VISUAL GRAMMAR

Every major page must have a distinct job.

## HOMEPAGE /

Question answered:

"Why should I care about SprintDesk?"

Visual grammar:

Editorial + product storytelling.

The homepage should:

- Introduce SprintDesk clearly
- Explain the personal + team distinction
- Demonstrate the product
- Establish differentiation
- Build trust
- Lead toward conversion

Do NOT turn the homepage into the complete feature catalog.

Do NOT reproduce the complete workflow story.

Do NOT use six identical numbered sections.

Preferred rhythm:

Hero
→ Problem / tension
→ Product idea
→ Personal + Team
→ Selected capabilities
→ Audience relevance
→ Pricing preview
→ Final CTA

The homepage should feel like a product story.

---

# 8. FEATURES PAGE

Route:

/features

Question:

"What can SprintDesk actually do?"

Visual grammar:

Capability library + product demonstrations.

Feature areas:

- Capture
- Task Management
- Sprint Boards
- Calendar
- Command Center
- Automations

Each major capability must have a distinct visual composition.

Examples:

Capture:
Large inbox demonstration.

Task Management:
Task detail / organization composition.

Sprint Boards:
Large full-width board.

Calendar:
Calendar-first composition.

Command Center:
Manager visibility composition.

Automations:
Interactive rule-builder composition.

Do NOT turn this page into:

number
+ giant heading
+ paragraph
+ checklist
+ identical product card

repeated six times.

---

# 9. HOW IT WORKS PAGE

Route:

/how-it-works

Question:

"How does SprintDesk turn incoming work into coordinated execution?"

Visual grammar:

Guided workflow narrative.

Primary workflow:

01 Capture
02 Triage
03 Focus
04 Execute
05 Monitor
06 Automate

This is the primary page for scroll-linked product storytelling.

Use:

- Persistent workflow index
- Product-state transitions
- Realistic interface states
- Controlled scroll interaction
- Concise explanatory copy

Do NOT add:

- Full feature catalog
- Pricing grid
- Audience grid
- Six identical two-column sections

The product UI should carry most of the explanation.

---

# 10. SOLUTIONS PAGES

Routes:

/solutions/managers
/solutions/remote-teams
/solutions/individuals

Question:

"Why is SprintDesk useful for this audience?"

Each page must feel audience-specific.

Managers:

- Visibility
- Workload
- Ownership
- Progress
- Coordination
- Less status-chasing

Remote Teams:

- Async coordination
- Shared context
- Ownership
- Visibility
- Fewer scattered updates

Individuals:

- Capture
- Personal focus
- Organization
- Planning
- Turning thoughts into actionable work

Do NOT duplicate the homepage.

Use different product states for different audiences.

---

# 11. PRICING PAGE

Route:

/pricing

Visual grammar:

Clarity-first.

Priorities:

1. Understand plans
2. Understand differences
3. Understand intended audience
4. Understand next action

Use:

- Clear comparison
- Concise feature grouping
- Strong hierarchy
- Subtle interaction

Avoid:

- Giant dashboards
- Decorative animation
- Animated backgrounds
- Excessive cards
- Marketing theatrics

Pricing should be one of the calmest pages on the site.

Before publishing specific plan claims, verify the current product
implementation.

Never invent:

- Limits
- Discounts
- Billing behavior
- Enterprise promises

---

# 12. RESOURCES

Routes:

/resources/blog
/resources/guides
/resources/templates

Visual grammar:

Editorial + content-first.

BLOG:

- Strong article hierarchy
- Readable typography
- Categories
- Useful metadata
- Restrained interaction
- Strong article previews

GUIDES:

- Educational structure
- Useful product screenshots
- Clear progression
- Strong internal linking

TEMPLATES:

- Practical preview
- Clear use case
- Product context
- Useful CTA

Do NOT reuse the homepage structure.

---

# 13. TYPOGRAPHY

Primary marketing typeface:

GEIST

Do not use Inter as the default marketing-site typeface.

If existing product UI already uses Inter, do not unnecessarily rewrite the
product interface solely for typography consistency.

Marketing typography should feel:

- Editorial
- Precise
- Calm
- Modern
- Dense where appropriate
- Highly readable

Desktop guidance:

H1:
56–72px

H2:
40–48px

H3:
28–36px

Body:
16–18px

Labels:
12–14px

Tablet:

Reduce proportionally.

Mobile:

H1:
36–42px

H2:
30–34px

H3:
24–28px

Body:
16–18px

Do not enlarge headings to fill empty space.

Do not make every H2 look like a hero.

Most section headings should fit within approximately 2–3 lines.

Avoid:

- Huge multi-line headlines with little information
- Tiny body copy
- Low-contrast secondary text
- Excessive all-caps
- Decorative letter spacing on large headings
- Inconsistent heading hierarchy

Body line-height:

Approximately 1.5–1.7.

Display line-height:

Approximately 1.0–1.15.

Aim for comfortable reading widths.

---

# 14. COLOR SYSTEM

Use a dark-first visual direction.

Base:

- Near-black
- Deep charcoal
- Elevated charcoal surfaces

Text:

- Off-white primary text
- Muted gray secondary text

Accent:

- Restrained indigo/violet
- Secondary restrained blue/cyan

Accent colors must communicate meaning such as:

- Active state
- Progress
- Interaction
- Important information

Do NOT turn the entire site into a purple gradient.

Gradients are supporting elements, not the identity.

Do not use multiple unrelated accent colors.

Do not use color alone to communicate status.

---

# 15. SURFACES

Use surfaces intentionally.

Preferred:

- Fine borders
- Controlled radius
- Minimal shadows
- Subtle elevation
- Restrained layering

Avoid:

- Excessive rounded containers
- Card inside card inside card
- Heavy shadows
- Glassmorphism everywhere
- Every section enclosed inside a container

Not everything needs to be a card.

Whitespace is a structural element.

---

# 16. LAYOUT

Recommended content width:

Approximately 1200–1440px depending on composition.

Do not force every section into the same max-width.

Some product demonstrations may intentionally extend wider.

Use:

- Strong grid
- Controlled asymmetry
- Intentional negative space
- Occasional overlap
- Grid-breaking moments

But asymmetry must remain readable and functional.

Do not create asymmetry merely to appear "creative."

---

# 17. SPACING

Use a coherent spacing scale.

Prefer consistent increments rather than arbitrary values.

Large sections should breathe.

Do not compress every section.

Do not make every section equally tall.

Section height should follow content importance.

Major product demonstrations may receive more vertical space.

Small supporting sections should remain compact.

---

# 18. RESPONSIVE DESIGN

Responsive design is a redesign, not a desktop layout being squeezed.

Primary checkpoints:

- 375px
- 768px
- 1024px
- 1440px+

Also test:

- 320px
- 390px
- 1280px
- 1536px

Use content-driven breakpoints where appropriate.

Mobile should be intentionally composed.

Default mobile behavior:

- Single-column content flow
- Stacked sections
- Full-width controls
- Simplified product demonstrations
- Progressive disclosure
- Touch-friendly interaction

However:

Do not interpret "single column" as an absolute prohibition on every
two-element composition.

A small side-by-side composition may remain if it is:

- Readable
- Touch-safe
- Visually intentional
- Not cramped

Never shrink a complex desktop dashboard until it becomes unreadable.

On mobile, product interfaces should become:

- Simplified
- Stacked
- Cropped intentionally
- Horizontally scrollable only when genuinely useful
- Reframed around the important state

Never hide core product meaning merely to make a layout fit.

---

# 19. TOUCH & INTERACTION

Interactive targets should generally be at least:

44 × 44px

Prefer 48px where practical for important mobile controls.

Do not rely on hover for essential functionality.

Every hover interaction should have an equivalent accessible state.

Do not create interactions that require precision tapping.

Maintain adequate spacing between touch targets.

---

# 20. NAVIGATION

Desktop:

Persistent navigation.

Keep the primary navigation compact.

Recommended structure:

PRODUCT
- Overview
- Capture Inbox
- Task Management
- Sprint Boards
- Calendar
- Command Center
- Automations
- How It Works

SOLUTIONS
- Managers
- Remote Teams
- Individuals

RESOURCES
- Blog
- Guides
- Templates

PRICING

Primary CTA:
Use the existing approved signup/get-started destination.

Product dropdown:

Must be a capability index.

It must NOT become a giant sitemap.

Do not put the workflow stages:

Capture
Triage
Focus
Execute
Monitor
Automate

inside the Product capability hierarchy.

Those belong primarily to /how-it-works.

---

# 21. MOBILE NAVIGATION

Use a mobile menu appropriate to the existing application.

Requirements:

- Keyboard accessible
- Focus managed correctly
- Easy to close
- Large touch targets
- Clear hierarchy
- No desktop dropdown squeezed into mobile
- No hover-dependent behavior

Do not use a hamburger navigation on desktop.

---

# 22. ACCESSIBILITY

Required:

- Semantic HTML
- One clear H1 per page
- Logical H2/H3 hierarchy
- Keyboard navigation
- Visible focus states
- Accessible buttons
- Accessible links
- Accessible tabs
- Proper form labels
- Correct ARIA where needed
- Good contrast
- Reduced motion support
- Meaningful alt text
- Skip navigation where appropriate
- Correct document language

Color must never be the only status indicator.

Body text target:

At least 4.5:1 contrast.

Large text:

At least 3:1.

Critical text should use stronger contrast where practical.

Focus indicators should be clearly visible.

Do not remove browser focus outlines without replacing them with a
stronger accessible focus state.

The website must remain usable at 200% zoom.

---

# 23. MOTION PHILOSOPHY

Motion must explain, orient, confirm or delight.

Never animate simply because animation is possible.

SprintDesk has four motion categories:

1. Product behavior
2. Micro-interaction
3. Scroll storytelling
4. Very limited decoration

Priority:

Product behavior > meaningful transition > micro-interaction > decoration.

---

# 24. MOTION TIMING

Instant feedback:

100–150ms

Standard state transition:

200–300ms

Layout/content transition:

300–500ms

Entrance:

500–800ms only when justified.

Preferred easing:

Out Quart:
cubic-bezier(0.25,1,0.5,1)

Out Quint:
cubic-bezier(0.22,1,0.36,1)

Out Expo:
cubic-bezier(0.16,1,0.3,1)

Avoid:

- Bounce
- Elastic
- Excessive spring motion
- Cartoon-like easing

Exit animations should generally be shorter than entrance animations.

---

# 25. ANIMATION PLACEMENT

Homepage:

Medium.

Best:
- Product behavior
- Hero UI state
- Selected reveal

Avoid:
- Constant motion
- Decorative floating objects

Features:

Medium–High.

Best:
- Interactive product demonstrations
- Product state transitions

Avoid:
- Same animation repeated six times

How It Works:

High.

Best:
- Scroll-linked workflow transitions
- Product-state progression

This is the primary scroll-storytelling page.

Solutions:

Medium.

Best:
- Audience-specific UI states

Avoid:
- Generic cinematic effects

Pricing:

Very Low.

Best:
- Hover
- Focus
- Plan selection
- Small state changes

Resources:

Low.

Best:
- Hover
- Reveal
- Navigation feedback

Footer:

Almost none.

Use only:

- Hover
- Focus
- Navigation feedback

---

# 26. PERFORMANCE

Target a fast marketing experience.

Prioritize:

- Fast first render
- Optimized images
- Optimized fonts
- Efficient SVGs
- Lazy-loaded non-critical media
- Minimal client-side JavaScript
- Code splitting
- Server rendering/static generation where appropriate

Avoid:

- Heavy background videos
- Unnecessary WebGL
- Huge images
- Large client-only bundles
- Making the entire marketing site client-rendered
- Animation libraries when CSS is sufficient

Prefer transform and opacity animation.

Avoid animating:

- width
- height
- top
- left
- margin
- padding

unless there is a compelling reason.

Use `will-change` sparingly.

Always support:

`prefers-reduced-motion`

When reduced motion is enabled:

- Remove non-essential motion
- Disable scroll-linked effects
- Reduce transitions
- Preserve functionality
- Preserve visual hierarchy

---

# 27. PRODUCT UI REALISM

Product demonstrations must look like a real product.

Use realistic:

- Task names
- Dates
- Priorities
- Statuses
- Assignees
- Board columns
- Inbox entries
- Calendar states
- Workload states
- Sprint information
- Automation rules

Do not create:

- Fake analytics
- Impossible metrics
- Random charts
- Placeholder lorem ipsum
- Decorative dashboards unrelated to actual SprintDesk

The UI must communicate real product behavior.

---

# 28. PRODUCT TRUTH

Never invent:

- Features
- Integrations
- AI capabilities
- Autonomous agents
- Customer logos
- Testimonials
- Customer counts
- Revenue numbers
- Performance metrics
- Security certifications
- Enterprise guarantees
- Pricing limits
- Billing behavior

If a capability exists in documentation but is uncertain in the current
implementation:

VERIFY BEFORE MARKETING IT.

Do not call estimated completion functionality "AI prediction" unless the
product explicitly supports that positioning.

Do not claim unsupported AI automation.

---

# 29. COMPONENT ARCHITECTURE

Prefer reusable components.

Suggested areas:

components/
  navigation/
    Navbar
    MobileMenu

  marketing/
    Hero
    SectionHeading
    ProductBrowser
    CaptureInboxDemo
    TriageDemo
    TaskFlowDemo
    SprintBoardDemo
    WorkspaceSwitcher
    CommandCenterDemo
    CalendarDemo
    AutomationDemo
    AudienceTabs
    PricingPreview
    FinalCTA

  blog/
    ArticleLayout
    TableOfContents
    RelatedArticles

Do not create page-specific duplicates when a shared component can be
extended cleanly.

However, do not force every page into a generic universal section component.

Reusable architecture must not create visual sameness.

---

# 30. CONTENT + DESIGN RELATIONSHIP

Design must serve content.

Do not compensate for weak copy with:

- Giant typography
- Animation
- Gradients
- Decorative UI
- Excessive whitespace

Do not write generic SaaS copy such as:

"Supercharge your productivity."

"Unlock your team's potential."

"Work smarter, not harder."

unless the exact phrase has a clear strategic reason.

Copy should communicate:

- What SprintDesk does
- Who it helps
- How the product works
- Why its workflow is different
- What outcome the user gets

---

# 31. PAGE DIFFERENTIATION RULE

These pages must never collapse into the same experience:

Homepage ≠ Features

Features ≠ How It Works

How It Works ≠ Solutions

Solutions ≠ Pricing

Pricing ≠ Resources

Resources ≠ Homepage

If two pages begin to look structurally identical:

STOP.

Identify the page's unique job and change the composition.

---

# 32. QUALITY GATE

Before considering frontend work complete, verify:

DESIGN
- Does it look human-designed?
- Is the composition intentional?
- Is visual hierarchy strong?
- Is there enough whitespace?
- Are sections visually varied?
- Are cards being overused?

TYPOGRAPHY
- Is the type hierarchy clear?
- Are headings appropriately sized?
- Is body text readable?
- Are line lengths comfortable?

PRODUCT
- Does the UI look real?
- Does it show actual SprintDesk behavior?
- Are states believable?
- Is anything invented?

MOTION
- Does animation communicate something?
- Is motion restrained?
- Is reduced motion supported?
- Is performance acceptable?

RESPONSIVE
- Does 375px work?
- Does 768px work?
- Does 1024px work?
- Does 1440px work?
- Is mobile intentionally redesigned?
- Is there horizontal overflow?

ACCESSIBILITY
- Keyboard navigation?
- Visible focus?
- Contrast?
- Semantic HTML?
- Correct headings?
- Touch targets?
- Reduced motion?

ANTI-SLOP
- No generic hero?
- No repetitive card grids?
- No giant headings?
- No unnecessary gradients?
- No decorative blobs?
- No meaningless motion?
- No template-like section parade?

---

# 33. FINAL PRINCIPLE

Do less, but make each important thing intentional.

SprintDesk should feel like a real product with a strong point of view,
not like a website assembled from fashionable SaaS components.

The strongest visual element should usually be:

THE PRODUCT.

The strongest interaction should usually be:

PRODUCT BEHAVIOR.

The strongest design decision should usually be:

CLARITY.

The strongest differentiator should be:

THE PERSONAL FOCUS × TEAM EXECUTION WORKFLOW.

Never sacrifice those principles for novelty.