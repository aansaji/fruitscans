import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

const Icon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const PREVIEW_IMG =
  "https://lh3.googleusercontent.com/aida/AP1WRLugwjZqAmXOwltnA3iQM2EJVuHPW83tI2CL4DDbm_dnxJBKFwWU7N3GTulzPa4nm2vUzDXetEFIgmpYy_Enk60y3Hm-y-xLYICTinyuY7dybi8ANgJWnZgunVZfB9lqWCF0GW9z8bf_XJ1cb3YE8YNVBxs-OvT3G5hrkMfGlOnN0hcdM69QnAxMapEHggMX2h44N-joYv4KZYf6qwAyboev9Mp4F3D8nVvQ7ZPuiIdU9Y2sOZMlvAP43g";

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
        <button className="btn-depth px-4 py-2 rounded-full bg-primary text-on-primary text-sm font-semibold">
          New Scan
        </button>
      </div>
    </header>
  );
}

function Hero() {
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
              Upload high-resolution captures or connect your FruitScan Elite device for
              real-time molecular-level quality inspection.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="btn-depth flex items-center justify-center gap-2 px-8 py-4 bg-primary text-on-primary rounded-full font-semibold hover:brightness-110">
              <Icon name="photo_camera" />
              Activate Camera
            </button>
            <button className="btn-depth flex items-center justify-center gap-2 px-8 py-4 border border-outline-variant bg-surface-container/50 text-white rounded-full font-semibold hover:bg-surface-container">
              <Icon name="upload_file" />
              Batch Upload
            </button>
          </div>
        </div>

        <div className="relative group">
          <div className="scanner-border-3d p-4 bg-surface-container-high/30 backdrop-blur-sm">
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-surface-container-lowest flex flex-col items-center justify-center border border-white/5 group-hover:border-primary/20 transition-all">
              <img
                alt="Scanning preview"
                className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity grayscale"
                src={PREVIEW_IMG}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
              <div className="relative z-10 text-center p-8 bg-surface-container/40 backdrop-blur-md rounded-xl border border-white/10 glass-card">
                <Icon name="target" className="text-4xl! text-primary mb-4 block glow-green" />
                <h3 className="text-xl font-semibold text-white">Drop an Image or Scan</h3>
                <p className="text-sm text-on-surface-variant mt-2">
                  Support for JPG, PNG, and RAW analysis
                </p>
                <div className="mt-6 flex justify-center gap-2">
                  <div
                    className="w-1.5 h-8 bg-primary rounded-full glow-green"
                    style={{ animation: "bounce 1s infinite" }}
                  />
                  <div
                    className="w-1.5 h-8 bg-primary/60 rounded-full"
                    style={{ animation: "bounce 1.2s infinite" }}
                  />
                  <div
                    className="w-1.5 h-8 bg-primary/30 rounded-full"
                    style={{ animation: "bounce 1.4s infinite" }}
                  />
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

type Metric = {
  icon: string;
  label: string;
  value: string;
  unit: string;
  status: string;
  color: "primary" | "secondary" | "citrus-orange" | "berry-red";
  pct: number;
  glow: string;
};

const METRICS: Metric[] = [
  { icon: "eco", label: "Ripeness Index", value: "87", unit: "/ 100", status: "Optimal", color: "primary", pct: 87, glow: "glow-green" },
  { icon: "opacity", label: "Moisture Level", value: "14.2", unit: "%", status: "Moderate", color: "citrus-orange", pct: 62, glow: "glow-orange" },
  { icon: "bloodtype", label: "Sugar Content", value: "12.5", unit: "°Bx", status: "High Brix", color: "secondary", pct: 75, glow: "glow-blue" },
  { icon: "warning", label: "Pesticide Detection", value: "0.02", unit: "ppm", status: "Trace Detected", color: "berry-red", pct: 15, glow: "glow-red" },
];

function MetricCard({ m }: { m: Metric }) {
  const c = `text-${m.color}`;
  const bg = `bg-${m.color}`;
  const chipBg = `bg-${m.color}/10`;
  const chipBorder = `border-${m.color}/20`;
  return (
    <div className="p-6 rounded-3xl glass-card transition-transform hover:scale-[1.02] duration-300">
      <div className="flex justify-between items-start mb-6">
        <Icon name={m.icon} className={`${c} ${m.glow}`} />
        <span className={`text-[10px] ${c} ${chipBg} border ${chipBorder} px-2 py-0.5 rounded uppercase font-bold tracking-wider`}>
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
        <div className={`${bg} h-full rounded-full ${m.glow}`} style={{ width: `${m.pct}%` }} />
      </div>
    </div>
  );
}

function Dashboard() {
  const bars = [
    { h: 40, c: "secondary", g: "glow-blue" },
    { h: 60, c: "primary", g: "glow-green" },
    { h: 35, c: "secondary", g: "glow-blue" },
    { h: 80, c: "primary", g: "glow-green" },
    { h: 55, c: "secondary", g: "glow-blue" },
    { h: 45, c: "primary", g: "glow-green" },
    { h: 90, c: "secondary", g: "glow-blue" },
    { h: 30, c: "primary", g: "glow-green" },
  ];
  return (
    <section className="py-20 bg-surface-container-lowest border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">Live Analysis Dashboard</h2>
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
          {METRICS.map((m) => (
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
            {bars.map((b, i) => (
              <div
                key={i}
                className={`flex-grow bg-${b.c}/20 hover:bg-${b.c}/40 transition-all rounded-t ${b.g}`}
                style={{ height: `${b.h}%` }}
              />
            ))}
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

function SystemTools() {
  const tools = [
    { icon: "history", label: "Scan History" },
    { icon: "cloud_sync", label: "Database Sync" },
    { icon: "table_chart", label: "Data Export" },
    { icon: "verified", label: "Calibration" },
  ];
  return (
    <section className="bg-surface py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-3xl font-bold text-white mb-12 text-center md:text-left">
          System Tools
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {tools.map((t) => (
            <a
              key={t.label}
              href="#"
              className="btn-depth group flex flex-col items-center md:items-start gap-4 p-6 glass-card rounded-2xl transition-all border border-white/5 hover:border-primary/30"
            >
              <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <Icon name={t.icon} />
              </div>
              <span className="font-semibold text-white">{t.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

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

function Index() {
  return (
    <div className="bg-background text-on-surface min-h-screen">
      <TopNav />
      <main className="pt-14">
        <Hero />
        <Dashboard />
        <SystemTools />
      </main>
      <Footer />
    </div>
  );
}
