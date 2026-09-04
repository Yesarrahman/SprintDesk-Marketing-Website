---
name: sprintdesk-seo-content-system
description: Permanent SEO, search architecture, content strategy, and AI-search visibility authority for the SprintDesk marketing website. Use when planning or editing metadata, routes, content, blog articles, topic clusters, internal links, structured data, canonicals, sitemaps, robots.txt, indexability, product landing pages, or SEO QA.
---

# SprintDesk SEO & Content System

Use this skill alongside `sprintdesk-frontend-experience`. The frontend skill controls visual expression, UX, responsive behavior, accessibility, and motion. This skill controls semantic/search structure, technical SEO, information architecture, search intent, content quality, internal authority, and AI-search readiness.

## Source of truth

When instructions conflict, follow this order:

1. Actual SprintDesk capabilities and production implementation
2. Existing SprintDesk sitemap and information architecture
3. Approved master product/build prompt
4. SprintDesk frontend/design system
5. This SEO and content system
6. Implementation convenience

SEO must never invent product capabilities to satisfy a keyword, create pages merely because a feature or keyword exists, or distort the product architecture. Strengthen the existing information architecture instead of flattening it.

## Core objective

Optimize for discoverability, crawlability, indexability, relevance, search-intent satisfaction, information clarity, usefulness, internal authority flow, entity understanding, AI-search retrieval/citation, and post-search conversion.

Do not optimize for keyword density, generic AI content, or page volume. Every important page must have a clear reason to exist and should be useful to humans without relying on a CTA.

## Established architecture

Preserve these public routes:

- `/`
- `/features`
- `/how-it-works`
- `/solutions/managers`
- `/solutions/remote-teams`
- `/solutions/individuals`
- `/pricing`
- `/resources/blog`
- `/resources/guides`
- `/resources/templates`
- `/resources/blog/[slug]`

Feature anchors:

`/features#capture`, `/features#tasks`, `/features#sprints`, `/features#calendar`, `/features#command-center`, `/features#automations`

Workflow anchors:

`/how-it-works#capture`, `/how-it-works#triage`, `/how-it-works#focus`, `/how-it-works#execute`, `/how-it-works#monitor`, `/how-it-works#automate`

Do not create `/task-management`, `/task-management-software`, `/best-task-management-tool`, or similar keyword variants unless there is a genuine distinct intent, sufficient unique content, and a durable strategic purpose. Do not turn each feature anchor into a thin standalone SEO page.

## Page jobs

Give every indexable page one primary search/user job:

- Homepage: establish SprintDesk’s category, explain the personal + team positioning, and convert qualified visitors. Do not make it rank for every feature.
- Features: canonical capability hub for Capture Inbox, Task Management, Sprint Boards, Calendar, Command Center, and Automations. Each section should explain what it is, the problem it solves, how SprintDesk handles it, relevant behavior, who benefits, and when it is useful.
- How It Works: explain the operating model as `Capture → Triage → Focus → Execute → Monitor → Automate`. Keep workflow stages distinct from the capability hierarchy.
- Solutions: match a specific audience to a specific problem, workflow, product evidence, outcome, CTA, and internal-link path. Never clone the same page with audience words swapped.
- Pricing: support a purchase decision with truthful plans, differences, audience fit, and next action.
- Blog/guides/templates: provide educational, practical, editorial content with an appropriate product connection.

## Search intent

For every SEO page or content brief, identify:

- Primary and secondary intent
- Target audience and user stage
- Searcher’s primary question/problem
- Desired next action

Use four intent categories:

- Informational: understanding a concept; usually Blog or Guides
- Commercial investigation: evaluating approaches/tools; Blog, Guides, Features, or Solutions
- Product/category: seeking a product or category solution; Homepage, Features, or Solutions
- Transactional: ready to act; Pricing or the existing signup CTA destination

Do not force informational content into a sales page or make a product page answer a broad educational question better handled by an article.

## Topic clusters

Build around durable clusters rather than isolated articles:

- Task Management: systems, organization, prioritization, personal/team management, tracking → `/features#tasks`
- Project Management: planning, tracking, workflows, small-team tools → `/features` and `/how-it-works`
- Remote Team Execution: async task management, coordination, distributed workflows → `/solutions/remote-teams`
- Personal Productivity: planning, prioritization, multiple priorities, personal systems → `/solutions/individuals`
- Manager Execution: visibility, workload, sprint planning, coordination, oversight → `/solutions/managers`

Each cluster should have pillar content, supporting articles, practical guides, useful templates where appropriate, and product pages that genuinely solve the problem. Build a deliberate graph:

`article → supporting article → pillar guide → relevant capability → relevant solution → pricing/signup when appropriate`

Do not publish isolated articles or force a product CTA into every paragraph.

