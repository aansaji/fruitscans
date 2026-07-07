import { useEffect, useRef, useState } from "react";

const Icon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

export type CalibrationStep = {
  id: string;
  title: string;
  instruction: string;
  icon: string;
  durationMs: number;
};

export const CALIBRATION_STEPS: CalibrationStep[] = [
  {
    id: "auto",
    title: "Full auto-calibration",
    instruction:
      "One-shot routine: warms the source, captures dark & white references, fits the correction matrix and verifies drift < 1.0%.",
    icon: "auto_fix_high",
    durationMs: 2600,
  },
];

export type SavedProfile = {
  id: string;
  name: string;
  category: "Fruit" | "Vegetable";
  notes: string;
  createdAt: string;
  drift: number; // %
  coverage: { from: number; to: number }; // nm
};

const LS_KEY = "fruitscan.calibration.profiles.v1";

function loadProfiles(): SavedProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as SavedProfile[]) : [];
  } catch {
    return [];
  }
}

function saveProfiles(profiles: SavedProfile[]) {
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(profiles));
  } catch {
    /* ignore quota errors */
  }
}

export function CalibrationWizard() {
  const [stepIdx, setStepIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [stepProgress, setStepProgress] = useState(0);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [log, setLog] = useState<string[]>([]);
  const [profiles, setProfiles] = useState<SavedProfile[]>([]);
  const [form, setForm] = useState({
    name: "",
    category: "Fruit" as "Fruit" | "Vegetable",
    notes: "",
    from: 400,
    to: 1700,
  });
  const timers = useRef<number[]>([]);
  const logEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProfiles(loadProfiles());
    return () => timers.current.forEach((t) => window.clearTimeout(t));
  }, []);

  useEffect(() => {
    logEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [log]);

  const allDone =
    CALIBRATION_STEPS.every((s) => completed[s.id]) && Object.keys(completed).length > 0;

  const runStep = (idx: number) => {
    if (running) return;
    const step = CALIBRATION_STEPS[idx];
    setRunning(true);
    setStepProgress(0);
    setLog((l) => [...l, `▶ ${new Date().toLocaleTimeString()} — ${step.title} started`]);
    const tickInterval = 60;
    const ticks = Math.ceil(step.durationMs / tickInterval);
    for (let i = 1; i <= ticks; i++) {
      const t = window.setTimeout(() => {
        setStepProgress(Math.round((i / ticks) * 100));
      }, i * tickInterval);
      timers.current.push(t);
    }
    const done = window.setTimeout(() => {
      setRunning(false);
      setStepProgress(100);
      setCompleted((c) => ({ ...c, [step.id]: true }));
      setLog((l) => [
        ...l,
        `✓ ${new Date().toLocaleTimeString()} — ${step.title} ok`,
      ]);
      if (idx < CALIBRATION_STEPS.length - 1) setStepIdx(idx + 1);
    }, step.durationMs + 30);
    timers.current.push(done);
  };

  const resetWizard = () => {
    if (running) return;
    setStepIdx(0);
    setStepProgress(0);
    setCompleted({});
    setLog([]);
  };

  const saveProfile = () => {
    if (!form.name.trim() || !allDone) return;
    const profile: SavedProfile = {
      id: `prof_${Date.now()}`,
      name: form.name.trim(),
      category: form.category,
      notes: form.notes.trim(),
      createdAt: new Date().toLocaleString(),
      drift: Math.round((Math.random() * 0.8 + 0.1) * 100) / 100,
      coverage: { from: form.from, to: form.to },
    };
    const next = [profile, ...profiles].slice(0, 24);
    setProfiles(next);
    saveProfiles(next);
    setLog((l) => [...l, `💾 Profile "${profile.name}" saved (drift ${profile.drift}%)`]);
    setForm({ ...form, name: "", notes: "" });
  };

  const deleteProfile = (id: string) => {
    const next = profiles.filter((p) => p.id !== id);
    setProfiles(next);
    saveProfiles(next);
  };

  const completedCount = Object.values(completed).filter(Boolean).length;
  const overall = Math.round((completedCount / CALIBRATION_STEPS.length) * 100);

  return (
    <section id="calibration-wizard" className="bg-surface py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-10">
          <div>
            <h3 className="text-3xl font-bold text-white">Calibration Workflow</h3>
            <p className="text-sm text-on-surface-variant mt-1">
              Step through the calibration routine and save reusable profiles for new produce.
            </p>
          </div>
          <div className="text-sm text-on-surface-variant">
            <span className="font-mono text-primary">{overall}%</span> calibrated ·{" "}
            {profiles.length} saved profile{profiles.length === 1 ? "" : "s"}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Steps */}
          <div className="lg:col-span-2 glass-card rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-white font-semibold flex items-center gap-2">
                <Icon name="route" className="text-primary" /> Manual Calibration Steps
              </h4>
              <button
                onClick={resetWizard}
                disabled={running}
                className="text-xs text-on-surface-variant hover:text-white disabled:opacity-40"
              >
                Reset
              </button>
            </div>
            <div className="space-y-3">
              {CALIBRATION_STEPS.map((s, i) => {
                const isCurrent = i === stepIdx;
                const isDone = completed[s.id];
                return (
                  <div
                    key={s.id}
                    className={`rounded-2xl border p-4 transition-colors ${
                      isCurrent
                        ? "border-primary/50 bg-primary/5"
                        : isDone
                          ? "border-primary/20 bg-surface-container/40"
                          : "border-white/5 bg-surface-container/20"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center border ${
                          isDone
                            ? "bg-primary text-on-primary border-primary"
                            : isCurrent
                              ? "bg-primary/15 text-primary border-primary/30"
                              : "bg-surface-container text-on-surface-variant border-white/10"
                        }`}
                      >
                        <Icon name={isDone ? "check" : s.icon} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-white font-semibold">
                            Step {i + 1}. {s.title}
                          </p>
                          {isDone && (
                            <span className="text-[10px] text-primary uppercase tracking-wider font-bold">
                              Done
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-on-surface-variant mt-1">{s.instruction}</p>
                        {isCurrent && (
                          <div className="mt-3 flex items-center gap-3">
                            <button
                              onClick={() => runStep(i)}
                              disabled={running || isDone}
                              className="btn-depth px-4 py-1.5 rounded-full text-xs font-semibold bg-primary text-on-primary disabled:opacity-50"
                            >
                              {isDone ? "Completed" : running ? `Running ${stepProgress}%` : "Run Step"}
                            </button>
                            {!isDone && i > 0 && !running && (
                              <button
                                onClick={() => setStepIdx(i - 1)}
                                className="text-xs text-on-surface-variant hover:text-white"
                              >
                                ← Previous
                              </button>
                            )}
                            {isDone && i < CALIBRATION_STEPS.length - 1 && (
                              <button
                                onClick={() => setStepIdx(i + 1)}
                                className="text-xs text-primary hover:text-white"
                              >
                                Next →
                              </button>
                            )}
                          </div>
                        )}
                        {isCurrent && running && (
                          <div className="mt-3 h-1.5 bg-surface rounded-full overflow-hidden sunk-in">
                            <div
                              className="h-full bg-primary glow-green rounded-full transition-[width] duration-100"
                              style={{ width: `${stepProgress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Log */}
            <div className="mt-6 rounded-2xl bg-surface-container-lowest/80 p-4 h-40 overflow-y-auto font-mono text-xs leading-relaxed border border-white/5">
              {log.length === 0 ? (
                <p className="text-on-surface-variant/60">$ awaiting calibration…</p>
              ) : (
                log.map((l, i) => (
                  <div key={i} className="text-white">
                    {l}
                  </div>
                ))
              )}
              <div ref={logEnd} />
            </div>
          </div>

          {/* Save profile + library */}
          <div className="space-y-6">
            <div className="glass-card rounded-3xl p-6">
              <h4 className="text-white font-semibold flex items-center gap-2 mb-4">
                <Icon name="save" className="text-primary" /> Save Custom Profile
              </h4>
              <div className="space-y-3">
                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">
                    Produce Name
                  </span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Dragonfruit"
                    className="mt-1 w-full rounded-xl bg-surface-container/60 border border-white/10 px-3 py-2 text-sm text-white focus:border-primary outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">
                    Category
                  </span>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value as "Fruit" | "Vegetable" })
                    }
                    className="mt-1 w-full rounded-xl bg-surface-container/60 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-primary"
                  >
                    <option>Fruit</option>
                    <option>Vegetable</option>
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">
                      From (nm)
                    </span>
                    <input
                      type="number"
                      value={form.from}
                      onChange={(e) => setForm({ ...form, from: Number(e.target.value) })}
                      className="mt-1 w-full rounded-xl bg-surface-container/60 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-primary"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">
                      To (nm)
                    </span>
                    <input
                      type="number"
                      value={form.to}
                      onChange={(e) => setForm({ ...form, to: Number(e.target.value) })}
                      className="mt-1 w-full rounded-xl bg-surface-container/60 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-primary"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">
                    Notes
                  </span>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={2}
                    placeholder="Ambient temp, batch ID, operator…"
                    className="mt-1 w-full rounded-xl bg-surface-container/60 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-primary"
                  />
                </label>
                <button
                  onClick={saveProfile}
                  disabled={!allDone || !form.name.trim()}
                  className="btn-depth w-full rounded-full bg-primary text-on-primary font-semibold py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {allDone
                    ? form.name.trim()
                      ? "Save Profile"
                      : "Name required"
                    : `Complete all ${CALIBRATION_STEPS.length} steps first`}
                </button>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6">
              <h4 className="text-white font-semibold flex items-center gap-2 mb-4">
                <Icon name="folder" className="text-primary" /> Profile Library
              </h4>
              {profiles.length === 0 ? (
                <p className="text-sm text-on-surface-variant/70">
                  No custom profiles yet — run the wizard then save one above.
                </p>
              ) : (
                <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {profiles.map((p) => (
                    <li
                      key={p.id}
                      className="p-3 rounded-2xl border border-white/10 bg-surface-container/40"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                          <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">
                            {p.category} · {p.coverage.from}–{p.coverage.to} nm · drift{" "}
                            {p.drift}%
                          </p>
                          {p.notes && (
                            <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                              {p.notes}
                            </p>
                          )}
                          <p className="text-[10px] text-on-surface-variant/60 mt-1">
                            {p.createdAt}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteProfile(p.id)}
                          className="text-on-surface-variant hover:text-berry-red transition"
                          aria-label="Delete profile"
                        >
                          <Icon name="delete" className="text-[18px]!" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
