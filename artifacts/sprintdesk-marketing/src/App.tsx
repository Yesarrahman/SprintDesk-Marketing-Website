import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Inbox,
  Layers3,
  Menu,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import { Link, Route, Switch, useLocation, useParams, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

type Stage = 'capture' | 'triage' | 'focus' | 'execute' | 'monitor' | 'automate';

const stageLabels: { id: Stage; label: string }[] = [
  { id: 'capture', label: 'Capture' },
  { id: 'triage', label: 'Triage' },
  { id: 'focus', label: 'Focus' },
  { id: 'execute', label: 'Execute' },
  { id: 'monitor', label: 'Monitor' },
  { id: 'automate', label: 'Automate' },
];

function Meta({ title, description, path = '', faq, image = 'https://sprintdesk.app/sprintdesk-logo.png', imageAlt = 'SprintDesk' }: { title: string; description: string; path?: string; faq?: { question: string; answer: string }[]; image?: string; imageAlt?: string }) {
  useEffect(() => {
    document.title = title;
    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let node = document.head.querySelector(`meta[${attr}="${name}"]`);
      if (!node) {
        node = document.createElement('meta');
        node.setAttribute(attr, name);
        document.head.appendChild(node);
      }
      node.setAttribute('content', content);
    };
    setMeta('description', description);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', 'website', true);
    setMeta('og:url', `https://sprintdesk.app${path || window.location.pathname}`, true);
    setMeta('og:image', image, true);
    setMeta('og:image:alt', imageAlt, true);
    setMeta('og:image:width', '1200', true);
    setMeta('og:image:height', '630', true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image);
    setMeta('twitter:image:alt', imageAlt);
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://sprintdesk.app${path || window.location.pathname}`);
    let schema = document.head.querySelector('#sprintdesk-schema') as HTMLScriptElement | null;
    if (!schema) {
      schema = document.createElement('script');
      schema.id = 'sprintdesk-schema';
      schema.type = 'application/ld+json';
      document.head.appendChild(schema);
    }
    const softwareSchema = {
      '@context': 'https://schema.org',
      '@type': path === '/' ? ['Organization', 'WebSite', 'SoftwareApplication'] : 'SoftwareApplication',
      name: 'SprintDesk',
      url: `https://sprintdesk.app${path || window.location.pathname}`,
      description,
      applicationCategory: 'BusinessApplication',
    };
    schema.textContent = JSON.stringify(faq?.length ? {
      '@context': 'https://schema.org',
      '@graph': [
        softwareSchema,
        {
          '@type': 'FAQPage',
          mainEntity: faq.map(({ question, answer }) => ({
            '@type': 'Question',
            name: question,
            acceptedAnswer: { '@type': 'Answer', text: answer },
          })),
        },
      ],
    } : softwareSchema);
  }, [title, description, path, faq, image, imageAlt]);
  return null;
}

function Logo() {
  return <Link href="/" className="brand" data-testid="link-logo" aria-label="SprintDesk home"><img className="brand-logo" src="/sprintdesk-logo.png" alt="SprintDesk" /></Link>;
}

function MotionObserver() {
  useEffect(() => {
    const shell = document.querySelector<HTMLElement>('.site-shell');
    shell?.classList.add('motion-ready');
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-visible'));
      return () => shell?.classList.remove('motion-ready');
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    nodes.forEach((node) => observer.observe(node));
    return () => {
      observer.disconnect();
      shell?.classList.remove('motion-ready');
    };
  }, []);
  return null;
}

const productLinks = [
  ['Capture Inbox', '/features#capture'],
  ['Personal Task Flow', '/features#tasks'],
  ['Personal task management', '/personal-task-management'],
  ['Team task management', '/team-task-management'],
  ['Remote team task management', '/remote-team-task-management'],
  ['Team workload management', '/team-workload-management'],
  ['Sprint management', '/sprint-management'],
  ['Team Sprint Board', '/features#sprints'],
  ['Command Center', '/features#command-center'],
  ['Automations', '/workflow-automation'],
];
const solutionLinks = [
  ['Managers', '/solutions/managers'],
  ['Remote Teams', '/solutions/remote-teams'],
  ['Individuals', '/solutions/individuals'],
];
const resourceLinks = [
  ['Blog', '/resources/blog'],
  ['Guides', '/resources/guides'],
  ['Templates', '/resources/templates'],
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const listener = () => setScrolled(window.scrollY > 22);
    window.addEventListener('scroll', listener, { passive: true });
    return () => window.removeEventListener('scroll', listener);
  }, []);
  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobile]);
  const menu = (name: string, links: string[][]) => (
    <div className="dropdown">
      <button className="nav-trigger" onClick={() => setOpen(open === name ? null : name)} aria-expanded={open === name} data-testid={`button-nav-${name.toLowerCase()}`}>
        {name} <ChevronDown size={13} />
      </button>
      {open === name && <div className="dropdown-panel" role="menu">{links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(null)} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}<small>{name === 'Product' ? 'Product capability' : name === 'Solutions' ? 'A focused way to work' : 'Practical thinking for teams'}</small></Link>)}</div>}
    </div>
  );
  return (
    <header className={`nav-wrap ${scrolled ? 'scrolled' : ''}`}>
      <div className="container-wide nav-inner">
        <Logo />
        <nav className="nav-links" aria-label="Primary navigation">
          {menu('Product', productLinks)}
          {menu('Solutions', solutionLinks)}
          {menu('Resources', resourceLinks)}
          <Link href="/pricing" className="nav-link" data-testid="link-nav-pricing">Pricing</Link>
        </nav>
        <div className="nav-actions">
          <a href="#footer-contact" className="login-link" data-testid="link-log-in">Log in</a>
          <a className="button-primary" href="#start" data-testid="link-start-free">Start free <ArrowUpRight size={15} /></a>
        </div>
        <button className="menu-button" onClick={() => setMobile(!mobile)} aria-label={mobile ? 'Close navigation' : 'Open navigation'} aria-expanded={mobile} data-testid="button-mobile-menu">{mobile ? <X size={19} /> : <Menu size={19} />}</button>
      </div>
      {mobile && <nav className="mobile-nav" aria-label="Mobile navigation">
        <p className="eyebrow" style={{ padding: '6px 12px' }}>Explore SprintDesk</p>
        <span className="mobile-nav-label">Product</span>
        {productLinks.map(([label, href]) => <Link key={href} href={href} onClick={() => setMobile(false)} data-testid={`link-mobile-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</Link>)}
        <Link href="/how-it-works" onClick={() => setMobile(false)} data-testid="link-mobile-how-it-works">How it works</Link>
        <span className="mobile-nav-label">Solutions</span>
        {solutionLinks.map(([label, href]) => <Link key={href} href={href} onClick={() => setMobile(false)} data-testid={`link-mobile-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</Link>)}
        <span className="mobile-nav-label">Resources</span>
        {resourceLinks.map(([label, href]) => <Link key={href} href={href} onClick={() => setMobile(false)} data-testid={`link-mobile-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</Link>)}
        <Link href="/pricing" onClick={() => setMobile(false)} data-testid="link-mobile-pricing">Pricing</Link>
        <a href="#start" className="button-primary mobile-cta" onClick={() => setMobile(false)} data-testid="link-mobile-start">Start free <ArrowUpRight size={15} /></a>
      </nav>}
    </header>
  );
}

function Footer() {
  const groups: [string, string[][]][] = [
    ['PRODUCT', [['Features', '/features'], ['How it works', '/how-it-works'], ['Personal task management', '/personal-task-management'], ['Team task management', '/team-task-management'], ['Remote team task management', '/remote-team-task-management'], ['Team workload management', '/team-workload-management'], ['Sprint management', '/sprint-management'], ['Task management', '/features#tasks'], ['Sprint boards', '/features#sprints'], ['Automations', '/workflow-automation']]],
    ['SOLUTIONS', [['Managers', '/solutions/managers'], ['Remote teams', '/solutions/remote-teams'], ['Individuals', '/solutions/individuals']]],
    ['RESOURCES', [['Blog', '/resources/blog'], ['Guides', '/resources/guides'], ['Templates', '/resources/templates']]],
    ['COMPANY', [['About SprintDesk', '/'], ['Contact', '#footer-contact'], ['Privacy', '/privacy'], ['Terms', '/terms'], ['Security', '/security']]],
  ];
  return <footer className="footer" id="footer-contact">
    <div className="container-wide">
      <div className="footer-main">
        <div className="footer-brand"><Logo /><p>Where personal focus meets team velocity. Capture personally. Organize intelligently. Execute together.</p></div>
        {groups.map(([heading, links]) => <div className="footer-col" key={heading}><h4>{heading}</h4>{(links as string[][]).map(([label, href]) => <Link key={href} href={href} data-testid={`link-footer-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</Link>)}</div>)}
      </div>
      <div className="footer-bottom"><span>© 2025 SprintDesk. A quieter way to move work.</span><span>Built for the work between the thought and the outcome.</span></div>
    </div>
  </footer>;
}

function Shell({ children }: { children: ReactNode }) {
  return <div className="site-shell"><MotionObserver /><Navbar />{children}<Footer /></div>;
}

function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return <div className="section-heading"><div className="eyebrow">{eyebrow}</div><h2 className="display">{title}</h2>{body && <p>{body}</p>}</div>;
}

function CaptureDemo({ compact = false }: { compact?: boolean }) {
  const [captured, setCaptured] = useState(false);
  const [triaged, setTriaged] = useState(false);
  return <div className={`product-frame ${compact ? 'compact-demo' : ''}`} data-testid="demo-capture-inbox">
    <div className="window-bar"><i /><i /><i /><span className="window-name">sprintdesk / personal-inbox</span></div>
    <div className="product-layout">
      {!compact && <aside className="product-side"><div className="side-label">Workspace</div><div className="side-item active"><span className="side-dot" /> Personal</div><div className="side-item"><Layers3 size={12} /> Team / Core</div><div className="side-label" style={{ marginTop: 28 }}>Views</div><div className="side-item"><Inbox size={12} /> Capture Inbox</div><div className="side-item"><Target size={12} /> Task Flow</div></aside>}
      <main className="product-main">
        <div className="main-top"><div><h3>Capture Inbox</h3><span>Private until you choose otherwise</span></div><span>{triaged ? 'Triaged 01' : 'Inbox 05'}</span></div>
        <button className="capture-input" onClick={() => setCaptured(!captured)} aria-live="polite" data-testid="button-capture-thought"><Sparkles size={14} /><span>{captured ? 'Captured just now' : 'Capture a thought…'}</span>{captured && <Check size={13} color="hsl(var(--accent))" />}</button>
        <div className="mock-list">
          {(captured ? ['Fix mobile navbar', 'Follow up with Sarah', 'Review client feedback'] : ['Fix mobile navbar', 'Follow up with Sarah', 'Review client feedback', 'Idea for onboarding', 'Check sprint blockers']).map((item, index) => <div className="mock-task" key={item} data-testid={`task-inbox-${index}`}><div className="task-leading"><span className="task-check" /><span>{item}</span></div><span className="task-meta">{index === 0 ? 'just now' : `${index + 1}h`}</span></div>)}
        </div>
        <button className="capture-prompt" onClick={() => setTriaged(!triaged)} aria-live="polite" data-testid="button-triage-to-board">{triaged ? 'Added to Personal · Todo ✓' : 'Triage to Board →'}</button>
      </main>
    </div>
  </div>;
}

type HeroPhase = 'capture' | 'triage' | 'personal' | 'team-preview' | 'team';

const heroPhases: { id: HeroPhase; label: string }[] = [
  { id: 'capture', label: 'Capture' },
  { id: 'triage', label: 'Triage' },
  { id: 'personal', label: 'Personal Task Flow' },
  { id: 'team-preview', label: 'Team handoff' },
  { id: 'team', label: 'Team Sprint Board' },
];