## Blog and article standards

Use stable, descriptive slugs under `/resources/blog/[slug]`, with lowercase words and hyphens. Avoid unnecessary dates and do not change published URLs without a redirect plan.

A strong article generally includes a breadcrumb, H1, early answer/thesis, author and accurate dates where supported, useful hero media, a table of contents for long pieces, structured H2/H3 sections, original examples, product screenshots/workflow examples where relevant, a practical takeaway, a natural SprintDesk connection, contextual internal links, related resources, and an appropriate CTA. Do not force every article into one rigid template.

Add value through real workflows, clear frameworks, meaningful comparisons, practical recommendations, first-hand product knowledge, original screenshots/diagrams, specific examples, definitions, and evidence. Avoid generic introductions, keyword stuffing, competitor rewrites, inflated word counts, repetitive conclusions, unsupported statistics, fake expertise, fake customer stories, and generic AI advice.

## AI-search and answerability

Treat AEO/GEO as good foundational SEO, not a separate magic ranking system. Use explicit terminology, logical headings, self-contained explanations, accurate facts, consistent entity references, clear relationships, original information, evidence, and freshness where it matters.

Answer the primary question early. Use definitions, direct explanations, comparison tables only when useful, steps, examples, pros/cons, and clear conclusions. Do not bury the answer under a long introduction or manufacture FAQ blocks for snippets. Important claims must make sense without requiring unstated context.

Use concrete product evidence—actual UI, behavior, workflows, roles, pricing, and supported capabilities—instead of decorative marketing claims. Product UI can be both conversion evidence and semantic context.

## Internal linking and breadcrumbs

Prioritize contextual links over repetitive navigation links. Every important page should be reachable and have semantically sensible relationships. Use natural, descriptive, varied anchors; never link every article to every page.

Default authority flow:

`Resources → educational content → pillar content → product capability → solution page → pricing/signup`

User intent overrides this default.

Breadcrumbs must reflect the real hierarchy, such as:

- Home → Resources → Blog → Article
- Home → Resources → Guides → Guide
- Home → Resources → Templates → Template
- Home → Solutions → Remote Teams

Visible breadcrumbs and `BreadcrumbList` schema must match. Never create a fake SEO-only hierarchy.

## Metadata, URLs, and indexability

Every important indexable page needs:

- A unique, intent-matched title
- A specific, useful meta description
- One clear H1 and logical H2/H3 structure
- A preferred HTTPS production canonical
- Stable lowercase hyphenated URL when public
- Appropriate robots directives
- Open Graph and Twitter/X metadata where appropriate

Do not mechanically derive titles from route names or reuse descriptions. Keep semantic heading structure separate from visual scale; the frontend skill controls the latter.

Before indexing a page, verify that it has a real purpose, unique useful content, a correct canonical, internal reachability, no placeholder copy, no accidental duplication, and no staging/demo/private application content. Use `noindex` intentionally, not to hide weak information architecture.

## Sitemap and robots.txt

The XML sitemap should contain canonical, indexable, meaningful public URLs: homepage, capability/workflow pages, solution pages, pricing where appropriate, resource hubs, and published indexable content.

Exclude noindex pages, redirects, duplicates, tracking URLs, private/authenticated routes, and staging routes. Use accurate `lastmod` only when content meaningfully changes; do not manufacture freshness.

`robots.txt` should allow public marketing content, reference the sitemap, avoid blocking assets needed for rendering/indexing, and avoid exposing private application areas unnecessarily. Do not use robots.txt as a substitute for noindex; crawlers must be able to see a noindex directive.

## Structured data

Use JSON-LD only when it accurately represents visible page content:

- Homepage: `Organization` and `WebSite`
- Product-oriented pages: `SoftwareApplication` or accurate subtype, plus `Organization` where relevant
- Blog articles: `Article` or `BlogPosting`, `BreadcrumbList`, and supported author information
- Guides: accurate article/educational schema and breadcrumbs
- Solutions: appropriate product/application and organization relationships

Use only supported properties. Never invent pricing, ratings, reviews, operating systems, offers, authorship, dates, categories, organizational details, or aggregate ratings. Schema-only breadcrumbs are not allowed.

FAQs are allowed when they resolve genuine user uncertainty. Do not repeat FAQ blocks across the site merely to chase rich results.

## Content integrity

Never publish unverified features, integrations, customers, testimonials, logos, metrics, security/compliance claims, pricing limits, performance claims, awards, reviews, case studies, authors, or statistics. If a detail cannot be verified from the current implementation or approved source, mark it as not currently verified rather than guessing.

Before publishing a product claim:

1. Verify the feature exists.
2. Verify the described behavior.
3. Verify relevant plan/availability differences.
4. Verify terminology against the product.
5. Verify screenshots are current.
6. Verify links point to the right page.

