export type ColorKey = "primary" | "secondary" | "citrus-orange" | "berry-red";

export type Metric = {
  icon: string;
  label: string;
  value: string;
  unit: string;
  status: string;
  color: ColorKey;
  pct: number;
  glow: string;
};

export type Molecule = { name: string; value: string; unit: string; pct: number };
export type Electrolyte = { name: string; value: string; unit: string };
export type FingerprintBand = { range: string; compound: string; intensity: number };

export type Analysis = {
  lab: {
    grade: "A+" | "A" | "B" | "C" | "D" | "Reject";
    summary: string;
    pH: string;
    brix: string;
    firmness: string; // N
    acidity: string; // % titratable
    color: ColorKey;
  };
  microbial: {
    status: "Sterile" | "Safe" | "Watch" | "Contaminated" | "Hazardous";
    color: ColorKey;
    pathogens: { name: string; cfu: string; risk: "None" | "Low" | "Moderate" | "High" | "Critical" }[];
    note: string;
  };
  fingerprint: FingerprintBand[]; // 5–6 bands across NIR/UV
  molecules: Molecule[]; // identified concentrations
  electrolytes: Electrolyte[];
  wellness: {
    score: number; // 0–100
    color: ColorKey;
    benefits: string[];
    warnings: string[];
    therapeutic: string;
    metabolicLimit: string; // e.g. "≤ 2 servings / day"
    biocompatibility: string; // e.g. "98% — broadly tolerated"
  };
  circular: {
    wasteScore: number; // 0–100 (higher = more recoverable)
    color: ColorKey;
    upcycle: { title: string; icon: string; steps: string[] }[];
    zeroWaste: string[]; // bullet strategies
  };
};

export type Produce = {
  id: string;
  name: string;
  emoji: string;
  category: "Fruit" | "Vegetable";
  condition: "Fresh" | "Stale" | "Rotten" | "Infected";
  image: string;
  metrics: Metric[];
  spectrum: number[]; // 8 bars 0–100
  analysis: Analysis;
};

const freshUpcycle = (name: string) => [
  {
    title: `${name} skin & trim`,
    icon: "compost",
    steps: [
      "Rinse trim, pat dry, slice thin",
      "Dehydrate at 55 °C for 6 h",
      "Blend into fiber powder for smoothies or baking",
    ],
  },
  {
    title: "Liquid extract",
    icon: "science",
    steps: [
      "Cold-press cores & off-cuts",
      "Strain through 200 µm muslin",
      "Bottle as functional shot · 5 day fridge life",
    ],
  },
];

const decayUpcycle = (name: string) => [
  {
    title: `${name} bio-compost`,
    icon: "yard",
    steps: [
      "Quarantine away from fresh stock",
      "Layer with dry carbon (cardboard / sawdust) 3:1",
      "Aerate weekly · ready in 28 days as soil amendment",
    ],
  },
  {
    title: "Bokashi ferment",
    icon: "science",
    steps: [
      "Chop, weigh, add 3% bokashi bran",
      "Press into airtight bin, drain leachate every 2 days",
      "Dilute leachate 1:200 as plant tonic; bury solids after 14 d",
    ],
  },
  {
    title: "Biogas feedstock",
    icon: "local_fire_department",
    steps: [
      "Macerate into <1 cm slurry",
      "Feed to mesophilic digester (35 °C)",
      "Recover ~0.45 m³ CH₄ per kg VS over 21 days",
    ],
  },
];

