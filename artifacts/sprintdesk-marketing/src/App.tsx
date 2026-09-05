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

function Meta({ title, description, path = '' }: { title: string; description: string; path?: string }) {
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
    setMeta('og:image', 'https://sprintdesk.app/sprintdesk-logo.png', true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:image', 'https://sprintdesk.app/sprintdesk-logo.png');
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
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': path === '/' ? ['Organization', 'WebSite', 'SoftwareApplication'] : 'SoftwareApplication',
      name: 'SprintDesk',
      url: `https://sprintdesk.app${path || window.location.pathname}`,
      description,
      applicationCategory: 'BusinessApplication',
    });
  }, [title, description, path]);
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
  ['Team Sprint Board', '/features#sprints'],
  ['Command Center', '/features#command-center'],
  ['Automations', '/features#automations'],
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
    ['PRODUCT', [['Features', '/features'], ['How it works', '/how-it-works'], ['Task management', '/features#tasks'], ['Sprint boards', '/features#sprints'], ['Automations', '/features#automations']]],
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

function PersonalFlowPreview() {
  const columns: [string, string[]][] = [
    ['Backlog', ['Client proposal']],
    ['Todo', ['Fix mobile navbar', 'Review feedback']],
    ['In Progress', ['Onboarding notes']],
    ['Review', ['Release checklist']],
  ];
  return <div className="hero-board-state workflow-personal-preview" data-testid="demo-personal-task-flow">
    <div className="board-state-heading"><div><span className="eyebrow">Personal workspace</span><h3>Personal Task Flow</h3></div><span className="demo-count">4 due today</span></div>
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

function Pricing() {
  return <Shell><Meta title="SprintDesk Pricing — Start Free" description="Compare SprintDesk Free, Pro, and Enterprise plans. Start with a personal workspace and grow into team execution." path="/pricing" /><main><section className="inner-hero"><div className="container-wide"><div className="eyebrow">Pricing</div><h1 className="display">A clear place to start.</h1><p>Choose the plan that matches the way you work today. SprintDesk plans are priced per month, with no credit card required to start free.</p></div></section><section className="inner-section" style={{ paddingBottom: 35 }}><div className="container-wide"><PricingCards /></div></section><section className="inner-section" style={{ paddingTop: 35 }}><div className="container-wide"><div className="surface" style={{ padding: '28px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}><div><div className="eyebrow">Plan fit</div><h2 className="display" style={{ fontSize: 30, margin: '13px 0' }}>Start with the work in front of you.</h2></div><div className="muted" style={{ fontSize: 14 }}><p><strong style={{ color: 'hsl(var(--foreground))' }}>Free</strong> is for individual professionals. <strong style={{ color: 'hsl(var(--foreground))' }}>Pro</strong> is for growing collaborative teams. <strong style={{ color: 'hsl(var(--foreground))' }}>Enterprise</strong> is for teams needing scale and automation.</p><p>Every plan keeps the core journey intact: capture, organize, and move work forward.</p></div></div></div></section></main></Shell>;
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