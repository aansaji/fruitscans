import type { Produce } from "@/lib/produce";

const Icon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

function Section({
  id,
  icon,
  title,
  subtitle,
  children,
}: {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center glow-green shrink-0">
            <Icon name={icon} className="text-primary" />
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-white">{title}</h3>
            <p className="text-sm text-on-surface-variant mt-1">{subtitle}</p>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

function ChipColor({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      className={`text-[10px] text-${color} bg-${color}/10 border border-${color}/30 px-2.5 py-1 rounded-full uppercase font-bold tracking-wider`}
    >
      {children}
    </span>
  );
}

function riskColor(risk: string) {
  switch (risk) {
    case "Critical":
    case "High":
      return "berry-red";
    case "Moderate":
      return "citrus-orange";
    case "Low":
      return "secondary";
    default:
      return "primary";
  }
}

export function AnalysisReport({ current }: { current: Produce }) {
  const a = current.analysis;
  return (
    <>
      {/* Lab Assessment */}
      <Section
        id="lab"
        icon="biotech"
        title={`Lab Assessment · ${current.name}`}
        subtitle="Bench-top quality parameters from the integrated lab module."
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`glass-card rounded-3xl p-6 border border-${a.lab.color}/30 lg:col-span-1`}>
            <p className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
              Overall Grade
            </p>
            <div className="flex items-baseline gap-3 mt-2">
              <span className={`text-6xl font-display font-bold text-${a.lab.color}`}>
                {a.lab.grade}
              </span>
            </div>
            <p className="text-sm text-on-surface-variant mt-3">{a.lab.summary}</p>
          </div>
          <div className="glass-card rounded-3xl p-6 lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { l: "pH", v: a.lab.pH },
                { l: "Brix", v: a.lab.brix },
                { l: "Firmness", v: a.lab.firmness },
                { l: "Titr. Acidity", v: a.lab.acidity },
              ].map((x) => (
                <div key={x.l}>
                  <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">
                    {x.l}
                  </p>
                  <p className="text-2xl text-white font-display font-bold mt-1">{x.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Microbial */}
      <Section
        id="microbial"
        icon="coronavirus"
        title="Microbial & Pathological Tissue Status"
        subtitle="Culture & qPCR-derived load assessment of the sample tissue."
      >
        <div className="glass-card rounded-3xl p-6 mb-6 flex flex-wrap items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <Icon name="shield" className={`text-${a.microbial.color}`} />
            <div>
              <p className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                Status
              </p>
              <p className={`text-xl font-semibold text-${a.microbial.color}`}>
                {a.microbial.status}
              </p>
            </div>
          </div>
          <p className="text-sm text-on-surface-variant max-w-xl">{a.microbial.note}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {a.microbial.pathogens.map((p) => {
            const c = riskColor(p.risk);
            return (
              <div key={p.name} className="glass-card rounded-2xl p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <p className="text-sm font-semibold text-white">{p.name}</p>
                  <ChipColor color={c}>{p.risk}</ChipColor>
                </div>
                <p className="font-mono text-sm text-on-surface-variant">{p.cfu}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Fingerprint */}
      <Section
        id="fingerprint"
        icon="fingerprint"
        title="Spectrometer Chemical Fingerprint"
        subtitle="Characteristic absorption bands resolved from the spectral pass."
      >
        <div className="glass-card rounded-3xl p-6">
          <div className="space-y-3">
            {a.fingerprint.map((b) => (
              <div key={b.range} className="grid grid-cols-12 gap-3 items-center">
                <span className="col-span-12 md:col-span-3 text-xs font-mono text-primary/80">
                  {b.range}
                </span>
                <span className="col-span-8 md:col-span-5 text-sm text-white">{b.compound}</span>
                <div className="col-span-4 md:col-span-4 h-2 rounded-full bg-surface overflow-hidden sunk-in">
                  <div
                    className="h-full bg-secondary glow-blue rounded-full transition-[width] duration-700"
                    style={{ width: `${b.intensity}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Molecules + electrolytes */}
      <Section
        id="molecules"
        icon="science"
        title="Molecular Concentrations & Electrolytes"
        subtitle="Identified compounds quantified from the spectral fingerprint."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card rounded-3xl p-6">
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Identified Molecules
            </h4>
            <div className="space-y-4">
              {a.molecules.map((m) => (
                <div key={m.name}>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">{m.name}</span>
                    <span className="font-mono text-on-surface-variant">
                      {m.value} {m.unit}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 bg-surface rounded-full overflow-hidden sunk-in">
                    <div
                      className="h-full bg-primary glow-green rounded-full"
                      style={{ width: `${m.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card rounded-3xl p-6">
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Electrolyte Profile
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {a.electrolytes.map((e) => (
                <div
                  key={e.name}
                  className="p-4 rounded-2xl bg-surface-container/40 border border-white/5"
                >
                  <p className="text-xs text-on-surface-variant">{e.name}</p>
                  <p className="text-lg font-display font-bold text-white mt-1">
                    {e.value}{" "}
                    <span className="text-xs text-on-surface-variant font-sans">{e.unit}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Wellness */}
      <Section
        id="wellness"
        icon="favorite"
        title="Wellness Impact Assessment"
        subtitle="Biocompatibility, therapeutic outcomes and metabolic intake limits."
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`glass-card rounded-3xl p-6 border border-${a.wellness.color}/30`}>
            <p className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
              Wellness Score
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={`text-5xl font-display font-bold text-${a.wellness.color}`}>
                {a.wellness.score}
              </span>
              <span className="text-on-surface-variant">/ 100</span>
            </div>
            <div className="mt-4 h-2 bg-surface rounded-full overflow-hidden sunk-in">
              <div
                className={`h-full bg-${a.wellness.color} glow-green rounded-full`}
                style={{ width: `${a.wellness.score}%` }}
              />
            </div>
            <div className="mt-6 space-y-2 text-sm">
              <p>
                <span className="text-on-surface-variant">Biocompatibility · </span>
                <span className="text-white">{a.wellness.biocompatibility}</span>
              </p>
              <p>
                <span className="text-on-surface-variant">Metabolic limit · </span>
                <span className="text-white">{a.wellness.metabolicLimit}</span>
              </p>
              <p>
                <span className="text-on-surface-variant">Therapeutic · </span>
                <span className="text-white">{a.wellness.therapeutic}</span>
              </p>
            </div>
          </div>
          <div className="glass-card rounded-3xl p-6">
            <h4 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider flex items-center gap-2">
              <Icon name="check_circle" /> Benefits
            </h4>
            <ul className="space-y-2 text-sm text-white">
              {a.wellness.benefits.map((b) => (
                <li key={b} className="flex gap-2">
                  <Icon name="add" className="text-primary text-[16px]! mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-card rounded-3xl p-6">
            <h4 className="text-sm font-semibold text-berry-red mb-3 uppercase tracking-wider flex items-center gap-2">
              <Icon name="warning" /> Warnings
            </ul-marker />
            </h4>
            <ul className="space-y-2 text-sm text-white">
              {a.wellness.warnings.map((b) => (
                <li key={b} className="flex gap-2">
                  <Icon name="error" className="text-berry-red text-[16px]! mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Circular economy */}
      <Section
        id="circular"
        icon="recycling"
        title="Organic Circular Economy Guide"
        subtitle="Zero-waste strategies and upcycling routines for this sample."
      >
        <div className={`glass-card rounded-3xl p-6 mb-6 border border-${a.circular.color}/30`}>
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                Recoverable Value
              </p>
              <p className={`text-3xl font-display font-bold text-${a.circular.color}`}>
                {a.circular.wasteScore}%
              </p>
            </div>
            <div className="flex-1 min-w-[200px] h-2 bg-surface rounded-full overflow-hidden sunk-in">
              <div
                className={`h-full bg-${a.circular.color} rounded-full glow-green`}
                style={{ width: `${a.circular.wasteScore}%` }}
              />
            </div>
            <ChipColor color={a.circular.color}>
              {current.condition === "Fresh" ? "Prevent waste" : "Recover from decay"}
            </ChipColor>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-3xl p-6">
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
              <Icon name="checklist" className="text-primary" /> Zero-Waste Strategy
            </h4>
            <ul className="space-y-2 text-sm text-white">
              {a.circular.zeroWaste.map((b) => (
                <li key={b} className="flex gap-2">
                  <Icon name="bolt" className="text-primary text-[16px]! mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            {a.circular.upcycle.map((u) => (
              <div key={u.title} className="glass-card rounded-3xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary glow-blue">
                    <Icon name={u.icon} />
                  </div>
                  <h5 className="text-white font-semibold">{u.title}</h5>
                </div>
                <ol className="space-y-1.5 text-sm text-on-surface-variant list-decimal list-inside marker:text-primary">
                  {u.steps.map((s) => (
                    <li key={s}>
                      <span className="text-white">{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