function HeroWorkflow() {
  const [phase, setPhase] = useState<HeroPhase>('capture');
  const [playing, setPlaying] = useState(true);
  const phaseIndex = heroPhases.findIndex((item) => item.id === phase);
  const replay = () => {
    setPhase('capture');
    setPlaying(true);
  };

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('team');
      setPlaying(false);
      return;
    }
    if (!playing) return;
    const timeout = window.setTimeout(() => {
      if (phaseIndex >= heroPhases.length - 1) {
        setPlaying(false);
      } else {
        setPhase(heroPhases[phaseIndex + 1].id);
      }
    }, phase === 'capture' ? 1700 : 2900);
    return () => window.clearTimeout(timeout);
  }, [phase, phaseIndex, playing]);

  return (
    <div className="hero-workflow" data-testid="demo-hero-workflow">
      <div className="hero-demo-toolbar">
        <div className="hero-demo-context"><span className="status-light" /> sprintdesk / connected workflow</div>
        <div className="hero-demo-state" aria-live="polite">{playing ? 'PLAYING' : 'PAUSED'} <span>{phaseIndex + 1} / {heroPhases.length}</span></div>
      </div>
      <div className="hero-demo-progress" aria-hidden="true">
        <i style={{ width: `${((phaseIndex + 1) / heroPhases.length) * 100}%` }} />
      </div>
      <div className={`hero-demo-canvas phase-${phase}`} aria-live="polite">
        {phase === 'capture' && (
          <div className="hero-capture-state">
            <div className="hero-demo-sidebar">
              <span className="sidebar-overline">Workspace</span>
              <strong><span className="side-dot" /> Personal</strong>
              <span>Team / Core</span>
              <span>Calendar</span>
            </div>
            <div className="hero-demo-content">
              <div className="hero-demo-heading"><div><span className="eyebrow">Personal space</span><h3>Capture Inbox</h3></div><span className="demo-count">05 incoming</span></div>
              <div className="hero-capture-entry"><Sparkles size={15} /><span>Fix mobile navbar</span><b>captured now</b></div>
              <div className="hero-task-list">
                {['Review onboarding flow', 'Follow up with Sarah', 'Check sprint blockers', 'Client feedback idea'].map((task, index) => (
                  <div className="hero-task-row" key={task}><span className="task-check" /><span>{task}</span><small>{index + 1}h</small></div>
                ))}
              </div>
              <div className="hero-demo-footnote"><span className="raw-marker">RAW THOUGHT</span><span className="thin-connector" /><span>Private until you choose otherwise</span></div>
            </div>
          </div>
        )}
        {phase === 'triage' && (
          <div className="hero-triage-state">
            <div className="hero-underlay">
              <span className="eyebrow">Capture Inbox</span><h3>Fix mobile navbar</h3><p>Captured a moment ago</p>
            </div>
            <div className="triage-panel">
              <div className="triage-panel-top"><span className="eyebrow">Triage task</span><strong>01 / 04</strong></div>
              <h3>Fix mobile navbar</h3>
              <p className="triage-description">Refine the navigation at the 390px breakpoint before the next release.</p>
              <div className="triage-fields">
                <div><span>Workspace</span><strong>Personal <small>⌄</small></strong></div>
                <div><span>Board column</span><strong>Todo <small>⌄</small></strong></div>
                <div><span>Priority</span><strong className="accent-text">High <small>⌄</small></strong></div>
              </div>
              <button className="button-primary" onClick={() => setPhase('personal')} data-testid="button-hero-triage">Move to Personal Task Flow <ArrowRight size={14} /></button>
            </div>
          </div>
        )}
        {phase === 'personal' && (
          <div className="hero-board-state">
            <div className="board-state-heading"><div><span className="eyebrow">Personal workspace</span><h3>Personal Task Flow</h3></div><span className="demo-count">4 due today</span></div>
            <div className="hero-columns">
              {[
                ['Backlog', ['Client proposal']],
                ['Todo', ['Fix mobile navbar', 'Review feedback']],
                ['In Progress', ['Onboarding notes']],
                ['Review', ['Release checklist']],
              ].map(([name, tasks]) => <div className="hero-column" key={name as string}><div className="hero-column-title"><span>{name}</span><b>{(tasks as string[]).length}</b></div>{(tasks as string[]).map((task) => <div className={`hero-card ${task === 'Fix mobile navbar' ? 'selected-card' : ''}`} key={task}><strong>{task}</strong><small>{task === 'Fix mobile navbar' ? 'Todo · High' : 'Personal task'}</small></div>)}</div>)}
            </div>
            <div className="board-state-foot"><span className="route-chip">PERSONAL TASK FLOW</span><span>One thought, now in context.</span></div>
          </div>
        )}
        {(phase === 'team-preview' || phase === 'team') && (
          <div className={`hero-board-state team-state ${phase === 'team' ? 'is-settled' : 'is-handoff'}`}>
            <div className="board-state-heading"><div><span className="eyebrow">Team workspace / Sprint 04</span><h3>Team Sprint Board</h3></div><span className="demo-count accent-text">9 / 12 points</span></div>
            <div className="hero-columns">
              {[
                ['Backlog', ['Release planning']],
                ['Todo', ['Onboarding improvements']],
                ['In Progress', ['Fix mobile navbar']],
                ['Review', ['API documentation']],
              ].map(([name, tasks]) => <div className="hero-column" key={name as string}><div className="hero-column-title"><span>{name}</span><b>{(tasks as string[]).length}</b></div>{(tasks as string[]).map((task) => <div className={`hero-card ${task === 'Fix mobile navbar' ? 'selected-card' : ''}`} key={task}><strong>{task}</strong><small>{task === 'Fix mobile navbar' ? 'Alex Morgan · 3 pts' : 'Sarah Chen · 5 pts'}</small><em>{task === 'Fix mobile navbar' ? 'Website Improvements · Frontend' : 'Product'}</em></div>)}</div>)}
            </div>
            <div className="board-state-foot"><span className="route-chip route-team">TEAM SPRINT BOARD</span><span>{phase === 'team-preview' ? 'The task is entering shared execution.' : 'Progress is visible where the work happens.'}</span></div>
          </div>
        )}
      </div>
      <div className="hero-demo-footer">
        <div className="hero-phase-list" role="list" aria-label="Workflow progress">
          {heroPhases.map((item, index) => <div role="listitem" key={item.id}><button className={phase === item.id ? 'active' : phaseIndex > index ? 'complete' : ''} onClick={() => { setPhase(item.id); setPlaying(false); }} aria-current={phase === item.id ? 'step' : undefined} data-testid={`button-hero-phase-${item.id}`}><span>{String(index + 1).padStart(2, '0')}</span>{item.label}</button></div>)}
        </div>
        {!playing && <button className="replay-button" onClick={replay} aria-label="Replay workflow demonstration" data-testid="button-replay-workflow"><RotateCcw size={13} /> Replay</button>}
      </div>
    </div>
  );
}

function BoardDemo({ full = false }: { full?: boolean }) {
  const [swimlanes, setSwimlanes] = useState(false);
  const [moved, setMoved] = useState(false);
  const columns: [string, string[]][] = moved
    ? [['Backlog', ['Outline pricing page']], ['Todo', ['Fix mobile navbar']], ['In Progress', ['Client onboarding flow']], ['Review', ['API documentation']]]
    : [['Backlog', ['Outline pricing page']], ['Todo', ['Fix mobile navbar', 'Update empty state']], ['In Progress', ['Client onboarding flow']], ['Review', ['API documentation']]];
  return <div className={`wide-board ${full ? 'full-board' : ''}`} data-testid="demo-sprint-board">
    <div className="board-header"><div><h3>Sprint 04 · Product foundations</h3><span>9 of 12 story points complete</span></div><button className="button-secondary" onClick={() => setSwimlanes(!swimlanes)} data-testid="button-toggle-swimlanes">{swimlanes ? 'Columns view' : 'View swimlanes'}</button></div>
    {swimlanes ? <div className="surface" style={{ padding: 16 }}><div className="panel-title"><span>ASSIGNEE</span><span>ACTIVE WORK</span></div>{[['Sarah Chen', 'Fix mobile navbar', 'Review client feedback'], ['David Okafor', 'API documentation'], ['Alex Morgan', 'Client onboarding flow']].map(([name, ...tasks], index) => <div key={name} className="activity-item" data-testid={`swimlane-${index}`}><i style={{ background: index === 2 ? 'hsl(var(--primary))' : 'hsl(var(--accent))' }} /><div><strong style={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}>{name}</strong><p style={{ margin: '5px 0 0' }}>{tasks.join(' · ')}</p></div></div>)}</div> : <div className="board-columns">{columns.map(([title, items], index) => <div className="kanban-col" key={title}><div className="kanban-title"><span>{title}</span><b>{items.length}</b></div>{items.map((item) => <button className="kanban-card" key={item} onClick={() => index === 1 && setMoved(true)} data-testid={`button-board-task-${item.toLowerCase().replaceAll(' ', '-')}`}>{item}<small>{index === 1 ? '3 pts · Sarah' : index === 2 ? '5 pts · Alex' : '2 pts'}</small></button>)}</div>)}</div>}
    <div className="avatar-stack"><span className="avatar">SC</span><span className="avatar">DO</span><span className="avatar">AM</span><span className="avatar">+2</span><span style={{ marginLeft: 14, color: 'hsl(var(--muted-foreground))', fontSize: 11 }}>6 collaborators</span></div>
  </div>;
}

function CommandCenter() {
  const [pulse, setPulse] = useState(false);
  return <div data-testid="demo-command-center">
    <div className="metric-row">
      {[['SPRINT PROGRESS', pulse ? '82%' : '78%', ''], ['TEAM VELOCITY', '+18%', 'accent'], ['OPEN BLOCKERS', '3', '']].map(([label, value, style]) => <div className="metric" key={label}><span>{label}</span><strong className={style}>{value}</strong></div>)}
    </div>
    <div className="command-grid">
      <div className="workload-panel"><div className="panel-title"><span>TEAM WORKLOAD</span><span>THIS SPRINT</span></div>{[['Sarah', 78], ['David', 52], ['Alex', 91], ['Maria', 63]].map(([name, width], index) => <div className="load-row" key={name}><span>{name}</span><div className="load-bar"><i style={{ width: `${pulse && index === 0 ? 86 : width}%` }} /></div><span>{pulse && index === 0 ? '8' : index === 2 ? '9' : index + 4}</span></div>)}<button className="capture-prompt" onClick={() => setPulse(!pulse)} data-testid="button-command-refresh">{pulse ? 'Live update received ✓' : 'View live activity →'}</button></div>
      <div className="activity-panel"><div className="panel-title"><span>ACTIVITY</span><span>LIVE</span></div>{['John moved Landing Page to In Review', 'Sarah completed API Documentation', 'David updated task priority'].map((item, index) => <div className="activity-item" key={item}><i /><div>{item}<time>{index + 1}m ago</time></div></div>)}</div>
    </div>
  </div>;
}

