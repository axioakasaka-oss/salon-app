import { useEffect, useState } from "react";
import { supabase } from "./supabase";

// ============================================================
// 定数
// ============================================================
const MANUAL_CATEGORIES = [
  { key: "施術",           label: "施術",           icon: "🧴" },
  { key: "ウィッグ",      label: "ウィッグ",      icon: "👩‍🦰" },
  { key: "薬剤",           label: "薬剤",           icon: "🧪" },
  { key: "店販商品",      label: "店販商品",      icon: "🛍" },
  { key: "接客",           label: "接客",           icon: "🤝" },
  { key: "カウンセリング", label: "カウンセリング", icon: "💬" },
  { key: "システム",      label: "システム",      icon: "⚙" },
];

const WORRIES = [
  { key: "抜け毛",              warn: false },
  { key: "薄毛",                warn: false },
  { key: "白髪",                warn: false },
  { key: "頭皮の乾燥・べたつき", warn: false },
  { key: "かゆみ・炎症",       warn: false },
  { key: "切れ毛・枝毛・ダメージ", warn: false },
  { key: "円形脱毛症・抜毛症",  warn: false },
  { key: "ウィッグ・エクステ相談", warn: false },
  { key: "抗がん剤治療中・前後", warn: true },
  { key: "アレルギー",         warn: false },
];

const MEDICAL = [
  { key: "皮膚科通院歴あり", warn: true  },
  { key: "自己免疫疾患",     warn: true  },
  { key: "甲状腺疾患",       warn: true  },
  { key: "貧血",             warn: true  },
  { key: "アレルギー体質",   warn: false },
  { key: "アトピー体質",     warn: false },
  { key: "服用薬あり",       warn: false },
];

const LIFESTYLE = [
  { key: "睡眠不足（6h未満）",    warn: false },
  { key: "運動不足",              warn: false },
  { key: "食事が偏りがち",        warn: false },
  { key: "ダイエット中・食事制限", warn: false },
  { key: "強いストレスを感じた",   warn: false },
  { key: "大きな環境変化があった", warn: false },
  { key: "冷え性",                warn: false },
  { key: "肩こりがひどい",        warn: false },
  { key: "朝シャンプーしている",  warn: false },
  { key: "喫煙習慣あり",          warn: true  },
];

const SINCE_OPTIONS = ["数カ月前", "半年〜1年前", "1〜3年前", "ずっと前から"];
const BIRTH_OPTIONS = ["あり", "なし"];
const CYCLE_OPTIONS = ["正常", "生理不順", "閉経"];
const GOAL_OPTIONS  = ["地毛でどうにかしたい", "増毛エクステを検討", "ウィッグを検討"];

// ============================================================
// カラー定数
// ============================================================
const C = {
  bg:          "#f9f7f4",
  surface:     "#ffffff",
  border:      "#e8ddd4",
  accent:      "#8b6842",
  accentLight: "#efe3d4",
  accentText:  "#6b4f30",
  text:        "#2c2420",
  textSub:     "#7a6a60",
  warn:        "#b04040",
  warnBg:      "#fdf2f2",
  warnBorder:  "#e8c5c5",
};

