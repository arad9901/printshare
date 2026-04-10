import { useState, useMemo, useRef, useEffect } from "react";

// ============================================================
// CONSTANTS & DATA
// ============================================================

const COMMISSION_RATE = 0.12;

const TIERS = {
  economy: {
    id: "economy", name: "חסכוני", emoji: "🟢",
    printers: "Ender 3, Artillery, Creality K1",
    materialRate: 0.08, machineRate: 4,
    layerHeight: "0.2–0.3mm",
    description: "אב-טיפוסים מהירים, צעצועים, עיצוב פשוט",
    bestFor: ["אב-טיפוסים", "צעצועים", "קישוטים"],
    bgColor: "bg-green-50", borderColor: "border-green-300",
    textColor: "text-green-700", badgeBg: "bg-green-100",
    btn: "bg-green-600 hover:bg-green-700", dot: "#16a34a",
  },
  standard: {
    id: "standard", name: "סטנדרטי", emoji: "🔵",
    printers: "Bambu P1P, Prusa Mini+, Creality K1C",
    materialRate: 0.14, machineRate: 7,
    layerHeight: "0.15–0.2mm",
    description: "חלקים פונקציונליים, מוצרי תחביב, איכות טובה",
    bestFor: ["חלקים פונקציונליים", "תחביב", "מוצרים יומיומיים"],
    bgColor: "bg-blue-50", borderColor: "border-blue-300",
    textColor: "text-blue-700", badgeBg: "bg-blue-100",
    btn: "bg-blue-600 hover:bg-blue-700", dot: "#2563eb",
  },
  quality: {
    id: "quality", name: "איכותי", emoji: "🟣",
    printers: "Prusa MK4, Bambu X1C, Voron",
    materialRate: 0.22, machineRate: 12,
    layerHeight: "0.1–0.15mm",
    description: "חלקי הנדסה, עמידות לחום וסביבות קשות",
    bestFor: ["הנדסה", "שימוש חיצוני", "עמידות לחום"],
    bgColor: "bg-purple-50", borderColor: "border-purple-300",
    textColor: "text-purple-700", badgeBg: "bg-purple-100",
    btn: "bg-purple-600 hover:bg-purple-700", dot: "#7c3aed",
  },
  premium: {
    id: "premium", name: "פרמיום ✨", emoji: "⭐",
    printers: "Anycubic M3/M4, Formlabs Form 3",
    materialRate: 0.55, machineRate: 18,
    layerHeight: "0.025–0.1mm",
    description: "שרף/SLA — פרטים עדינים, תכשיטים, מיניאטורות",
    bestFor: ["תכשיטים", "מיניאטורות", "שיניים"],
    bgColor: "bg-amber-50", borderColor: "border-amber-300",
    textColor: "text-amber-700", badgeBg: "bg-amber-100",
    btn: "bg-amber-500 hover:bg-amber-600", dot: "#d97706",
  },
};

// ---- יצרנים ודגמים ----
const PRINTER_BRANDS = {
  "Creality": {
    economy: ["Ender 3", "Ender 3 V2", "Ender 3 S1", "Ender 3 Neo", "Ender 3 Max Neo", "CR-10"],
    standard: ["Ender 3 S1 Pro", "K1", "K1C", "K1 Max", "CR-10 S Pro", "CR-10 Smart Pro"],
  },
  "Bambu Lab": {
    economy:  ["A1 Mini"],
    standard: ["A1 Mini Combo", "A1", "A1 Combo", "P1P", "H2D", "H2D Combo"],
    quality:  ["P1S", "P1S Combo", "X1C", "X1C Combo", "X1E", "X1E Combo"],
  },
  "Prusa": {
    standard: ["Mini+", "MK3S+"],
    quality: ["MK4", "MK4S", "XL", "Core One"],
    premium: ["SL1S Speed"],
  },
  "Anycubic": {
    economy: ["Kobra", "Kobra 2", "Kobra 2 Neo"],
    standard: ["Kobra 2 Pro", "Kobra 2 Plus", "Kobra 2 Max", "Vyper"],
    premium: ["Photon Mono M3", "Photon Mono M3 Plus", "Photon Mono M3 Max", "Photon M5s", "Photon M5s Pro"],
  },
  "Artillery": {
    economy: ["Sidewinder X2", "Genius Pro"],
    standard: ["Sidewinder X3", "Sidewinder X3 Pro", "Hornet"],
  },
};

// ---- ערים ישראליות — רשימה מקיפה ----
const ISRAELI_CITIES = [
  // א
  "אבו גוש","אבן יהודה","אופקים","אור יהודה","אור עקיבא","אורנית","אחיהוד","אחוזת ברק",
  "אילת","אילניה","אכסאל","אל-עזריה","אלעד","אלפי מנשה","אם אל-פחם","אמירים",
  "אפרת","אראלה","אריאל","ארסוף","אשדוד","אשקלון","אשרת",
  // ב
  "באקה אל-גרביה","באר יעקב","באר שבע","בוסתן הגליל","בועינה-נוג'ידאת",
  "ביתר עילית","בית אל","בית אריה","בית דגן","בית ג'ן","בית חנינא","בית יצחק",
  "בית לחם הגלילית","בית שאן","בית שמש","בני ברק","בני עי\"ש","בנימינה",
  "בסמת טבעון","בענה","בצרה","בקה אל-גרבייה","בר יוחאי","ברקן","ברקת","בת ים","בת עין",
  // ג
  "גבע","גבעון החדשה","גבעת זאב","גבעת שמואל","גבעתיים","גדרה","גולני","גן יבנה",
  "גני תקווה","גשר הזיו",
  // ד
  "דאלית אל-כרמל","דבורייה","דימונה","דליה","דלתון",
  // ה
  "הוד השרון","הרצליה","הר אדר","הר גילה",
  // ו
  "ורד יריחו",
  // ז
  "זכרון יעקב","זמר","זרזיר",
  // ח
  "חבצלת השרון","חדרה","חולון","חיפה","חצור הגלילית","חצרים",
  // ט
  "טבריה","טורעאן","טייבה","טייבה (בעמק)","טירה","טירת יהודה","טירת כרמל","טמרה",
  // י
  "יבנה","יגור","יהוד-מונוסון","יודפת","יוקנעם עילית","יכיני","ינוח","ירושלים","ירכא","ישכר",
  // כ
  "כאבול","כאוכב אבו אל-היג'א","כוכב יאיר","כוכב הצפון","כישור","כסרא-סמיע",
  "כפר אדומים","כפר ביאליק","כפר בלום","כפר גלעדי","כפר הנשיא","כפר הרי\"ף",
  "כפר חב\"ד","כפר חרוב","כפר יהושע","כפר יונה","כפר יסיף","כפר כמא","כפר כנא",
  "כפר מנדא","כפר מצר","כפר נהר הירדן","כפר סבא","כפר עזה","כפר ענן","כפר פינס",
  "כפר קאסם","כפר קרע","כפר ראש הנקרה","כפר רות","כפר שמאי","כפר תבור","כרמיאל",
  // ל
  "לוד","לוחמי הגטאות","לימן","לקיה",
  // מ
  "מג'ד אל-כרום","מגאר","מגדל","מגדל העמק","מגדל שמס","מגדלים","מודיעין מכבים רעות",
  "מודיעין עילית","מוצא עילית","מזכרת בתיה","מחניים","מטולה","מיתר","מכמנים",
  "מעלות-תרשיחא","מעלה אדומים","מעלה גלבוע","מעלה עירון","מפלסים","מצפה רמון","מצפה שלם",
  "מרגליות","משגב עם",
  // נ
  "נהריה","נוף הגליל","נועם","נחשולים","ניצן","ניר דוד","ניר עם","ניר עציון",
  "נס ציונה","נשר","נתיבות","נתניה",
  // ס
  "סאג'ור","סביון","סח'נין","סלמה","סנסנה","ספיר",
  // ע
  "עכו","עמנואל","עפולה","עראבה","עראמשה","ערד","עשרת",
  // פ
  "פוריה","פורת","פרדס חנה-כרכור","פרדסייה","פתח תקוה",
  // צ
  "צביה","צובה","צור הדסה","צור יגאל","צור נתן","צפת","צרעה",
  // ק
  "קדומים","קדימה-צורן","קדמת צבי","קטורה","קיסריה","קלנסווה","קצרין",
  "קריית אונו","קריית אתא","קריית ביאליק","קריית גת","קריית טבעון",
  "קריית מוצקין","קריית מלאכי","קריית עקרון","קריית ים","קריית שמונה",
  // ר
  "ראש העין","ראש פינה","ראשון לציון","רהט","רוחמה","רחובות","רינתיה",
  "רכסים","רמלה","רמת גן","רמת השרון","רמת ישי","רמת מגשימים","רמת רחל",
  "רעננה","רקפת",
  // ש
  "שדה אליהו","שדרות","שוהם","שילה","שמשית","שפרעם","שריד",
  // ת
  "תל אביב-יפו","תל מונד","תל שבע","תפרח","תקוע",
].sort((a, b) => a.localeCompare(b, "he"));

