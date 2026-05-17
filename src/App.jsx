import { useEffect, useState } from "react";
import { supabase } from "./supabase";

// ============================================================
// 定数
// ============================================================
const MANUAL_CATEGORIES = [
  { key: "施術",        label: "施術",        icon: "🧴" },
  { key: "ウィッグ",   label: "ウィッグ",   icon: "👩‍🦰" },
  { key: "薬剤",        label: "薬剤",        icon: "🧪" },
  { key: "店販商品",   label: "店販商品",   icon: "🛍" },
  { key: "接客",        label: "接客",        icon: "🤝" },
  { key: "カウンセリング", label: "カウンセリング", icon: "💬" },
  { key: "システム",   label: "システム",   icon: "⚙" },
];

// ============================================================
// スタイル定数
// ============================================================
const C = {
  bg:        "#f9f7f4",
  surface:   "#ffffff",
  border:    "#e8ddd4",
  accent:    "#8b6842",
  accentLight: "#efe3d4",
  text:      "#2c2420",
  textSub:   "#7a6a60",
  green:     "#3a7a58",
  greenBg:   "#f0f8f3",
  greenBorder:"#c5e0d0",
  red:       "#b04040",
  redBg:     "#fdf2f2",
  redBorder: "#e8c5c5",
};

const s = {
  layout: {
    padding: "16px",
    fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
    background: C.bg,
    minHeight: "100vh",
    color: C.text,
    maxWidth: "860px",
    margin: "0 auto",
  },
  card: {
    border: `1px solid ${C.border}`,
    borderRadius: 16,
    padding: "20px 18px",
    marginBottom: 16,
    background: C.surface,
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: C.textSub,
    letterSpacing: 0.5,
    marginBottom: 14,
    textTransform: "uppercase",
  },
  btn: {
    padding: "12px 16px",
    borderRadius: 12,
    border: `1px solid ${C.border}`,
    background: C.surface,
    cursor: "pointer",
    fontSize: 15,
    lineHeight: 1.5,
    minHeight: 48,
    width: "100%",
    textAlign: "left",
    color: C.text,
    transition: "all 0.15s",
  },
  btnActive: {
    background: C.accentLight,
    border: `1px solid ${C.accent}`,
    color: C.accent,
    fontWeight: 700,
  },
  btnPrimary: {
    padding: "13px 16px",
    borderRadius: 12,
    border: "none",
    background: C.accent,
    color: "#fff",
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 700,
    minHeight: 48,
    width: "100%",
  },
  btnSmall: {
    padding: "8px 14px",
    borderRadius: 10,
    border: `1px solid ${C.border}`,
    background: C.surface,
    cursor: "pointer",
    fontSize: 13,
    color: C.text,
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 12,
    border: `1px solid ${C.border}`,
    fontSize: 15,
    background: C.surface,
    color: C.text,
    outline: "none",
    boxSizing: "border-box",
  },
  tag: {
    display: "inline-block",
    fontSize: 11,
    padding: "3px 8px",
    borderRadius: 4,
    fontWeight: 600,
    letterSpacing: 0.3,
  },
};

// ============================================================
// サブコンポーネント
// ============================================================

/** トップナビゲーション */
function NavTabs({ active, onChange }) {
  const tabs = [
    { key: "counseling", label: "カウンセリング", icon: "💬" },
    { key: "manual",     label: "マニュアル",     icon: "📋" },
  ];
  return (
    <div style={{
      display: "flex",
      gap: 8,
      marginBottom: 24,
      background: C.surface,
      padding: 6,
      borderRadius: 16,
      border: `1px solid ${C.border}`,
    }}>
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          style={{
            flex: 1,
            padding: "11px 8px",
            borderRadius: 11,
            border: "none",
            background: active === t.key ? C.accent : "transparent",
            color: active === t.key ? "#fff" : C.textSub,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: active === t.key ? 700 : 500,
            transition: "all 0.15s",
          }}
        >
          {t.icon} {t.label}
        </button>
      ))}
    </div>
  );
}

