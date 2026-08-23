import { useEffect, useState } from "react";
import { supabase } from "./supabase";

// ============================================================
// ✏️ トーク文・メカニズムはここを書き換えてください
// ============================================================
const CAUSE_DATA = {

  ホルモン性薄毛: {
    icon: "🔬",
    title: "ホルモンバランスの変化による薄毛",
    sub: "産後・更年期・生理不順に多いパターン",
    mechanism: [
      "エストロゲン（女性ホルモン）が減少する",
      "毛包（毛が生える袋）への栄養供給が減り、毛が細くなる",
      "髪の成長期が短くなり、抜け毛が増える・ボリュームが落ちる",
    ],
    mechLabel: "なぜ薄毛になるのか — メカニズム",
    talkOpener: "産後や更年期のタイミングで薄毛を感じる方はとても多いんです。これはホルモンバランスの変化が原因で、髪への栄養が届きにくくなっているサインなんですね。",
    talkDeep: "女性ホルモンには髪を育てる働きがあって、それが減ると毛根が小さくなってしまいます。でも、適切なケアをすると毛根が復活してくる可能性もありますので、少しずつ頑張っていきましょう",
    talkPoints: ["共感ファースト", "原因を明確に", "希望を伝える"],
  },

  生活習慣薄毛: {
    icon: "🌿",
    title: "生活習慣・ストレスによる薄毛",
    sub: "睡眠不足・ストレス・食生活に多いパターン",
    mechanism: [
      "ストレス・睡眠不足・冷えで自律神経が乱れ血行が悪くなる",
      "頭皮への血流が減り、毛根に栄養・酸素が届かなくなる",
      "髪が細く弱くなり、抜け毛・ボリュームダウンにつながる",
    ],
    mechLabel: "なぜ髪に影響するのか — メカニズム",
    talkOpener: "髪って、体の中でも後回しにされやすい部分なんです。栄養や血液は、心臓や内臓など大切な臓器に優先的に送られて、頭皮まで届きにくくなるんですね。",
    talkDeep: "睡眠中に成長ホルモンが分泌されて、髪もその時間に育ちます。睡眠不足やストレスが続くと、その修復の時間が削られてしまうんです。",
    talkPoints: ["体全体との繋がりで話す", "睡眠の重要性", "生活改善を促す"],
  },

  頭皮トラブル: {
    icon: "💧",
    title: "頭皮バリア機能の低下",
    sub: "乾燥・べたつき・かゆみに多いパターン",
    mechanism: [
      "シャンプーの洗いすぎ・生活習慣の乱れで皮脂バランスが崩れる",
      "頭皮のバリア機能が低下し、外部刺激に敏感になる",
      "毛穴が詰まり、健康な髪が育ちにくい環境になる",
    ],
    mechLabel: "なぜ頭皮トラブルが起きるのか — メカニズム",
    talkOpener: "頭皮って実はお顔の皮膚と繋がっていて、同じようにデリケートなんです。乾燥やべたつきは、頭皮の防御機能が弱まっているサインなんですね。",
    talkDeep: "毛穴が皮脂や汚れで詰まると、髪の芽が出てくる出口が塞がれてしまいます。まず頭皮をきれいにリセットすることで、その後のケアの効果もぐっと上がりますよ。",
    talkPoints: ["身近な例えで説明", "毛穴詰まりを可視化", "ケアへ自然につなぐ"],
  },

  白髪: {
    icon: "✨",
    title: "メラノサイト機能の低下",
    sub: "白髪・色素低下に多いパターン",
    mechanism: [
      "ストレス・加齢・栄養不足でメラノサイト（色素細胞）が減少する",
      "髪に色をつけるメラニン色素が作られなくなる",
      "新しく生えてくる髪が白くなる",
    ],
    mechLabel: "なぜ白髪になるのか — メカニズム",
    talkOpener: "白髪は加齢だけでなく、ストレスや栄養不足でも出やすくなるんです。髪の色を作る細胞が少なくなってしまっているサインですね。",
    talkDeep: "一度白くなった髪を黒くするのは難しいのですが、これ以上増やさないためのケアはできます。カラーで隠す方法と、白髪を活かしたデザインの2つの方向性でご提案できますよ。",
    talkPoints: ["原因を正直に説明", "できることを提案", "デザインの選択肢を示す"],
  },

  ダメージ: {
    icon: "💎",
    title: "髪のタンパク質・水分バランスの乱れ",
    sub: "切れ毛・枝毛・ダメージに多いパターン",
    mechanism: [
      "カラー・パーマ・熱ダメージで髪内部のタンパク質が流出する",
      "髪のキューティクルが開いたまま水分が逃げやすくなる",
      "切れ毛・枝毛・パサつき・ツヤのなさにつながる",
    ],
    mechLabel: "なぜダメージが起きるのか — メカニズム",
    talkOpener: "切れ毛や枝毛は、髪の内側のタンパク質が失われているサインなんです。ちょうど、乾燥した木が割れやすくなるのと同じイメージですね。",
    talkDeep: "一度ダメージを受けた部分は元には戻りませんが、内部を補修することでこれ以上悪化させないことはできます。毎日のホームケアと合わせてケアしていきましょう。",
    talkPoints: ["例えを使って説明", "正直にダメージを伝える", "ホームケアへ誘導"],
  },

  血流低下: {
    icon: "🩸",
    title: "血流低下による栄養不足",
    sub: "冷え性・肩こり・運動不足に多いパターン",
    mechanism: [
      "冷え性・運動不足・肩こりで首・頭部の血流が低下する",
      "毛根への栄養・酸素の供給が不足する",
      "髪のハリ・コシがなくなり細毛・抜け毛につながる",
    ],
    mechLabel: "なぜ血流が関係するのか — メカニズム",
    talkOpener: "頭皮は体の一番上にあるので、血液が届きにくい場所なんです。冷え性や肩こりがある方は特に、頭皮まで栄養が行き渡りにくい状態になっています。",
    talkDeep: "頭皮マッサージや血行を促すシャンプーの使い方で、かなり改善できることが多いです。ホームケアとサロンケアを組み合わせて、継続することが大切ですね。",
    talkPoints: ["体の構造で説明", "具体的な改善策を示す", "継続の大切さを伝える"],
  },
};