// ---- קואורדינטות ערים (lat, lon) ----
const CITY_COORDS = {
  "תל אביב":        [32.08, 34.78],
  "ירושלים":        [31.77, 35.21],
  "חיפה":           [32.79, 34.99],
  "באר שבע":        [31.25, 34.79],
  "נתניה":          [32.32, 34.85],
  "אשדוד":          [31.80, 34.65],
  "ראשון לציון":    [31.97, 34.80],
  "פתח תקוה":       [32.09, 34.89],
  "רחובות":         [31.89, 34.81],
  "רמת גן":         [32.07, 34.82],
  "חולון":          [32.01, 34.77],
  "בת ים":          [32.02, 34.75],
  "כפר סבא":        [32.18, 34.91],
  "רעננה":          [32.18, 34.87],
  "הרצליה":         [32.16, 34.84],
  "מודיעין מכבים רעות": [31.90, 35.01],
  "אשקלון":         [31.67, 34.57],
  "נהריה":          [33.00, 35.10],
  "עפולה":          [32.61, 35.29],
  "לוד":            [31.95, 34.89],
  "רמלה":           [31.93, 34.87],
  "אילת":           [29.56, 34.95],
  "קריית גת":       [31.61, 34.77],
  "חדרה":           [32.43, 34.92],
  "טבריה":          [32.79, 35.53],
  "ראש העין":       [32.10, 34.95],
};

// ---- מדפיסים לדוגמה ----
const MOCK_PRINTERS = [
  { id:1, name:"ירון כהן",   city:"תל אביב",   tier:"economy",  brand:"Creality",  printer:"Ender 3 V2",         materials:["PLA"],                       rating:4.7, reviews:23, completedPrints:87,  avatar:"י", bio:"מדפיס תלת-מימד תחביבן עם ניסיון של 3 שנים. מתמחה בפריטי עיצוב ביתי.", turnaround:"2–4 ימים", available:true  },
  { id:2, name:"מיכל לוי",   city:"ירושלים",   tier:"standard", brand:"Bambu Lab", printer:"Bambu Lab P1P",       materials:["PLA+","PETG","TPU"],         rating:4.9, reviews:41, completedPrints:156, avatar:"מ", bio:"מהנדסת מוצר. מתמחה בחלקים פונקציונליים ואיכות גבוהה.",               turnaround:"1–3 ימים", available:true  },
  { id:3, name:"אורי ברק",   city:"חיפה",      tier:"quality",  brand:"Prusa",     printer:"Prusa MK4",           materials:["ABS","ASA","PETG-CF"],       rating:5.0, reviews:18, completedPrints:64,  avatar:"א", bio:"מהנדס מכונות. חלקים עמידים לחום ולעומסים מכניים.",                   turnaround:"3–5 ימים", available:true  },
  { id:4, name:"נועה שמיר",  city:"תל אביב",   tier:"premium",  brand:"Anycubic",  printer:"Photon Mono M3 Plus", materials:["שרף סטנדרטי","שרף ABS-like"],rating:4.8, reviews:29, completedPrints:112, avatar:"נ", bio:"מעצבת תכשיטים ומיניאטורות. שרף בלבד — פרטים עדינים.",                turnaround:"2–3 ימים", available:false },
  { id:5, name:"דני אברהם",  city:"באר שבע",   tier:"standard", brand:"Prusa",     printer:"Mini+",               materials:["PLA+","TPU"],                rating:4.6, reviews:12, completedPrints:38,  avatar:"ד", bio:"סטודנט להנדסת מכונות. פריטים יצירתיים ופונקציונליים.",               turnaround:"2–5 ימים", available:true  },
  { id:6, name:"רותם גל",    city:"רחובות",    tier:"economy",  brand:"Creality",  printer:"K1",                  materials:["PLA"],                       rating:4.5, reviews:7,  completedPrints:22,  avatar:"ר", bio:"K1 מהירה — אב-טיפוסים זריזים ופריטים פשוטים.",                      turnaround:"1–3 ימים", available:true  },
  { id:7, name:"עומר בן-דוד",city:"חיפה",      tier:"standard", brand:"Bambu Lab", printer:"A1",                  materials:["PLA+","PETG"],               rating:4.7, reviews:15, completedPrints:45,  avatar:"ע", bio:"Bambu A1 עם AMS — מדפסת מהירה עם תמיכה בריבוי צבעים.",             turnaround:"2–4 ימים", available:true  },
  { id:8, name:"שרה כץ",     city:"נתניה",     tier:"quality",  brand:"Bambu Lab", printer:"X1C",                 materials:["ABS","ASA","Nylon","PA-CF"], rating:4.9, reviews:22, completedPrints:78,  avatar:"ש", bio:"X1C עם AMS — הנדסה ו-multicolor. חומרים מהנדסה בלבד.",              turnaround:"2–4 ימים", available:true  },
  { id:9, name:"תום לרנר",   city:"ראשון לציון",tier:"economy",  brand:"Artillery", printer:"Sidewinder X2",       materials:["PLA"],                       rating:4.4, reviews:9,  completedPrints:31,  avatar:"ת", bio:"Sidewinder ל-Benchy ואב-טיפוסים. מחיר נוח.",                         turnaround:"3–5 ימים", available:true  },
];

const MOCK_ORDERS_INIT = [
  { id:"ORD-001", itemName:"מחזיק טלפון לאופניים", tier:"standard", printerName:"מיכל לוי",  status:"printing",  weight:45,  hours:3, total:52.50, commission:5.67, date:"08/04/2026" },
  { id:"ORD-002", itemName:"גב לכיסא גיימינג",    tier:"economy",  printerName:"ירון כהן",  status:"completed", weight:120, hours:7, total:41.70, commission:4.51, date:"01/04/2026" },
];

// ============================================================
// PRICING ENGINE
// ============================================================
function calcPrice(tierId, weight, hours) {
  const t = TIERS[tierId];
  if (!t) return null;
  const mat  = weight * t.materialRate;
  const mach = hours  * t.machineRate;
  const sub  = mat + mach;
  const comm = sub * COMMISSION_RATE;
  return {
    mat:   mat.toFixed(2),
    mach:  mach.toFixed(2),
    sub:   sub.toFixed(2),
    comm:  comm.toFixed(2),
    total: (sub + comm).toFixed(2),
  };
}

// ---- מהירות הדפסה לפי רמה (גרם/שעה) ----
// Economy (Ender 3 ~50mm/s): ~6 g/h
// Standard (Bambu P1P ~150mm/s): ~20 g/h
// Quality (Prusa MK4 ~200mm/s, 0.15mm layer): ~15 g/h (slower for quality)
// Premium (Resin SLA, depends on layer area): ~2.5 g/h
const TIER_PRINT_SPEED_GPH = {
  economy: 6,
  standard: 20,
  quality: 15,
  premium: 2.5,
};

// ---- מרפח נפח → גרם (FDM: PLA 1.24g/cm³, infill אפקטיבי; Resin: 1.1g/cm³ solid) ----
function volumeToWeight(volumeMM3, tierId) {
  if (tierId === "premium") {
    // שרף — בדרך כלל מודפס חלול, ~30% solid
    return Math.max(1, Math.round(volumeMM3 * 0.30 * 0.00112 * 10) / 10);
  }
  // FDM — חישוב: דפנות (~30%) + infill (15–25%) = ~35–40% solid אפקטיבי
  const effectiveFill = { economy: 0.35, standard: 0.38, quality: 0.42 };
  const fill = effectiveFill[tierId] || 0.38;
  return Math.max(1, Math.round(volumeMM3 * fill * 0.00124 * 10) / 10);
}