Competitor pages require genuine user intent, meaningful differentiation, factual evidence, and unique value. Explain use case, differences, tradeoffs, relevant SprintDesk capabilities, and who each option may suit. Do not publish mass-generated “alternative” pages or unsupported superiority claims.

Programmatic SEO is acceptable only when each page represents a real entity/use case, uses accurate data, is meaningfully different, provides user value, and keeps the architecture understandable.

## Images, rendering, and performance

For meaningful images, use descriptive filenames, concise useful alt text, stable dimensions/aspect ratios, optimized formats, lazy loading below the fold, and priority loading for important above-the-fold assets. Decorative images should generally use empty alt text.

Product screenshots should show real SprintDesk UI where possible, accurate readable states, useful context, and usable mobile layouts. Do not use fake dashboards as SEO illustrations.

Protect LCP, CLS, INP, image/font loading, JavaScript execution, animation overhead, third-party scripts, hydration cost, and large media. Essential title, H1, primary content, internal links, canonical, and appropriate structured data should not depend unnecessarily on fragile client-only rendering. Use one authoritative metadata implementation rather than competing systems.

## Content lifecycle

Before creating a new page, check:

- Does an existing page already answer this?
- Is the intent genuinely different?
- Can an existing page be expanded?
- Would a new page split authority?
- Where does it fit in a topic cluster?
- What internal links will connect it?

For cannibalization, differentiate intent if possible; otherwise consolidate, redirect the weaker page, update links, and repair canonical/sitemap signals. For decaying content, choose deliberately between update, consolidate, redirect, noindex, and remove.

Update content when underlying pricing, capabilities, screenshots, workflows, integrations, statistics, or industry information changes. Set `dateModified` accurately; do not change publication dates just to appear fresh. IndexNow may notify participating engines of meaningful changes, but it is not a ranking shortcut.

## Search-first content brief

Before writing an article, record:

- Primary topic and intent
- Secondary intents
- Target audience and problem
- Unique angle
- Proposed title and H1
- Key questions and required sections
- Supporting topics
- Internal links
- Product connection
- External sources if needed
- Schema type
- CTA
- Freshness/update considerations

Use the content-to-product bridge when appropriate:

`problem → explanation → framework → practical example → workflow → SprintDesk capability → product page → CTA`

The product connection should help the reader; not every article should become a sales page.

## SEO and design collaboration

Frontend controls visual expression; SEO controls semantic/search structure. Do not make headings enormous because they are H1/H2, remove semantic headings for visual convenience, or hide essential content behind interaction. Important copy must exist in accessible HTML. Scroll storytelling is appropriate for `/how-it-works`, but its underlying workflow must remain structurally understandable to crawlers and users.

Mobile must retain core content, important headings, crawlable links, usable navigation, readable text, adaptive tables/content, stable images, and no essential information hidden merely for layout.

## QA gates

### Page-level

- [ ] 200 status, indexability, correct canonical and robots directive
- [ ] Included in sitemap when indexable; no duplicate URL
- [ ] Crawlable internal links and no orphan status
- [ ] Unique intent, clear H1, useful introduction, logical headings
- [ ] Content satisfies intent without keyword stuffing or filler
- [ ] Product claims are accurate
- [ ] Unique title, useful description, Open Graph, correct URL/image
- [ ] Valid schema that matches visible content and contains no fabricated properties

### Site-level

- [ ] Valid sitemap and robots.txt
- [ ] Canonical consistency and no accidental noindex/robots blocking
- [ ] No broken links or orphaned important pages
- [ ] No duplicate titles and avoidable duplicate descriptions
- [ ] Correct heading hierarchy, schema relationships, breadcrumbs, and Open Graph
- [ ] Mobile content parity and acceptable performance
- [ ] No staging URLs or private dashboard pages indexed

### Content-system and pre-publish

Before publishing any page, answer: who is it for, what question does it answer, what is the intent, why should it exist, what does it add, which cluster owns it, what should link to/from it, what capability is genuinely relevant, are claims verified, is it useful without the CTA, are canonical/schema/indexability correct?

If the reason to exist or unique contribution is weak, do not publish it.

Never create near-identical SEO pages, keyword-stuffed headings/footers, generic intros, fake proof, fake comparisons/integrations/case studies, identical metadata, meaningless categories, competitor pages with only names swapped, or FAQ sections on every page.

When editing existing SEO, inspect first, preserve what works, check inbound links, canonical and sitemap implications, assess overlap, make targeted changes, and rerun SEO QA. Do not rewrite the entire SEO system during an unrelated visual change.

The goal is not more pages or keywords. It is stronger pages with clearer intent, accurate evidence, coherent entity relationships, useful answers, and a trustworthy path from search to the right SprintDesk page.