// ============================================================
// 施術提案データ（追加・変更可能）
// ============================================================
const PROPOSAL_DATA = {
  幹細胞発毛メニュー: {
    icon: "🔬",
    desc: "幹細胞培養液×エレクトロポレーションで毛包に直接アプローチ",
  },
  ハーブフォンデュシャンプー: {
    icon: "💧",
    desc: "ミネラル×育毛ハーブで血行促進・抗酸化作用",
  },
  頭皮クレンジング: {
    icon: "🌿",
    desc: "毛穴の汚れを浮き出させ頭皮環境をリセット",
  },
  白髪ケアカラー提案: {
    icon: "✨",
    desc: "白髪を活かしたデザインカラー、または白髪染め",
  },
  集中補修トリートメント: {
    icon: "💎",
    desc: "毛髪内部を補修してハリ・コシを回復",
  },
  ウィッグカウンセリング: {
    icon: "👩‍🦰",
    desc: "医療用・ファッション用ウィッグをご提案",
  },
  増毛エクステ相談: {
    icon: "💫",
    desc: "自然な仕上がりの増毛エクステをご提案",
  },
};

// ============================================================
// カテゴリ・選択肢定数
// ============================================================
const MANUAL_CATEGORIES = [
  { key: "施術",           icon: "🧴" },
  { key: "ウィッグ",      icon: "👩‍🦰" },
  { key: "薬剤",           icon: "🧪" },
  { key: "店販商品",      icon: "🛍" },
  { key: "接客",           icon: "🤝" },
  { key: "カウンセリング", icon: "💬" },
  { key: "システム",      icon: "⚙" },
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
  const causeKeys = [];
  const proposals = [];

  if (has("抗がん剤治療中・前後"))
    warnings.push("抗がん剤治療中・前後のお客様です。施術前に必ず医師への確認を推奨してください。");
  if (has("皮膚科通院歴あり") || has("自己免疫疾患") || has("甲状腺疾患"))
    warnings.push("医療的背景があります。施術内容について慎重にご確認ください。");

  const isHormonal = sg("cycle") === "生理不順" || sg("cycle") === "閉経" || sg("birth") === "あり";

  if ((has("抜け毛") || has("薄毛")) && isHormonal) {
    causeKeys.push("ホルモン性薄毛");
    proposals.push("幹細胞発毛メニュー", "ハーブフォンデュシャンプー");
  } else if (has("抜け毛") || has("薄毛")) {
    causeKeys.push("生活習慣薄毛");
    proposals.push("幹細胞発毛メニュー");
  }

  if (has("頭皮の乾燥・べたつき") || has("かゆみ・炎症")) {
    causeKeys.push("頭皮トラブル");
    proposals.push("頭皮クレンジング");
  }

  if (has("白髪")) {
    causeKeys.push("白髪");
    proposals.push("白髪ケアカラー提案");
  }

  if (has("切れ毛・枝毛・ダメージ")) {
    causeKeys.push("ダメージ");
    proposals.push("集中補修トリートメント");
  }

  const hasBloodFlow = has("冷え性") || has("肩こりがひどい") || has("運動不足");
  if (hasBloodFlow) causeKeys.push("血流低下");

  if (has("ウィッグ・エクステ相談") || sg("goal") === "ウィッグを検討")
    proposals.push("ウィッグカウンセリング");
  if (sg("goal") === "増毛エクステを検討")
    proposals.push("増毛エクステ相談");

  const uniqueProposals = [...new Set(proposals)];
  if (uniqueProposals.length === 0) uniqueProposals.push("ウィッグカウンセリング");

  return { warnings, causeKeys, proposals: uniqueProposals };
}