function weightToHours(weightG, tierId) {
  const speed = TIER_PRINT_SPEED_GPH[tierId] || 10;
  return Math.round((weightG / speed) * 10) / 10;
}

// ---- STL Parser — חישוב נפח גיאומטרי אמיתי (אלגוריתם tetrahedra) ----
async function parseSTLFile(file) {
  try {
    const buf = await file.arrayBuffer();
    const view = new DataView(buf);
    if (buf.byteLength < 84) return null;

    const numTri = view.getUint32(80, true);
    const expectedSize = 84 + numTri * 50;

    let volumeMM3 = 0;
    if (Math.abs(expectedSize - buf.byteLength) < 500) {
      // Binary STL — חישוב נפח אמיתי
      for (let i = 0; i < numTri; i++) {
        const o = 84 + i * 50 + 12; // דלג על 80B header + 4B count + 12B normal
        const v1x = view.getFloat32(o,      true), v1y = view.getFloat32(o+4,  true), v1z = view.getFloat32(o+8,  true);
        const v2x = view.getFloat32(o+12,   true), v2y = view.getFloat32(o+16, true), v2z = view.getFloat32(o+20, true);
        const v3x = view.getFloat32(o+24,   true), v3y = view.getFloat32(o+28, true), v3z = view.getFloat32(o+32, true);
        // נפח מחותם של טטראדהרון (v1·(v2×v3)/6)
        volumeMM3 += (v1x*(v2y*v3z - v2z*v3y) + v1y*(v2z*v3x - v2x*v3z) + v1z*(v2x*v3y - v2y*v3x)) / 6;
      }
      volumeMM3 = Math.abs(volumeMM3);
    } else {
      // ASCII STL — אמדן גס לפי גודל קובץ (כ-50 בייט לכל משולש)
      const approxTri = buf.byteLength / 200;
      volumeMM3 = approxTri * 0.5;
    }

    return { volumeMM3: Math.round(volumeMM3), numTri, source: "stl" };
  } catch { return null; }
}

// ---- GCode Parser — קרא זמן ומשקל ישירות מהסלייסר ----
async function parseGcodeFile(file) {
  try {
    const text = await file.text();
    const header = text.slice(0, 8000); // רק ה-header (מטא-דאטה בראש הקובץ)

    let timeSeconds = null, weightG = null;

    // PrusaSlicer / SuperSlicer: "; estimated printing time (normal mode) = 2h 5m 3s"
    const prusaT = header.match(/estimated printing time.*?=\s*(?:(\d+)h\s*)?(?:(\d+)m\s*)?(?:(\d+)s)?/i);
    if (prusaT) timeSeconds = (+( prusaT[1]||0))*3600 + (+(prusaT[2]||0))*60 + (+(prusaT[3]||0));

    // PrusaSlicer: "; filament used [g] = 45.87"
    const prusaW = header.match(/filament used \[g\]\s*=\s*([\d.]+)/i);
    if (prusaW) weightG = parseFloat(prusaW[1]);

    // Cura: ";TIME:6303"
    const curaT = header.match(/^;TIME:(\d+)/m);
    if (curaT && !timeSeconds) timeSeconds = parseInt(curaT[1]);

    // Cura: ";Filament used: 4.28542m" (4.28m × π×(1.75/2)² × 1.24 g/cm³)
    const curaL = header.match(/;Filament used:\s*([\d.]+)m/i);
    if (curaL && !weightG) {
      const meters = parseFloat(curaL[1]);
      weightG = Math.round(meters * 1000 * Math.PI * (0.875**2) * 0.00124 * 10) / 10;
    }

    // Bambu Studio: "; total estimated time: 0h 45m" or "; total estimated time: 1h 30m 5s"
    const bambuT = header.match(/total estimated time:\s*(?:(\d+)h\s*)?(?:(\d+)m\s*)?(?:(\d+)s)?/i);
    if (bambuT && !timeSeconds) timeSeconds = (+(bambuT[1]||0))*3600 + (+(bambuT[2]||0))*60 + (+(bambuT[3]||0));

    // Bambu: "; filament used [g] = ..."  (same as Prusa format)
    // Generic fallback: any "XXg" near "filament"
    if (!weightG) {
      const generic = header.match(/filament.*?([\d.]+)\s*g\b/i);
      if (generic) weightG = parseFloat(generic[1]);
    }

    if (!timeSeconds && !weightG) return null;

    const hours = timeSeconds ? Math.round((timeSeconds / 3600) * 10) / 10 : null;
    return { hours, weightG: weightG ? Math.round(weightG * 10) / 10 : null, source: "gcode" };
  } catch { return null; }
}

// ============================================================
// SHARED COMPONENTS
// ============================================================
function TierBadge({ tierId, size="sm" }) {
  const t = TIERS[tierId];
  if (!t) return null;
  const cls = size==="lg" ? "px-3 py-1 text-sm font-semibold" : "px-2 py-0.5 text-xs font-medium";
  return <span className={`${cls} rounded-full ${t.badgeBg} ${t.textColor} border ${t.borderColor}`}>{t.emoji} {t.name}</span>;
}

function Stars({ rating }) {
  return <span className="text-amber-400 text-sm">{"★".repeat(Math.round(rating))}{"☆".repeat(5-Math.round(rating))} <span className="text-gray-600 font-medium">{rating}</span></span>;
}

function Avatar({ letter, tier }) {
  const colors = { economy:"#16a34a", standard:"#2563eb", quality:"#7c3aed", premium:"#d97706" };
  return (
    <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-base font-bold flex-shrink-0"
         style={{ background: colors[tier] || "#6366f1" }}>
      {letter}
    </div>
  );
}