// ============================================================
// 提案ロジック
// ============================================================
function buildProposal(chips, singles) {
  const has = (k) => !!chips[k];
  const sg  = (g) => singles[g] || "";

  const warnings  = [];
  const causes    = [];
  const proposals = [];
  const talks     = [];

  if (has("抗がん剤治療中・前後")) {
    warnings.push("抗がん剤治療中・前後のお客様です。施術前に必ず医師への確認を推奨してください。");
  }
  if (has("皮膚科通院歴あり") || has("自己免疫疾患") || has("甲状腺疾患")) {
    warnings.push("医療的背景があります。施術内容について慎重にご確認ください。");
  }

  const isHormonal = sg("cycle") === "生理不順" || sg("cycle") === "閉経" || sg("birth") === "あり";

  if ((has("抜け毛") || has("薄毛")) && isHormonal) {
    causes.push("ホルモンバランスの変化（産後・更年期）による毛包の萎縮");
    proposals.push({ icon: "🔬", name: "幹細胞発毛メニュー", desc: "幹細胞培養液×エレクトロポレーションで毛包に直接アプローチ" });
    proposals.push({ icon: "💧", name: "ハーブフォンデュシャンプー", desc: "ミネラル×育毛ハーブで血行促進・抗酸化作用" });
    talks.push("「ホルモンバランスの変化による薄毛には、幹細胞培養液を使った発毛メニューが特に効果的です。毛包に直接アプローチするエレクトロポレーションと組み合わせることで、より高い効果が期待できます。」");
  } else if (has("抜け毛") || has("薄毛")) {
    causes.push("生活習慣・ストレスによる頭皮環境の悪化");
    proposals.push({ icon: "🔬", name: "幹細胞発毛メニュー", desc: "頭皮環境を整えながら発毛を促進" });
    talks.push("「生活習慣からくる薄毛には、頭皮環境を根本から整えることが大切です。幹細胞メニューで血行を促進しながら、ホームケアも一緒に見直しましょう。」");
  }

  if (has("頭皮の乾燥・べたつき") || has("かゆみ・炎症")) {
    causes.push("頭皮バリア機能の低下・皮脂バランスの乱れ");
    proposals.push({ icon: "🌿", name: "頭皮クレンジング", desc: "毛穴の汚れを浮き出させ頭皮環境をリセット" });
    talks.push("「頭皮の乾燥やべたつきは、毛穴詰まりや皮脂バランスの乱れが原因のことが多いです。まず頭皮クレンジングでリセットしましょう。」");
  }

  if (has("白髪")) {
    causes.push("メラノサイト機能の低下・栄養不足・ストレス");
    proposals.push({ icon: "✨", name: "白髪ケア・カラー提案", desc: "白髪を活かしたデザインカラー、または白髪染め" });
    talks.push("「白髪の原因は色素細胞の機能低下です。カラーで隠す方法と、白髪を活かしたデザインの2つの方向性をご提案できます。」");
  }

  if (has("切れ毛・枝毛・ダメージ")) {
    causes.push("髪のタンパク質・水分バランスの乱れ");
    proposals.push({ icon: "💎", name: "集中補修トリートメント", desc: "毛髪内部を補修してハリ・コシを回復" });
    talks.push("「切れ毛や枝毛は、髪内部のタンパク質が失われているサインです。集中トリートメントで補修しながらホームケアも見直しましょう。」");
  }

  if (has("ウィッグ・エクステ相談") || sg("goal") === "ウィッグを検討") {
    proposals.push({ icon: "👩‍🦰", name: "ウィッグカウンセリング", desc: "医療用・ファッション用ウィッグをご提案" });
    talks.push("「ウィッグは今とても自然なものが増えています。お客様のライフスタイルに合わせて最適なものをご提案できます。」");
  }

  if (sg("goal") === "増毛エクステを検討") {
    proposals.push({ icon: "💫", name: "増毛エクステ相談", desc: "自然な仕上がりの増毛エクステをご提案" });
  }

  const lifeKeys = ["睡眠不足（6h未満）", "強いストレスを感じた", "ダイエット中・食事制限", "冷え性"];
  const lifeFactors = lifeKeys.filter(has).map((k) =>
    k.replace("（6h未満）", "").replace("を感じた", "").replace("中・食事制限", "")
  );
  if (lifeFactors.length > 0) {
    causes.push(`生活習慣（${lifeFactors.join("・")}）による頭皮への血流低下`);
  }

  if (proposals.length === 0) {
    proposals.push({ icon: "💬", name: "詳細カウンセリング", desc: "お悩みに合わせた施術をご提案します" });
  }

  return { warnings, causes, proposals, talks };
}

