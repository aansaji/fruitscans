import { jsPDF } from "jspdf";
import type { Produce } from "@/lib/produce";

function downloadReportPdf(current: Produce) {
  const a = current.analysis;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  let y = margin;

  const ensure = (needed = 20) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };
  const h1 = (t: string) => {
    ensure(28);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(20, 90, 40);
    doc.text(t, margin, y);
    y += 20;
    doc.setDrawColor(200);
    doc.line(margin, y, pageW - margin, y);
    y += 12;
    doc.setTextColor(30);
  };
  const h2 = (t: string) => {
    ensure(22);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text(t, margin, y);
    y += 16;
  };
  const p = (t: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(55);
    const lines = doc.splitTextToSize(t, pageW - margin * 2);
    lines.forEach((ln: string) => {
      ensure(14);
      doc.text(ln, margin, y);
      y += 13;
    });
  };
  const kv = (k: string, v: string) => {
    ensure(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(40);
    doc.text(`${k}:`, margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60);
    doc.text(v, margin + 110, y);
    y += 14;
  };
  const bullet = (t: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(55);
    const lines = doc.splitTextToSize(`• ${t}`, pageW - margin * 2 - 8);
    lines.forEach((ln: string, i: number) => {
      ensure(13);
      doc.text(ln, margin + (i === 0 ? 0 : 10), y);
      y += 13;
    });
  };

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(20, 90, 40);
  doc.text("FruitScan Elite — Analysis Report", margin, y);
  y += 26;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(90);
  doc.text(
    `${current.name} · ${current.category} · ${current.condition} · ${new Date().toLocaleString()}`,
    margin,
    y,
  );
  y += 20;

  h1("Lab Assessment");
  kv("Overall Grade", a.lab.grade);
  kv("pH", a.lab.pH);
  kv("Brix", a.lab.brix);
  kv("Firmness", a.lab.firmness);
  kv("Titratable Acidity", a.lab.acidity);
  p(a.lab.summary);
  y += 6;

  h1("Microbial & Pathological Tissue Status");
  kv("Status", a.microbial.status);
  p(a.microbial.note);
  y += 4;
  h2("Pathogen Load");
  a.microbial.pathogens.forEach((pg) => bullet(`${pg.name} — ${pg.risk} — ${pg.cfu}`));
  y += 6;

  h1("Spectrometer Chemical Fingerprint");
  a.fingerprint.forEach((b) => bullet(`${b.range} — ${b.compound} (intensity ${b.intensity}%)`));
  y += 6;

  h1("Identified Molecules & Electrolytes");
  h2("Molecules");
  a.molecules.forEach((m) => bullet(`${m.name}: ${m.value} ${m.unit}`));
  h2("Electrolytes");
  a.electrolytes.forEach((e) => bullet(`${e.name}: ${e.value} ${e.unit}`));
  y += 6;

  h1("Wellness Impact Assessment");
  kv("Wellness Score", `${a.wellness.score} / 100`);
  kv("Biocompatibility", a.wellness.biocompatibility);
  kv("Metabolic Limit", a.wellness.metabolicLimit);
  kv("Therapeutic", a.wellness.therapeutic);
  h2("Benefits");
  a.wellness.benefits.forEach(bullet);
  h2("Warnings");
  a.wellness.warnings.forEach(bullet);
  y += 6;

  h1("Organic Circular Economy Guide");
  kv("Recoverable Value", `${a.circular.wasteScore}%`);
  h2("Zero-Waste Strategy");
  a.circular.zeroWaste.forEach(bullet);
  a.circular.upcycle.forEach((u) => {
    h2(u.title);
    u.steps.forEach((s, i) => bullet(`${i + 1}. ${s}`));
  });

  // Footer page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(140);
    doc.text(
      `FruitScan Elite · ${current.name} · page ${i} / ${pageCount}`,
      pageW / 2,
      pageH - 20,
      { align: "center" },
    );
  }

  const slug = current.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  doc.save(`fruitscan-${slug}-report.pdf`);
}


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
      <div className="max-w-7xl mx-auto px-6 pt-10 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Full Analytical Report
          </p>
          <p className="text-lg text-white font-semibold">{current.name}</p>
        </div>
        <button
          onClick={() => downloadReportPdf(current)}
          className="btn-depth inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary text-sm font-semibold"
        >
          <Icon name="picture_as_pdf" /> Download PDF
        </button>
      </div>
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