/** YES/NO ボタン */
function YesNoButtons({ branchId, answer, onAnswer }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
      {[
        { val: "yes", label: "はい ✓",  bg: C.greenBg,  border: C.green,  color: C.green },
        { val: "no",  label: "いいえ ✗", bg: C.redBg,    border: C.red,    color: C.red   },
      ].map(opt => (
        <button
          key={opt.val}
          onClick={() => onAnswer(branchId, opt.val)}
          style={{
            ...s.btn,
            textAlign: "center",
            fontWeight: 600,
            background: answer === opt.val ? opt.bg : C.surface,
            borderColor: answer === opt.val ? opt.border : C.border,
            color: answer === opt.val ? opt.color : C.textSub,
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/** 結果ボックス */
function ResultBox({ color, title, cause, proposal }) {
  const isGreen = color === "green";
  return (
    <div style={{
      background: isGreen ? C.greenBg : C.redBg,
      border: `1px solid ${isGreen ? C.greenBorder : C.redBorder}`,
      borderRadius: 12,
      padding: "14px 16px",
      marginTop: 4,
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: isGreen ? C.green : C.red, marginBottom: 10 }}>
        {isGreen ? "✓ はい の場合" : "✗ いいえ の場合"}
      </div>
      {cause && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, color: C.textSub, marginBottom: 4 }}>原因候補</div>
          <div style={{ fontSize: 14, lineHeight: 1.8 }}>{cause}</div>
        </div>
      )}
      {proposal && (
        <div>
          <div style={{ fontSize: 12, color: C.textSub, marginBottom: 4 }}>おすすめ対応</div>
          <div style={{ fontSize: 14, lineHeight: 1.8 }}>{proposal}</div>
        </div>
      )}
    </div>
  );
}

/** マニュアルカテゴリタブ */
function ManualCategoryTabs({ active, onChange }) {
  return (
    <div style={{
      display: "flex",
      gap: 8,
      overflowX: "auto",
      paddingBottom: 8,
      marginBottom: 18,
      scrollbarWidth: "none",
    }}>
      {MANUAL_CATEGORIES.map(cat => {
        const isActive = active === cat.key;
        return (
          <button
            key={cat.key}
            onClick={() => onChange(cat.key)}
            style={{
              flex: "0 0 auto",
              padding: "10px 14px",
              borderRadius: 12,
              border: `1px solid ${isActive ? C.accent : C.border}`,
              background: isActive ? C.accentLight : C.surface,
              cursor: "pointer",
              textAlign: "center",
              fontSize: 13,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? C.accent : C.textSub,
              transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: 18, display: "block", marginBottom: 3 }}>{cat.icon}</span>
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}

/** マニュアル詳細 - 汎用 */
function ManualDetail({ manual, onClose }) {
  return (
    <div style={s.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, color: C.textSub, marginBottom: 4 }}>{manual.category}</div>
          <h2 style={{ margin: 0, fontSize: 20, lineHeight: 1.5 }}>{manual.title}</h2>
          {manual.total_time && (
            <div style={{
              display: "inline-block",
              marginTop: 8,
              padding: "4px 12px",
              borderRadius: 999,
              background: C.accentLight,
              color: C.accent,
              fontSize: 13,
              fontWeight: 700,
            }}>
              ⏱ {manual.total_time}
            </div>
          )}
        </div>
        <button onClick={onClose} style={{ ...s.btnSmall, flexShrink: 0, marginLeft: 12 }}>閉じる</button>
      </div>

      {manual.description && (
        <div style={{ marginBottom: 16, padding: "12px 14px", background: C.accentLight, borderRadius: 10 }}>
          <div style={{ fontSize: 12, color: C.accent, fontWeight: 700, marginBottom: 6 }}>概要</div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8 }}>{manual.description}</p>
        </div>
      )}

      {manual.content && (
        <div style={{
          whiteSpace: "pre-line",
          lineHeight: 2,
          background: "#fafafa",
          padding: 16,
          borderRadius: 12,
          fontSize: 14,
          border: `1px solid ${C.border}`,
        }}>
          {manual.content}
        </div>
      )}
    </div>
  );
}

// ============================================================
// カウンセリング画面
// ============================================================
function CounselingView() {
  const [topics, setTopics] = useState([]);
  const [selected, setSelected] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [branches, setBranches] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadTopics(); }, []);

  async function loadTopics() {
    const { data } = await supabase
      .from("counseling_topics")
      .select("*")
      .eq("category", "カウンセリング")
      .order("sort_order");
    setTopics(data || []);
  }

  async function selectTopic(topic) {
    setSelected(topic);
    setAnswers({});
    setLoading(true);

    const [qRes, sRes, bRes] = await Promise.all([
      supabase.from("counseling_questions").select("*").eq("topic_id", topic.id).order("sort_order"),
      supabase.from("counseling_suggestions").select("*").eq("topic_id", topic.id).order("sort_order"),
      supabase.from("counseling_branches").select("*").eq("topic_id", topic.id).order("sort_order"),
    ]);

    setQuestions(qRes.data || []);
    setSuggestions(sRes.data || []);
    setBranches(bRes.data || []);
    setLoading(false);

    setTimeout(() => {
      document.getElementById("counseling-detail")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  return (
    <div>
      {/* お悩み選択 */}
      <div style={s.card}>
        <div style={s.sectionTitle}>お悩みを選択</div>
        {topics.length === 0 ? (
          <p style={{ color: C.textSub, fontSize: 14 }}>データを読み込み中...</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
            {topics.map(t => (
              <button
                key={t.id}
                onClick={() => selectTopic(t)}
                style={{ ...s.btn, ...(selected?.id === t.id ? s.btnActive : {}) }}
              >
                {t.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 詳細エリア */}
      {loading && (
        <div style={{ ...s.card, textAlign: "center", color: C.textSub, padding: 32 }}>
          読み込み中...
        </div>
      )}

      {selected && !loading && (
        <div id="counseling-detail">
          {/* 選択中のお悩み */}
          <div style={{ ...s.card, borderLeft: `4px solid ${C.accent}` }}>
            <div style={s.sectionTitle}>選択中のお悩み</div>
            <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.5 }}>{selected.name}</div>
          </div>

          {/* 確認質問 */}
          {questions.length > 0 && (
            <div style={s.card}>
              <div style={s.sectionTitle}>確認質問</div>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                {questions.map(q => (
                  <li key={q.id} style={{ marginBottom: 10, fontSize: 15, lineHeight: 1.8 }}>
                    {q.question}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* YES / NO 分岐 */}
          {branches.length > 0 && (
            <div style={s.card}>
              <div style={s.sectionTitle}>YES / NO 分岐</div>
              {branches.map((b, i) => (
                <div key={b.id} style={{ borderTop: i > 0 ? `1px solid ${C.border}` : "none", paddingTop: i > 0 ? 20 : 0, marginTop: i > 0 ? 20 : 0 }}>
                  <p style={{ fontWeight: 700, marginBottom: 12, lineHeight: 1.8, fontSize: 15 }}>{b.question}</p>
                  <YesNoButtons branchId={b.id} answer={answers[b.id]} onAnswer={(id, val) => setAnswers(prev => ({ ...prev, [id]: val }))} />
                  {answers[b.id] === "yes" && <ResultBox color="green" cause={b.yes_result} proposal={b.yes_proposal} />}
                  {answers[b.id] === "no"  && <ResultBox color="red"   cause={b.no_result}  proposal={b.no_proposal}  />}
                </div>
              ))}
            </div>
          )}

          {/* 基本の原因と提案 */}
          {suggestions.length > 0 && (
            <div style={s.card}>
              <div style={s.sectionTitle}>基本の原因と提案</div>
              {suggestions.map((s2, i) => (
                <div key={s2.id} style={{ borderTop: i > 0 ? `1px solid ${C.border}` : "none", paddingTop: i > 0 ? 20 : 0, marginTop: i > 0 ? 20 : 0 }}>
                  {s2.cause_hypothesis && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 12, color: C.textSub, marginBottom: 4, fontWeight: 700 }}>原因</div>
                      <div style={{ fontSize: 15, lineHeight: 1.8 }}>{s2.cause_hypothesis}</div>
                    </div>
                  )}
                  {s2.proposal_menu && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 12, color: C.textSub, marginBottom: 4, fontWeight: 700 }}>おすすめ施術</div>
                      <div style={{ fontSize: 15, lineHeight: 1.8 }}>{s2.proposal_menu}</div>
                    </div>
                  )}
                  {s2.talk_script && (
                    <div style={{ marginBottom: 14, padding: "12px 14px", background: C.accentLight, borderRadius: 10 }}>
                      <div style={{ fontSize: 12, color: C.accent, fontWeight: 700, marginBottom: 6 }}>💬 説明トーク</div>
                      <div style={{ fontSize: 14, lineHeight: 1.9 }}>{s2.talk_script}</div>
                    </div>
                  )}
                  {s2.caution && (
                    <div style={{ padding: "10px 14px", background: "#fffbf0", borderRadius: 10, border: "1px solid #f0e0a0" }}>
                      <div style={{ fontSize: 12, color: "#8a7020", fontWeight: 700, marginBottom: 6 }}>⚠ 注意点</div>
                      <div style={{ fontSize: 14, lineHeight: 1.8 }}>{s2.caution}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// マニュアル画面
// ============================================================
function ManualView() {
  const [manuals, setManuals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("施術");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedManual, setSelectedManual] = useState(null);

  useEffect(() => { loadManuals(); }, []);

  async function loadManuals() {
    setLoading(true);
    const { data } = await supabase.from("manuals").select("*").order("title");
    setManuals(data || []);
    setLoading(false);
  }

  // 検索 or カテゴリフィルター
  const filtered = searchQuery.trim()
    ? manuals.filter(m =>
        m.title?.includes(searchQuery) ||
        m.description?.includes(searchQuery) ||
        m.content?.includes(searchQuery)
      )
    : manuals.filter(m => m.category === activeCategory);

  if (selectedManual) {
    return <ManualDetail manual={selectedManual} onClose={() => setSelectedManual(null)} />;
  }

  return (
    <div>
      {/* 検索バー */}
      <div style={{ ...s.card, padding: "14px 16px" }}>
        <input
          type="text"
          placeholder="🔍  マニュアルを検索（タイトル・内容）"
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); }}
          style={s.input}
        />
        {searchQuery && (
          <div style={{ marginTop: 8, fontSize: 13, color: C.textSub }}>
            {filtered.length} 件見つかりました
          </div>
        )}
      </div>

      {/* カテゴリタブ（検索中は非表示） */}
      {!searchQuery && (
        <ManualCategoryTabs active={activeCategory} onChange={cat => { setActiveCategory(cat); setSelectedManual(null); }} />
      )}

      {/* マニュアル一覧 */}
      <div style={s.card}>
        <div style={s.sectionTitle}>
          {searchQuery ? `検索結果` : `${activeCategory} マニュアル`}
        </div>

        {loading ? (
          <p style={{ color: C.textSub, fontSize: 14 }}>読み込み中...</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: C.textSub, fontSize: 14 }}>
            {searchQuery ? "該当するマニュアルがありません" : "このカテゴリのマニュアルはまだありません"}
          </p>
        ) : (
          filtered.map((m, i) => (
            <div
              key={m.id}
              style={{
                borderTop: i > 0 ? `1px solid ${C.border}` : "none",
                paddingTop: i > 0 ? 18 : 0,
                marginTop: i > 0 ? 18 : 0,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  {searchQuery && (
                    <span style={{ ...s.tag, background: C.accentLight, color: C.accent, marginBottom: 6 }}>
                      {m.category}
                    </span>
                  )}
                  <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.6, marginBottom: 6 }}>{m.title}</div>
                  {m.description && (
                    <div style={{ fontSize: 13, color: C.textSub, lineHeight: 1.7 }}>
                      {m.description.length > 60 ? m.description.slice(0, 60) + "…" : m.description}
                    </div>
                  )}
                  {m.total_time && (
                    <div style={{ marginTop: 6, fontSize: 12, color: C.accent }}>⏱ {m.total_time}</div>
                  )}
                </div>
                <button
                  onClick={() => { setSelectedManual(m); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  style={{ ...s.btnSmall, flexShrink: 0 }}
                >
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
    <div style={s.layout}>
      {/* ヘッダー */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: C.textSub, letterSpacing: 1, marginBottom: 4 }}>AXIO SALON</div>
        <h1 style={{ fontSize: "clamp(20px, 5vw, 28px)", margin: 0, lineHeight: 1.3 }}>
          スタッフ教育アプリ
        </h1>
      </div>

      {/* ナビゲーション */}
      <NavTabs active={activeTab} onChange={setActiveTab} />

      {/* 画面切り替え */}
      {activeTab === "counseling" && <CounselingView />}
      {activeTab === "manual"     && <ManualView />}
    </div>
  );
}