export const PRODUCE: Produce[] = [
  // ── Fresh items ──
  {
    id: "strawberry",
    name: "Strawberry",
    emoji: "🍓",
    category: "Fruit",
    condition: "Fresh",
    image:
      "https://images.unsplash.com/photo-1518635017498-87f514b751ba?auto=format&fit=crop&w=1200&q=80",
    metrics: [
      { icon: "eco", label: "Ripeness Index", value: "92", unit: "/ 100", status: "Peak", color: "primary", pct: 92, glow: "glow-green" },
      { icon: "opacity", label: "Moisture Level", value: "91.0", unit: "%", status: "High", color: "secondary", pct: 91, glow: "glow-blue" },
      { icon: "bloodtype", label: "Sugar Content", value: "8.4", unit: "°Bx", status: "Sweet", color: "citrus-orange", pct: 70, glow: "glow-orange" },
      { icon: "warning", label: "Pesticide Detection", value: "0.04", unit: "ppm", status: "Trace", color: "berry-red", pct: 22, glow: "glow-red" },
    ],
    spectrum: [30, 55, 70, 85, 60, 45, 75, 40],
    analysis: {
      lab: { grade: "A", summary: "Premium retail grade, ready to eat.", pH: "3.4", brix: "8.4 °Bx", firmness: "4.1 N", acidity: "0.78 %", color: "primary" },
      microbial: {
        status: "Safe", color: "primary",
        pathogens: [
          { name: "Total aerobic count", cfu: "1.2×10³ CFU/g", risk: "Low" },
          { name: "Botrytis cinerea", cfu: "Not detected", risk: "None" },
          { name: "E. coli", cfu: "<10 CFU/g", risk: "None" },
        ],
        note: "Within EU fresh-berry safety thresholds.",
      },
      fingerprint: [
        { range: "420–460 nm (UV-Vis)", compound: "Pelargonidin-3-glucoside", intensity: 78 },
        { range: "660–680 nm", compound: "Chlorophyll-a residue", intensity: 22 },
        { range: "970 nm (NIR)", compound: "Free water O–H", intensity: 88 },
        { range: "1450 nm", compound: "Sucrose / fructose O–H", intensity: 64 },
        { range: "1720 nm", compound: "Lipid C–H", intensity: 12 },
      ],
      molecules: [
        { name: "Vitamin C (ascorbate)", value: "58.8", unit: "mg/100g", pct: 65 },
        { name: "Anthocyanins", value: "33.4", unit: "mg/100g", pct: 72 },
        { name: "Ellagic acid", value: "1.6", unit: "mg/100g", pct: 55 },
        { name: "Fructose", value: "2.4", unit: "g/100g", pct: 48 },
      ],
      electrolytes: [
        { name: "Potassium (K⁺)", value: "153", unit: "mg/100g" },
        { name: "Calcium (Ca²⁺)", value: "16", unit: "mg/100g" },
        { name: "Magnesium (Mg²⁺)", value: "13", unit: "mg/100g" },
        { name: "Sodium (Na⁺)", value: "1", unit: "mg/100g" },
      ],
      wellness: {
        score: 88, color: "primary",
        benefits: ["High antioxidant load", "Supports vascular elasticity", "Low glycemic load (GI≈40)"],
        warnings: ["Common oral-allergy syndrome trigger (Bet v 1)"],
        therapeutic: "Anti-inflammatory polyphenol profile; favorable for endothelial function.",
        metabolicLimit: "≤ 300 g / day for adults",
        biocompatibility: "97% — broadly tolerated",
      },
      circular: {
        wasteScore: 82, color: "primary",
        upcycle: freshUpcycle("Strawberry"),
        zeroWaste: [
          "Freeze overripe berries within 24 h for smoothie packs",
          "Infuse stems & caps in vinegar for pink dressing (7 d)",
          "Dry hulls into tea blend with hibiscus",
        ],
      },
    },
  },
  {
    id: "apple",
    name: "Apple",
    emoji: "🍎",
    category: "Fruit",
    condition: "Fresh",
    image:
      "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=1200&q=80",
    metrics: [
      { icon: "eco", label: "Ripeness Index", value: "87", unit: "/ 100", status: "Optimal", color: "primary", pct: 87, glow: "glow-green" },
      { icon: "opacity", label: "Moisture Level", value: "14.2", unit: "%", status: "Moderate", color: "citrus-orange", pct: 62, glow: "glow-orange" },
      { icon: "bloodtype", label: "Sugar Content", value: "12.5", unit: "°Bx", status: "High Brix", color: "secondary", pct: 75, glow: "glow-blue" },
      { icon: "warning", label: "Pesticide Detection", value: "0.02", unit: "ppm", status: "Trace", color: "berry-red", pct: 15, glow: "glow-red" },
    ],
    spectrum: [40, 60, 35, 80, 55, 45, 90, 30],
    analysis: {
      lab: { grade: "A+", summary: "Export-grade, crisp texture, balanced sugar/acid.", pH: "3.6", brix: "12.5 °Bx", firmness: "8.3 N", acidity: "0.42 %", color: "primary" },
      microbial: {
        status: "Sterile", color: "primary",
        pathogens: [
          { name: "Total aerobic count", cfu: "4.0×10² CFU/g", risk: "None" },
          { name: "Penicillium expansum", cfu: "Not detected", risk: "None" },
        ],
        note: "Wax-coated surface; rinse before consumption.",
      },
      fingerprint: [
        { range: "450 nm", compound: "Chlorogenic acid", intensity: 55 },
        { range: "680 nm", compound: "Chlorophyll", intensity: 18 },
        { range: "970 nm", compound: "Water O–H", intensity: 70 },
        { range: "1200 nm", compound: "Pectin / cellulose", intensity: 60 },
        { range: "1450 nm", compound: "Sucrose O–H", intensity: 75 },
      ],
      molecules: [
        { name: "Quercetin glycosides", value: "4.4", unit: "mg/100g", pct: 60 },
        { name: "Pectin", value: "1.2", unit: "g/100g", pct: 55 },
        { name: "Malic acid", value: "0.42", unit: "g/100g", pct: 42 },
        { name: "Fructose", value: "5.9", unit: "g/100g", pct: 70 },
      ],
      electrolytes: [
        { name: "Potassium (K⁺)", value: "107", unit: "mg/100g" },
        { name: "Calcium (Ca²⁺)", value: "6", unit: "mg/100g" },
        { name: "Magnesium (Mg²⁺)", value: "5", unit: "mg/100g" },
        { name: "Phosphorus (P)", value: "11", unit: "mg/100g" },
      ],
      wellness: {
        score: 84, color: "primary",
        benefits: ["Soluble fiber supports gut microbiome", "LDL-lowering polyphenols", "Hydrating, GI≈38"],
        warnings: ["Seeds contain amygdalin — discard core"],
        therapeutic: "Prebiotic pectin promotes SCFA production by gut flora.",
        metabolicLimit: "≤ 2 medium apples / day",
        biocompatibility: "99% — universally tolerated",
      },
      circular: {
        wasteScore: 90, color: "primary",
        upcycle: freshUpcycle("Apple"),
        zeroWaste: [
          "Boil peels & cores into pectin stock for jam-setting",
          "Ferment scraps into apple-scrap vinegar (3 weeks)",
          "Dry slices for trail snacks — uses imperfect fruit",
        ],
      },
    },
  },
  {
    id: "banana",
    name: "Banana",
    emoji: "🍌",
    category: "Fruit",
    condition: "Fresh",
    image:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=1200&q=80",
    metrics: [
      { icon: "eco", label: "Ripeness Index", value: "78", unit: "/ 100", status: "Ripe", color: "citrus-orange", pct: 78, glow: "glow-orange" },
      { icon: "opacity", label: "Moisture Level", value: "74.9", unit: "%", status: "Balanced", color: "secondary", pct: 75, glow: "glow-blue" },
      { icon: "bloodtype", label: "Sugar Content", value: "18.0", unit: "°Bx", status: "Very High", color: "primary", pct: 90, glow: "glow-green" },
      { icon: "warning", label: "Pesticide Detection", value: "0.00", unit: "ppm", status: "Clean", color: "berry-red", pct: 4, glow: "glow-red" },
    ],
    spectrum: [25, 45, 60, 70, 80, 55, 65, 50],
    analysis: {
      lab: { grade: "A", summary: "Dessert-ripe; ideal for fresh eating or baking.", pH: "4.8", brix: "18.0 °Bx", firmness: "2.9 N", acidity: "0.36 %", color: "citrus-orange" },
      microbial: {
        status: "Safe", color: "primary",
        pathogens: [
          { name: "Total aerobic count", cfu: "8.0×10² CFU/g", risk: "Low" },
          { name: "Colletotrichum musae", cfu: "Surface only", risk: "Low" },
        ],
        note: "Skin barrier intact; pulp sterile.",
      },
      fingerprint: [
        { range: "450 nm", compound: "Carotenoids", intensity: 50 },
        { range: "680 nm", compound: "Chlorophyll degradation", intensity: 25 },
        { range: "970 nm", compound: "Water O–H", intensity: 65 },
        { range: "1450 nm", compound: "Sucrose / glucose", intensity: 88 },
        { range: "1720 nm", compound: "Starch C–H", intensity: 40 },
      ],
      molecules: [
        { name: "Potassium", value: "358", unit: "mg/100g", pct: 85 },
        { name: "Vitamin B6", value: "0.37", unit: "mg/100g", pct: 55 },
        { name: "Tryptophan", value: "9", unit: "mg/100g", pct: 40 },
        { name: "Starch (residual)", value: "5.4", unit: "g/100g", pct: 35 },
      ],
      electrolytes: [
        { name: "Potassium (K⁺)", value: "358", unit: "mg/100g" },
        { name: "Magnesium (Mg²⁺)", value: "27", unit: "mg/100g" },
        { name: "Calcium (Ca²⁺)", value: "5", unit: "mg/100g" },
        { name: "Sodium (Na⁺)", value: "1", unit: "mg/100g" },
      ],
      wellness: {
        score: 80, color: "primary",
        benefits: ["Quick-release glucose for endurance", "High potassium for cardiac rhythm", "Serotonin precursor (tryptophan)"],
        warnings: ["GI≈51 — moderate diabetic intake"],
        therapeutic: "Electrolyte replenishment post-exercise; mild antacid effect.",
        metabolicLimit: "≤ 2 medium bananas / day",
        biocompatibility: "96% — latex-fruit cross-reactivity possible",
      },
      circular: {
        wasteScore: 85, color: "primary",
        upcycle: freshUpcycle("Banana"),
        zeroWaste: [
          "Banana-peel tea as garden potassium tonic",
          "Blacken & freeze for banana bread (uses overripe)",
          "Dry peels & grind for plant-based bacon seasoning",
        ],
      },
    },
  },
  {
    id: "tomato",
    name: "Tomato",
    emoji: "🍅",
    category: "Vegetable",
    condition: "Fresh",
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1200&q=80",
    metrics: [
      { icon: "eco", label: "Ripeness Index", value: "81", unit: "/ 100", status: "Optimal", color: "primary", pct: 81, glow: "glow-green" },
      { icon: "opacity", label: "Moisture Level", value: "94.5", unit: "%", status: "High", color: "secondary", pct: 94, glow: "glow-blue" },
      { icon: "bloodtype", label: "Sugar Content", value: "4.2", unit: "°Bx", status: "Low", color: "citrus-orange", pct: 35, glow: "glow-orange" },
      { icon: "warning", label: "Pesticide Detection", value: "0.06", unit: "ppm", status: "Trace", color: "berry-red", pct: 28, glow: "glow-red" },
    ],
    spectrum: [50, 75, 45, 85, 40, 65, 55, 35],
    analysis: {
      lab: { grade: "A", summary: "Vine-ripened; suitable for fresh & culinary use.", pH: "4.3", brix: "4.2 °Bx", firmness: "5.6 N", acidity: "0.44 %", color: "primary" },
      microbial: {
        status: "Safe", color: "primary",
        pathogens: [
          { name: "Salmonella spp.", cfu: "Not detected", risk: "None" },
          { name: "Total aerobic count", cfu: "2.1×10³ CFU/g", risk: "Low" },
        ],
        note: "Wash before use to remove field soil flora.",
      },
      fingerprint: [
        { range: "470 nm", compound: "β-Carotene", intensity: 60 },
        { range: "500 nm", compound: "Lycopene", intensity: 82 },
        { range: "970 nm", compound: "Water O–H", intensity: 92 },
        { range: "1450 nm", compound: "Sugars", intensity: 35 },
        { range: "1720 nm", compound: "Lipid C–H", intensity: 8 },
      ],
      molecules: [
        { name: "Lycopene", value: "2.6", unit: "mg/100g", pct: 78 },
        { name: "Vitamin C", value: "13.7", unit: "mg/100g", pct: 48 },
        { name: "Glutamate (umami)", value: "246", unit: "mg/100g", pct: 70 },
        { name: "GABA", value: "31", unit: "mg/100g", pct: 35 },
      ],
      electrolytes: [
        { name: "Potassium (K⁺)", value: "237", unit: "mg/100g" },
        { name: "Magnesium (Mg²⁺)", value: "11", unit: "mg/100g" },
        { name: "Calcium (Ca²⁺)", value: "10", unit: "mg/100g" },
        { name: "Chloride (Cl⁻)", value: "51", unit: "mg/100g" },
      ],
      wellness: {
        score: 86, color: "primary",
        benefits: ["Lycopene supports prostate & skin health", "Low-cal hydration (94% water)", "Umami enhances satiety"],
        warnings: ["Nightshade — limit in inflammatory flare-ups"],
        therapeutic: "Cooked lycopene 3× more bioavailable than raw.",
        metabolicLimit: "≤ 400 g / day",
        biocompatibility: "94% — mild solanine sensitivity in some",
      },
      circular: {
        wasteScore: 88, color: "primary",
        upcycle: freshUpcycle("Tomato"),
        zeroWaste: [
          "Skins & seeds → oven-dried tomato powder umami booster",
          "Trim ends into stock with onion peels (45 min simmer)",
          "Slow-roast bruised tomatoes → confit, keeps 14 days in oil",
        ],
      },
    },
  },
  {
    id: "carrot",
    name: "Carrot",
    emoji: "🥕",
    category: "Vegetable",
    condition: "Fresh",
    image:
      "https://images.unsplash.com/photo-1582515073490-39981397c445?auto=format&fit=crop&w=1200&q=80",
    metrics: [
      { icon: "eco", label: "Ripeness Index", value: "85", unit: "/ 100", status: "Optimal", color: "primary", pct: 85, glow: "glow-green" },
      { icon: "opacity", label: "Moisture Level", value: "88.3", unit: "%", status: "High", color: "secondary", pct: 88, glow: "glow-blue" },
      { icon: "bloodtype", label: "Sugar Content", value: "6.1", unit: "°Bx", status: "Moderate", color: "citrus-orange", pct: 50, glow: "glow-orange" },
      { icon: "warning", label: "Pesticide Detection", value: "0.01", unit: "ppm", status: "Clean", color: "berry-red", pct: 8, glow: "glow-red" },
    ],
    spectrum: [35, 50, 80, 55, 70, 90, 45, 60],
    analysis: {
      lab: { grade: "A+", summary: "Crisp, high-carotenoid root; storage life 21 days @ 2 °C.", pH: "6.3", brix: "6.1 °Bx", firmness: "11.2 N", acidity: "0.10 %", color: "primary" },
      microbial: {
        status: "Safe", color: "primary",
        pathogens: [
          { name: "Listeria monocytogenes", cfu: "Not detected", risk: "None" },
          { name: "Soil mesophiles", cfu: "1.5×10⁴ CFU/g", risk: "Low" },
        ],
        note: "Scrub under cold water; peel for immunocompromised consumers.",
      },
      fingerprint: [
        { range: "450 nm", compound: "α-Carotene", intensity: 65 },
        { range: "478 nm", compound: "β-Carotene", intensity: 88 },
        { range: "970 nm", compound: "Water O–H", intensity: 80 },
        { range: "1200 nm", compound: "Cellulose / pectin", intensity: 62 },
        { range: "1720 nm", compound: "Lipid C–H", intensity: 6 },
      ],
      molecules: [
        { name: "β-Carotene (pro-vitamin A)", value: "8.3", unit: "mg/100g", pct: 88 },
        { name: "Falcarinol", value: "2.0", unit: "mg/100g", pct: 50 },
        { name: "Fiber (insoluble)", value: "2.8", unit: "g/100g", pct: 60 },
        { name: "Sucrose", value: "3.6", unit: "g/100g", pct: 45 },
      ],
      electrolytes: [
        { name: "Potassium (K⁺)", value: "320", unit: "mg/100g" },
        { name: "Calcium (Ca²⁺)", value: "33", unit: "mg/100g" },
        { name: "Magnesium (Mg²⁺)", value: "12", unit: "mg/100g" },
        { name: "Sodium (Na⁺)", value: "69", unit: "mg/100g" },
      ],
      wellness: {
        score: 90, color: "primary",
        benefits: ["Vision & mucosal support via retinol pathway", "Anti-proliferative falcarinol activity"],
        warnings: ["Excess intake → benign carotenemia"],
        therapeutic: "Pair with fat for 6× β-carotene absorption.",
        metabolicLimit: "≤ 300 g / day",
        biocompatibility: "99% — universally tolerated",
      },
      circular: {
        wasteScore: 92, color: "primary",
        upcycle: freshUpcycle("Carrot"),
        zeroWaste: [
          "Greens → carrot-top pesto (nutty, peppery)",
          "Peels → crispy spiced chips, 200 °C / 12 min",
          "Pulp from juicing → muffins or pet treats",
        ],
      },
    },
  },
  {
    id: "avocado",
    name: "Avocado",
    emoji: "🥑",
    category: "Fruit",
    condition: "Fresh",
    image:
      "https://images.unsplash.com/photo-1601039641847-7857b994d704?auto=format&fit=crop&w=1200&q=80",
    metrics: [
      { icon: "eco", label: "Ripeness Index", value: "69", unit: "/ 100", status: "Near Ripe", color: "citrus-orange", pct: 69, glow: "glow-orange" },
      { icon: "opacity", label: "Moisture Level", value: "73.2", unit: "%", status: "Balanced", color: "secondary", pct: 73, glow: "glow-blue" },
      { icon: "bloodtype", label: "Sugar Content", value: "0.7", unit: "°Bx", status: "Low", color: "primary", pct: 10, glow: "glow-green" },
      { icon: "warning", label: "Pesticide Detection", value: "0.00", unit: "ppm", status: "Clean", color: "berry-red", pct: 3, glow: "glow-red" },
    ],
    spectrum: [60, 40, 55, 70, 50, 80, 35, 65],
    analysis: {
      lab: { grade: "A", summary: "1–2 days from peak; lipid profile excellent.", pH: "6.4", brix: "0.7 °Bx", firmness: "9.1 N", acidity: "0.05 %", color: "citrus-orange" },
      microbial: {
        status: "Sterile", color: "primary",
        pathogens: [
          { name: "Pulp microbial load", cfu: "<10² CFU/g", risk: "None" },
          { name: "Skin Listeria spp.", cfu: "Not detected", risk: "None" },
        ],
        note: "Surface-only flora; sanitize before cutting.",
      },
      fingerprint: [
        { range: "660 nm", compound: "Chlorophyll-a", intensity: 45 },
        { range: "930 nm", compound: "Oil C–H", intensity: 80 },
        { range: "970 nm", compound: "Water", intensity: 60 },
        { range: "1200 nm", compound: "Cellulose", intensity: 30 },
        { range: "1720 nm", compound: "Monounsaturated lipids", intensity: 92 },
      ],
      molecules: [
        { name: "Oleic acid", value: "9.8", unit: "g/100g", pct: 90 },
        { name: "Vitamin K1", value: "21", unit: "µg/100g", pct: 55 },
        { name: "Folate (B9)", value: "81", unit: "µg/100g", pct: 60 },
        { name: "Lutein + zeaxanthin", value: "271", unit: "µg/100g", pct: 65 },
      ],
      electrolytes: [
        { name: "Potassium (K⁺)", value: "485", unit: "mg/100g" },
        { name: "Magnesium (Mg²⁺)", value: "29", unit: "mg/100g" },
        { name: "Calcium (Ca²⁺)", value: "12", unit: "mg/100g" },
        { name: "Phosphorus (P)", value: "52", unit: "mg/100g" },
      ],
      wellness: {
        score: 92, color: "primary",
        benefits: ["MUFA improves HDL/LDL ratio", "Carotenoid uptake amplifier", "Satiating fiber + fat profile"],
        warnings: ["Persin in seed & skin — discard"],
        therapeutic: "Recommended in Mediterranean & cardio-protective diets.",
        metabolicLimit: "≤ ½ fruit / day for low-fat regimens",
        biocompatibility: "95% — rare latex cross-reactivity",
      },
      circular: {
        wasteScore: 86, color: "primary",
        upcycle: freshUpcycle("Avocado"),
        zeroWaste: [
          "Pit → grated into smoothies for fiber (mild antioxidant)",
          "Skin → natural pink-blush textile dye",
          "Oxidized flesh → rich hair-mask emollient",
        ],
      },
    },
  },

  // ── Decayed / infected items ──
  {
    id: "rotten-strawberry",
    name: "Mouldy Strawberry",
    emoji: "🍓",
    category: "Fruit",
    condition: "Rotten",
    image:
      "https://images.unsplash.com/photo-1591287083773-9a5b5d3b3b5f?auto=format&fit=crop&w=1200&q=80",
    metrics: [
      { icon: "eco", label: "Ripeness Index", value: "12", unit: "/ 100", status: "Decayed", color: "berry-red", pct: 12, glow: "glow-red" },
      { icon: "opacity", label: "Moisture Level", value: "62.1", unit: "%", status: "Leaking", color: "citrus-orange", pct: 62, glow: "glow-orange" },
      { icon: "bloodtype", label: "Sugar Content", value: "3.1", unit: "°Bx", status: "Fermented", color: "secondary", pct: 25, glow: "glow-blue" },
      { icon: "warning", label: "Pesticide Detection", value: "0.05", unit: "ppm", status: "Trace", color: "berry-red", pct: 24, glow: "glow-red" },
    ],
    spectrum: [80, 70, 35, 25, 40, 60, 30, 55],
    analysis: {
      lab: { grade: "Reject", summary: "Visible grey mould; do NOT consume.", pH: "3.9", brix: "3.1 °Bx", firmness: "0.6 N", acidity: "1.20 %", color: "berry-red" },
      microbial: {
        status: "Hazardous", color: "berry-red",
        pathogens: [
          { name: "Botrytis cinerea", cfu: "Heavy growth", risk: "Critical" },
          { name: "Rhizopus stolonifer", cfu: "Moderate", risk: "High" },
          { name: "Mycotoxin (patulin)", cfu: "0.18 µg/g", risk: "High" },
        ],
        note: "Mycotoxins penetrate >2 cm into fruit; cutting off mould is not safe.",
      },
      fingerprint: [
        { range: "420 nm", compound: "Anthocyanin degradation", intensity: 38 },
        { range: "660 nm", compound: "Fungal pigment", intensity: 72 },
        { range: "970 nm", compound: "Free water", intensity: 60 },
        { range: "1450 nm", compound: "Ethanol O–H (ferment)", intensity: 55 },
        { range: "1720 nm", compound: "Acetaldehyde C–H", intensity: 48 },
      ],
      molecules: [
        { name: "Ethanol", value: "0.8", unit: "g/100g", pct: 60 },
        { name: "Acetic acid", value: "0.3", unit: "g/100g", pct: 45 },
        { name: "Patulin (mycotoxin)", value: "0.18", unit: "µg/g", pct: 78 },
        { name: "Vitamin C (residual)", value: "9", unit: "mg/100g", pct: 12 },
      ],
      electrolytes: [
        { name: "Potassium (K⁺)", value: "130", unit: "mg/100g" },
        { name: "Calcium (Ca²⁺)", value: "12", unit: "mg/100g" },
      ],
      wellness: {
        score: 4, color: "berry-red",
        benefits: ["None — discard from food stream"],
        warnings: ["Mycotoxin nephrotoxicity", "Allergenic mould spores", "Risk of GI infection"],
        therapeutic: "Not for human consumption.",
        metabolicLimit: "0 g — unsafe",
        biocompatibility: "12% — immunocompromised at acute risk",
      },
      circular: {
        wasteScore: 70, color: "citrus-orange",
        upcycle: decayUpcycle("Strawberry"),
        zeroWaste: [
          "Quarantine in sealed bag — never co-compost with fresh harvest",
          "Hot-compost (>55 °C for 3 days) to deactivate mould",
          "Divert to anaerobic digester for biogas, not vermicompost",
        ],
      },
    },
  },
  {
    id: "infected-apple",
    name: "Infected Apple",
    emoji: "🍎",
    category: "Fruit",
    condition: "Infected",
    image:
      "https://images.unsplash.com/photo-1610917040803-1fccf9623064?auto=format&fit=crop&w=1200&q=80",
    metrics: [
      { icon: "eco", label: "Ripeness Index", value: "28", unit: "/ 100", status: "Diseased", color: "berry-red", pct: 28, glow: "glow-red" },
      { icon: "opacity", label: "Moisture Level", value: "61.0", unit: "%", status: "Dehydrating", color: "citrus-orange", pct: 61, glow: "glow-orange" },
      { icon: "bloodtype", label: "Sugar Content", value: "9.2", unit: "°Bx", status: "Fermenting", color: "secondary", pct: 55, glow: "glow-blue" },
      { icon: "warning", label: "Pesticide Detection", value: "0.09", unit: "ppm", status: "High", color: "berry-red", pct: 65, glow: "glow-red" },
    ],
    spectrum: [70, 55, 80, 35, 60, 75, 40, 50],
    analysis: {
      lab: { grade: "Reject", summary: "Penicillium blue-mould lesion; reject lot.", pH: "3.8", brix: "9.2 °Bx", firmness: "3.1 N", acidity: "0.62 %", color: "berry-red" },
      microbial: {
        status: "Contaminated", color: "berry-red",
        pathogens: [
          { name: "Penicillium expansum", cfu: "Heavy", risk: "Critical" },
          { name: "Patulin", cfu: "62 µg/kg (>EU 25 µg/kg)", risk: "High" },
          { name: "Yeast count", cfu: "5.0×10⁵ CFU/g", risk: "High" },
        ],
        note: "Exceeds EU Commission Reg. (EC) No 1881/2006 patulin limit.",
      },
      fingerprint: [
        { range: "410 nm", compound: "Patulin metabolites", intensity: 65 },
        { range: "680 nm", compound: "Chlorophyll loss", intensity: 12 },
        { range: "970 nm", compound: "Water (declining)", intensity: 55 },
        { range: "1450 nm", compound: "Ethanol / acetate", intensity: 70 },
        { range: "1720 nm", compound: "Volatile esters", intensity: 58 },
      ],
      molecules: [
        { name: "Patulin", value: "62", unit: "µg/kg", pct: 82 },
        { name: "Ethanol", value: "1.2", unit: "g/100g", pct: 68 },
        { name: "Ethyl acetate", value: "0.14", unit: "g/100g", pct: 52 },
        { name: "Pectin (degraded)", value: "0.4", unit: "g/100g", pct: 18 },
      ],
      electrolytes: [
        { name: "Potassium (K⁺)", value: "98", unit: "mg/100g" },
        { name: "Calcium (Ca²⁺)", value: "5", unit: "mg/100g" },
      ],
      wellness: {
        score: 6, color: "berry-red",
        benefits: ["None"],
        warnings: ["Hepatotoxic & immunotoxic mycotoxins", "Cutting away mould DOES NOT remove patulin"],
        therapeutic: "Reject from food chain.",
        metabolicLimit: "0 g — unsafe",
        biocompatibility: "15% — unsafe for all groups",
      },
      circular: {
        wasteScore: 75, color: "citrus-orange",
        upcycle: decayUpcycle("Apple"),
        zeroWaste: [
          "Never use for scrap-vinegar (patulin survives fermentation)",
          "Hot-compost or anaerobic-digest only",
          "Burnable biomass pellet if dried below 12% moisture",
        ],
      },
    },
  },
  {
    id: "stale-banana",
    name: "Overripe Banana",
    emoji: "🍌",
    category: "Fruit",
    condition: "Stale",
    image:
      "https://images.unsplash.com/photo-1574226516831-e1dff420e8f8?auto=format&fit=crop&w=1200&q=80",
    metrics: [
      { icon: "eco", label: "Ripeness Index", value: "34", unit: "/ 100", status: "Overripe", color: "citrus-orange", pct: 34, glow: "glow-orange" },
      { icon: "opacity", label: "Moisture Level", value: "68.4", unit: "%", status: "Soft", color: "secondary", pct: 68, glow: "glow-blue" },
      { icon: "bloodtype", label: "Sugar Content", value: "21.3", unit: "°Bx", status: "Hyper-sweet", color: "primary", pct: 95, glow: "glow-green" },
      { icon: "warning", label: "Pesticide Detection", value: "0.00", unit: "ppm", status: "Clean", color: "berry-red", pct: 4, glow: "glow-red" },
    ],
    spectrum: [40, 65, 70, 78, 85, 60, 55, 45],
    analysis: {
      lab: { grade: "B", summary: "Edible but flavour past peak; divert to baking.", pH: "5.2", brix: "21.3 °Bx", firmness: "1.1 N", acidity: "0.28 %", color: "citrus-orange" },
      microbial: {
        status: "Watch", color: "citrus-orange",
        pathogens: [
          { name: "Total yeast/mould", cfu: "2.0×10⁴ CFU/g", risk: "Moderate" },
          { name: "Surface Colletotrichum", cfu: "Spreading", risk: "Moderate" },
        ],
        note: "Pulp still safe if peel undamaged & lesions <15%.",
      },
      fingerprint: [
        { range: "450 nm", compound: "Carotenoids", intensity: 60 },
        { range: "680 nm", compound: "Chlorophyll absent", intensity: 8 },
        { range: "970 nm", compound: "Water", intensity: 58 },
        { range: "1450 nm", compound: "Glucose / fructose", intensity: 92 },
        { range: "1720 nm", compound: "Starch (depleted)", intensity: 12 },
      ],
      molecules: [
        { name: "Glucose", value: "12.4", unit: "g/100g", pct: 88 },
        { name: "Fructose", value: "8.9", unit: "g/100g", pct: 80 },
        { name: "Potassium", value: "320", unit: "mg/100g", pct: 78 },
        { name: "Pectinase activity", value: "elevated", unit: "rel.", pct: 65 },
      ],
      electrolytes: [
        { name: "Potassium (K⁺)", value: "320", unit: "mg/100g" },
        { name: "Magnesium (Mg²⁺)", value: "24", unit: "mg/100g" },
      ],
      wellness: {
        score: 62, color: "citrus-orange",
        benefits: ["High potassium retained", "Faster glucose uptake — recovery snack"],
        warnings: ["GI≈62 — limit for diabetics", "Mould risk if peel cracked"],
        therapeutic: "Energy refuel post-endurance; mild laxative effect.",
        metabolicLimit: "≤ 1 banana / day if blood-sugar sensitive",
        biocompatibility: "88% — same caveats as fresh banana",
      },
      circular: {
        wasteScore: 95, color: "primary",
        upcycle: decayUpcycle("Banana"),
        zeroWaste: [
          "Freeze peeled & sliced for smoothies / ‘nice cream’",
          "Banana bread, pancakes, muffins — flagship upcycle",
          "Peel → leather polish or shoe shine (rub flesh side)",
        ],
      },
    },
  },
  {
    id: "rotten-tomato",
    name: "Rotten Tomato",
    emoji: "🍅",
    category: "Vegetable",
    condition: "Rotten",
    image:
      "https://images.unsplash.com/photo-1546470427-1ec7c61a8d18?auto=format&fit=crop&w=1200&q=80",
    metrics: [
      { icon: "eco", label: "Ripeness Index", value: "9", unit: "/ 100", status: "Decayed", color: "berry-red", pct: 9, glow: "glow-red" },
      { icon: "opacity", label: "Moisture Level", value: "81.2", unit: "%", status: "Leaching", color: "secondary", pct: 81, glow: "glow-blue" },
      { icon: "bloodtype", label: "Sugar Content", value: "2.0", unit: "°Bx", status: "Collapsed", color: "citrus-orange", pct: 16, glow: "glow-orange" },
      { icon: "warning", label: "Pesticide Detection", value: "0.08", unit: "ppm", status: "Elevated", color: "berry-red", pct: 55, glow: "glow-red" },
    ],
    spectrum: [85, 60, 30, 20, 35, 55, 25, 40],
    analysis: {
      lab: { grade: "Reject", summary: "Soft rot, putrid odor; biohazard.", pH: "4.6", brix: "2.0 °Bx", firmness: "0.3 N", acidity: "0.78 %", color: "berry-red" },
      microbial: {
        status: "Hazardous", color: "berry-red",
        pathogens: [
          { name: "Erwinia carotovora", cfu: "Heavy", risk: "Critical" },
          { name: "Geotrichum candidum", cfu: "Moderate", risk: "High" },
          { name: "Salmonella spp.", cfu: "Possible (test)", risk: "High" },
        ],
        note: "Pectinolytic bacteria cause tissue collapse; aerosols are infectious.",
      },
      fingerprint: [
        { range: "500 nm", compound: "Lycopene oxidation", intensity: 35 },
        { range: "660 nm", compound: "Bacterial pigment", intensity: 55 },
        { range: "970 nm", compound: "Free water surge", intensity: 95 },
        { range: "1450 nm", compound: "Volatile alcohols", intensity: 65 },
        { range: "1720 nm", compound: "Aldehyde C–H", intensity: 50 },
      ],
      molecules: [
        { name: "Putrescine", value: "120", unit: "mg/kg", pct: 80 },
        { name: "Cadaverine", value: "90", unit: "mg/kg", pct: 70 },
        { name: "Histamine", value: "65", unit: "mg/kg", pct: 60 },
        { name: "Lycopene (residual)", value: "0.4", unit: "mg/100g", pct: 12 },
      ],
      electrolytes: [
        { name: "Potassium (K⁺)", value: "180", unit: "mg/100g" },
        { name: "Sodium (Na⁺)", value: "16", unit: "mg/100g" },
      ],
      wellness: {
        score: 3, color: "berry-red",
        benefits: ["None"],
        warnings: ["Biogenic amines cause scombroid-like reactions", "Salmonella / Erwinia GI infection risk"],
        therapeutic: "Discard.",
        metabolicLimit: "0 g — unsafe",
        biocompatibility: "8% — acute reaction risk",
      },
      circular: {
        wasteScore: 65, color: "citrus-orange",
        upcycle: decayUpcycle("Tomato"),
        zeroWaste: [
          "Wear gloves — bag separately to prevent cross-contamination",
          "Anaerobic digestion ideal: high moisture, fast methanogenesis",
          "Liquid leachate diluted 1:300 for non-edible ornamentals only",
        ],
      },
    },
  },
  {
    id: "infected-carrot",
    name: "Cavity-Spot Carrot",
    emoji: "🥕",
    category: "Vegetable",
    condition: "Infected",
    image:
      "https://images.unsplash.com/photo-1612257999692-c1da0a7f4f54?auto=format&fit=crop&w=1200&q=80",
    metrics: [
      { icon: "eco", label: "Ripeness Index", value: "41", unit: "/ 100", status: "Lesioned", color: "berry-red", pct: 41, glow: "glow-red" },
      { icon: "opacity", label: "Moisture Level", value: "72.5", unit: "%", status: "Patchy", color: "citrus-orange", pct: 72, glow: "glow-orange" },
      { icon: "bloodtype", label: "Sugar Content", value: "4.8", unit: "°Bx", status: "Below spec", color: "secondary", pct: 38, glow: "glow-blue" },
      { icon: "warning", label: "Pesticide Detection", value: "0.07", unit: "ppm", status: "Elevated", color: "berry-red", pct: 48, glow: "glow-red" },
    ],
    spectrum: [50, 45, 70, 40, 65, 80, 35, 55],
    analysis: {
      lab: { grade: "C", summary: "Pythium cavity-spot lesions; trim 5 mm around lesion, cook only.", pH: "6.0", brix: "4.8 °Bx", firmness: "7.4 N", acidity: "0.12 %", color: "citrus-orange" },
      microbial: {
        status: "Contaminated", color: "berry-red",
        pathogens: [
          { name: "Pythium violae", cfu: "Active lesion", risk: "High" },
          { name: "Soil mesophiles", cfu: "8.0×10⁵ CFU/g", risk: "Moderate" },
          { name: "Listeria spp.", cfu: "Surface positive", risk: "High" },
        ],
        note: "Not safe raw; deep-cook ≥75 °C core for 2 min.",
      },
      fingerprint: [
        { range: "478 nm", compound: "β-Carotene (reduced)", intensity: 55 },
        { range: "660 nm", compound: "Fungal melanin", intensity: 40 },
        { range: "970 nm", compound: "Water (uneven)", intensity: 65 },
        { range: "1200 nm", compound: "Cellulose breakdown", intensity: 35 },
        { range: "1720 nm", compound: "Lipid oxidation", intensity: 22 },
      ],
      molecules: [
        { name: "β-Carotene (residual)", value: "4.1", unit: "mg/100g", pct: 45 },
        { name: "6-MMP (off-flavour)", value: "0.05", unit: "mg/kg", pct: 60 },
        { name: "Falcarindiol", value: "1.4", unit: "mg/100g", pct: 38 },
        { name: "Fiber", value: "3.0", unit: "g/100g", pct: 65 },
      ],
      electrolytes: [
        { name: "Potassium (K⁺)", value: "280", unit: "mg/100g" },
        { name: "Calcium (Ca²⁺)", value: "28", unit: "mg/100g" },
      ],
      wellness: {
        score: 28, color: "citrus-orange",
        benefits: ["Trimmed & cooked portions retain fibre + carotenoids"],
        warnings: ["Raw consumption not advised", "Bitter off-flavour metabolites"],
        therapeutic: "Use only in stocks or stews (≥75 °C × 2 min).",
        metabolicLimit: "≤ 100 g cooked / day",
        biocompatibility: "55% — avoid for pregnant / immunocompromised",
      },
      circular: {
        wasteScore: 88, color: "primary",
        upcycle: decayUpcycle("Carrot"),
        zeroWaste: [
          "Lesioned ends → vermicompost AFTER 60 °C hot-compost pre-treatment",
          "Healthy core → dehydrate into stock-powder",
          "Tops (if green) → pesto only when free of yellowing",
        ],
      },
    },
  },
];