// ============================================================
// カウンセリングビュー
// ============================================================
function CounselingView() {
  const [step, setStep]       = useState(1);
  const [chips, setChips]     = useState({});
  const [singles, setSingles] = useState({});
  const [result, setResult]   = useState(null);

  const toggleChip = (key) => setChips((p) => ({ ...p, [key]: !p[key] }));
  const setSingle  = (group, val) => setSingles((p) => ({ ...p, [group]: val }));
  const hasAnyWorry = Object.values(chips).some(Boolean);

  const goStep = (n) => {
    if (n === 4) setResult(buildProposal(chips, singles));
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setChips({}); setSingles({}); setResult(null); setStep(1);
  };

  const chipStyle = (on, warn) => ({
    display: "inline-block",
    padding: "7px 13px",
    borderRadius: 20,
    border: `1px solid ${on ? (warn ? C.warnBorder : C.accent) : (warn ? C.warnBorder : C.border)}`,
    background: on ? (warn ? C.warnBg : C.accentLight) : (warn ? "#fff8f8" : C.surface),
    color: on ? (warn ? C.warn : C.accentText) : (warn ? C.warn : C.textSub),
    cursor: "pointer",
    fontSize: 13,
    fontWeight: on ? 700 : 400,
    margin: "0 5px 7px 0",
    transition: "all 0.15s",
  });

  const card = {
    border: `1px solid ${C.border}`, borderRadius: 16,
    padding: "16px 18px", marginBottom: 12,
    background: C.surface, boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
  };
  const secLabel = { fontSize: 11, fontWeight: 700, color: C.textSub, letterSpacing: 0.5, marginBottom: 12 };
  const navRow   = { display: "flex", gap: 8, marginTop: 14 };
  const btnPri   = { flex: 1, padding: "12px 16px", borderRadius: 12, border: "none", background: C.accent, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" };
  const btnDis   = { flex: 1, padding: "12px 16px", borderRadius: 12, border: `1px solid ${C.border}`, background: "#ede8e2", color: C.textSub, fontSize: 14, cursor: "not-allowed" };
  const btnBack  = { padding: "12px 16px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.surface, color: C.textSub, fontSize: 14, cursor: "pointer" };

  // 進捗バー
  const Progress = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 18 }}>
      {[1, 2, 3, 4].map((n) => (
        <div key={n} style={{ display: "flex", alignItems: "center", flex: n < 4 ? "0 0 auto" : 1 }}>
          <div style={{
            width: 26, height: 26, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, flexShrink: 0,
            border: step === n ? `2px solid ${C.accent}` : `1px solid ${C.border}`,
            background: step > n ? C.accent : step === n ? C.surface : "#f5f0ea",
            color: step > n ? "#fff" : step === n ? C.accent : C.textSub,
            transition: "all 0.2s",
          }}>
            {step > n ? "✓" : n}
          </div>
          {n < 4 && (
            <div style={{ flex: 1, height: 1, minWidth: 20, background: step > n ? C.accent : C.border, transition: "background 0.2s" }} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <Progress />

      {/* STEP 1: お悩み */}
      {step === 1 && (
        <div>
          <div style={card}>
            <div style={secLabel}>STEP 1 · 本日のお悩み（複数選択可）</div>
            <div>
              {WORRIES.map((w) => (
                <span key={w.key} style={chipStyle(!!chips[w.key], w.warn)} onClick={() => toggleChip(w.key)}>
                  {w.key}
                </span>
              ))}
            </div>
          </div>
          <div style={card}>
            <div style={secLabel}>いつ頃から？</div>
            <div>
              {SINCE_OPTIONS.map((o) => (
                <span key={o} style={chipStyle(singles.since === o, false)} onClick={() => setSingle("since", o)}>
                  {o}
                </span>
              ))}
            </div>
          </div>
          <div style={navRow}>
            <button style={hasAnyWorry ? btnPri : btnDis} disabled={!hasAnyWorry} onClick={() => goStep(2)}>
              次へ →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: 医療・体質 */}
      {step === 2 && (
        <div>
          <div style={card}>
            <div style={secLabel}>STEP 2 · 医療・体質について</div>
            <div>
              {MEDICAL.map((m) => (
                <span key={m.key} style={chipStyle(!!chips[m.key], m.warn)} onClick={() => toggleChip(m.key)}>
                  {m.key}
                </span>
              ))}
            </div>
          </div>
          <div style={card}>
            <div style={secLabel}>女性ホルモン関連</div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: C.textSub, marginBottom: 6 }}>出産経験</div>
              <div>
                {BIRTH_OPTIONS.map((o) => (
                  <span key={o} style={chipStyle(singles.birth === o, false)} onClick={() => setSingle("birth", o)}>{o}</span>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: C.textSub, marginBottom: 6 }}>生理周期</div>
              <div>
                {CYCLE_OPTIONS.map((o) => (
                  <span key={o} style={chipStyle(singles.cycle === o, false)} onClick={() => setSingle("cycle", o)}>{o}</span>
                ))}
              </div>
            </div>
          </div>
          <div style={navRow}>
            <button style={btnBack} onClick={() => goStep(1)}>← 戻る</button>
            <button style={btnPri} onClick={() => goStep(3)}>次へ →</button>
          </div>
        </div>
      )}

      {/* STEP 3: 生活習慣 */}
      {step === 3 && (
        <div>
          <div style={card}>
            <div style={secLabel}>STEP 3 · 生活習慣チェック</div>
            <div>
              {LIFESTYLE.map((l) => (
                <span key={l.key} style={chipStyle(!!chips[l.key], l.warn)} onClick={() => toggleChip(l.key)}>
                  {l.key}
                </span>
              ))}
            </div>
          </div>
          <div style={card}>
            <div style={secLabel}>理想の状態</div>
            <div>
              {GOAL_OPTIONS.map((o) => (
                <span key={o} style={chipStyle(singles.goal === o, false)} onClick={() => setSingle("goal", o)}>{o}</span>
              ))}
            </div>
          </div>
          <div style={navRow}>
            <button style={btnBack} onClick={() => goStep(2)}>← 戻る</button>
            <button style={btnPri} onClick={() => goStep(4)}>提案を見る ✨</button>
          </div>
        </div>
      )}

      {/* STEP 4: 提案結果 */}
      {step === 4 && result && (
        <div>
          {result.warnings.length > 0 && (
            <div style={{ background: C.warnBg, border: `1px solid ${C.warnBorder}`, borderRadius: 14, padding: "12px 16px", marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: C.warn, fontWeight: 700, marginBottom: 6 }}>⚠ 注意事項</div>
              {result.warnings.map((w, i) => (
                <div key={i} style={{ fontSize: 13, color: C.warn, lineHeight: 1.7 }}>{w}</div>
              ))}
            </div>
          )}

          {result.causes.length > 0 && (
            <div style={{ ...card, background: "#faf8f5" }}>
              <div style={secLabel}>考えられる原因</div>
              {result.causes.map((c, i) => (
                <div key={i} style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 4 }}>・{c}</div>
              ))}
            </div>
          )}

          <div style={{ ...card, padding: 0, overflow: "hidden" }}>
            <div style={{ background: C.accent, color: "#fff", padding: "11px 16px", fontSize: 13, fontWeight: 700 }}>
              ✨ おすすめ施術提案
            </div>
            <div style={{ padding: "8px 16px" }}>
              {result.proposals.map((p, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  padding: "12px 0",
                  borderBottom: i < result.proposals.length - 1 ? `1px solid ${C.border}` : "none",
                }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                    {p.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{p.name}</div>
                    <div style={{ fontSize: 13, color: C.textSub, lineHeight: 1.6 }}>{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {result.talks.length > 0 && (
            <div style={{ ...card, borderLeft: `4px solid ${C.accent}`, borderRadius: "0 14px 14px 0", background: "#fdf8f4" }}>
              <div style={{ fontSize: 12, color: C.accent, fontWeight: 700, marginBottom: 8 }}>💬 説明トーク例</div>
              {result.talks.map((t, i) => (
                <div key={i} style={{ fontSize: 13, lineHeight: 1.9, marginBottom: 8 }}>{t}</div>
              ))}
            </div>
          )}

          <div style={navRow}>
            <button style={btnBack} onClick={() => goStep(3)}>← 戻る</button>
          </div>
          <button onClick={reset} style={{ display: "block", width: "100%", marginTop: 10, padding: "11px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.surface, color: C.textSub, fontSize: 13, cursor: "pointer" }}>
            ↺ 最初からやり直す
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// マニュアルビュー
// ============================================================
function ManualDetail({ manual, onClose }) {
  const card = { border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px 18px", marginBottom: 12, background: C.surface };
  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, color: C.textSub, marginBottom: 4 }}>{manual.category}</div>
          <h2 style={{ margin: 0, fontSize: 19, lineHeight: 1.5 }}>{manual.title}</h2>
          {manual.total_time && (
            <div style={{ display: "inline-block", marginTop: 8, padding: "4px 12px", borderRadius: 999, background: C.accentLight, color: C.accent, fontSize: 12, fontWeight: 700 }}>
              ⏱ {manual.total_time}
            </div>
          )}
        </div>
        <button onClick={onClose} style={{ padding: "8px 14px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, cursor: "pointer", fontSize: 13, flexShrink: 0, marginLeft: 12 }}>
          閉じる
        </button>
      </div>
      {manual.description && (
        <div style={{ marginBottom: 14, padding: "12px 14px", background: C.accentLight, borderRadius: 10 }}>
          <div style={{ fontSize: 12, color: C.accent, fontWeight: 700, marginBottom: 6 }}>概要</div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8 }}>{manual.description}</p>
        </div>
      )}
      {manual.content && (
        <div style={{ whiteSpace: "pre-line", lineHeight: 2, background: "#fafafa", padding: 16, borderRadius: 12, fontSize: 14, border: `1px solid ${C.border}` }}>
          {manual.content}
        </div>
      )}
    </div>
  );
}

function ManualView() {
  const [manuals, setManuals]               = useState([]);
  const [loading, setLoading]               = useState(true);
  const [activeCategory, setActiveCategory] = useState("施術");
  const [searchQuery, setSearchQuery]       = useState("");
  const [selectedManual, setSelectedManual] = useState(null);

  useEffect(() => { loadManuals(); }, []);

  async function loadManuals() {
    setLoading(true);
    const { data } = await supabase.from("manuals").select("*").order("title");
    setManuals(data || []);
    setLoading(false);
  }

  const filtered = searchQuery.trim()
    ? manuals.filter((m) => m.title?.includes(searchQuery) || m.description?.includes(searchQuery) || m.content?.includes(searchQuery))
    : manuals.filter((m) => m.category === activeCategory);

  const card     = { border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px 18px", marginBottom: 12, background: C.surface };
  const secLabel = { fontSize: 11, fontWeight: 700, color: C.textSub, letterSpacing: 0.5, marginBottom: 12 };

  if (selectedManual) return <ManualDetail manual={selectedManual} onClose={() => setSelectedManual(null)} />;

  return (
    <div>
      <div style={{ ...card, padding: "12px 14px" }}>
        <input
          type="text"
          placeholder="🔍  マニュアルを検索（タイトル・内容）"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, background: C.surface, color: C.text, outline: "none", boxSizing: "border-box" }}
        />
        {searchQuery && <div style={{ marginTop: 8, fontSize: 13, color: C.textSub }}>{filtered.length} 件見つかりました</div>}
      </div>

      {!searchQuery && (
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 12, scrollbarWidth: "none" }}>
          {MANUAL_CATEGORIES.map((cat) => {
            const active = activeCategory === cat.key;
            return (
              <button key={cat.key} onClick={() => { setActiveCategory(cat.key); setSelectedManual(null); }}
                style={{ flex: "0 0 auto", padding: "9px 13px", borderRadius: 12, border: `1px solid ${active ? C.accent : C.border}`, background: active ? C.accentLight : C.surface, cursor: "pointer", textAlign: "center", fontSize: 12, fontWeight: active ? 700 : 400, color: active ? C.accent : C.textSub, whiteSpace: "nowrap" }}>
                <div style={{ fontSize: 18, marginBottom: 3 }}>{cat.icon}</div>
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      <div style={card}>
        <div style={secLabel}>{searchQuery ? "検索結果" : `${activeCategory} マニュアル`}</div>
        {loading ? (
          <p style={{ color: C.textSub, fontSize: 14 }}>読み込み中...</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: C.textSub, fontSize: 14 }}>{searchQuery ? "該当するマニュアルがありません" : "このカテゴリのマニュアルはまだありません"}</p>
        ) : (
          filtered.map((m, i) => (
            <div key={m.id} style={{ borderTop: i > 0 ? `1px solid ${C.border}` : "none", paddingTop: i > 0 ? 16 : 0, marginTop: i > 0 ? 16 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  {searchQuery && <span style={{ display: "inline-block", fontSize: 11, padding: "2px 8px", borderRadius: 4, background: C.accentLight, color: C.accent, fontWeight: 700, marginBottom: 5 }}>{m.category}</span>}
                  <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.6, marginBottom: 4 }}>{m.title}</div>
                  {m.description && <div style={{ fontSize: 13, color: C.textSub, lineHeight: 1.6 }}>{m.description.length > 60 ? m.description.slice(0, 60) + "…" : m.description}</div>}
                  {m.total_time && <div style={{ marginTop: 5, fontSize: 12, color: C.accent }}>⏱ {m.total_time}</div>}
                </div>
                <button onClick={() => { setSelectedManual(m); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  style={{ padding: "8px 14px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, cursor: "pointer", fontSize: 13, flexShrink: 0 }}>
                  詳細 →
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ============================================================
// メインApp
// ============================================================
export default function App() {
  const [activeTab, setActiveTab] = useState("counseling");

  return (
    <div style={{ padding: "16px", fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif', background: C.bg, minHeight: "100vh", color: C.text, maxWidth: "860px", margin: "0 auto" }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 11, color: C.textSub, letterSpacing: 1, marginBottom: 3 }}>AXIO SALON</div>
        <h1 style={{ fontSize: "clamp(18px, 5vw, 26px)", margin: 0, lineHeight: 1.3 }}>スタッフ教育アプリ</h1>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 20, background: C.surface, padding: 5, borderRadius: 14, border: `1px solid ${C.border}` }}>
        {[{ key: "counseling", label: "💬 カウンセリング" }, { key: "manual", label: "📋 マニュアル" }].map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{ flex: 1, padding: "10px 8px", borderRadius: 10, border: "none", background: activeTab === tab.key ? C.accent : "transparent", color: activeTab === tab.key ? "#fff" : C.textSub, cursor: "pointer", fontSize: 13, fontWeight: activeTab === tab.key ? 700 : 400, transition: "all 0.15s" }}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "counseling" && <CounselingView />}
      {activeTab === "manual"     && <ManualView />}
    </div>
  );
}