function CalendarDemo() {
  const dates = Array.from({ length: 35 }, (_, i) => i - 1);
  const [selectedDate, setSelectedDate] = useState<number | null>(12);
  const calendarTasks: Record<number, string> = { 4: 'Client proposal', 9: 'Mobile navbar', 14: 'Sprint review', 21: 'Onboarding update', 28: 'Release planning' };
  return <div className="calendar" data-testid="demo-calendar">
    <div className="calendar-month"><strong>September 2026</strong><span>MONTH VIEW · 5 DUE</span></div>
    <div className="calendar-days">{['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => <span key={day}>{day}</span>)}</div>
    <div className="calendar-dates">{dates.map((date, index) => <button className={`date ${date === selectedDate ? 'active' : ''}`} key={index} onClick={() => date > 0 && date <= 30 && setSelectedDate(date)} aria-label={calendarTasks[date] ? `${date} September: ${calendarTasks[date]}` : `${date} September`} data-testid={`button-calendar-date-${date}`}>{date > 0 && date <= 30 && <><b>{date}</b>{calendarTasks[date] && <i className={date === selectedDate ? 'violet' : ''} />}</>}</button>)}</div>
    {selectedDate && calendarTasks[selectedDate] && <div className="calendar-preview"><span>SEP {String(selectedDate).padStart(2, '0')}</span><strong>{calendarTasks[selectedDate]}</strong><button onClick={() => setSelectedDate(null)} aria-label="Close calendar detail" data-testid="button-close-calendar-preview"><X size={13} /></button></div>}
  </div>;
}

function AutomationDemo() {
  const [active, setActive] = useState(false);
  return <div className="rule-builder" data-testid="demo-automation">
    <div className="rule-block"><div className="rule-label">When</div><div className="rule-value"><span>Task status changes to</span><strong>In Review</strong></div></div>
    <div className="rule-arrow">↓</div>
    <div className="rule-block"><div className="rule-label">Then</div><div className="rule-value"><span>Set priority</span><strong>High</strong></div></div>
    <div className="rule-arrow">↓</div>
    <div className="rule-block"><div className="rule-label">And</div><div className="rule-value"><span>Assign to</span><strong>Project Manager</strong></div></div>
    <button className={active ? 'button-primary' : 'button-secondary'} style={{ width: '100%', marginTop: 18 }} onClick={() => setActive(!active)} data-testid="button-activate-automation">{active ? 'Automation active ✓' : 'Activate automation'}</button>
    {active && <div className="active-rule"><i /> Rule will run when a task enters In Review</div>}
  </div>;
}

type AutomationRule = {
  trigger: string;
  action: string;
  assignee: string;
};

function AutomationRuleBuilder() {
  const [rule, setRule] = useState<AutomationRule>({
    trigger: 'In Review',
    action: 'High',
    assignee: 'Project Manager',
  });
  const [active, setActive] = useState(false);
  const [runCount, setRunCount] = useState(0);
  const taskStatus = active ? 'In Review' : 'Todo';
  const priority = active ? rule.action : 'Normal';
  const owner = active ? rule.assignee : 'Unassigned';

  const updateRule = (key: keyof AutomationRule, value: string) => {
    setActive(false);
    setRule((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="automation-builder" data-testid="workflow-automation-builder">
      <div className="automation-builder-head">
        <div>
          <span className="eyebrow">No-code rule builder</span>
          <h3>Keep routine updates moving.</h3>
        </div>
        <span className={`automation-status ${active ? 'is-active' : ''}`} aria-live="polite">
          <i /> {active ? 'AUTOMATION ACTIVE' : 'DRAFT RULE'}
        </span>
      </div>
      <div className="automation-rule-stack">
        <div className="automation-rule-row">
          <span className="automation-rule-label">WHEN</span>
          <label>
            <span>Task status changes to</span>
            <select value={rule.trigger} onChange={(event) => updateRule('trigger', event.target.value)} aria-label="Task status trigger">
              <option>In Review</option>
              <option>Done</option>
              <option>Blocked</option>
            </select>
          </label>
        </div>
        <div className="automation-connector" aria-hidden="true">↓</div>
        <div className="automation-rule-row">
          <span className="automation-rule-label">THEN</span>
          <label>
            <span>Set priority</span>
            <select value={rule.action} onChange={(event) => updateRule('action', event.target.value)} aria-label="Priority action">
              <option>High</option>
              <option>Normal</option>
              <option>Low</option>
            </select>
          </label>
        </div>
        <div className="automation-connector" aria-hidden="true">↓</div>
        <div className="automation-rule-row">
          <span className="automation-rule-label">AND</span>
          <label>
            <span>Assign to</span>
            <select value={rule.assignee} onChange={(event) => updateRule('assignee', event.target.value)} aria-label="Assignment action">
              <option>Project Manager</option>
              <option>Sarah Chen</option>
              <option>David Okafor</option>
            </select>
          </label>
        </div>
      </div>
      <button
        className={active ? 'button-primary' : 'button-secondary'}
        onClick={() => { setActive(true); setRunCount((count) => count + 1); }}
        data-testid="button-run-automation"
      >
        {active ? 'Rule is running ✓' : 'Activate automation'} <ArrowRight size={14} />
      </button>
      <div className={`automation-task-result ${active ? 'is-updated' : ''}`} aria-live="polite">
        <div className="automation-result-top"><span>RESULTING TASK UPDATE</span>{active && <b>UPDATED JUST NOW</b>}</div>
        <div className="automation-task-title"><span className="task-check" /> Prepare sprint review</div>
        <div className="automation-task-meta"><span>STATUS <strong>{taskStatus}</strong></span><span>PRIORITY <strong>{priority}</strong></span><span>OWNER <strong>{owner}</strong></span></div>
        {active && <p className="automation-run-note">Rule run {runCount}: the task picked up its new context automatically.</p>}
      </div>
    </div>
  );
}

function WorkspaceSwitcher() {
  const [mode, setMode] = useState<'personal' | 'team'>('personal');
  const personal = mode === 'personal';
  return <section className="workspace-section" data-reveal>
    <div className="container-wide">
      <div className="workspace-top"><div><div className="eyebrow">One product, two work modes</div><h2 className="display">Your work changes.<br />Your workspace should too.</h2></div><div className="toggle" role="tablist" aria-label="Workspace mode"><button className={personal ? 'active' : ''} onClick={() => setMode('personal')} role="tab" aria-selected={personal} data-testid="button-personal-space">Personal space</button><button className={!personal ? 'active' : ''} onClick={() => setMode('team')} role="tab" aria-selected={!personal} data-testid="button-team-space">Team space</button></div></div>
       <div className="workspace-grid">
        <div className="workspace-copy"><div className="eyebrow">{personal ? 'Personal space' : 'Team space'}</div><h3>{personal ? 'Protect your focus.' : 'See the whole team move.'}</h3><p>{personal ? 'Keep your personal work organized without getting buried in team activity.' : 'Turn individual tasks into coordinated execution with shared visibility and real-time progress.'}</p><ul className="workspace-points">{(personal ? ['Private Capture Inbox', 'Personal Dashboard', 'Task Flow Board', 'Upcoming deadlines'] : ['Sprint Board', 'Story points and progress', 'Swimlanes by assignee', 'Team workload and blockers']).map((point) => <li key={point}><Check size={15} />{point}</li>)}</ul></div>
         <div className={`mode-visual mode-state-${mode}`} key={mode} aria-live="polite">{personal ? <CaptureDemo compact /> : <BoardDemo />}</div>
      </div>
    </div>
  </section>;
}

function WorkflowSection() {
  const [active, setActive] = useState<Stage>('capture');
  const workflowVisual = active === 'capture' ? <CaptureDemo compact /> : active === 'triage' ? <div className="workflow-triage-preview"><div className="eyebrow">Triage task</div><h3>Fix mobile navbar</h3><div className="triage-fields"><div><span>Workspace</span><strong>Personal</strong></div><div><span>Board column</span><strong>Todo</strong></div><div><span>Priority</span><strong className="accent-text">High</strong></div></div></div> : active === 'focus' ? <PersonalFlowPreview /> : active === 'execute' ? <BoardDemo full /> : active === 'monitor' ? <CommandCenter /> : <AutomationDemo />;
   return <section className="workflow-section" data-reveal>
    <div className="container-wide workflow-layout">
      <nav className="workflow-index" aria-label="Workflow stages">{stageLabels.map((stage) => <button className={active === stage.id ? 'active' : ''} onClick={() => setActive(stage.id)} key={stage.id} data-testid={`button-workflow-${stage.id}`}>{stage.id.toUpperCase()}</button>)}</nav>
       <div className="workflow-copy"><div className="eyebrow">The SprintDesk workflow</div><h2 className="display">One workflow from thought to execution.</h2><p>Every stage keeps context intact—from the moment something occurs to the moment a team can act on it.</p><div className="workflow-stages">{stageLabels.map((stage, index) => <article className="workflow-stage" id={stage.id} key={stage.id} style={{ opacity: active === stage.id ? 1 : .48, transition: 'opacity .3s ease' }}><span className="stage-no">0{index + 1}</span><div><h3>{stage.label === 'Automate' ? 'Let the workflow handle the repetitive work.' : stage.label === 'Capture' ? 'Catch everything.' : stage.label === 'Triage' ? 'Organize when you’re ready.' : stage.label === 'Focus' ? 'Work in the right context.' : stage.label === 'Execute' ? 'Keep the team moving.' : 'See what needs attention.'}</h3><p>{stage.label === 'Capture' && 'Quickly capture tasks, ideas, notes, and links without interrupting your flow.'}{stage.label === 'Triage' && 'Turn raw thoughts into structured work by choosing where the task belongs and what happens next.'}{stage.label === 'Focus' && 'Keep personal priorities separate from collaborative execution.'}{stage.label === 'Execute' && 'Turn individual tasks into coordinated progress with shared sprint visibility.'}{stage.label === 'Monitor' && 'Read progress, workload, blockers, and activity from the work itself.'}{stage.label === 'Automate' && 'Create simple rules that automatically update tasks and keep work moving.'}</p>{active === stage.id && <div className="violet-rule" style={{ maxWidth: 300 }} />}</div></article>)}</div><div className="workflow-visual" aria-label={`${stageLabels.find((item) => item.id === active)?.label ?? active} product preview`}>{workflowVisual}</div></div>
    </div>
  </section>;
}

function PersonalFlowPreview({ title = 'Personal Task Flow' }: { title?: string }) {
  const columns: [string, string[]][] = [
    ['Backlog', ['Client proposal']],
    ['Todo', ['Fix mobile navbar', 'Review feedback']],
    ['In Progress', ['Onboarding notes']],
    ['Review', ['Release checklist']],
  ];
  return <div className="hero-board-state workflow-personal-preview" data-testid="demo-personal-task-flow">
    <div className="board-state-heading"><div><span className="eyebrow">Personal workspace</span><h3>{title}</h3></div><span className="demo-count">4 due today</span></div>
    <div className="hero-columns">{columns.map(([name, tasks]) => <div className="hero-column" key={name}><div className="hero-column-title"><span>{name}</span><b>{tasks.length}</b></div>{tasks.map((task) => <div className={`hero-card ${task === 'Fix mobile navbar' ? 'selected-card' : ''}`} key={task}><strong>{task}</strong><small>{task === 'Fix mobile navbar' ? 'Todo · High' : 'Personal task'}</small></div>)}</div>)}</div>
    <div className="board-state-foot"><span className="route-chip">PERSONAL TASK FLOW</span><span>One thought, now in context.</span></div>
  </div>;
}

function PricingCards({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState('Pro');
  const plans = [
    { name: 'Free', price: '$0', ideal: 'Individual professionals', features: ['1 Personal Workspace', 'Up to 3 Team Workspaces', '3–5 members per team', 'Core Kanban functionality'] },
    { name: 'Pro', price: '$8', ideal: 'Growing collaborative teams', features: ['Everything in Free', 'Story Points tracking', 'Time Tracking', 'Unlimited team members', 'Advanced Swimlanes'] },
    { name: 'Enterprise', price: '$20', ideal: 'Teams needing scale and automation', features: ['Everything in Pro', 'No-Code Automations Engine', 'Timesheet exports', 'Custom Client Portals'] },
  ];
  return <div className={`price-grid ${compact ? 'compact-pricing' : ''}`}>{plans.map((plan) => <article className={`price-card ${plan.name === 'Pro' ? 'popular' : ''} ${selected === plan.name ? 'selected' : ''}`} key={plan.name} onClick={() => setSelected(plan.name)} data-testid={`card-plan-${plan.name.toLowerCase()}`}>{plan.name === 'Pro' && <span className="popular-label">MOST POPULAR</span>}<h3>{plan.name}</h3><p>{plan.ideal}</p><div className="price">{plan.price}<small>{plan.name === 'Free' ? '' : '/month'}</small></div><ul>{plan.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><button className={selected === plan.name ? 'button-primary' : 'button-secondary'} style={{ width: '100%', marginTop: 24 }} onClick={() => setSelected(plan.name)} data-testid={`button-select-${plan.name.toLowerCase()}`}>{selected === plan.name ? 'Selected · Start free' : 'Choose plan'}</button></article>)}</div>;
}

function Home() {
  return <Shell><Meta title="SprintDesk | Personal Task Management & Team Execution" description="Capture tasks, organize personal work, manage team sprints, track progress, and automate workflows with SprintDesk." path="/" />
    <main>
      <section className="hero" id="start">
        <div className="container-wide hero-inner">
          <div className="hero-copy">
            <div className="hero-signal" aria-label="Personal focus times team execution"><span className="signal-node" /><span className="signal-line" /><span className="signal-label">PERSONAL FOCUS × TEAM EXECUTION</span><span className="signal-line" /><span className="signal-node" /></div>
            <h1 className="display">Where Personal Focus Meets <em>Team Velocity.</em></h1>
            <p>SprintDesk brings personal productivity and team execution into one connected workspace. Capture ideas instantly, organize work without friction, and move seamlessly from personal focus to collaborative sprints.</p>
            <div className="hero-actions"><a href="#demo" className="button-primary" data-testid="link-hero-start">Start Free <ArrowUpRight size={15} /></a><a href="#how-it-works" className="button-secondary" data-testid="link-hero-how">See How It Works <Play size={14} /></a></div>
            <div className="microcopy">No credit card required.</div>
          </div>
          <div className="hero-product" id="demo"><HeroWorkflow /></div>
        </div>
      </section>
      <section className="hero-bridge" aria-label="The beginning of work"><div className="container-wide"><span className="bridge-rule" /><p>Most work doesn’t start as a perfectly organized task.</p><div className="bridge-words"><span>A thought.</span><span>A message.</span><span>A note.</span><span>A reminder.</span></div><div className="bridge-route" aria-hidden="true"><i /><span /><i /><span /><i /><span /><i /></div></div></section>
      <section className="problem-section"><div className="container-wide problem-layout"><div className="problem-intro"><div className="eyebrow">The gap between thought and outcome</div><h2 className="display">Your work doesn’t fit into one box.</h2><p>Personal focus and team execution are different contexts. SprintDesk gives each the space it needs, then connects them when work is ready to move.</p><div className="problem-outcome"><span className="outcome-line" /><strong>One connected workflow.</strong></div></div><div className="problem-list">{[['01', 'The notebook mess', '“I write ideas down, but they never become real tasks.”', 'Capture Inbox', 'note-fragments'], ['02', 'Context overload', '“My personal work gets buried inside team boards.”', 'Personal / Team', 'split-context'], ['03', 'Status chasing', '“I spend too much time asking for updates.”', 'Command Center', 'status-thread']].map(([no, title, quote, solution, visual]) => <div className="problem-row" key={no}><div className="problem-number">{no}</div><div className="problem-statement"><h3>{title}</h3><p>{quote}</p></div><div className={`problem-visual ${visual}`} aria-label={`${solution} connection`}><div className="visual-wire"><i /><span /><i /></div><div className="problem-visual-copy"><strong>{solution}</strong><small>{visual === 'note-fragments' ? 'captured into SprintDesk' : visual === 'split-context' ? 'two clear places to work' : 'visibility from the workflow'}</small></div></div></div>)}</div></div></section>
      <div id="how-it-works"><WorkflowSection /></div>
      <WorkspaceSwitcher />
      <section className="feature-strip"><div className="container-wide"><SectionHeading eyebrow="Selected capabilities" title="The quiet command layer for work in motion." body="SprintDesk keeps the surface simple while giving every task a meaningful next place to go." /><div className="feature-rail"><div className="feature-nav">{[['Inbox', 'Catch thoughts before they disappear.', '#capture'], ['Calendar', 'See deadlines before they surprise you.', '#calendar'], ['Command Center', 'See your team’s heartbeat.', '#command-center']].map(([label, detail, href], index) => <a className={index === 0 ? 'active' : ''} href={`/features${href}`} key={label} data-testid={`link-feature-${label.toLowerCase().replaceAll(' ', '-')}`}><span>{label}</span><span>0{index + 1} ↗</span></a>)}</div><div className="feature-detail"><div className="eyebrow">Capture without interrupting your flow</div><h3>Don’t organize the thought. Just catch it.</h3><p>Thoughts, tasks, links, and ideas can wait in a private Capture Inbox until you have the context to triage them properly.</p><CaptureDemo compact /></div></div></div></section>
       <section className="command-section"><div className="container-wide"><div className="command-heading"><div><div className="eyebrow">Team visibility</div><h2 className="display">See your team’s heartbeat in one screen.</h2></div><p>Understand progress, workload, blockers, and team activity without chasing updates across meetings and messages.</p></div><CommandCenter /></div></section>
       <section className="sprint-board-section"><div className="container-wide sprint-board-heading"><div className="eyebrow">Team execution</div><h2 className="display">Turn tasks into team momentum.</h2><p>Give work structure without losing visibility.</p><BoardDemo full /></div></section>
      <section className="calendar-section"><div className="container-wide calendar-layout"><div className="calendar-copy"><div className="eyebrow">Interactive calendar</div><h2 className="display">See deadlines before they become surprises.</h2><p>Bring due dates, scheduled tasks, and upcoming work into a monthly view that makes the next important thing easy to find.</p><Link href="/features#calendar" className="button-secondary" style={{ marginTop: 24 }} data-testid="link-calendar-feature">Explore the calendar <ArrowRight size={15} /></Link></div><CalendarDemo /></div></section>
      <section className="automation-section"><div className="container-wide automation-layout"><div className="automation-copy"><div className="eyebrow">No-code automations</div><h2 className="display">Your board shouldn’t need constant babysitting.</h2><p>If this. Then that. Without the busywork. Create a rule once and let routine status, priority, and assignment changes follow the work.</p></div><AutomationDemo /></div></section>
      <AudienceSection />
      <section className="pricing-preview"><div className="container-wide"><div className="pricing-top"><div><div className="eyebrow">Simple by design</div><h2 className="display">Start with the context you need.</h2></div><p>Choose the workspace that fits your work now. Move up when your team and workflow do.</p></div><PricingCards compact /><div style={{ textAlign: 'center', marginTop: 32 }}><Link href="/pricing" className="button-secondary" data-testid="link-full-pricing">Compare all plans <ArrowRight size={15} /></Link></div></div></section>
      <FinalCTA />
    </main>
  </Shell>;
}

const audienceData = {
  Managers: { eyebrow: 'For managers', title: 'See the work without chasing updates.', body: 'A clear view of progress, ownership, workload, and blockers lets managers coordinate from the work itself.', items: ['Sprint progress', 'Team velocity', 'Open blockers', 'Workload'], href: '/solutions/managers' },
  'Remote teams': { eyebrow: 'For remote teams', title: 'Stay aligned—even when everyone is everywhere.', body: 'Shared boards, visible assignments, activity, and deadlines keep async work connected to its context.', items: ['Shared Sprint Board', 'Activity', 'Assignments', 'Deadlines'], href: '/solutions/remote-teams' },
  'Individual contributors': { eyebrow: 'For individuals', title: 'Protect your focus without disconnecting from the team.', body: 'A private place for incoming thoughts and personal tasks, with an easy transition to collaborative work when it is ready.', items: ['Personal workspace', 'Capture Inbox', 'Personal tasks', 'Easy transition to team work'], href: '/solutions/individuals' },
  'Growing teams': { eyebrow: 'For growing teams', title: 'Scale the workflow without rebuilding it.', body: 'Keep personal focus and team execution in one connected system as collaboration becomes more structured.', items: ['Advanced swimlanes', 'Story points', 'Automation', 'More collaboration capacity'], href: '/pricing' },
};

function AudienceSection() {
  const [selected, setSelected] = useState<keyof typeof audienceData>('Managers');
  const data = audienceData[selected];
  return <section className="audience-section" data-reveal><div className="container-wide"><SectionHeading eyebrow="Made for the way work actually happens" title="One workspace. Different reasons to open it." body="SprintDesk meets you in the context you are already in, then helps work travel to the people who need it." /><div className="audience-tabs" role="tablist">{(Object.keys(audienceData) as (keyof typeof audienceData)[]).map((label) => <button className={selected === label ? 'active' : ''} onClick={() => setSelected(label)} role="tab" aria-selected={selected === label} key={label} data-testid={`button-audience-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</button>)}</div><div className="audience-content" key={selected}><div><div className="eyebrow">{data.eyebrow}</div><h2 className="display">{data.title}</h2><p>{data.body}</p><div className="audience-list">{data.items.map((item) => <span key={item}>{item}</span>)}</div><Link href={data.href} className="button-secondary" style={{ marginTop: 28 }} data-testid="link-audience-solution">Explore this workflow <ArrowRight size={15} /></Link></div><div className="audience-note"><div className="eyebrow">The useful distinction</div><p style={{ color: 'hsl(var(--foreground))', fontSize: 21, lineHeight: 1.35, margin: '18px 0 0' }}>{selected === 'Managers' ? 'Visibility should arrive from the workflow—not from another request for an update.' : selected === 'Remote teams' ? 'Async does not mean invisible. Shared context makes the handoff legible.' : selected === 'Individual contributors' ? 'Private capture is not separate from collaboration. It is where better work starts.' : 'Structure can grow without forcing every piece of work into the same shape.'}</p></div></div></div></section>;
}

function FinalCTA() {
  return <section className="final-cta" id="final-cta" data-reveal><div className="container-wide"><div className="eyebrow">A clearer place for work to go</div><h2 className="display">From scattered thoughts to coordinated execution.</h2><p>Capture the work. Organize the priorities. Keep your team moving.</p><a href="#start" className="button-primary" data-testid="link-final-start">Start SprintDesk for free <ArrowUpRight size={15} /></a><div className="microcopy">No credit card required.</div></div></section>;
}

function Features() {
  return <Shell><Meta title="SprintDesk Features | Task Management Software for Connected Work" description="Explore SprintDesk features for capturing work, managing tasks, focusing personally, running sprints, planning deadlines, monitoring progress, and automating routine updates." path="/features" /><main>
    <section className="inner-hero feature-hero"><div className="container-wide"><div className="eyebrow">Everything connected</div><h1 className="display">One workspace for every stage of the work.</h1><p>From the first thought to the final task, SprintDesk keeps personal focus and team execution connected.</p></div></section>
    <section className="feature-map" aria-label="SprintDesk feature index"><div className="container-wide"><div className="feature-map-intro"><div><div className="eyebrow">A capability library with a point of view</div><h2 className="display">Organize the work around what needs to happen next.</h2></div><p>Start wherever the work is today. Each surface gives it a useful next place without asking you to rebuild your context.</p></div><nav className="feature-map-links">{[['Capture', '#capture'], ['Tasks + triage', '#tasks'], ['Sprints + focus', '#sprints'], ['Plan / calendar', '#calendar'], ['Monitor / command center', '#command-center'], ['Automate', '#automations']].map(([label, href], index) => <a href={href} key={href}><span>0{index + 1}</span>{label}<ArrowUpRight size={14} /></a>)}</nav></div></section>
    <section className="feature-library"><div className="container-wide">
      <article className="feature-band feature-band-capture" id="capture"><div className="feature-band-copy"><div className="eyebrow">01 · Capture</div><h2 className="display">Give unfinished thoughts somewhere safe to land.</h2><p>Capture tasks, ideas, notes, and links in a private inbox while they are still fresh. Organization can happen when the surrounding context is available.</p><div className="feature-proof"><span className="proof-mark">INBOX 05</span><span>Private until you choose otherwise.</span></div></div><div className="feature-band-visual"><CaptureDemo /></div></article>
      <article className="feature-band feature-band-tasks" id="tasks"><div className="feature-band-copy"><div className="eyebrow">02 · Triage / Task management</div><h2 className="display">Turn a raw item into the right next action.</h2><p>During triage, refine the task, choose Personal or Team Workspace, select a board column, and set priority. Then keep the work in a focused task flow.</p><div className="task-detail-surface"><div className="panel-title"><span>TASK DETAIL</span><span>PERSONAL</span></div><h3>Fix mobile navbar</h3><p>Refine the navigation at the 390px breakpoint before the next release.</p><div className="task-detail-fields"><span>Workspace <b>Personal</b></span><span>Column <b>Todo</b></span><span>Priority <b className="accent-text">High</b></span></div></div></div><div className="feature-band-visual focus-visual"><div className="focus-label"><span className="eyebrow">Focus / personal task flow</span><span>4 due today</span></div><PersonalFlowPreview /></div></article>
      <article className="feature-band feature-band-sprints" id="sprints"><div className="feature-wide-heading"><div><div className="eyebrow">03 · Focus → Execute / Sprint boards</div><h2 className="display">Keep personal priorities clear, then make shared work visible.</h2></div><p>Personal Task Flow protects individual focus. A Sprint Board adds story points, ownership, progress, swimlanes, tags, and the shared context needed to execute together.</p></div><div className="feature-band-visual"><BoardDemo full /></div></article>
      <article className="feature-band feature-band-calendar" id="calendar"><div className="feature-band-visual"><CalendarDemo /></div><div className="feature-band-copy"><div className="eyebrow">04 · Plan / calendar</div><h2 className="display">Give deadlines a place you can actually scan.</h2><p>Use the monthly calendar to see due dates and scheduled tasks together. Select a day to bring the next commitment into focus.</p><Link href="/how-it-works#focus" className="text-link">See planning in the workflow <ArrowRight size={14} /></Link></div></article>
      <article className="feature-band feature-band-command" id="command-center"><div className="feature-band-copy"><div className="eyebrow">05 · Monitor / Command Center</div><h2 className="display">Let visibility arrive from the work itself.</h2><p>Read sprint progress, team velocity, open blockers, workload, and activity together so coordination starts with a shared picture.</p><div className="command-note"><span className="status-light" /> Live activity is part of the workflow, not another status ritual.</div></div><div className="feature-band-visual"><CommandCenter /></div></article>
      <article className="feature-band feature-band-automations" id="automations"><div className="feature-band-copy"><div className="eyebrow">06 · Automate</div><h2 className="display">Make the predictable parts take care of themselves.</h2><p>Build a simple When → Then → And rule for routine updates, such as raising priority and assigning the Project Manager when a task enters In Review.</p></div><div className="feature-band-visual automation-visual"><AutomationDemo /></div></article>
    </div></section><FinalCTA /></main></Shell>;
}

function WorkflowStory() {
  const [active, setActive] = useState<Stage>('capture');
  const stageContent: Record<Stage, { title: string; body: string; note: string }> = {
    capture: { title: 'Start with what is on your mind.', body: 'Capture a task, idea, note, link, or reminder without interrupting the work already in front of you.', note: 'Private until you choose otherwise.' },
    triage: { title: 'Decide when the context is ready.', body: 'Turn a raw item into structured work by choosing its workspace, board column, and priority.', note: 'Inbox → Personal / Team → Todo' },
    focus: { title: 'Work in the context that fits.', body: 'Personal Task Flow keeps individual priorities clear while the team workspace stays focused on shared execution.', note: '4 due today · Personal workspace' },
    execute: { title: 'Make the handoff legible.', body: 'When work is ready for the team, its ownership, points, status, and place on the sprint board travel with it.', note: 'Sprint 04 · Product foundations' },
    monitor: { title: 'See what needs attention.', body: 'Progress, workload, blockers, and activity give the team a shared operating picture without a separate update chase.', note: '3 open blockers · This sprint' },
    automate: { title: 'Let routine updates follow the work.', body: 'A small rule builder handles predictable status, priority, and assignment changes while the team stays focused.', note: 'When In Review → set High → assign PM' },
  };
  const content = stageContent[active];
  const visual = active === 'capture' ? <CaptureDemo compact /> : active === 'triage' ? <div className="workflow-triage-preview"><div className="eyebrow">Triage task · 01 / 04</div><h3>Fix mobile navbar</h3><p className="muted">Refine the navigation at the 390px breakpoint before the next release.</p><div className="triage-fields"><div><span>Workspace</span><strong>Personal</strong></div><div><span>Board column</span><strong>Todo</strong></div><div><span>Priority</span><strong className="accent-text">High</strong></div></div><button className="button-secondary" onClick={() => setActive('focus')}>Move to Personal Task Flow <ArrowRight size={14} /></button></div> : active === 'focus' ? <PersonalFlowPreview /> : active === 'execute' ? <BoardDemo full /> : active === 'monitor' ? <CommandCenter /> : <AutomationDemo />;
  return <section className="workflow-story"><div className="container-wide"><div className="workflow-story-head"><div><div className="eyebrow">The operating model</div><h2 className="display">Six stages. One connected line of sight.</h2></div><p>The product changes shape as work becomes clearer. Follow the same item from a private capture to coordinated execution.</p></div><div className="workflow-story-layout"><nav className="story-index" aria-label="Workflow stages">{stageLabels.map((stage, index) => <button id={stage.id} key={stage.id} className={active === stage.id ? 'active' : ''} onClick={() => setActive(stage.id)} aria-current={active === stage.id ? 'step' : undefined} data-testid={`button-story-${stage.id}`}><span>0{index + 1}</span>{stage.label}<ArrowRight size={13} /></button>)}</nav><div className="story-main"><div className={`story-visual story-visual-${active}`} aria-live="polite">{visual}</div><div className="story-copy"><span className="story-stage-kicker">0{stageLabels.findIndex((stage) => stage.id === active) + 1} / {stageLabels.length} · {stageLabels.find((stage) => stage.id === active)?.label}</span><h3>{content.title}</h3><p>{content.body}</p><div className="story-note"><span className="status-light" />{content.note}</div></div></div></div></div></section>;
}

function HowItWorks() {
  return <Shell><Meta title="How SprintDesk Works | Capture to Coordinated Execution" description="Follow SprintDesk's workflow from Capture and Triage through Focus, Execute, Monitor, and Automate in one connected workspace." path="/how-it-works" /><main><section className="inner-hero workflow-hero"><div className="container-wide"><div className="eyebrow">How it works</div><h1 className="display">From a quick thought to coordinated execution.</h1><p>SprintDesk turns scattered work into a clear workflow—without forcing personal productivity and team collaboration into separate tools.</p></div></section><WorkflowStory /><section className="workflow-handoff"><div className="container-wide"><div className="handoff-copy"><div className="eyebrow">The handoff</div><h2 className="display">The task keeps its context as it moves.</h2><p>Capture privately, choose the next place deliberately, then let the shared board and Command Center make the work legible to everyone involved.</p><Link href="/features#tasks" className="text-link">Explore task management <ArrowRight size={14} /></Link></div><BoardDemo full /></div></section><FinalCTA /></main></Shell>;
}

const personalFaq = [
  { question: 'How do I organize personal tasks?', answer: 'Start by capturing tasks in one inbox, then return to triage them when you have enough context. Give each task a clear next action, a workspace, a priority, and a due date when one matters.' },
  { question: 'What is the best way to prioritize tasks?', answer: 'Separate what is urgent from what is simply visible. Choose the next meaningful action, keep today’s commitments easy to scan, and move lower-context work into a backlog until it is ready.' },
  { question: 'Can I keep personal and team tasks separate?', answer: 'Yes. SprintDesk gives personal work its own workspace while keeping a deliberate path to team execution when a task is ready to move.' },
  { question: 'How does SprintDesk help manage personal tasks?', answer: 'SprintDesk combines a Capture Inbox, triage workflow, Personal Dashboard, Task Flow Board, and calendar so personal work can be captured quickly, organized later, prioritized clearly, and planned around deadlines.' },
];

function PersonalWorkRail() {
  return <div className="personal-work-rail" aria-label="Places personal work can get lost">
    <div className="personal-rail-sources">
      {['Notes', 'Sticky notes', 'Chat messages', 'Random to-do lists'].map((item, index) => <div className="personal-rail-source" key={item}><span>0{index + 1}</span><strong>{item}</strong><i aria-hidden="true" /></div>)}
    </div>
    <div className="personal-rail-route" aria-hidden="true"><span /><i /><span /><i /><span /></div>
    <div className="personal-rail-destination"><span className="eyebrow">SprintDesk</span><strong>One connected personal workspace.</strong><small>Capture first. Organize when you are ready.</small></div>
  </div>;
}

function PersonalTaskManagement() {
  return <Shell>
    <Meta title="Personal Task Management | Capture, Prioritize, and Focus — SprintDesk" description="Manage personal tasks in one connected workspace. Capture thoughts, organize priorities, plan around due dates, and focus without getting buried in team activity." path="/personal-task-management" faq={personalFaq} />
    <main>
      <section className="inner-hero personal-hero">
        <div className="container-wide personal-hero-grid">
          <div className="personal-hero-copy">
            <div className="eyebrow">Personal task management</div>
            <h1 className="display">Your work deserves a space of its own.</h1>
            <p>Capture tasks, organize priorities, and focus on what matters without getting buried in team activity.</p>
            <div className="hero-actions"><Link href="/pricing" className="button-primary" data-testid="link-personal-start">Start Free <ArrowUpRight size={15} /></Link></div>
          </div>
          <div className="personal-hero-visual">
            <div className="personal-visual-label"><span>PERSONAL DASHBOARD</span><span>4 DUE TODAY</span></div>
            <PersonalFlowPreview title="Personal Dashboard" />
          </div>
        </div>
      </section>

      <section className="personal-problem" data-reveal>
        <div className="container-wide">
          <div className="personal-section-heading"><div><div className="eyebrow">The personal work gap</div><h2 className="display">Personal work gets lost in too many places.</h2></div><p>When tasks live across notes, messages, and half-finished lists, the hard part is often finding the work again. SprintDesk gives incoming work a reliable first place to land.</p></div>
          <PersonalWorkRail />
        </div>
      </section>

      <section className="personal-feature-stack">
        <article className="personal-feature personal-feature-capture" data-reveal>
          <div className="container-wide personal-feature-grid">
            <div className="personal-feature-copy"><div className="eyebrow">01 · Capture everything</div><h2 className="display">Give every thought a safe first place.</h2><p>Capture tasks, ideas, notes, and links in the Capture Inbox while they are still fresh. You do not need to decide what something means before you make sure it is not lost.</p><Link href="/features#capture" className="text-link">Explore Capture Inbox <ArrowRight size={14} /></Link></div>
            <div className="personal-feature-visual"><CaptureDemo compact /></div>
          </div>
        </article>

        <article className="personal-feature personal-feature-triage" data-reveal>
          <div className="container-wide personal-feature-grid">
            <div className="personal-feature-visual"><div className="workflow-triage-preview"><div className="eyebrow">Triage task · 01 / 04</div><h3>Fix mobile navbar</h3><p className="muted">Refine the navigation at the 390px breakpoint before the next release.</p><div className="triage-fields"><div><span>Workspace</span><strong>Personal</strong></div><div><span>Board column</span><strong>Todo</strong></div><div><span>Priority</span><strong className="accent-text">High</strong></div></div><Link href="/features#tasks" className="button-secondary">Organize this task <ArrowRight size={14} /></Link></div></div>
            <div className="personal-feature-copy"><div className="eyebrow">02 · Organize later</div><h2 className="display">Let context arrive before structure.</h2><p>Return to the inbox when you can make a better decision. Triage each item into a workspace, board column, and priority instead of forcing organization into the moment of capture.</p><Link href="/how-it-works#triage" className="text-link">See the triage workflow <ArrowRight size={14} /></Link></div>
          </div>
        </article>

        <article className="personal-feature personal-feature-dashboard" data-reveal>
          <div className="container-wide personal-feature-grid">
            <div className="personal-feature-copy"><div className="eyebrow">03 · See today’s priorities</div><h2 className="display">Know what deserves your attention next.</h2><p>The Personal Dashboard keeps today’s tasks, work in progress, and next actions visible without pulling team activity into every decision.</p><div className="personal-proof-line"><span className="status-light" />Personal workspace · 4 due today</div></div>
            <div className="personal-feature-visual personal-board-visual"><PersonalFlowPreview title="Personal Dashboard" /></div>
          </div>
        </article>

        <article className="personal-feature personal-feature-flow" data-reveal>
          <div className="container-wide personal-feature-grid">
            <div className="personal-feature-visual personal-board-visual"><PersonalFlowPreview title="Task Flow Board" /></div>
            <div className="personal-feature-copy"><div className="eyebrow">04 · Move work forward</div><h2 className="display">Make progress visible to yourself.</h2><p>Use a focused Task Flow Board to see what is waiting, what is active, and what is ready for review. The next action should be easy to find when you return.</p><Link href="/features#tasks" className="text-link">Explore task management <ArrowRight size={14} /></Link></div>
          </div>
        </article>

        <article className="personal-feature personal-feature-calendar" data-reveal>
          <div className="container-wide personal-feature-grid">
            <div className="personal-feature-copy"><div className="eyebrow">05 · Plan around deadlines</div><h2 className="display">Give due dates somewhere you can scan.</h2><p>Bring deadlines and scheduled tasks into a monthly view. Select a day to see the commitment that needs a place in your plan.</p><Link href="/features#calendar" className="text-link">Explore the calendar <ArrowRight size={14} /></Link></div>
            <div className="personal-feature-visual"><CalendarDemo /></div>
          </div>
        </article>
      </section>

      <section className="personal-answer" data-reveal>
        <div className="container-wide">
          <div className="personal-answer-heading"><div className="eyebrow">A clear definition</div><h2 className="display">What is personal task management?</h2><p className="answer-lede">Personal task management is the practice of capturing, organizing, prioritizing, and planning the work you are responsible for so you can focus on the next meaningful action.</p></div>
          <div className="personal-answer-grid">
            <div><span>01</span><h3>Why it matters</h3><p>A trusted system reduces the effort of remembering what needs to happen and makes unfinished work easier to return to.</p></div>
            <div><span>02</span><h3>How to manage personal tasks</h3><p>Capture quickly, triage when you have context, choose a clear next action, and use priorities and due dates to shape your day.</p></div>
            <div><span>03</span><h3>What to look for</h3><p>Look for a private capture step, flexible organization, an at-a-glance priority view, a task flow, and a calendar that connects commitments to work.</p></div>
            <div><span>04</span><h3>How SprintDesk approaches it</h3><p>SprintDesk keeps personal work separate from team activity while preserving a deliberate path into shared execution when a task is ready.</p><Link href="/how-it-works" className="text-link">Follow the complete workflow <ArrowRight size={14} /></Link></div>
          </div>
        </div>
      </section>

      <section className="personal-faq" data-reveal>
        <div className="container-wide personal-faq-layout">
          <div><div className="eyebrow">Questions worth answering</div><h2 className="display">Personal task management, without the mystery.</h2><p>Useful systems are usually simpler than they look: one place to capture, one place to decide, and a clear view of what is next.</p></div>
          <div className="faq-list">{personalFaq.map(({ question, answer }) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
        </div>
      </section>

      <section className="personal-final-cta" id="personal-start">
        <div className="container-wide"><div className="eyebrow">A quieter way to work</div><h2 className="display">Focus on the work. Not on finding it.</h2><Link href="/pricing" className="button-primary" data-testid="link-personal-final-start">Start Free <ArrowUpRight size={15} /></Link><div className="personal-crosslinks"><Link href="/team-task-management">See team task management <ArrowRight size={14} /></Link><Link href="/features">Explore SprintDesk features <ArrowRight size={14} /></Link></div></div>
      </section>
    </main>
  </Shell>;
}

const teamFaq = [
  { question: 'What is team task management?', answer: 'Team task management is the shared practice of assigning, organizing, prioritizing, and tracking work so everyone can see ownership, progress, and what needs attention next.' },
  { question: 'How do teams keep tasks from falling through the cracks?', answer: 'Teams reduce dropped work by giving every task a clear owner, status, priority, and place on a shared board. Regular visibility into progress and blockers makes the next conversation more specific.' },
  { question: 'How does SprintDesk support team coordination?', answer: 'SprintDesk combines a Team Sprint Board with assignees, story points, progress, tags, swimlanes, activity, and a Command Center for sprint progress, velocity, blockers, and workload.' },
];

const remoteFaq = [
  { question: 'What is remote team task management?', answer: 'Remote team task management is the practice of organizing shared work across locations with visible ownership, deadlines, status, activity, and progress that does not depend on everyone being online together.' },
  { question: 'How can remote teams organize tasks effectively?', answer: 'Start with one shared workspace, assign each task clearly, keep deadlines and status visible, and use activity and sprint progress to preserve context between asynchronous updates.' },
  { question: 'How does SprintDesk support distributed collaboration?', answer: 'SprintDesk gives remote teams a shared Sprint Board for ownership and execution, plus visible activity, deadlines, workload, progress, and blockers so coordination can happen without endless status meetings.' },
];

const workloadFaq = [
  { question: 'What is team workload management?', answer: 'Team workload management is the practice of making active work and ownership visible so a team can understand how work is distributed, where attention is concentrated, and what needs review next.' },
  { question: 'How can managers see team workload?', answer: 'Managers can review workload alongside sprint progress, blockers, and activity in SprintDesk’s Command Center, then use the Sprint Board and swimlanes to understand the tasks behind the view.' },
  { question: 'Does SprintDesk automatically rebalance workload?', answer: 'No. SprintDesk makes workload distribution and ownership visible so teams can have a better-informed conversation about priorities and next steps.' },
 ];

const sprintFaq = [
  { question: 'What is sprint management?', answer: 'Sprint management is the practice of planning, organizing, and tracking shared work through a focused sprint so a team can see ownership, progress, and what needs attention next.' },
  { question: 'How does a sprint board help a team?', answer: 'A sprint board gives shared work a visible status, owner, story point value, tag, and place in the workflow. Swimlanes add another way to read active work by assignee.' },
  { question: 'How does SprintDesk show sprint progress?', answer: 'SprintDesk combines the Team Sprint Board with the Command Center, where teams can review sprint progress, team velocity, open blockers, workload, and activity.' },
  { question: 'Can personal tasks become sprint work?', answer: 'Yes. SprintDesk keeps personal focus separate until a task is ready to move into shared execution, where its ownership, points, status, and board context become visible to the team.' },
];

function TeamTaskManagement() {
  return <Shell>
    <Meta title="Team Task Management Software | SprintDesk" description="Give your team one shared place to assign work, track progress, see workload, identify blockers, and move work forward without more status meetings." path="/team-task-management" faq={teamFaq} />
    <main>
      <section className="inner-hero team-task-hero">
        <div className="container-wide team-task-hero-grid">
          <div className="team-task-hero-copy">
            <div className="eyebrow">Team task management</div>
            <h1 className="display">One place to see what your team is working on.</h1>
            <p>SprintDesk helps teams organize tasks, track progress, manage priorities, and stay aligned from one shared workspace.</p>
            <div className="hero-actions"><Link href="/pricing" className="button-primary" data-testid="link-team-task-start">Start Free <ArrowUpRight size={15} /></Link><Link href="/how-it-works#execute" className="button-secondary">See team execution <ArrowRight size={15} /></Link></div>
          </div>
          <div className="team-task-hero-visual"><div className="team-visual-label"><span>TEAM SPRINT BOARD</span><span>SPRINT 04 / 12 POINTS</span></div><BoardDemo full /></div>
        </div>
      </section>

      <section className="team-benefits" data-reveal>
        <div className="container-wide">
          <div className="team-task-heading"><div><div className="eyebrow">Clarity without another meeting</div><h2 className="display">Make the next part of the work obvious.</h2></div><p>A shared task system should reduce the questions around the work, not create another place to maintain.</p></div>
          <div className="team-benefit-list">
            {[
              ['01', 'Assign work clearly.', 'Every task has a visible owner and a place in the workflow.'],
              ['02', 'Track progress visually.', 'Status and story points make the sprint easier to read at a glance.'],
              ['03', 'See workload distribution.', 'Compare active work across assignees before priorities become capacity problems.'],
              ['04', 'Identify blockers.', 'Open blockers stay close to the progress they affect.'],
              ['05', 'Monitor activity.', 'Updates remain connected to the tasks they describe.'],
              ['06', 'Keep everyone aligned.', 'The team works from one shared picture instead of separate status threads.'],
            ].map(([number, title, body]) => <div className="team-benefit-row" key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p><i aria-hidden="true"><ArrowRight size={14} /></i></div>)}
          </div>
        </div>
      </section>

      <section className="team-board-section">
        <div className="container-wide">
          <div className="team-section-intro"><div><div className="eyebrow">Product demo / Team Sprint Board</div><h2 className="display">Shared execution, with the details still attached.</h2></div><p>See assignees, story points, progress, tags, and swimlanes together. Switch to swimlanes when the question is who owns the work, not just where the task sits.</p></div>
          <BoardDemo full />
          <div className="team-board-note"><span className="status-light" />Click a task to move it forward, or view swimlanes to read active work by assignee.</div>
        </div>
      </section>

      <section className="team-manager-section" data-reveal>
        <div className="container-wide team-manager-grid">
          <div className="team-manager-copy"><div className="eyebrow">Manager visibility</div><h2 className="display">Stop chasing updates.</h2><p>Use the Command Center to see sprint progress, velocity, blockers, workload, and activity from the same system where the team does the work.</p><Link href="/features#command-center" className="text-link">Explore the Command Center <ArrowRight size={14} /></Link></div>
          <CommandCenter />
        </div>
      </section>

      <section className="team-answer" data-reveal>
        <div className="container-wide">
          <div className="team-answer-copy"><div className="eyebrow">A direct answer</div><h2 className="display">What is team task management?</h2><p className="team-answer-lede">Team task management is a shared system for assigning, organizing, prioritizing, and tracking work so everyone understands what is happening, who owns it, and what needs attention next.</p></div>
          <div className="team-answer-grid"><div><span>01</span><h3>Manage tasks effectively</h3><p>Give each task a clear owner, status, priority, and next step. Keep the detail with the work so progress can be understood without recreating context.</p></div><div><span>02</span><h3>Prevent dropped work</h3><p>Use one shared board, visible deadlines, and activity so unfinished work does not disappear inside messages or disconnected lists.</p></div><div><span>03</span><h3>Coordinate with SprintDesk</h3><p>Move from personal focus to shared execution with a Sprint Board and Command Center that make ownership, progress, blockers, and workload visible.</p></div></div>
        </div>
      </section>

      <section className="team-faq" data-reveal>
        <div className="container-wide team-faq-layout"><div><div className="eyebrow">Questions teams ask</div><h2 className="display">A shared view of the work should be easy to explain.</h2><p>Start with the work itself, then use the same context to decide what happens next.</p></div><div className="faq-list">{teamFaq.map(({ question, answer }) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div>
      </section>

       <section className="team-final-cta">
         <div className="container-wide"><div className="eyebrow">Team execution, made visible</div><h2 className="display">Give your team one place to move work forward.</h2><Link href="/pricing" className="button-primary" data-testid="link-team-task-final-start">Start Free <ArrowUpRight size={15} /></Link><div className="team-crosslinks"><Link href="/remote-team-task-management">Remote team task management <ArrowRight size={14} /></Link><Link href="/team-workload-management">Team workload management <ArrowRight size={14} /></Link><Link href="/sprint-management">Sprint management <ArrowRight size={14} /></Link></div></div>
      </section>
    </main>
  </Shell>;
}

function TeamWorkloadManagement() {
  return <Shell>
    <Meta title="Team Workload Management Software | SprintDesk" description="See team workload, active ownership, sprint context, blockers, and activity in one shared view with SprintDesk." path="/team-workload-management" faq={workloadFaq} image="https://sprintdesk.app/team-workload-management-og.png" imageAlt="SprintDesk team workload management Command Center" />
    <main>
      <section className="inner-hero workload-hero">
        <div className="container-wide workload-hero-grid">
          <div className="workload-hero-copy">
            <div className="eyebrow">Team workload management</div>
            <h1 className="display">See team workload before it becomes a bottleneck.</h1>
            <p>Understand how active work is distributed across assignees, then review the sprint context, blockers, and activity behind the numbers.</p>
            <div className="hero-actions"><Link href="/pricing" className="button-primary" data-testid="link-workload-start">Start Free <ArrowUpRight size={15} /></Link><Link href="/team-task-management" className="button-secondary">See team task management <ArrowRight size={15} /></Link></div>
          </div>
          <div className="workload-hero-visual"><div className="workload-visual-label"><span>COMMAND CENTER</span><span>THIS SPRINT</span></div><CommandCenter /></div>
        </div>
      </section>

      <section className="workload-problem-section" data-reveal>
        <div className="container-wide">
          <div className="team-section-intro"><div><div className="eyebrow">The workload gap</div><h2 className="display">Distribution is easier to discuss when the work is visible.</h2></div><p>Workload is not a score. It is context for a better conversation about active ownership, sprint progress, and what needs attention.</p></div>
          <div className="workload-signal-list">{[['01', 'Ownership is scattered.', 'The team has to reconstruct who is carrying active work.'], ['02', 'Uneven work stays hidden.', 'A full view makes concentrated effort easier to notice early.'], ['03', 'Blockers lose their context.', 'A workload conversation is stronger when it stays close to the tasks and progress it affects.'], ['04', 'Managers ask for another update.', 'Shared activity gives the next review a useful starting point.']].map(([number, title, body]) => <div className="workload-signal-row" key={number}><span>{number}</span><div><h3>{title}</h3><p>{body}</p></div><b>→ shared context</b></div>)}</div>
        </div>
      </section>

      <section className="workload-view-section">
        <div className="container-wide workload-view-grid">
          <div className="workload-view-copy"><div className="eyebrow">Workload view / Command Center</div><h2 className="display">Read distribution alongside the work that explains it.</h2><p>SprintDesk brings team workload together with sprint progress, team velocity, open blockers, and activity. Review the signal, then open the board context behind it.</p><div className="workload-proof-list"><span><i />Active work by assignee</span><span><i />Sprint progress and velocity</span><span><i />Open blockers in context</span><span><i />Live activity from the workflow</span></div><Link href="/features#command-center" className="text-link">Explore the Command Center <ArrowRight size={14} /></Link></div>
          <CommandCenter />
        </div>
      </section>

      <section className="workload-ownership-section" data-reveal>
        <div className="container-wide workload-ownership-grid">
          <div className="workload-board-wrap"><BoardDemo full /></div>
          <div className="workload-view-copy"><div className="eyebrow">Ownership behind the signal</div><h2 className="display">See who owns the work—not just how much is active.</h2><p>Use the Sprint Board for task-level context, then switch to swimlanes when the question is who is carrying the work. Assignees, points, tags, and status stay attached.</p><Link href="/sprint-management" className="text-link">See sprint management <ArrowRight size={14} /></Link></div>
        </div>
      </section>

      <section className="team-answer workload-answer" data-reveal>
        <div className="container-wide">
          <div className="team-answer-copy"><div className="eyebrow">A direct answer</div><h2 className="display">What is team workload management?</h2><p className="team-answer-lede">Team workload management is a shared way to see active work and ownership across a team, use sprint context to understand what is in motion, and decide what deserves review next.</p></div>
          <div className="team-answer-grid"><div><span>01</span><h3>See active work</h3><p>Review how work is distributed across assignees instead of relying on separate lists or update threads.</p></div><div><span>02</span><h3>Keep the context attached</h3><p>Read workload with progress, blockers, activity, points, and the tasks that make the signal meaningful.</p></div><div><span>03</span><h3>Review with clarity</h3><p>Give managers and teams a shared picture for discussing priorities without turning visibility into surveillance.</p></div></div>
        </div>
      </section>

      <section className="team-faq workload-faq" data-reveal>
        <div className="container-wide team-faq-layout"><div><div className="eyebrow">Questions teams ask</div><h2 className="display">Workload visibility that starts with the work.</h2><p>Use the view to understand distribution, then use the board to decide what happens next.</p></div><div className="faq-list">{workloadFaq.map(({ question, answer }) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div>
      </section>

      <section className="team-final-cta workload-final-cta">
        <div className="container-wide"><div className="eyebrow">A clearer team view</div><h2 className="display">Make workload part of the workflow, not another report.</h2><Link href="/pricing" className="button-primary" data-testid="link-workload-final-start">Start Free <ArrowUpRight size={15} /></Link><div className="team-crosslinks"><Link href="/sprint-management">Sprint management <ArrowRight size={14} /></Link><Link href="/team-task-management">Team task management <ArrowRight size={14} /></Link><Link href="/solutions/managers">SprintDesk for managers <ArrowRight size={14} /></Link><Link href="/remote-team-task-management">Remote team workload <ArrowRight size={14} /></Link></div></div>
      </section>
    </main>
  </Shell>;
}

function SprintManagement() {
  return <Shell>
    <Meta title="Sprint Management Software | SprintDesk" description="Plan and track shared sprint work with story points, visible progress, assignees, swimlanes, and blockers in SprintDesk." path="/sprint-management" faq={sprintFaq} image="https://sprintdesk.app/sprint-management-og.png" imageAlt="SprintDesk sprint board with story points and visible progress" />
    <main>
      <section className="inner-hero sprint-management-hero">
        <div className="container-wide sprint-management-hero-grid">
          <div className="sprint-management-hero-copy">
            <div className="eyebrow">Sprint management</div>
            <h1 className="display">Turn sprint work into a shared picture.</h1>
            <p>Give your team one place to plan the work in motion, see progress, understand ownership, and keep blockers close to the tasks they affect.</p>
            <div className="hero-actions"><Link href="/pricing" className="button-primary" data-testid="link-sprint-start">Start Free <ArrowUpRight size={15} /></Link><Link href="/how-it-works#execute" className="button-secondary">See team execution <ArrowRight size={15} /></Link></div>
          </div>
          <div className="sprint-management-hero-visual"><div className="sprint-visual-label"><span>TEAM SPRINT BOARD</span><span>SPRINT 04 / 12 POINTS</span></div><BoardDemo full /></div>
        </div>
      </section>

      <section className="sprint-problem-section" data-reveal>
        <div className="container-wide">
          <div className="team-section-intro"><div><div className="eyebrow">The sprint gap</div><h2 className="display">A sprint should be easier to read than the status thread around it.</h2></div><p>Shared execution works when ownership, progress, and blockers stay close to the work instead of being rebuilt in meetings.</p></div>
          <div className="sprint-signal-list">{[['01', 'Ownership is unclear.', 'A visible assignee gives every task a clear next conversation.'], ['02', 'Progress needs a status chase.', 'Columns and story points make movement easier to see at a glance.'], ['03', 'Blockers are detached.', 'Keep the issue with the task and sprint context it affects.'], ['04', 'The sprint loses its shape.', 'A shared board gives the team one place to orient and execute.']].map(([number, title, body]) => <div className="sprint-signal-row" key={number}><span>{number}</span><div><h3>{title}</h3><p>{body}</p></div><b>→ one sprint board</b></div>)}</div>
        </div>
      </section>

      <section className="sprint-board-management-section">
        <div className="container-wide">
          <div className="team-section-intro"><div><div className="eyebrow">Product demo / Sprint Board</div><h2 className="display">Plan and execute with the details still attached.</h2></div><p>Use columns for status, story points for shared progress language, assignees for ownership, tags for context, and swimlanes when you need to read active work by person.</p></div>
          <BoardDemo full />
          <div className="team-board-note"><span className="status-light" />Click a task to move it forward, or view swimlanes to read active work by assignee.</div>
        </div>
      </section>

      <section className="sprint-visibility-section" data-reveal>
        <div className="container-wide sprint-visibility-grid">
          <div className="workload-view-copy"><div className="eyebrow">Execution → visibility</div><h2 className="display">The board shows the work. The Command Center shows the shape of the sprint.</h2><p>Connect task-level execution to a shared review of sprint progress, team velocity, open blockers, workload, and activity.</p><div className="workload-proof-list"><span><i />9 of 12 story points complete</span><span><i />3 open blockers</span><span><i />Workload by assignee</span><span><i />Activity from the board</span></div><Link href="/team-workload-management" className="text-link">See team workload management <ArrowRight size={14} /></Link></div>
          <CommandCenter />
        </div>
      </section>

      <section className="team-answer sprint-answer" data-reveal>
        <div className="container-wide">
          <div className="team-answer-copy"><div className="eyebrow">A direct answer</div><h2 className="display">What is sprint management?</h2><p className="team-answer-lede">Sprint management is the practice of planning, organizing, and tracking shared work through a focused sprint so the team can understand ownership, progress, and what needs attention next.</p></div>
          <div className="team-answer-grid"><div><span>01</span><h3>Plan the work in view</h3><p>Give shared tasks a place on the board, a status, an assignee, and the story point context the team uses to discuss progress.</p></div><div><span>02</span><h3>Track progress together</h3><p>Use columns, points, tags, and swimlanes to make the work legible without turning the board into a scoreboard.</p></div><div><span>03</span><h3>Respond to blockers</h3><p>Pair the board with Command Center visibility so the team can see blockers, workload, and activity in the same operating picture.</p></div></div>
        </div>
      </section>

      <section className="team-faq sprint-faq" data-reveal>
        <div className="container-wide team-faq-layout"><div><div className="eyebrow">Questions teams ask</div><h2 className="display">A sprint board should make the next step clearer.</h2><p>Keep personal focus separate until work is ready for shared execution, then give the team the context to move it together.</p></div><div className="faq-list">{sprintFaq.map(({ question, answer }) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div>
      </section>

      <section className="team-final-cta sprint-final-cta">
        <div className="container-wide"><div className="eyebrow">Shared execution, made visible</div><h2 className="display">Give every sprint a clear place to move forward.</h2><Link href="/pricing" className="button-primary" data-testid="link-sprint-final-start">Start Free <ArrowUpRight size={15} /></Link><div className="team-crosslinks"><Link href="/team-workload-management">See team workload <ArrowRight size={14} /></Link><Link href="/team-task-management">Team task management <ArrowRight size={14} /></Link><Link href="/remote-team-task-management">Remote team task management <ArrowRight size={14} /></Link><Link href="/features#sprints">Explore sprint boards <ArrowRight size={14} /></Link><Link href="/features#command-center">Explore team visibility <ArrowRight size={14} /></Link></div></div>
      </section>
    </main>
  </Shell>;
}

function RemoteTeamTaskManagement() {
  return <Shell>
    <Meta title="Remote Team Task Management | SprintDesk" description="Keep remote work visible with shared ownership, async coordination, deadlines, activity, workload, and blockers in one team workspace." path="/remote-team-task-management" faq={remoteFaq} />
    <main>
      <section className="inner-hero remote-team-hero">
        <div className="container-wide remote-team-hero-grid">
          <div className="remote-team-hero-copy"><div className="eyebrow">Remote team task management</div><h1 className="display">Keep remote work visible—and everyone aligned.</h1><p>SprintDesk gives distributed teams a shared place to organize work, track progress, identify blockers, and stay aligned without endless status meetings.</p><div className="hero-actions"><Link href="/pricing" className="button-primary" data-testid="link-remote-team-start">Start Free <ArrowUpRight size={15} /></Link><Link href="/team-task-management" className="button-secondary">See team task management <ArrowRight size={15} /></Link></div></div>
          <div className="remote-team-signal"><span>REMOTE WORK</span><i /><strong>One shared workspace</strong><small>Visible between meetings, across locations.</small></div>
        </div>
      </section>

      <section className="remote-problem-section" data-reveal>
        <div className="container-wide">
          <div className="remote-section-heading"><div><div className="eyebrow">The remote work problem</div><h2 className="display">When work happens everywhere, context gets harder to find.</h2></div><p>Distributed teams need more than a stream of updates. They need a shared place where ownership, deadlines, and progress stay connected.</p></div>
          <div className="remote-problem-list">{[['01', 'Messages everywhere.', 'The detail is spread across conversations.'], ['02', 'Updates scattered.', 'The latest status is hard to reconstruct.'], ['03', 'Tasks without owners.', 'The next step exists, but nobody can see who has it.'], ['04', 'Deadlines getting missed.', 'Commitments disappear when they are not attached to the workflow.']].map(([number, title, body]) => <div className="remote-problem-row" key={number}><span>{number}</span><div><h3>{title}</h3><p>{body}</p></div><b>→ one shared workspace</b></div>)}</div>
        </div>
      </section>

      <section className="remote-visibility-section">
        <div className="container-wide remote-feature-grid">
          <div className="remote-feature-copy"><div className="eyebrow">Async visibility</div><h2 className="display">See progress without asking for it.</h2><p>Activity feed, task status, and sprint progress give remote teams a shared operating picture even when schedules do not overlap.</p><div className="remote-proof-list"><span><i />Activity feed</span><span><i />Task status</span><span><i />Sprint progress</span></div></div>
          <CommandCenter />
        </div>
      </section>

      <section className="remote-ownership-section" data-reveal>
        <div className="container-wide remote-feature-grid remote-feature-grid-reverse">
          <div className="remote-board-wrap"><BoardDemo full /></div>
          <div className="remote-feature-copy"><div className="eyebrow">Clear ownership</div><h2 className="display">Everyone knows what they own.</h2><p>Assignees, swimlanes, and workload make the handoff clear without requiring every person to be in the same room—or the same call.</p><Link href="/team-task-management" className="text-link">Explore team task management <ArrowRight size={14} /></Link></div>
        </div>
      </section>

      <section className="remote-blockers-section" data-reveal>
        <div className="container-wide">
          <div className="remote-section-heading"><div><div className="eyebrow">Blockers in context</div><h2 className="display">Find problems before they become delays.</h2></div><p>Open blockers, at-risk tasks, and sprint progress belong in the same view, so a remote team can respond with context instead of guesswork.</p></div>
          <div className="remote-risk-grid"><div><span>OPEN BLOCKERS</span><strong>03</strong><small>Visible in the current sprint.</small></div><div><span>AT-RISK TASKS</span><strong>02</strong><small>Prioritize the work that needs attention.</small></div><div><span>SPRINT PROGRESS</span><strong>78%</strong><small>Read progress without a status chase.</small></div></div>
        </div>
      </section>

      <section className="remote-answer" data-reveal>
        <div className="container-wide"><div className="team-answer-copy"><div className="eyebrow">A direct answer</div><h2 className="display">What is remote team task management?</h2><p className="team-answer-lede">Remote team task management is the practice of coordinating shared work across locations with visible owners, deadlines, status, activity, and progress that stays useful between conversations.</p></div><div className="remote-answer-points"><div><span>01</span><h3>Organize tasks across locations</h3><p>Use one shared Sprint Board with clear owners, status, deadlines, tags, and swimlanes.</p></div><div><span>02</span><h3>Maintain manager visibility</h3><p>Read activity, workload, sprint progress, and blockers without turning visibility into surveillance.</p></div><div><span>03</span><h3>Support distributed collaboration</h3><p>Keep the context with the work so asynchronous updates can still lead to coordinated execution.</p></div></div></div>
      </section>

      <section className="team-faq" data-reveal>
        <div className="container-wide team-faq-layout"><div><div className="eyebrow">Questions remote teams ask</div><h2 className="display">Coordination that works across time and place.</h2><p>Visibility is useful when it helps people decide what to do next—not when it asks them to prove they are busy.</p></div><div className="faq-list">{remoteFaq.map(({ question, answer }) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div>
      </section>

      <section className="team-final-cta remote-final-cta">
        <div className="container-wide"><div className="eyebrow">Async work, shared context</div><h2 className="display">Less status chasing. More progress.</h2><Link href="/pricing" className="button-primary" data-testid="link-remote-team-final-start">Start Free <ArrowUpRight size={15} /></Link><div className="team-crosslinks"><Link href="/team-task-management">Team task management <ArrowRight size={14} /></Link><Link href="/how-it-works">See how SprintDesk works <ArrowRight size={14} /></Link><Link href="/features#command-center">Explore team visibility <ArrowRight size={14} /></Link></div></div>
      </section>
    </main>
  </Shell>;
}

type SolutionKey = 'managers' | 'remote-teams' | 'individuals';
const solutionData: Record<SolutionKey, { eyebrow: string; title: string; desc: string; question: string; answer: string; points: string[] }> = {
  managers: { eyebrow: 'SprintDesk for managers', title: 'Visibility without the status chase.', desc: 'Keep an eye on progress, workload, ownership, and blockers from the same workspace where the work is happening.', question: 'How can managers identify blockers earlier?', answer: 'The Team Command Center brings sprint progress, team velocity, open blockers, team workload, and activity into one view. It replaces a chain of update requests with a shared operating picture.', points: ['Sprint progress and velocity', 'Open blockers in context', 'Workload by team member', 'Active and completed tasks'], },
  'remote-teams': { eyebrow: 'SprintDesk for remote teams', title: 'Stay aligned when everyone is everywhere.', desc: 'Give async work a shared home without asking every person to be online at the same time.', question: 'How does SprintDesk keep remote work connected?', answer: 'A shared Sprint Board makes assignments, deadlines, progress, tags, and activity visible. Personal capture stays private until a task is ready to join team execution.', points: ['Shared Sprint Board', 'Visible assignments and deadlines', 'Activity without scattered updates', 'Personal-to-team handoff'], },
  individuals: { eyebrow: 'SprintDesk for individuals', title: 'Protect your focus without disconnecting.', desc: 'A quiet place to catch incoming work, organize it on your own time, and move the right tasks into the team context.', question: 'How does SprintDesk separate personal and team work?', answer: 'SprintDesk gives you a private Capture Inbox and Personal Task Flow alongside a Team Workspace. You choose when a task moves from your focus into collaborative execution.', points: ['Private Capture Inbox', 'Personal Dashboard and Task Flow', 'Upcoming deadlines', 'Easy transition to team work'], },
};

function SolutionPage({ kind }: { kind: SolutionKey }) {
  const data = solutionData[kind];
  const closingTitle = kind === 'managers'
    ? 'A manager’s view should clarify, not crowd the work.'
    : kind === 'remote-teams'
      ? 'Async coordination works better when context has a home.'
      : 'Personal organization is part of team execution.';
  const closingBody = kind === 'managers'
    ? 'Use the Command Center to orient the conversation around progress, workload, and blockers.'
    : kind === 'remote-teams'
      ? 'SprintDesk makes the handoff from a private note to a shared task legible to everyone involved.'
      : 'Capture first, triage later, then choose the personal or team board that matches the work.';
  const demo = kind === 'managers' ? <CommandCenter /> : kind === 'remote-teams' ? <BoardDemo full /> : <CaptureDemo />;
  return (
    <Shell>
      <Meta title={`${data.eyebrow} — SprintDesk`} description={data.desc} path={`/solutions/${kind}`} />
      <main>
        <section className="inner-hero">
          <div className="container-wide">
            <div className="eyebrow">{data.eyebrow}</div>
            <h1 className="display">{data.title}</h1>
            <p>{data.desc}</p>
            <div className="hero-actions">
              <a href="#solution-demo" className="button-primary" data-testid="link-solution-start">Start free <ArrowUpRight size={15} /></a>
              <Link href="/how-it-works" className="button-secondary" data-testid="link-solution-how">See the workflow <ArrowRight size={15} /></Link>
            </div>
          </div>
        </section>
        <section className="inner-section" id="solution-demo">
          <div className="container-wide">
            <div className="solution-intro" style={{ maxWidth: 650, marginBottom: 48 }}>
              <div className="eyebrow">A specific answer for a specific context</div>
              <h2 className="display" style={{ fontSize: 'clamp(31px,4vw,48px)', margin: '13px 0' }}>{data.question}</h2>
              <p className="muted" style={{ fontSize: 17 }}>{data.answer}</p>
            </div>
            <div className="workspace-grid">
              <div className="workspace-copy"><ul className="workspace-points">{data.points.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul></div>
              <div>{demo}</div>
            </div>
          </div>
        </section>
        <section className="problem-section">
          <div className="container-wide"><SectionHeading eyebrow="Make the next step visible" title={closingTitle} body={closingBody} /></div>
        </section>
        <FinalCTA />
      </main>
    </Shell>
  );
}

const pricingFaq = [
  { question: 'Can I start with the Free plan?', answer: 'Yes. Free is designed for individual professionals and includes one Personal Workspace, up to three Team Workspaces, 3–5 members per team, and core Kanban functionality.' },
  { question: 'What happens when my team grows?', answer: 'Pro adds unlimited team members, Story Points tracking, Time Tracking, and Advanced Swimlanes for growing collaborative teams.' },
  { question: 'Which plan includes automations?', answer: 'Enterprise includes the No-Code Automations Engine, along with everything in Pro, timesheet exports, and custom client portals.' },
];

function Pricing() {
  const comparisonRows = [
    ['Personal Workspace', '1', '1', '1'],
    ['Team Workspaces', 'Up to 3', 'Up to 3', 'Up to 3'],
    ['Team members', '3–5 per team', 'Unlimited', 'Unlimited'],
    ['Core Kanban functionality', 'Included', 'Included', 'Included'],
    ['Story Points tracking', '—', 'Included', 'Included'],
    ['Time Tracking', '—', 'Included', 'Included'],
    ['Advanced Swimlanes', '—', 'Included', 'Included'],
    ['No-Code Automations Engine', '—', '—', 'Included'],
    ['Timesheet exports', '—', '—', 'Included'],
    ['Custom Client Portals', '—', '—', 'Included'],
  ];
  return <Shell>
    <Meta title="SprintDesk Pricing — Start Simple, Scale with the Work" description="Compare SprintDesk Free, Pro, and Enterprise plans. Start with a personal workspace and grow into team execution, tracking, and automation." path="/pricing" faq={pricingFaq} />
    <main>
      <section className="inner-hero pricing-hero"><div className="container-wide"><div className="eyebrow">Pricing</div><h1 className="display">Start simple. Scale when the work does.</h1><p>Choose the SprintDesk workspace that fits how you work today.</p></div></section>
      <section className="inner-section pricing-plans-section" id="plans"><div className="container-wide"><PricingCards /></div></section>
      <section className="pricing-comparison-section" data-reveal>
        <div className="container-wide">
          <div className="pricing-section-heading"><div><div className="eyebrow">Compare plans</div><h2 className="display">The right amount of structure for the work ahead.</h2></div><p>Every plan keeps the core journey intact: capture, organize, and move work forward.</p></div>
          <div className="comparison-wrap"><table className="comparison-table"><thead><tr><th scope="col">Workspace capability</th><th scope="col">Free</th><th scope="col">Pro</th><th scope="col">Enterprise</th></tr></thead><tbody>{comparisonRows.map(([feature, free, pro, enterprise]) => <tr key={feature}><th scope="row">{feature}</th><td>{free === 'Included' ? <Check size={15} aria-label="Included" /> : free}</td><td>{pro === 'Included' ? <Check size={15} aria-label="Included" /> : pro}</td><td>{enterprise === 'Included' ? <Check size={15} aria-label="Included" /> : enterprise}</td></tr>)}</tbody></table></div>
        </div>
      </section>
      <section className="pricing-faq-section" data-reveal><div className="container-wide pricing-faq-layout"><div><div className="eyebrow">Questions before you choose</div><h2 className="display">Pricing should be easy to explain.</h2><p>Start with the plan that matches your current context. Move up when your team and workflow need more room.</p></div><div className="faq-list">{pricingFaq.map(({ question, answer }) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>
      <section className="pricing-final-cta"><div className="container-wide"><div className="eyebrow">A clear place to start</div><h2 className="display">Start with the work you have today.</h2><Link href="/pricing#plans" className="button-primary" data-testid="link-pricing-final-start">Start Free <ArrowUpRight size={15} /></Link><div className="microcopy">No credit card required.</div></div></section>
    </main>
  </Shell>;
}

function WorkflowAutomation() {
  const automationFaq = [
    { question: 'What is workflow automation?', answer: 'Workflow automation is the use of simple rules to make predictable task updates happen automatically when a defined condition is met.' },
    { question: 'How does task automation work?', answer: 'You choose a trigger, such as a task status changing to In Review, then choose rule-based actions such as setting a priority or assigning the task to a project manager.' },
    { question: 'When should teams automate workflows?', answer: 'Teams should automate repetitive, consistent updates that do not need a new decision every time. Automation is useful when the same status, priority, or assignment change happens again and again.' },
    { question: 'How does SprintDesk approach automation?', answer: 'SprintDesk keeps automation no-code and focused: When a task condition changes, Then update its priority, And assign the next owner. The rule stays visible and close to the work.' },
  ];
  return <Shell>
    <Meta title="Workflow Automation Software | SprintDesk" description="Create simple no-code rules that update task status, change priorities, and assign work when the right conditions are met." path="/workflow-automation" faq={automationFaq} />
    <main>
      <section className="inner-hero automation-page-hero"><div className="container-wide automation-page-hero-grid"><div><div className="eyebrow">Workflow automation</div><h1 className="display">Let your workflow handle the busywork.</h1><p>Create simple no-code rules that automatically update tasks, change priorities, and assign work when the right conditions are met.</p><div className="hero-actions"><Link href="/pricing" className="button-primary" data-testid="link-automation-start">Start Free <ArrowUpRight size={15} /></Link><Link href="#automation-demo" className="button-secondary">Build a rule <ArrowRight size={15} /></Link></div></div><div className="automation-hero-signal"><span className="eyebrow">IF THIS → THEN THAT</span><strong>Routine updates,<br /><em>handled.</em></strong><div className="automation-signal-flow"><span>STATUS CHANGES</span><i /><span>PRIORITY + OWNER</span></div></div></div></section>
      <section className="automation-demo-section" id="automation-demo"><div className="container-wide"><div className="automation-demo-heading"><div><div className="eyebrow">Build a rule in seconds</div><h2 className="display">When the condition is met, the next step is already clear.</h2></div><p>Choose the trigger and rule-based actions. Then activate the rule to see the resulting task update.</p></div><AutomationRuleBuilder /></div></section>
      <section className="automation-benefits-section" data-reveal><div className="container-wide"><div className="automation-benefit-intro"><div className="eyebrow">Small rules. Less coordination.</div><h2 className="display">Make the repeatable parts disappear.</h2></div><div className="automation-benefit-grid">{[['01', 'Reduce repetitive updates.', 'Stop changing the same fields by hand every time a task moves.'], ['02', 'Keep workflows consistent.', 'Use one visible rule for the updates your team agrees should happen together.'], ['03', 'Move tasks automatically.', 'Let status changes carry the right priority and ownership with them.'], ['04', 'Reduce manual coordination.', 'Spend less time reminding people what the workflow already knows.']].map(([number, title, body]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div></div></section>
      <section className="automation-answer-section" data-reveal><div className="container-wide"><div className="automation-answer-heading"><div className="eyebrow">A direct definition</div><h2 className="display">What is workflow automation?</h2><p className="answer-lede">Workflow automation is the use of rule-based actions to update work automatically when a known condition is met.</p></div><div className="automation-answer-grid"><div><span>01</span><h3>How task automation works</h3><p>Define a When condition, then choose the Then and And actions that should follow. In SprintDesk, those actions focus on status, priority, and assignments.</p></div><div><span>02</span><h3>When teams should automate</h3><p>Automate predictable updates that happen repeatedly and consistently. Keep decisions that need judgment with the people doing the work.</p></div><div><span>03</span><h3>How SprintDesk approaches it</h3><p>SprintDesk uses a visible, no-code rule builder so the workflow stays understandable: In Review can mean High priority and a clear next owner.</p></div></div></div></section>
      <section className="automation-faq-section"><div className="container-wide automation-faq-layout"><div><div className="eyebrow">Questions teams ask</div><h2 className="display">Automation that stays understandable.</h2><p>Useful automation should make a workflow clearer, not hide it behind a complicated system.</p></div><div className="faq-list">{automationFaq.map(({ question, answer }) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>
      <section className="automation-final-cta"><div className="container-wide"><div className="eyebrow">Rule-based work, made simple</div><h2 className="display">Build the rule once. Let the workflow repeat itself.</h2><Link href="/pricing" className="button-primary" data-testid="link-automation-final-start">Start Free <ArrowUpRight size={15} /></Link><div className="microcopy">No credit card required.</div></div></section>
    </main>
  </Shell>;
}

const articles = [
  { category: 'TASK MANAGEMENT', title: 'A practical system for the work you do not have time to organize yet', excerpt: 'Why a private capture step makes task management calmer—and how to turn raw notes into actionable work.', slug: 'private-capture-to-actionable-work', type: 'article' },
  { category: 'REMOTE WORK', title: 'Async work is visible work when the context travels with it', excerpt: 'A field guide to assignments, deadlines, and shared activity without a daily status ritual.', slug: 'async-work-shared-context', type: 'article' },
  { category: 'WORKLOAD MANAGEMENT', title: 'What a useful team workload view actually shows', excerpt: 'Look at active work, ownership, and blockers together before you rebalance a sprint.', slug: 'useful-team-workload-view', type: 'article' },
  { category: 'SPRINT MANAGEMENT', title: 'Story points are a conversation about progress', excerpt: 'Use points and progress to make a sprint legible without turning the board into a scoreboard.', slug: 'story-points-and-sprint-progress', type: 'guide' },
  { category: 'WORKFLOW AUTOMATION', title: 'If this, then that: a small rule builder with a big payoff', excerpt: 'Where no-code rules help most: routine priority changes and predictable assignments.', slug: 'small-rules-big-payoff', type: 'guide' },
];

function ResourcesHub({ kind }: { kind: 'blog' | 'guides' | 'templates' }) {
  const filtered = kind === 'blog' ? articles.slice(0, 3) : kind === 'guides' ? articles.slice(2) : [{ category: 'TEAM PRODUCTIVITY', title: 'The personal-to-team handoff canvas', excerpt: 'A practical starting point for deciding what belongs in Personal Task Flow and what belongs in a Sprint Board.', slug: 'personal-to-team-handoff', type: 'template' }, { category: 'TASK MANAGEMENT', title: 'The weekly triage checklist', excerpt: 'A lightweight way to turn a Capture Inbox into a focused list of next actions.', slug: 'weekly-triage-checklist', type: 'template' }, { category: 'REMOTE WORK', title: 'Async sprint kickoff outline', excerpt: 'A shared outline for sprint goals, ownership, deadlines, and blockers.', slug: 'async-sprint-kickoff', type: 'template' }];
  const title = kind === 'blog' ? 'Notes on the work between the thought and the outcome.' : kind === 'guides' ? 'Guides for making work easier to see and move.' : 'Practical starting points for better work.';
  return <Shell><Meta title={`SprintDesk ${kind[0].toUpperCase() + kind.slice(1)} — Ideas for Better Work`} description={title} path={`/resources/${kind}`} /><main><section className="inner-hero"><div className="container-wide"><div className="eyebrow">Resources / {kind}</div><h1 className="display">{title}</h1><p>{kind === 'blog' ? 'Thoughtful writing about task management, remote work, sprint management, team productivity, workload, and workflow automation.' : kind === 'guides' ? 'Educational paths that connect a practical idea to a product workflow you can actually use.' : 'Downloadable ways to think through capture, triage, team handoffs, and sprint coordination.'}</p></div></section><section className="inner-section"><div className="container-wide"><div className="resource-grid">{filtered.map((item, index) => <Link href={`/resources/blog/${item.slug}`} className={`resource-card ${index === 0 ? 'featured' : ''}`} key={item.slug} data-testid={`link-resource-${item.slug}`}><div className="eyebrow">{item.category}</div>{index === 0 ? <h2>{item.title}</h2> : <h3>{item.title}</h3>}<p>{item.excerpt}</p><span className="read-more">{item.type === 'template' ? 'Open template →' : item.type === 'guide' ? 'Read guide →' : 'Read article →'}</span></Link>)}</div></div></section><section className="inner-section" style={{ paddingTop: 0 }}><div className="container-wide"><div className="surface" style={{ padding: '32px 36px', display: 'flex', justifyContent: 'space-between', gap: 30, alignItems: 'center', flexWrap: 'wrap' }}><div><div className="eyebrow">The product connection</div><h2 className="display" style={{ fontSize: 28, margin: '12px 0 0' }}>When the idea is ready, SprintDesk gives it somewhere to go.</h2></div><Link href="/features" className="button-secondary" data-testid="link-resources-features">Explore product capabilities <ArrowRight size={15} /></Link></div></div></section></main></Shell>;
}

function Article() {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find((item) => item.slug === slug) ?? articles[0];
  return <Shell><Meta title={`${article.title} — SprintDesk`} description={article.excerpt} path={`/resources/blog/${article.slug}`} /><main><div className="container-wide breadcrumbs">Home → Resources → {article.type === 'article' ? 'Blog' : 'Guides'} → {article.title}</div><article className="article"><div className="eyebrow">{article.category}</div><h1 className="display">{article.title}</h1><p className="lede">{article.excerpt}</p><div className="article-body"><p><strong style={{ color: 'hsl(var(--foreground))' }}>The short answer:</strong> work becomes easier to move when the first capture and the final handoff are part of the same visible system. The point is not to organize everything immediately. The point is to keep context available until you are ready to decide.</p><h2>Start with the thought, not the structure</h2><p>A private Capture Inbox is useful because it lowers the cost of starting. A task can arrive as a phrase, a link, a reminder, or a question. It does not need a perfect title or a destination before it is safe to write down.</p><ul><li>Capture the thought while it is fresh.</li><li>Return to the inbox when you have the context to triage.</li><li>Choose Personal or Team Workspace deliberately.</li></ul><h2>Make the handoff explicit</h2><p>During triage, refine the title, select a board column, set priority, and decide whether this is personal work or shared execution. That small decision prevents personal priorities from disappearing into team activity—and prevents team work from living only in a private notebook.</p><h2>Let visibility arrive from the workflow</h2><p>Once a task enters a Sprint Board, story points, progress, swimlanes, assignees, and activity make the work legible. Managers can use the Command Center to see velocity, blockers, and workload without interrupting the people doing the work.</p><div className="feature-mini" style={{ marginTop: 45 }}>Continue with <Link href="/how-it-works" style={{ color: 'hsl(var(--accent))' }} data-testid="link-article-workflow">the SprintDesk workflow →</Link></div></div></article></main></Shell>;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch>
    <Route path="/" component={Home} />
    <Route path="/features" component={Features} />
    <Route path="/how-it-works" component={HowItWorks} />
    <Route path="/personal-task-management" component={PersonalTaskManagement} />
    <Route path="/team-task-management" component={TeamTaskManagement} />
    <Route path="/team-workload-management" component={TeamWorkloadManagement} />
    <Route path="/sprint-management" component={SprintManagement} />
    <Route path="/remote-team-task-management" component={RemoteTeamTaskManagement} />
    <Route path="/workflow-automation" component={WorkflowAutomation} />
    <Route path="/solutions/managers"><SolutionPage kind="managers" /></Route>
    <Route path="/solutions/remote-teams"><SolutionPage kind="remote-teams" /></Route>
    <Route path="/solutions/individuals"><SolutionPage kind="individuals" /></Route>
    <Route path="/pricing" component={Pricing} />
    <Route path="/resources/blog/:slug" component={Article} />
    <Route path="/resources/blog"><ResourcesHub kind="blog" /></Route>
    <Route path="/resources/guides"><ResourcesHub kind="guides" /></Route>
    <Route path="/resources/templates"><ResourcesHub kind="templates" /></Route>
    <Route path="/privacy"><Legal title="Privacy" /></Route>
    <Route path="/terms"><Legal title="Terms" /></Route>
    <Route path="/security"><Legal title="Security" /></Route>
    <Route component={NotFound} />
  </Switch></ErrorBoundary>;
}

function Legal({ title }: { title: string }) {
  return <Shell><Meta title={`${title} — SprintDesk`} description={`${title} information for SprintDesk.`} path={`/${title.toLowerCase()}`} /><main><section className="inner-hero"><div className="container-wide"><div className="eyebrow">SprintDesk / Legal</div><h1 className="display">{title}</h1><p>This page is a placeholder for SprintDesk’s {title.toLowerCase()} information and will be updated before public launch.</p></div></section></main></Shell>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;