// ---- City Autocomplete ----
function CityAutocomplete({ value, onChange, placeholder="הקלד עיר..." }) {
  const [query, setQuery] = useState(value || "");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => { setQuery(value || ""); }, [value]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const matches = query.length > 0
    ? ISRAELI_CITIES.filter(c => c.includes(query)).slice(0, 8)
    : ISRAELI_CITIES.slice(0, 8);

  return (
    <div className="relative" ref={ref}>
      <input
        className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        value={query}
        placeholder={placeholder}
        onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
      />
      {open && matches.length > 0 && (
        <div className="absolute z-30 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-52 overflow-y-auto">
          {matches.map(city => (
            <button key={city} type="button"
                    className="w-full text-right px-4 py-2 text-sm hover:bg-indigo-50 text-gray-700 block"
                    onMouseDown={() => { setQuery(city); onChange(city); setOpen(false); }}>
              📍 {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const OTHER = "__other__";

// ---- Brand + Model Select ----
function BrandModelSelect({ tierId, value, onChange }) {
  const [brand, setBrand]           = useState(value?.brand || "");
  const [model, setModel]           = useState(value?.model || "");
  const [customBrand, setCustomBrand] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [brandMode, setBrandMode]   = useState("list"); // "list" | "custom"
  const [modelMode, setModelMode]   = useState("list"); // "list" | "custom"

  const availBrands  = Object.entries(PRINTER_BRANDS).filter(([, d]) => d[tierId]).map(([n]) => n);
  const availModels  = brand && PRINTER_BRANDS[brand]?.[tierId] || [];
  const effectiveBrand = brandMode === "custom" ? customBrand : brand;
  const effectiveModel = modelMode === "custom" ? customModel : model;

  useEffect(() => {
    setBrand(""); setModel(""); setCustomBrand(""); setCustomModel("");
    setBrandMode("list"); setModelMode("list");
    onChange({ brand:"", model:"" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tierId]);

  const handleBrandChange = (val) => {
    if (val === OTHER) { setBrandMode("custom"); setBrand(""); setModel(""); onChange({ brand:customBrand, model:"" }); }
    else { setBrandMode("list"); setBrand(val); setModel(""); setModelMode("list"); onChange({ brand:val, model:"" }); }
  };

  const handleModelChange = (val) => {
    if (val === OTHER) { setModelMode("custom"); setModel(""); onChange({ brand:effectiveBrand, model:customModel }); }
    else { setModelMode("list"); setModel(val); onChange({ brand:effectiveBrand, model:val }); }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Brand */}
      <div>
        <label className="text-xs text-gray-500 block mb-1">יצרן</label>
        {brandMode === "custom" ? (
          <div className="flex gap-1">
            <input className="flex-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                   placeholder="לדוגמה: Voron, Prusa..."
                   value={customBrand}
                   onChange={e => { setCustomBrand(e.target.value); onChange({ brand:e.target.value, model:effectiveModel }); }}
                   autoFocus />
            <button onClick={() => { setBrandMode("list"); setCustomBrand(""); onChange({ brand:"", model:"" }); }}
                    className="text-gray-400 hover:text-gray-600 px-2" title="חזור לרשימה">✕</button>
          </div>
        ) : (
          <select className="w-full border rounded-xl px-3 py-2.5 text-sm bg-white"
                  value={brand}
                  onChange={e => handleBrandChange(e.target.value)}>
            <option value="">בחר יצרן...</option>
            {availBrands.map(b => <option key={b} value={b}>{b}</option>)}
            <option value={OTHER}>✏️ אחר (הקלד ידנית)</option>
          </select>
        )}
      </div>

      {/* Model */}
      <div>
        <label className="text-xs text-gray-500 block mb-1">דגם</label>
        {modelMode === "custom" || brandMode === "custom" ? (
          <div className="flex gap-1">
            <input className="flex-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                   placeholder="לדוגמה: V2.4, MK3S+..."
                   value={customModel}
                   onChange={e => { setCustomModel(e.target.value); onChange({ brand:effectiveBrand, model:e.target.value }); }}
                   disabled={!effectiveBrand} />
            {modelMode === "custom" && brandMode !== "custom" && (
              <button onClick={() => { setModelMode("list"); setCustomModel(""); onChange({ brand:effectiveBrand, model:"" }); }}
                      className="text-gray-400 hover:text-gray-600 px-2" title="חזור לרשימה">✕</button>
            )}
          </div>
        ) : (
          <select className="w-full border rounded-xl px-3 py-2.5 text-sm bg-white"
                  value={model}
                  disabled={!brand}
                  onChange={e => handleModelChange(e.target.value)}>
            <option value="">{brand ? "בחר דגם..." : "קודם יצרן"}</option>
            {availModels.map(m => <option key={m} value={m}>{m}</option>)}
            {brand && <option value={OTHER}>✏️ דגם אחר (הקלד ידנית)</option>}
          </select>
        )}
      </div>

      {/* Hint when custom brand is selected */}
      {brandMode === "custom" && (
        <div className="col-span-2 text-xs text-indigo-500 -mt-1">
          💡 הקלד את שם היצרן ואת דגם המדפסת — כל מדפסת מתקבלת
        </div>
      )}
    </div>
  );
}

// ---- PrinterCard ----
function PrinterCard({ printer, onSelect }) {
  const tier = TIERS[printer.tier];
  return (
    <div className={`border-2 rounded-2xl p-5 ${tier.borderColor} ${tier.bgColor} ${onSelect ? "hover:shadow-lg cursor-pointer transition-shadow" : ""}`}
         onClick={() => onSelect && printer.available && onSelect(printer)}>
      <div className="flex items-start gap-3 mb-3">
        <Avatar letter={printer.avatar} tier={printer.tier} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <span className="font-bold text-gray-900">{printer.name}</span>
            <TierBadge tierId={printer.tier} />
          </div>
          <div className="text-xs text-gray-500 mt-0.5">📍 {printer.city} · 🏷️ {printer.brand} {printer.printer}</div>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-3">{printer.bio}</p>
      <div className="flex flex-wrap gap-1 mb-3">
        {printer.materials.map(m => <span key={m} className="bg-white border text-gray-600 text-xs px-2 py-0.5 rounded-full">{m}</span>)}
      </div>
      <div className="flex items-center justify-between flex-wrap gap-2 text-sm">
        <Stars rating={printer.rating} />
        <span className="text-gray-400 text-xs">⏱ {printer.turnaround}</span>
        <span className="text-gray-400 text-xs">✅ {printer.completedPrints} הדפסות</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${printer.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
          {printer.available ? "✓ זמין" : "✗ עסוק"}
        </span>
      </div>
      {onSelect && (
        <button disabled={!printer.available}
                className={`mt-4 w-full py-2 rounded-xl text-white text-sm font-bold transition ${printer.available ? `${tier.btn}` : "bg-gray-300 cursor-not-allowed"}`}>
          {printer.available ? "בחר מדפיס זה" : "לא זמין כרגע"}
        </button>
      )}
    </div>
  );
}

// ============================================================
// ISRAEL SVG MAP
// ============================================================
function IsraelMap({ printers, onSelect }) {
  const [tooltip, setTooltip] = useState(null);
  const [selected, setSelected] = useState(null);

  // SVG dimensions & coordinate conversion
  const W = 260, H = 400;
  const BOUNDS = { minLat:29.4, maxLat:33.4, minLon:34.15, maxLon:35.95 };

  const toXY = (lat, lon) => [
    (lon - BOUNDS.minLon) / (BOUNDS.maxLon - BOUNDS.minLon) * W,
    (BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat) * H,
  ];

  // Simplified Israel outline (clockwise)
  const outline = [
    [33.07,35.10],[33.25,35.78],[32.70,35.67],[32.35,35.57],
    [32.00,35.55],[31.50,35.50],[31.10,35.18],[30.50,35.05],
    [29.58,35.00],[29.50,34.95],[29.50,34.62],[30.00,34.25],
    [31.20,34.22],[31.65,34.57],[31.80,34.65],[32.00,34.76],
    [32.20,34.80],[32.44,34.90],[32.82,34.97],[33.07,35.10],
  ].map(([la,lo]) => toXY(la,lo));
  const pathD = outline.map(([x,y],i) => `${i===0?"M":"L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ")+" Z";

  // Map printers to SVG coordinates, add small jitter for overlapping cities
  const cityCount = {};
  const mapped = printers.map(p => {
    const coords = CITY_COORDS[p.city];
    if (!coords) return null;
    cityCount[p.city] = (cityCount[p.city] || 0) + 1;
    const idx = cityCount[p.city] - 1;
    const angle = (idx * 137) * Math.PI / 180;
    const r = idx === 0 ? 0 : 14;
    const [bx, by] = toXY(coords[0], coords[1]);
    return { ...p, svgX: bx + Math.cos(angle)*r, svgY: by + Math.sin(angle)*r };
  }).filter(Boolean);

  const handleClick = (p) => {
    if (!p.available) return;
    setSelected(selected?.id === p.id ? null : p);
  };

  return (
    <div dir="rtl">
      <div className="flex gap-6 flex-wrap">
        {/* SVG Map */}
        <div className="relative flex-shrink-0" style={{ width: W, height: H }}>
          <svg width={W} height={H} className="rounded-2xl border border-gray-200 overflow-hidden drop-shadow-sm">
            {/* Sea */}
            <rect width={W} height={H} fill="#bfdbfe" />
            {/* Land */}
            <path d={pathD} fill="#dcfce7" stroke="#86efac" strokeWidth="1.5" />
            {/* Compass */}
            <text x={W/2} y={13} textAnchor="middle" fontSize="9" fill="#6b7280" fontFamily="sans-serif">↑ צפון</text>
            {/* Printer dots */}
            {mapped.map(p => (
              <g key={p.id}
                 className="cursor-pointer"
                 onMouseEnter={() => setTooltip(p)}
                 onMouseLeave={() => setTooltip(null)}
                 onClick={() => handleClick(p)}>
                <circle cx={p.svgX} cy={p.svgY} r={selected?.id === p.id ? 14 : 11}
                        fill={TIERS[p.tier].dot}
                        stroke={selected?.id === p.id ? "#1e1b4b" : "white"}
                        strokeWidth={selected?.id === p.id ? 3 : 2}
                        opacity={p.available ? 1 : 0.35} />
                <text x={p.svgX} y={p.svgY+0.5} textAnchor="middle" dominantBaseline="middle"
                      fontSize="8" fill="white" fontWeight="bold" className="pointer-events-none select-none"
                      fontFamily="sans-serif">
                  {p.avatar}
                </text>
              </g>
            ))}
          </svg>
          {/* Tooltip */}
          {tooltip && (
            <div className="absolute bg-white shadow-xl rounded-xl p-3 border border-gray-100 pointer-events-none z-20"
                 style={{
                   left: tooltip.svgX > W * 0.55 ? tooltip.svgX - 160 : tooltip.svgX + 16,
                   top:  Math.max(0, Math.min(H - 100, tooltip.svgY - 45)),
                   width: 148,
                 }}>
              <div className="font-bold text-gray-900 text-sm">{tooltip.name}</div>
              <div className="text-gray-500 text-xs">📍 {tooltip.city}</div>
              <div className="mt-1"><TierBadge tierId={tooltip.tier} /></div>
              <div className="text-xs mt-1">{tooltip.brand} {tooltip.printer}</div>
              {!tooltip.available && <div className="text-xs text-red-500 mt-1">לא זמין</div>}
            </div>
          )}
        </div>

        {/* Side panel */}
        <div className="flex-1 min-w-0">
          {selected ? (
            <div className={`border-2 rounded-2xl p-4 ${TIERS[selected.tier].bgColor} ${TIERS[selected.tier].borderColor}`}>
              <div className="flex items-center gap-3 mb-3">
                <Avatar letter={selected.avatar} tier={selected.tier} />
                <div>
                  <div className="font-bold text-gray-900">{selected.name}</div>
                  <div className="text-xs text-gray-500">📍 {selected.city}</div>
                </div>
              </div>
              <TierBadge tierId={selected.tier} size="lg" />
              <p className="text-sm text-gray-600 mt-2 mb-2">{selected.bio}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                {selected.materials.map(m => <span key={m} className="bg-white border text-xs text-gray-600 px-2 py-0.5 rounded-full">{m}</span>)}
              </div>
              <div className="text-xs text-gray-500 mb-3">
                <div>🏷️ {selected.brand} {selected.printer}</div>
                <div>⏱ {selected.turnaround} · ✅ {selected.completedPrints} הדפסות</div>
                <div className="mt-1"><Stars rating={selected.rating} /></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onSelect && onSelect(selected)}
                        className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition">
                  הדפס עם {selected.name} →
                </button>
                <button onClick={() => setSelected(null)}
                        className="px-3 py-2 rounded-xl border border-gray-300 text-gray-500 text-sm hover:bg-white">
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-6 border-2 border-dashed border-gray-200 rounded-2xl">
              <div className="text-4xl mb-2">🖨️</div>
              <p className="text-sm text-center">לחץ על נקודה במפה לפרטי המדפיס</p>
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4">
            {Object.values(TIERS).map(t => (
              <div key={t.id} className="flex items-center gap-1.5 text-xs text-gray-600">
                <div className="w-3 h-3 rounded-full" style={{ background: t.dot }} />
                {t.name}
              </div>
            ))}
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <div className="w-3 h-3 rounded-full bg-gray-300" />
              לא זמין
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: HOME
// ============================================================
function HomePage({ setPage }) {
  return (
    <div>
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white py-24 px-6 text-center">
        <div className="text-6xl mb-4">🖨️</div>
        <h1 className="text-5xl font-black mb-3">PrintShare</h1>
        <p className="text-xl text-indigo-200 mb-2">שיתוף מדפסות תלת-מימד בישראל</p>
        <p className="text-indigo-300 max-w-lg mx-auto mb-10 text-sm">
          יש לך מדפסת? הרוויח ממנה. רוצה להדפיס? מצא מדפיסן קרוב — במחיר הוגן ושקוף.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button onClick={() => setPage("request")} className="bg-white text-indigo-700 px-8 py-3 rounded-xl font-bold text-lg hover:bg-indigo-50 transition shadow-lg">
            🖨️ אני רוצה להדפיס
          </button>
          <button onClick={() => setPage("register")} className="border-2 border-white/60 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-white/10 transition">
            ➕ יש לי מדפסת
          </button>
        </div>
      </div>

      <div className="bg-white py-10 border-b">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-6 text-center">
          {[["127","מדפיסים פעילים"],["1,843","הדפסות הושלמו"],["12%","עמלה בלבד"],["4","רמות איכות"]].map(([n,l]) => (
            <div key={l}><div className="text-3xl font-black text-indigo-600">{n}</div><div className="text-gray-500 text-sm mt-1">{l}</div></div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-center text-gray-900 mb-10">איך זה עובד?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            {[
              { icon:"📐", t:"תאר את הפריט", d:"שם, תיאור, או העלה קובץ STL — המערכת תאמד מיד את המחיר" },
              { icon:"🧮", t:"קבל מחיר שקוף", d:"חישוב לפי משקל חומר + זמן הדפסה, לפי רמת האיכות שבחרת" },
              { icon:"🔍", t:"בחר מדפיס", d:"ראה דירוגים, זמינות ומיקום במפה — ובחר את המתאים לך" },
              { icon:"📦", t:"קבל את הפריט", d:"המדפיס מכין, ואתה מגיע לאסוף" },
            ].map((s,i) => (
              <div key={i} className="bg-white rounded-2xl p-5 text-center shadow-sm">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">{i+1}</div>
                <h3 className="font-bold text-gray-800 text-sm mb-1">{s.t}</h3>
                <p className="text-gray-500 text-xs">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-center text-gray-900 mb-2">4 רמות איכות הדפסה</h2>
          <p className="text-center text-gray-500 text-sm mb-8">בחר לפי סוג המוצר — מאב-טיפוס מהיר ועד פרמיום שרף</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.values(TIERS).map(tier => (
              <div key={tier.id} className={`rounded-2xl border-2 p-5 ${tier.bgColor} ${tier.borderColor}`}>
                <div className="text-3xl mb-2">{tier.emoji}</div>
                <h3 className={`font-black text-base mb-1 ${tier.textColor}`}>{tier.name}</h3>
                <p className="text-xs text-gray-500 mb-3">{tier.description}</p>
                <div className="text-xs text-gray-600 space-y-0.5">
                  <div>📏 {tier.layerHeight}</div>
                  <div className={`font-bold mt-1 ${tier.textColor}`}>₪{tier.materialRate}/גרם + ₪{tier.machineRate}/שעה</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 py-12 px-6">
        <div className="max-w-xl mx-auto">
          <h2 className="text-xl font-black text-center text-gray-900 mb-6">💼 המודל העסקי</h2>
          <div className="bg-white rounded-2xl p-6 shadow-sm font-mono text-sm">
            <div className="flex justify-between text-gray-500"><span>חומר: 80גרם × ₪0.14</span><span>₪11.20</span></div>
            <div className="flex justify-between text-gray-500"><span>מכונה: 4שעות × ₪7.00</span><span>₪28.00</span></div>
            <div className="flex justify-between font-bold border-t mt-2 pt-2"><span>💰 מדפיס מקבל</span><span className="text-green-600">₪39.20</span></div>
            <div className="flex justify-between text-indigo-600"><span>+ עמלה (12%)</span><span>₪4.70</span></div>
            <div className="flex justify-between font-black text-base border-t mt-2 pt-2"><span>💳 המזמין משלם</span><span>₪43.90</span></div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4 text-center text-sm">
            <div className="bg-green-50 border border-green-200 rounded-xl p-3">
              <div className="font-bold text-green-700">בעל המדפסת</div>
              <div className="text-green-600 text-xs mt-1">מקבל 100% ממחיר החומר + מכונה</div>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3">
              <div className="font-bold text-indigo-700">PrintShare</div>
              <div className="text-indigo-600 text-xs mt-1">12% עמלה מהמזמין בלבד</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: MARKETPLACE
// ============================================================
function MarketplacePage({ setPage, setSelectedPrinter }) {
  const [view, setView] = useState("list"); // "list" | "map"
  const [tierFilter, setTierFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("");
  const [availOnly, setAvailOnly] = useState(false);

  const filtered = MOCK_PRINTERS.filter(p => {
    if (tierFilter !== "all" && p.tier !== tierFilter) return false;
    if (cityFilter && p.city !== cityFilter) return false;
    if (availOnly && !p.available) return false;
    return true;
  });

  const handleSelect = (printer) => { setSelectedPrinter(printer); setPage("request"); };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900 mb-1">🔍 מצא מדפיס</h1>
            <p className="text-gray-500 text-sm">סנן לפי רמת איכות, עיר וזמינות</p>
          </div>
          {/* View Toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            <button onClick={() => setView("list")} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${view==="list" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
              📋 רשימה
            </button>
            <button onClick={() => setView("map")} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${view==="map" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
              🗺️ מפה
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-xs text-gray-500 block mb-1">רמת איכות</label>
            <select className="border rounded-xl px-3 py-2 text-sm" value={tierFilter} onChange={e => setTierFilter(e.target.value)}>
              <option value="all">כל הרמות</option>
              {Object.values(TIERS).map(t => <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>)}
            </select>
          </div>
          <div className="min-w-48">
            <label className="text-xs text-gray-500 block mb-1">עיר</label>
            <CityAutocomplete value={cityFilter} onChange={v => setCityFilter(v)} placeholder="כל הערים..." />
          </div>
          <label className="flex items-center gap-2 cursor-pointer pb-0.5">
            <input type="checkbox" checked={availOnly} onChange={e => setAvailOnly(e.target.checked)} className="w-4 h-4" />
            <span className="text-sm text-gray-600">זמינים בלבד</span>
          </label>
          <button onClick={() => { setTierFilter("all"); setCityFilter(""); setAvailOnly(false); }}
                  className="text-xs text-indigo-500 hover:underline pb-1">נקה סינון</button>
          <div className="mr-auto text-sm text-gray-400">{filtered.length} מדפיסים</div>
        </div>

        {/* Content */}
        {view === "list" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map(p => <PrinterCard key={p.id} printer={p} onSelect={handleSelect} />)}
            {filtered.length === 0 && (
              <div className="col-span-2 text-center py-20 text-gray-400">
                <div className="text-5xl mb-3">🔍</div><p>לא נמצאו מדפיסים</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <IsraelMap printers={filtered} onSelect={handleSelect} />
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// PAGE: REQUEST (3-step wizard)
// ============================================================
function RequestPage({ selectedPrinter, setPage, addOrder }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    itemName: "", description: "",
    tierId: selectedPrinter?.tier || "standard",
    weight: 60, hours: 4,
    printer: selectedPrinter || null,
    uploadedFile: null,    // הקובץ שהועלה (STL או GCode)
    fileSource: null,      // "stl" | "gcode"
    stlVolumeMM3: null,    // נפח מה-STL (לחישוב מחדש כשמשנים רמה)
    gcodeData: null,       // { hours, weightG } — ישיר מהסלייסר
    fileInfo: null,        // תיאור לתצוגה
  });
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const pricing = useMemo(() => calcPrice(form.tierId, form.weight, form.hours), [form.tierId, form.weight, form.hours]);
  const availPrinters = MOCK_PRINTERS.filter(p => p.tier === form.tierId && p.available);

  // כשמשנים רמת איכות — חשב מחדש מהנפח (אם יש STL)
  useEffect(() => {
    if (form.stlVolumeMM3 && form.fileSource === "stl") {
      const w = volumeToWeight(form.stlVolumeMM3, form.tierId);
      const h = weightToHours(w, form.tierId);
      setForm(f => ({ ...f, weight: w, hours: h }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.tierId]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const ext = file.name.split(".").pop().toLowerCase();

    if (ext === "stl") {
      const result = await parseSTLFile(file);
      setUploading(false);
      if (result) {
        const w = volumeToWeight(result.volumeMM3, form.tierId);
        const h = weightToHours(w, form.tierId);
        setForm(f => ({
          ...f,
          uploadedFile: file, fileSource: "stl",
          stlVolumeMM3: result.volumeMM3,
          weight: w, hours: h,
          fileInfo: { label:`${result.volumeMM3.toLocaleString()} מ״ק · ${result.numTri?.toLocaleString() ?? "?"} משולשים`, accuracy:"אמדן מנפח — ניתן לדיוק עם GCode" },
        }));
      } else {
        setForm(f => ({ ...f, uploadedFile: file, fileSource: "stl", fileInfo:{ label:"לא ניתן לנתח", accuracy:"" } }));
      }

    } else if (["gcode","gco","gc","bgcode"].includes(ext)) {
      const result = await parseGcodeFile(file);
      setUploading(false);
      if (result) {
        setForm(f => ({
          ...f,
          uploadedFile: file, fileSource: "gcode",
          gcodeData: result,
          weight: result.weightG ?? f.weight,
          hours:  result.hours   ?? f.hours,
          fileInfo: {
            label: [result.hours ? `${result.hours}שעות` : null, result.weightG ? `${result.weightG}גרם` : null].filter(Boolean).join(" · "),
            accuracy:"✅ נתונים ישירים מהסלייסר — מדויק!",
          },
        }));
      } else {
        setUploading(false);
        setForm(f => ({ ...f, uploadedFile: file, fileSource: "gcode", fileInfo:{ label:"לא נמצאו נתוני זמן/משקל בקובץ", accuracy:"" } }));
      }
    } else {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    addOrder({
      id: `ORD-${Math.floor(Math.random()*900+100)}`,
      itemName: form.itemName, tier: form.tierId,
      printerName: form.printer?.name || "?",
      status: "pending", weight: form.weight, hours: form.hours,
      total: parseFloat(pricing.total), commission: parseFloat(pricing.comm),
      date: new Date().toLocaleDateString("he-IL"),
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl p-10 shadow-lg text-center max-w-sm w-full">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-black mb-2">הבקשה נשלחה!</h2>
          <p className="text-gray-500 mb-5 text-sm">המדפיס יאשר בקרוב</p>
          <div className="bg-indigo-50 rounded-xl p-4 text-sm text-right mb-5 space-y-1">
            <div className="flex justify-between"><span>פריט</span><span className="font-medium">{form.itemName}</span></div>
            <div className="flex justify-between font-black text-indigo-600 text-base"><span>סה״כ</span><span>₪{pricing?.total}</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setPage("orders")} className="flex-1 bg-indigo-600 text-white py-2 rounded-xl font-bold text-sm hover:bg-indigo-700">הזמנות שלי</button>
            <button onClick={() => setPage("home")} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm hover:bg-gray-50">בית</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-black text-gray-900 mb-4">🖨️ בקשת הדפסה</h1>
        <div className="flex gap-2 mb-2">
          {[1,2,3].map(s => <div key={s} className={`h-2 flex-1 rounded-full transition-colors ${step>=s?"bg-indigo-600":"bg-gray-200"}`} />)}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mb-6">
          <span className={step>=1?"text-indigo-600 font-medium":""}>פרטי הפריט</span>
          <span className={step>=2?"text-indigo-600 font-medium":""}>מחיר ומדפיס</span>
          <span className={step>=3?"text-indigo-600 font-medium":""}>אישור</span>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="font-bold text-gray-800">שלב 1 — תאר את מה שאתה רוצה</h2>

            {/* File Upload — STL or GCode */}
            <div>
              <input type="file" accept=".stl,.gcode,.gco,.gc,.bgcode" className="hidden" id="file-upload" onChange={handleFileUpload} />
              <div className={`border-2 border-dashed rounded-xl transition ${form.uploadedFile ? (form.fileSource==="gcode" ? "border-green-400 bg-green-50" : "border-indigo-400 bg-indigo-50") : "border-gray-300 hover:border-indigo-400"}`}>
                {!form.uploadedFile ? (
                  <label htmlFor="file-upload" className="cursor-pointer block p-5">
                    <div className="text-center">
                      <div className="text-3xl mb-2">📂</div>
                      <div className="font-semibold text-gray-700 text-sm mb-1">העלה קובץ לאמדן אוטומטי</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="bg-white rounded-xl p-3 border border-gray-200 text-center">
                        <div className="text-lg mb-1">🧊</div>
                        <div className="font-semibold text-xs text-gray-700">קובץ STL</div>
                        <div className="text-xs text-gray-400 mt-0.5">אמדן לפי נפח המודל</div>
                        <div className="text-xs text-amber-600 mt-1">~דיוק בינוני</div>
                      </div>
                      <div className="bg-white rounded-xl p-3 border border-green-200 text-center">
                        <div className="text-lg mb-1">⚙️</div>
                        <div className="font-semibold text-xs text-gray-700">GCode מסלייסר</div>
                        <div className="text-xs text-gray-400 mt-0.5">PrusaSlicer / Cura / Bambu</div>
                        <div className="text-xs text-green-600 mt-1">✅ מדויק לחלוטין</div>
                      </div>
                    </div>
                    <div className="text-center mt-3">
                      <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm inline-block">בחר קובץ</span>
                    </div>
                  </label>
                ) : uploading ? (
                  <div className="p-5 text-center text-sm text-indigo-600 font-medium animate-pulse">⏳ מנתח קובץ...</div>
                ) : (
                  <div className="p-4 flex items-start gap-3">
                    <div className="text-2xl">{form.fileSource==="gcode" ? "⚙️" : "🧊"}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-900 truncate">{form.uploadedFile.name}</div>
                      {form.fileInfo?.label && (
                        <div className="text-sm font-bold text-indigo-700 mt-0.5">{form.fileInfo.label}</div>
                      )}
                      {form.fileInfo?.accuracy && (
                        <div className={`text-xs mt-0.5 ${form.fileSource==="gcode" ? "text-green-600" : "text-amber-600"}`}>
                          {form.fileInfo.accuracy}
                        </div>
                      )}
                      {form.fileSource === "stl" && (
                        <div className="text-xs text-gray-400 mt-1">
                          💡 לדיוק מלא — ייצא GCode מ-PrusaSlicer/Cura/Bambu Studio והעלה אותו
                        </div>
                      )}
                    </div>
                    <label htmlFor="file-upload" className="cursor-pointer text-xs text-indigo-500 hover:underline flex-shrink-0">החלף</label>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center text-xs text-gray-400 -mt-2">— או תאר בטקסט —</div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">שם הפריט *</label>
              <input className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                     placeholder="לדוגמה: מחזיק טלפון לאופניים"
                     value={form.itemName} onChange={e => setForm({...form, itemName:e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">תיאור (אופציונלי)</label>
              <textarea className="w-full border rounded-xl px-4 py-2.5 text-sm h-16 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="ממדים, שימוש מיועד, צבע..."
                        value={form.description} onChange={e => setForm({...form, description:e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                רמת איכות מבוקשת *
                {form.stlVolumeMM3 && <span className="text-xs text-indigo-500 font-normal mr-2">(שינוי רמה יעדכן את אמדן הזמן)</span>}
              </label>
              <div className="grid grid-cols-1 gap-2">
                {Object.values(TIERS).map(tier => {
                  const previewW = form.stlVolumeMM3 ? volumeToWeight(form.stlVolumeMM3, tier.id) : null;
                  const previewH = previewW ? weightToHours(previewW, tier.id) : null;
                  return (
                  <button key={tier.id} onClick={() => setForm({...form, tierId:tier.id, printer:null})}
                          className={`p-3 rounded-xl border-2 text-right flex gap-3 items-start transition ${form.tierId===tier.id ? `${tier.borderColor} ${tier.bgColor}` : "border-gray-200 hover:border-gray-300 bg-white"}`}>
                    <span className="text-2xl">{tier.emoji}</span>
                    <div className="flex-1">
                      <div className={`font-bold text-sm ${form.tierId===tier.id ? tier.textColor : "text-gray-800"}`}>{tier.name}</div>
                      <div className="text-xs text-gray-500">{tier.description}</div>
                      <div className="flex justify-between items-center mt-0.5">
                        <div className={`text-xs font-semibold ${form.tierId===tier.id ? tier.textColor : "text-gray-500"}`}>₪{tier.materialRate}/גרם + ₪{tier.machineRate}/שעה</div>
                        {previewW && <div className={`text-xs font-bold ${tier.textColor}`}>~{previewW}גרם · ~{previewH}שע</div>}
                      </div>
                    </div>
                  </button>
                  );
                })}
              </div>
            </div>
            <button onClick={() => form.itemName && setStep(2)}
                    className={`w-full py-3 rounded-xl text-white font-bold transition ${form.itemName ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-300 cursor-not-allowed"}`}>
              המשך ←
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="font-bold text-gray-800">שלב 2 — מחיר ובחירת מדפיס</h2>
            <div className={`rounded-xl p-5 border-2 ${TIERS[form.tierId].borderColor} ${TIERS[form.tierId].bgColor}`}>
              <h3 className="font-bold text-sm text-gray-700 mb-3">🧮 מחשבון מחיר</h3>
              {form.uploadedFile && form.fileInfo?.label && (
                <div className={`text-xs px-3 py-2 rounded-lg mb-3 font-medium ${form.fileSource==="gcode" ? "bg-green-100 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                  {form.fileSource === "gcode" ? "⚙️ נתוני סלייסר מדויקים:" : "🧊 אמדן מנפח STL:"} {form.fileInfo.label}
                  {form.fileSource === "stl" && <span className="font-normal"> — ניתן לשנות ידנית</span>}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">משקל חומר (גרם)</label>
                  <input type="number" min="1" max="2000" className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                         value={form.weight} onChange={e => setForm({...form, weight:+e.target.value})} />
                  <p className="text-xs text-gray-400 mt-0.5">קטן ≈ 20–60גרם · בינוני ≈ 60–200גרם</p>
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">זמן הדפסה (שעות)</label>
                  <input type="number" min="0.5" max="72" step="0.5" className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                         value={form.hours} onChange={e => setForm({...form, hours:+e.target.value})} />
                  <p className="text-xs text-gray-400 mt-0.5">ניתן להריץ בסלייסר</p>
                </div>
              </div>
              {pricing && (
                <div className="bg-white rounded-xl p-4 text-sm shadow-sm">
                  <div className="flex justify-between text-gray-500"><span>חומר ({form.weight}גרם × ₪{TIERS[form.tierId].materialRate})</span><span>₪{pricing.mat}</span></div>
                  <div className="flex justify-between text-gray-500"><span>מכונה ({form.hours}שע × ₪{TIERS[form.tierId].machineRate})</span><span>₪{pricing.mach}</span></div>
                  <div className="flex justify-between font-semibold border-t mt-2 pt-2"><span>למדפיס</span><span className="text-green-600">₪{pricing.sub}</span></div>
                  <div className="flex justify-between text-indigo-600"><span>+ עמלה (12%)</span><span>₪{pricing.comm}</span></div>
                  <div className="flex justify-between font-black text-base border-t mt-2 pt-2"><span>סה״כ שלך</span><span className="text-indigo-700">₪{pricing.total}</span></div>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-700 mb-2">בחר מדפיס — {availPrinters.length} זמינים</h3>
              {availPrinters.length === 0 ? (
                <div className="text-center py-8 text-gray-400 border-2 border-dashed rounded-xl text-sm">אין מדפיסים זמינים ברמה זו כרגע</div>
              ) : (
                <div className="space-y-2">
                  {availPrinters.map(p => (
                    <div key={p.id} onClick={() => setForm({...form, printer:p})}
                         className={`border-2 rounded-xl p-4 cursor-pointer transition ${form.printer?.id===p.id ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-indigo-300"}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar letter={p.avatar} tier={p.tier} />
                          <div>
                            <div className="font-bold text-sm">{p.name}</div>
                            <div className="text-xs text-gray-500">{p.city} · {p.brand} {p.printer}</div>
                          </div>
                        </div>
                        <div className="text-right"><Stars rating={p.rating} /><div className="text-xs text-gray-400">{p.turnaround}</div></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="border border-gray-200 text-gray-600 px-5 py-2 rounded-xl text-sm hover:bg-gray-50">→ חזור</button>
              <button onClick={() => form.printer && setStep(3)}
                      className={`flex-1 py-2 rounded-xl text-white font-bold text-sm transition ${form.printer ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-300 cursor-not-allowed"}`}>
                המשך לאישור ←
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-5">שלב 3 — אישור הזמנה</h2>
            <div className="space-y-2 text-sm mb-6">
              {[
                ["פריט", form.itemName],
                ["קובץ", form.uploadedFile ? `${form.uploadedFile.name} (${form.fileSource === "gcode" ? "GCode מסלייסר" : "STL"})` : "לא הועלה"],
                ["רמת איכות", null],
                ["מדפיס", `${form.printer?.name} — ${form.printer?.city}`],
                ["חומר", `${form.weight} גרם`],
                ["זמן הדפסה", `${form.hours} שעות`],
                ["למדפיס", `₪${pricing?.sub}`],
                ["עמלת פלטפורמה (12%)", `₪${pricing?.comm}`],
              ].map(([k,v]) => (
                <div key={k} className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">{k}</span>
                  {k==="רמת איכות" ? <TierBadge tierId={form.tierId} /> : <span className="font-medium">{v}</span>}
                </div>
              ))}
              <div className="flex justify-between pt-1 text-base font-black">
                <span>סה״כ לתשלום</span><span className="text-indigo-600">₪{pricing?.total}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="border border-gray-200 text-gray-600 px-5 py-2 rounded-xl text-sm">→ חזור</button>
              <button onClick={handleSubmit} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition">✅ אשר ושלח בקשה</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// PAGE: ORDERS
// ============================================================
function OrdersPage({ orders }) {
  const STATUS = {
    pending:   { label:"ממתין לאישור", cls:"bg-yellow-100 text-yellow-700" },
    accepted:  { label:"אושר",         cls:"bg-blue-100 text-blue-700"   },
    printing:  { label:"🖨️ בהדפסה",   cls:"bg-purple-100 text-purple-700"},
    completed: { label:"✅ הושלם",     cls:"bg-green-100 text-green-700" },
  };
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-black text-gray-900 mb-6">📋 ההזמנות שלי</h1>
        {orders.length === 0 ? (
          <div className="text-center py-20 text-gray-400"><div className="text-5xl mb-3">📭</div><p>אין הזמנות עדיין</p></div>
        ) : (
          <div className="space-y-4">
            {orders.map(o => {
              const s = STATUS[o.status] || STATUS.pending;
              return (
                <div key={o.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div><h3 className="font-bold text-gray-900">{o.itemName}</h3><p className="text-xs text-gray-400">{o.id} · {o.date}</p></div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${s.cls}`}>{s.label}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600 items-center mb-3">
                    <TierBadge tierId={o.tier} />
                    <span>👤 {o.printerName}</span>
                    <span>⚖️ {o.weight}גרם</span>
                    <span>⏱ {o.hours}שעות</span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-3 text-sm">
                    <span className="text-gray-400">כולל עמלה ₪{o.commission?.toFixed(2)}</span>
                    <span className="font-black text-indigo-600 text-base">₪{o.total?.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// PAGE: REGISTER PRINTER
// ============================================================
function RegisterPage({ setPage }) {
  const [form, setForm] = useState({ name:"", city:"", tierId:"standard", printerInfo:{ brand:"", model:"" }, materials:[], bio:"" });
  const [done, setDone] = useState(false);

  const tier = TIERS[form.tierId];
  const ready = form.name && form.city && form.printerInfo.brand && form.printerInfo.model;

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl p-10 shadow-lg text-center max-w-sm w-full">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-black mb-2">ברוך הבא!</h2>
          <p className="text-gray-500 text-sm mb-6">הפרופיל שלך עלה לאוויר — כשמגיעה הזמנה תקבל התראה.</p>
          <button onClick={() => setPage("marketplace")} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700">
            ראה את השוק
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-black text-gray-900 mb-1">➕ רשום את המדפסת שלך</h1>
        <p className="text-gray-500 text-sm mb-6">התחל לקבל הזמנות ולהרוויח — בלי עמלה ממך</p>
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">שם מלא *</label>
              <input className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                     value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">עיר מגורים *</label>
              <CityAutocomplete value={form.city} onChange={v => setForm({...form, city:v})} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">רמת האיכות שלך *</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(TIERS).map(t => (
                <button key={t.id} onClick={() => setForm({...form, tierId:t.id, printerInfo:{brand:"",model:""}, materials:[]})}
                        className={`p-3 rounded-xl border-2 text-right transition ${form.tierId===t.id ? `${t.borderColor} ${t.bgColor}` : "border-gray-200 hover:border-gray-300"}`}>
                  <div className={`font-bold text-sm ${form.tierId===t.id ? t.textColor : "text-gray-700"}`}>{t.emoji} {t.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{t.layerHeight}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">יצרן ודגם מדפסת *</label>
            <BrandModelSelect tierId={form.tierId} value={form.printerInfo}
                              onChange={v => setForm({...form, printerInfo:v, materials:[]})} />
          </div>

          {form.printerInfo.brand && (
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">חומרים זמינים</label>
              <div className="flex flex-wrap gap-2">
                {(PRINTER_BRANDS[form.printerInfo.brand]?.[form.tierId] ? TIERS[form.tierId].bestFor : []).length === 0
                  ? TIERS[form.tierId].bestFor.map(m => (
                      <button key={m} onClick={() => setForm(f => ({...f, materials: f.materials.includes(m) ? f.materials.filter(x=>x!==m) : [...f.materials, m]}))}
                              className={`px-3 py-1.5 rounded-full text-sm border-2 transition ${form.materials.includes(m) ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-300 text-gray-600 hover:border-indigo-400"}`}>
                        {m}
                      </button>
                    ))
                  : null
                }
                {["PLA","PLA+","PETG","ABS","ASA","TPU","Nylon","PETG-CF","PA-CF","שרף סטנדרטי","שרף ABS-like","שרף גמיש"]
                  .filter(m => {
                    const tierMats = { economy:["PLA"], standard:["PLA+","PETG","TPU"], quality:["ABS","ASA","PETG-CF","Nylon","PA-CF"], premium:["שרף סטנדרטי","שרף ABS-like","שרף גמיש"] };
                    return tierMats[form.tierId]?.includes(m);
                  })
                  .map(m => (
                    <button key={m} onClick={() => setForm(f => ({...f, materials: f.materials.includes(m) ? f.materials.filter(x=>x!==m) : [...f.materials, m]}))}
                            className={`px-3 py-1.5 rounded-full text-sm border-2 transition ${form.materials.includes(m) ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-300 text-gray-600 hover:border-indigo-400"}`}>
                      {m}
                    </button>
                  ))
                }
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">ביוגרפיה קצרה</label>
            <textarea className="w-full border rounded-xl px-4 py-2.5 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      placeholder="ספר על עצמך ועל ניסיון ההדפסה שלך..."
                      value={form.bio} onChange={e => setForm({...form, bio:e.target.value})} />
          </div>

          {form.printerInfo.brand && form.printerInfo.model && (
            <div className={`rounded-xl p-4 border-2 text-sm ${tier.bgColor} ${tier.borderColor}`}>
              <div className={`font-bold mb-1 ${tier.textColor}`}>💰 הרווח שלך — {form.printerInfo.brand} {form.printerInfo.model}</div>
              <div className="text-gray-600">
                ₪{tier.materialRate}/גרם + ₪{tier.machineRate}/שעה — ללא ניכוי.<br />
                לדוגמה 100גרם × 5שעות = <span className="font-bold">₪{(100*tier.materialRate + 5*tier.machineRate).toFixed(0)}</span> לכיסך.
              </div>
            </div>
          )}

          <button onClick={() => ready && setDone(true)}
                  className={`w-full py-3 rounded-xl text-white font-bold transition ${ready ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-300 cursor-not-allowed"}`}>
            ✅ רשום את המדפסת
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// APP SHELL
// ============================================================
export default function App() {
  const [page, setPage] = useState("home");
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  const [orders, setOrders] = useState(MOCK_ORDERS_INIT);
  const addOrder = o => setOrders(prev => [o, ...prev]);

  const nav = [
    { id:"home",       label:"בית" },
    { id:"marketplace",label:"🔍 מצא מדפיס" },
    { id:"request",    label:"🖨️ הדפס" },
    { id:"orders",     label:`📋 הזמנות${orders.length>0?` (${orders.length})`:""}` },
    { id:"register",   label:"➕ יש לי מדפסת" },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 flex-wrap">
          <button onClick={() => setPage("home")} className="text-xl font-black text-indigo-600 ml-4 flex-shrink-0">
            🖨️ PrintShare
          </button>
          <div className="flex gap-1 flex-wrap mr-auto">
            {nav.map(n => (
              <button key={n.id} onClick={() => setPage(n.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${page===n.id ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                {n.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {page === "home"        && <HomePage setPage={setPage} />}
      {page === "marketplace" && <MarketplacePage setPage={setPage} setSelectedPrinter={setSelectedPrinter} />}
      {page === "request"     && <RequestPage selectedPrinter={selectedPrinter} setPage={setPage} addOrder={addOrder} />}
      {page === "orders"      && <OrdersPage orders={orders} />}
      {page === "register"    && <RegisterPage setPage={setPage} />}
    </div>
  );
}
