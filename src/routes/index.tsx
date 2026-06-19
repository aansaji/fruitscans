import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PRODUCE, type Produce, type Metric } from "@/lib/produce";
import { AnalysisReport } from "@/components/fruitscan/AnalysisReport";
import { CalibrationWizard } from "@/components/fruitscan/CalibrationWizard";

export const Route = createFileRoute("/")({
  component: Index,
});

const Icon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);


// ─────────── Top Nav ───────────
function TopNav() {
  const links = ["Scan", "Library", "Devices", "Insights"];
  return (
    <header className="fixed top-0 inset-x-0 z-50 h-14 backdrop-blur-xl bg-background/70 border-b border-white/5">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center glow-green">
            <Icon name="eco" className="text-primary text-[18px]!" />
          </div>
          <span className="font-display font-bold tracking-tight text-white">
            FruitScan <span className="text-primary">Elite</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-on-surface-variant">
          {links.map((l) => (
            <a key={l} href="#" className="hover:text-white transition-colors">
              {l}
            </a>
          ))}
        </nav>
        <a
          href="#presets"
          className="btn-depth px-4 py-2 rounded-full bg-primary text-on-primary text-sm font-semibold"
        >
          New Scan
        </a>
      </div>
    </header>
  );
}

// ─────────── Hero ───────────
function Hero({
  current,
  scanning,
  progress,
  onScan,
}: {
  current: Produce;
  scanning: boolean;
  progress: number;
  onScan: () => void;
}) {
  return (
    <section className="relative bg-surface px-6 py-12 md:py-20 overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-primary/5 blur-[120px] -z-10" />
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div>
            <span className="text-primary/80 mb-2 block uppercase tracking-[0.2em] font-bold text-xs">
              Laboratory Grade Analysis
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-[1.05]">
              Analyze Freshness <br />
              with Precision.
            </h1>
            <p className="text-base md:text-lg text-on-surface-variant mt-4 max-w-lg">
              Pick a preset from your produce library or connect your FruitScan Elite device for
              real-time molecular-level quality inspection.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={onScan}
              disabled={scanning}
              className="btn-depth flex items-center justify-center gap-2 px-8 py-4 bg-primary text-on-primary rounded-full font-semibold hover:brightness-110 disabled:opacity-60"
            >
              <Icon name={scanning ? "radar" : "photo_camera"} />
              {scanning ? `Scanning… ${progress}%` : `Scan ${current.name}`}
            </button>
            <a
              href="#presets"
              className="btn-depth flex items-center justify-center gap-2 px-8 py-4 border border-outline-variant bg-surface-container/50 text-white rounded-full font-semibold hover:bg-surface-container"
            >
              <Icon name="grid_view" />
              Browse Produce
            </a>
          </div>
        </div>

        <div className="relative group">
          <div className="scanner-border-3d p-4 bg-surface-container-high/30 backdrop-blur-sm">
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-surface-container-lowest flex flex-col items-center justify-center border border-white/5 group-hover:border-primary/20 transition-all">
              <img
                alt={`${current.name} scan preview`}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                  scanning ? "opacity-70 grayscale-0" : "opacity-30 mix-blend-luminosity grayscale"
                }`}
                src={current.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
              {scanning && (
                <div
                  className="absolute left-0 right-0 h-[2px] bg-primary glow-green"
                  style={{ top: `${progress}%`, transition: "top 60ms linear" }}
                />
              )}
              <div className="relative z-10 text-center p-8 bg-surface-container/40 backdrop-blur-md rounded-xl border border-white/10 glass-card">
                <span className="text-5xl mb-3 block">{current.emoji}</span>
                <h3 className="text-xl font-semibold text-white">
                  {scanning ? "Analyzing Sample…" : current.name}
                </h3>
                <p className="text-sm text-on-surface-variant mt-2">
                  {scanning
                    ? `Spectral pass ${progress}%`
                    : `${current.category} · ready for inspection`}
                </p>
                <div className="mt-6 flex justify-center gap-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-8 rounded-full ${
                        scanning ? "bg-primary glow-green" : "bg-primary/30"
                      }`}
                      style={
                        scanning
                          ? { animation: `bounce ${1 + i * 0.2}s infinite` }
                          : undefined
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 glass-card p-4 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary glow-green">
              <Icon name="settings_input_component" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                HW Status
              </p>
              <p className="text-sm font-mono text-primary glow-green">
                Elite Device Connected
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────── Preset Picker ───────────
function PresetPicker({
  current,
  onPick,
  disabled,
}: {
  current: Produce;
  onPick: (p: Produce) => void;
  disabled: boolean;
}) {
  return (
    <section id="presets" className="bg-surface-container-lowest py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Produce Library</h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Choose a preset sample to load its calibrated profile and run a scan.
            </p>
          </div>
          <span className="text-xs uppercase tracking-wider text-on-surface-variant">
            {PRODUCE.length} presets available
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {PRODUCE.map((p) => {
            const active = p.id === current.id;
            return (
              <button
                key={p.id}
                onClick={() => onPick(p)}
                disabled={disabled}
                className={`btn-depth glass-card rounded-2xl p-4 flex flex-col items-center gap-2 text-center transition-all border ${
                  active
                    ? "border-primary/50 glow-green"
                    : "border-white/5 hover:border-primary/30"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="text-4xl">{p.emoji}</span>
                <span className="text-sm font-semibold text-white">{p.name}</span>
                <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">
                  {p.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────── Dashboard ───────────
function MetricCard({ m }: { m: Metric }) {
  const c = `text-${m.color}`;
  const bg = `bg-${m.color}`;
  const chipBg = `bg-${m.color}/10`;
  const chipBorder = `border-${m.color}/20`;
  return (
    <div className="p-6 rounded-3xl glass-card transition-transform hover:scale-[1.02] duration-300">
      <div className="flex justify-between items-start mb-6">
        <Icon name={m.icon} className={`${c} ${m.glow}`} />
        <span
          className={`text-[10px] ${c} ${chipBg} border ${chipBorder} px-2 py-0.5 rounded uppercase font-bold tracking-wider`}
        >
          {m.status}
        </span>
      </div>
      <h4 className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
        {m.label}
      </h4>
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-3xl font-bold text-white">{m.value}</span>
        <span className="text-sm text-on-surface-variant">{m.unit}</span>
      </div>
      <div className="w-full bg-surface h-2 rounded-full mt-4 overflow-hidden sunk-in">
        <div
          className={`${bg} h-full rounded-full ${m.glow} transition-[width] duration-700`}
          style={{ width: `${m.pct}%` }}
        />
      </div>
    </div>
  );
}

function Dashboard({ current }: { current: Produce }) {
  return (
    <section className="py-20 bg-surface-container-lowest border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Live Analysis · {current.name}
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Real-time telemetry from active scanning session.
            </p>
          </div>
          <div className="flex gap-2">
            {["refresh", "download", "more_vert"].map((i) => (
              <button
                key={i}
                className="p-2 hover:bg-surface-container rounded-lg transition-colors border border-white/10 glass-card"
              >
                <Icon name={i} className="text-on-surface-variant" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {current.metrics.map((m) => (
            <MetricCard key={m.label} m={m} />
          ))}
        </div>

        <div className="mt-8 p-8 rounded-3xl glass-card sunk-in">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h4 className="text-xl font-semibold text-white">Spectral Analysis Chart</h4>
            <div className="flex gap-6">
              <span className="flex items-center gap-2 text-xs text-on-surface-variant">
                <span className="w-3 h-3 rounded-full bg-secondary glow-blue" /> Infrared
              </span>
              <span className="flex items-center gap-2 text-xs text-on-surface-variant">
                <span className="w-3 h-3 rounded-full bg-primary glow-green" /> UltraViolet
              </span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-3 px-4 border-b border-l border-white/10 relative">
            {current.spectrum.map((h, i) => {
              const c = i % 2 === 0 ? "secondary" : "primary";
              const g = c === "secondary" ? "glow-blue" : "glow-green";
              return (
                <div
                  key={i}
                  className={`flex-grow bg-${c}/20 hover:bg-${c}/40 transition-all duration-500 rounded-t ${g}`}
                  style={{ height: `${h}%` }}
                />
              );
            })}
          </div>
          <div className="mt-4 flex justify-between px-4 text-xs text-on-surface-variant/60">
            <span>400nm</span>
            <span>550nm</span>
            <span>700nm</span>
            <span>850nm</span>
            <span>1000nm</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────── System Tools ───────────
type ToolId = "diagnostics" | "sync" | "export" | "calibration" | "update";
type Tool = {
  id: ToolId;
  icon: string;
  label: string;
  description: string;
  steps: string[]; // log lines emitted while running
  durationMs: number;
};

const TOOLS: Tool[] = [
  {
    id: "diagnostics",
    icon: "monitor_heart",
    label: "Diagnostics",
    description: "Run a full hardware self-test on the FruitScan Elite probe.",
    durationMs: 3200,
    steps: [
      "Probing optical bench…",
      "Verifying CCD response (411nm – 980nm)…",
      "Checking thermistor drift: ±0.12°C OK",
      "Light source intensity nominal",
      "Diagnostics PASSED — 0 faults",
    ],
  },
  {
    id: "sync",
    icon: "cloud_sync",
    label: "Database Sync",
    description: "Sync latest produce reference profiles from the lab cloud.",
    durationMs: 2600,
    steps: [
      "Authenticating with FruitScan Cloud…",
      "Fetching reference deltas (v24.3.1 → v24.3.4)…",
      "Merged 184 spectral signatures",
      "Sync complete · last updated just now",
    ],
  },
  {
    id: "export",
    icon: "table_chart",
    label: "Data Export",
    description: "Bundle the current session as a downloadable CSV report.",
    durationMs: 1800,
    steps: [
      "Collating active session metrics…",
      "Building CSV (4 metrics × 8 spectral bands)…",
      "scan-report.csv ready for download",
    ],
  },
  {
    id: "calibration",
    icon: "verified",
    label: "Calibration",
    description: "White-reference calibration against the supplied target.",
    durationMs: 3600,
    steps: [
      "Insert white reference target…",
      "Capturing baseline (12 frames)…",
      "Computing correction matrix…",
      "Drift compensation +0.7% applied",
      "Calibration stored ✓",
    ],
  },
  {
    id: "update",
    icon: "system_update_alt",
    label: "Firmware Update",
    description: "Apply the latest firmware to the connected device.",
    durationMs: 4200,
    steps: [
      "Checking firmware channel (stable)…",
      "Downloading FS-Elite-fw-v2.8.1 (2.4 MB)…",
      "Verifying signature…",
      "Flashing probe controller…",
      "Reboot complete · running v2.8.1",
    ],
  },
];

function SystemTools() {
  const [active, setActive] = useState<ToolId | null>(null);
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState<{ tool: ToolId; line: string; ts: string }[]>([]);
  const [completed, setCompleted] = useState<Record<ToolId, string | null>>({
    diagnostics: null,
    sync: null,
    export: null,
    calibration: null,
    update: null,
  });
  const timers = useRef<number[]>([]);
  const logEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => timers.current.forEach((t) => window.clearTimeout(t));
  }, []);

  useEffect(() => {
    logEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [log]);

  const run = (tool: Tool) => {
    if (active) return;
    setActive(tool.id);
    setProgress(0);
    setLog((l) => [
      ...l,
      {
        tool: tool.id,
        line: `▶ ${tool.label} started`,
        ts: new Date().toLocaleTimeString(),
      },
    ]);
    const stepInterval = tool.durationMs / tool.steps.length;
    tool.steps.forEach((step, i) => {
      const t = window.setTimeout(() => {
        setLog((l) => [
          ...l,
          { tool: tool.id, line: step, ts: new Date().toLocaleTimeString() },
        ]);
      }, stepInterval * (i + 0.5));
      timers.current.push(t);
    });
    const tickInterval = 60;
    const ticks = Math.ceil(tool.durationMs / tickInterval);
    for (let i = 1; i <= ticks; i++) {
      const t = window.setTimeout(() => {
        setProgress(Math.round((i / ticks) * 100));
      }, i * tickInterval);
      timers.current.push(t);
    }
    const done = window.setTimeout(() => {
      setProgress(100);
      setActive(null);
      setCompleted((c) => ({ ...c, [tool.id]: new Date().toLocaleTimeString() }));
      setLog((l) => [
        ...l,
        {
          tool: tool.id,
          line: `✓ ${tool.label} completed`,
          ts: new Date().toLocaleTimeString(),
        },
      ]);
    }, tool.durationMs + 50);
    timers.current.push(done);
  };

  return (
    <section className="bg-surface py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-10">
          <div>
            <h3 className="text-3xl font-bold text-white">System Tools</h3>
            <p className="text-sm text-on-surface-variant mt-1">
              Run device routines and watch live output below.
            </p>
          </div>
          {active && (
            <div className="flex items-center gap-3 text-sm text-primary">
              <Icon name="progress_activity" className="animate-spin" />
              Running {TOOLS.find((t) => t.id === active)?.label}… {progress}%
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {TOOLS.map((t) => {
            const isActive = active === t.id;
            const lastRun = completed[t.id];
            return (
              <button
                key={t.id}
                onClick={() => run(t)}
                disabled={!!active}
                className={`btn-depth group relative overflow-hidden flex flex-col items-start gap-3 p-5 glass-card rounded-2xl text-left transition-all border ${
                  isActive
                    ? "border-primary/50"
                    : "border-white/5 hover:border-primary/30"
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-high text-primary group-hover:bg-primary group-hover:text-on-primary"
                    }`}
                  >
                    <Icon
                      name={isActive ? "progress_activity" : t.icon}
                      className={isActive ? "animate-spin" : ""}
                    />
                  </div>
                  <span className="font-semibold text-white">{t.label}</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {t.description}
                </p>
                <div className="w-full h-1 rounded-full bg-surface overflow-hidden sunk-in">
                  <div
                    className="h-full bg-primary glow-green transition-[width] duration-100"
                    style={{ width: `${isActive ? progress : lastRun ? 100 : 0}%` }}
                  />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">
                  {isActive
                    ? `Running · ${progress}%`
                    : lastRun
                      ? `Last run ${lastRun}`
                      : "Idle"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Console output */}
        <div className="mt-8 rounded-3xl glass-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-surface-container/40">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-berry-red" />
              <span className="w-2.5 h-2.5 rounded-full bg-citrus-orange" />
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="ml-3 text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                System Console
              </span>
            </div>
            <button
              onClick={() => setLog([])}
              disabled={!!active || log.length === 0}
              className="text-xs text-on-surface-variant hover:text-white transition disabled:opacity-30"
            >
              Clear
            </button>
          </div>
          <div className="bg-surface-container-lowest/80 px-5 py-4 h-56 overflow-y-auto font-mono text-xs leading-relaxed">
            {log.length === 0 ? (
              <p className="text-on-surface-variant/60">
                $ awaiting command — run any tool above to see live output.
              </p>
            ) : (
              log.map((l, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-on-surface-variant/50">{l.ts}</span>
                  <span className="text-primary/80">[{l.tool}]</span>
                  <span className="text-white">{l.line}</span>
                </div>
              ))
            )}
            <div ref={logEnd} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────── Footer ───────────
function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant">
        <div className="flex items-center gap-2">
          <Icon name="eco" className="text-primary text-[18px]!" />
          <span className="font-display font-bold text-white">FruitScan Elite</span>
        </div>
        <p>© {new Date().getFullYear()} FruitScan Laboratories. All rights reserved.</p>
      </div>
    </footer>
  );
}

// ─────────── Page ───────────
function Index() {
  const [current, setCurrent] = useState<Produce>(PRODUCE[1]);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const runScan = () => {
    if (scanning) return;
    setScanning(true);
    setProgress(0);
    const duration = 2200;
    const tickInterval = 50;
    const ticks = Math.ceil(duration / tickInterval);
    for (let i = 1; i <= ticks; i++) {
      const t = window.setTimeout(() => {
        setProgress(Math.round((i / ticks) * 100));
      }, i * tickInterval);
      timers.current.push(t);
    }
    const done = window.setTimeout(() => {
      setScanning(false);
      setProgress(100);
    }, duration + 50);
    timers.current.push(done);
  };

  const pick = (p: Produce) => {
    if (scanning) return;
    setCurrent(p);
    setProgress(0);
  };

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <TopNav />
      <main className="pt-14">
        <Hero current={current} scanning={scanning} progress={progress} onScan={runScan} />
        <PresetPicker current={current} onPick={pick} disabled={scanning} />
        <Dashboard current={current} />
        <SystemTools />
      </main>
      <Footer />
    </div>
  );
}