// ============================================================
// 原因カードコンポーネント
// ============================================================
function CauseCard({ dataKey }) {
  const d = CAUSE_DATA[dataKey];
  if (!d) return null;

  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden", marginBottom: 14, background: C.surface, boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
      {/* ヘッダー */}
      <div style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, background: C.accentLight, flexShrink: 0 }}>
          {d.icon}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, lineHeight: 1.4 }}>{d.title}</div>
          <div style={{ fontSize: 12, color: C.textSub, marginTop: 2 }}>{d.sub}</div>
        </div>
      </div>

      <div style={{ padding: "14px 16px" }}>
        {/* メカニズム */}
        <div style={{ background: "#f7f4f0", borderRadius: 10, padding: "12px 14px", marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.textSub, letterSpacing: 0.5, marginBottom: 10 }}>
            {d.mechLabel}
          </div>
          {d.mechanism.map((step, i) => (
            <div key={i}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: C.accent, color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  {i + 1}
                </div>
                <div style={{ fontSize: 13, color: C.text, lineHeight: 1.7 }}>{step}</div>
              </div>
              {i < d.mechanism.length - 1 && (
                <div style={{ textAlign: "center", fontSize: 13, color: C.textSub, opacity: 0.4, margin: "2px 0 2px 30px" }}>↓</div>
              )}
            </div>
          ))}
        </div>

        {/* トークスクリプト */}
        <div style={{ borderLeft: `3px solid ${C.accent}`, background: "#fdf8f4", borderRadius: "0 10px 10px 0", padding: "12px 14px" }}>
          <div style={{ fontSize: 11, color: C.accent, fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}>
            💬 スタッフ説明トーク
          </div>
          <div style={{ fontSize: 11, color: C.textSub, fontWeight: 700, marginBottom: 5 }}>【切り出し方】</div>
          <div style={{ fontSize: 13, color: C.text, lineHeight: 1.9, marginBottom: 10 }}>
            「{d.talkOpener}」
          </div>
          <div style={{ fontSize: 11, color: C.textSub, fontWeight: 700, marginBottom: 5 }}>【深掘りトーク】</div>
          <div style={{ fontSize: 13, color: C.text, lineHeight: 1.9, marginBottom: 10 }}>
            「{d.talkDeep}」
          </div>
          <div>
            {d.talkPoints.map((p, i) => (
              <span key={i} style={{ display: "inline-block", background: C.accentLight, color: C.accentText, fontSize: 11, padding: "2px 9px", borderRadius: 10, margin: "0 4px 4px 0", fontWeight: 700 }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
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

  const reset = () => { setChips({}); setSingles({}); setResult(null); setStep(1); };

  const chipStyle = (on, warn) => ({
    display: "inline-block", padding: "7px 13px", borderRadius: 20, cursor: "pointer",
    border: `1px solid ${on ? (warn ? C.warnBorder : C.accent) : (warn ? C.warnBorder : C.border)}`,
    background: on ? (warn ? C.warnBg : C.accentLight) : (warn ? "#fff8f8" : C.surface),
    color: on ? (warn ? C.warn : C.accentText) : (warn ? C.warn : C.textSub),
    fontSize: 13, fontWeight: on ? 700 : 400, margin: "0 5px 7px 0", transition: "all 0.15s",
  });

  const card    = { border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px 18px", marginBottom: 12, background: C.surface, boxShadow: "0 2px 8px rgba(0,0,0,0.03)" };
  const secLbl  = { fontSize: 11, fontWeight: 700, color: C.textSub, letterSpacing: 0.5, marginBottom: 12 };
  const navRow  = { display: "flex", gap: 8, marginTop: 14 };
  const btnPri  = { flex: 1, padding: "12px 16px", borderRadius: 12, border: "none", background: C.accent, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" };
  const btnDis  = { flex: 1, padding: "12px 16px", borderRadius: 12, border: `1px solid ${C.border}`, background: "#ede8e2", color: C.textSub, fontSize: 14, cursor: "not-allowed" };
  const btnBack = { padding: "12px 16px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.surface, color: C.textSub, fontSize: 14, cursor: "pointer" };

  const Progress = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 18 }}>
      {[1, 2, 3, 4].map((n) => (
        <div key={n} style={{ display: "flex", alignItems: "center", flex: n < 4 ? "0 0 auto" : 1 }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, border: step === n ? `2px solid ${C.accent}` : `1px solid ${C.border}`, background: step > n ? C.accent : step === n ? C.surface : "#f5f0ea", color: step > n ? "#fff" : step === n ? C.accent : C.textSub, transition: "all 0.2s" }}>
            {step > n ? "✓" : n}
          </div>
          {n < 4 && <div style={{ flex: 1, height: 1, minWidth: 20, background: step > n ? C.accent : C.border, transition: "background 0.2s" }} />}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <Progress />

      {/* STEP 1 */}
      {step === 1 && (
        <div>
          <div style={card}>
            <div style={secLbl}>STEP 1 · 本日のお悩み（複数選択可）</div>
            <div>{WORRIES.map((w) => <span key={w.key} style={chipStyle(!!chips[w.key], w.warn)} onClick={() => toggleChip(w.key)}>{w.key}</span>)}</div>
          </div>
          <div style={card}>
            <div style={secLbl}>いつ頃から？</div>
            <div>{SINCE_OPTIONS.map((o) => <span key={o} style={chipStyle(singles.since === o, false)} onClick={() => setSingle("since", o)}>{o}</span>)}</div>
          </div>
          <div style={navRow}>
            <button style={hasAnyWorry ? btnPri : btnDis} disabled={!hasAnyWorry} onClick={() => goStep(2)}>次へ →</button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div>
          <div style={card}>
            <div style={secLbl}>STEP 2 · 医療・体質について</div>
            <div>{MEDICAL.map((m) => <span key={m.key} style={chipStyle(!!chips[m.key], m.warn)} onClick={() => toggleChip(m.key)}>{m.key}</span>)}</div>
          </div>
          <div style={card}>
            <div style={secLbl}>女性ホルモン関連</div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: C.textSub, marginBottom: 6 }}>出産経験</div>
              <div>{BIRTH_OPTIONS.map((o) => <span key={o} style={chipStyle(singles.birth === o, false)} onClick={() => setSingle("birth", o)}>{o}</span>)}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: C.textSub, marginBottom: 6 }}>生理周期</div>
              <div>{CYCLE_OPTIONS.map((o) => <span key={o} style={chipStyle(singles.cycle === o, false)} onClick={() => setSingle("cycle", o)}>{o}</span>)}</div>
            </div>
          </div>
          <div style={navRow}>
            <button style={btnBack} onClick={() => goStep(1)}>← 戻る</button>
            <button style={btnPri} onClick={() => goStep(3)}>次へ →</button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div>
          <div style={card}>
            <div style={secLbl}>STEP 3 · 生活習慣チェック</div>
            <div>{LIFESTYLE.map((l) => <span key={l.key} style={chipStyle(!!chips[l.key], l.warn)} onClick={() => toggleChip(l.key)}>{l.key}</span>)}</div>
          </div>
          <div style={card}>
            <div style={secLbl}>理想の状態</div>
            <div>{GOAL_OPTIONS.map((o) => <span key={o} style={chipStyle(singles.goal === o, false)} onClick={() => setSingle("goal", o)}>{o}</span>)}</div>
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
          {/* 警告 */}
          {result.warnings.length > 0 && (
            <div style={{ background: C.warnBg, border: `1px solid ${C.warnBorder}`, borderRadius: 14, padding: "12px 16px", marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: C.warn, fontWeight: 700, marginBottom: 6 }}>⚠ 注意事項</div>
              {result.warnings.map((w, i) => <div key={i} style={{ fontSize: 13, color: C.warn, lineHeight: 1.7 }}>{w}</div>)}
            </div>
          )}

          {/* 原因カード */}
          {result.causeKeys.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.textSub, letterSpacing: 0.5, marginBottom: 12 }}>考えられる原因</div>
              {result.causeKeys.map((key) => <CauseCard key={key} dataKey={key} />)}
            </div>
          )}

          {/* 施術提案 */}
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden", marginBottom: 14, background: C.surface }}>
            <div style={{ background: C.accent, color: "#fff", padding: "11px 16px", fontSize: 13, fontWeight: 700 }}>✨ おすすめ施術提案</div>
            <div style={{ padding: "8px 16px" }}>
              {result.proposals.map((name, i) => {
                const p = PROPOSAL_DATA[name] || { icon: "💬", desc: "" };
                return (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: i < result.proposals.length - 1 ? `1px solid ${C.border}` : "none" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{p.icon}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{name}</div>
                      <div style={{ fontSize: 13, color: C.textSub, lineHeight: 1.6 }}>{p.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
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
// ============================================================
// マニュアル詳細（HTML対応版）
// App.jsx の ManualDetail 関数をこれに差し替えてください
// ============================================================
function getFileType(url) {
  if (!url) return null;
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.toLowerCase().endsWith(".pdf") || url.includes("/storage/v1/object")) return "pdf";
  return "link";
}

function getYouTubeEmbedUrl(url) {
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  const longMatch = url.match(/[?&]v=([^?&]+)/);
  if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}`;
  return url;
}

function FileViewer({ url }) {
  const type = getFileType(url);
  if (!type) return null;
  const containerStyle = { marginTop: 14, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}` };
  if (type === "youtube") {
    return (
      <div style={containerStyle}>
        <div style={{ background: C.accentLight, padding: "8px 14px", fontSize: 12, color: C.accentText, fontWeight: 700 }}>▶ 動画マニュアル</div>
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
          <iframe src={getYouTubeEmbedUrl(url)} title="動画マニュアル" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
        </div>
      </div>
    );
  }
  if (type === "pdf") {
    return (
      <div style={containerStyle}>
        <div style={{ background: C.accentLight, padding: "8px 14px", fontSize: 12, color: C.accentText, fontWeight: 700 }}>📄 PDFマニュアル</div>
        <div style={{ padding: "14px 16px", background: C.surface }}>
          <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "10px 18px", borderRadius: 10, background: C.accent, color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>📄 PDFを開く</a>
          <div style={{ marginTop: 8, fontSize: 12, color: C.textSub }}>タップすると新しいタブで開きます</div>
        </div>
        <iframe src={url} title="PDFマニュアル" style={{ width: "100%", height: 500, border: "none", display: "block" }} />
      </div>
    );
  }
  return (
    <div style={{ marginTop: 14 }}>
      <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "10px 18px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, color: C.accent, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>🔗 ファイルを開く</a>
    </div>
  );
}function ManualDetail({ manual, onClose }) {
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
        <button onClick={onClose} style={{ padding: "8px 14px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, cursor: "pointer", fontSize: 13, flexShrink: 0, marginLeft: 12 }}>閉じる</button>
      </div>

      {manual.description && (
        <div style={{ marginBottom: 14, padding: "12px 14px", background: C.accentLight, borderRadius: 10 }}>
          <div style={{ fontSize: 12, color: C.accent, fontWeight: 700, marginBottom: 6 }}>概要</div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8 }}>{manual.description}</p>
        </div>
      )}

      {manual.content && (
        manual.is_html ? (
          // HTML表示モード
          <div
            style={{ fontSize: 14, lineHeight: 1.9, color: C.text }}
            dangerouslySetInnerHTML={{ __html: manual.content }}
          />
        ) : (
          // テキスト表示モード（従来通り）
          <div style={{ whiteSpace: "pre-line", lineHeight: 2, background: "#fafafa", padding: 16, borderRadius: 12, fontSize: 14, border: `1px solid ${C.border}`, marginBottom: 4 }}>
            {manual.content}
          </div>
        )
      )}

      {/* PDF・YouTube自動表示 */}
      <FileViewer url={manual.file_url} />
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

  const card    = { border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px 18px", marginBottom: 12, background: C.surface };
  const secLbl  = { fontSize: 11, fontWeight: 700, color: C.textSub, letterSpacing: 0.5, marginBottom: 12 };

  if (selectedManual) return <ManualDetail manual={selectedManual} onClose={() => setSelectedManual(null)} />;

  return (
    <div>
      <div style={{ ...card, padding: "12px 14px" }}>
        <input type="text" placeholder="🔍  マニュアルを検索（タイトル・内容）" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, background: C.surface, color: C.text, outline: "none", boxSizing: "border-box" }} />
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
                {cat.key}
              </button>
            );
          })}
        </div>
      )}

      <div style={card}>
        <div style={secLbl}>{searchQuery ? "検索結果" : `${activeCategory} マニュアル`}</div>
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
// Q&A・知識検索
// Supabase RPC: public.search_knowledge(search_text, limit)
// ============================================================
function KnowledgeSearchView() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  async function search() {
    const text = query.trim();
    if (!text) return;
    setLoading(true);
    setError("");
    setSearched(true);
    setSelected(null);
    const { data, error: rpcError } = await supabase.rpc("search_knowledge", {
      p_search_text: text,
      p_limit: 20,
    });
    if (rpcError) {
      setResults([]);
      setError("検索に失敗しました。Supabaseのsearch_knowledge設定を確認してください。");
    } else {
      setResults(data || []);
    }
    setLoading(false);
  }

  async function copyText(text, label = "回答") {
    try {
      await navigator.clipboard.writeText(text || "");
      window.alert(`${label}をコピーしました`);
    } catch {
      window.alert("コピーできませんでした。文章を選択してコピーしてください。");
    }
  }

  const card = { border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px 18px", marginBottom: 12, background: C.surface };

  if (selected) {
    return (
      <div>
        <button onClick={() => setSelected(null)} style={{ ...btnSearchBack }}>← 検索結果に戻る</button>
        <div style={card}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
            <span style={resultBadge(selected.result_type)}>{selected.result_type}</span>
            {selected.category && <span style={{ fontSize: 12, color: C.textSub }}>{selected.category}</span>}
          </div>
          <h2 style={{ margin: "0 0 16px", fontSize: 19, lineHeight: 1.6 }}>{selected.title}</h2>
          <div style={{ background: "#fdf8f4", borderLeft: `3px solid ${C.accent}`, borderRadius: "0 10px 10px 0", padding: "14px", marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: C.accent, fontWeight: 700, marginBottom: 7 }}>AXIO公式情報</div>
            <div style={{ whiteSpace: "pre-line", fontSize: 14, lineHeight: 1.9 }}>{selected.body || "回答本文が登録されていません。"}</div>
          </div>
          <button onClick={() => copyText(selected.body, "回答")} style={copyButton}>📋 回答をコピー</button>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.border}`, fontSize: 12, color: C.textSub, lineHeight: 1.8 }}>
            ※ この画面の情報を基準にお客様へご案内してください。医療的な判断が必要な内容は断定せず、必要に応じて医療機関への相談を案内してください。
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ ...card, padding: 18 }}>
        <div style={{ fontSize: 11, color: C.accent, fontWeight: 700, letterSpacing: 0.5, marginBottom: 6 }}>STAFF KNOWLEDGE</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 7 }}>🔍 お客様から聞かれたことを検索</div>
        <div style={{ fontSize: 13, color: C.textSub, lineHeight: 1.7, marginBottom: 14 }}>LINE・電話・接客中に分からないことを、そのまま文章で入力してください。</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") search(); }}
            placeholder="例：最近抜け毛が増えて幹細胞をすすめていい？"
            style={{ flex: 1, minWidth: 0, padding: "12px 14px", borderRadius: 11, border: `1px solid ${C.border}`, fontSize: 14, background: C.surface, color: C.text, outline: "none" }}
          />
          <button onClick={search} disabled={!query.trim() || loading} style={query.trim() && !loading ? searchButton : searchButtonDisabled}>{loading ? "検索中…" : "検索"}</button>
        </div>
        <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {["抜け毛　幹細胞", "カラー　頭皮　しみる", "更年期　薄毛", "ウィッグ　相談"].map((x) => (
            <button key={x} onClick={() => setQuery(x)} style={quickSearch}>{x}</button>
          ))}
        </div>
      </div>

      {error && <div style={{ ...card, color: C.warn, background: C.warnBg, borderColor: C.warnBorder }}>{error}</div>}

      {searched && !loading && !error && (
        <div style={card}>
          <div style={{ fontSize: 12, color: C.textSub, marginBottom: 12 }}>{results.length} 件の知識が見つかりました</div>
          {results.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 10px", color: C.textSub }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🔎</div>
              <div style={{ fontWeight: 700, color: C.text, marginBottom: 6 }}>回答が見つかりませんでした</div>
              <div style={{ fontSize: 13, lineHeight: 1.7 }}>キーワードを変えて検索してください。今後「Q&A追加リクエスト」機能も追加できます。</div>
            </div>
          ) : results.map((r, i) => (
            <button key={`${r.result_type}-${r.id}-${i}`} onClick={() => setSelected(r)} style={{ width: "100%", textAlign: "left", border: 0, borderTop: i ? `1px solid ${C.border}` : "none", background: "transparent", padding: "14px 0", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                <span style={resultBadge(r.result_type)}>{r.result_type}</span>
                {r.category && <span style={{ fontSize: 11, color: C.textSub }}>{r.category}</span>}
                {r.keyword_matches > 0 && <span style={{ marginLeft: "auto", fontSize: 11, color: C.accent }}>関連度 {r.keyword_matches}</span>}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, lineHeight: 1.6 }}>{r.title}</div>
              {r.body && <div style={{ marginTop: 4, fontSize: 12, color: C.textSub, lineHeight: 1.7 }}>{r.body.length > 120 ? r.body.slice(0, 120) + "…" : r.body}</div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const searchButton = { padding: "11px 16px", borderRadius: 11, border: "none", background: C.accent, color: "#fff", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" };
const searchButtonDisabled = { ...searchButton, background: "#d8d0c8", cursor: "not-allowed" };
const btnSearchBack = { padding: "9px 13px", marginBottom: 12, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, color: C.textSub, cursor: "pointer" };
const copyButton = { padding: "10px 14px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, color: C.accent, fontWeight: 700, cursor: "pointer" };
const quickSearch = { padding: "6px 9px", borderRadius: 999, border: `1px solid ${C.border}`, background: C.surface, color: C.textSub, fontSize: 11, cursor: "pointer" };
function resultBadge(type) { return { display: "inline-block", padding: "3px 8px", borderRadius: 6, background: type === "Q&A" ? C.accentLight : "#f0eee9", color: type === "Q&A" ? C.accent : C.textSub, fontSize: 10, fontWeight: 700 }; }

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
        {[{ key: "knowledge", label: "🔍 Q&A検索" }, { key: "counseling", label: "💬 カウンセリング" }, { key: "manual", label: "📋 マニュアル" }].map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{ flex: 1, padding: "10px 8px", borderRadius: 10, border: "none", background: activeTab === tab.key ? C.accent : "transparent", color: activeTab === tab.key ? "#fff" : C.textSub, cursor: "pointer", fontSize: 13, fontWeight: activeTab === tab.key ? 700 : 400, transition: "all 0.15s" }}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === "knowledge" && <KnowledgeSearchView />}
      {activeTab === "counseling" && <CounselingView />}
      {activeTab === "manual"     && <ManualView />}
    </div>
  );
}
