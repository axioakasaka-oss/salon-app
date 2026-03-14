import { useEffect, useState } from "react";
import { supabase } from "./supabase";

const MANUAL_CATEGORIES = [
  { key: "施術", label: "施術マニュアル", icon: "🧴" },
  { key: "薬剤", label: "使用薬剤", icon: "🧪" },
  { key: "店販商品", label: "店販商品", icon: "🛍" },
  { key: "接客", label: "接客", icon: "🤝" },
  { key: "カウンセリング", label: "カウンセリング", icon: "💬" },
  { key: "システム", label: "システム", icon: "⚙" },
];

export default function App() {
  const [topics, setTopics] = useState([]);
  const [selected, setSelected] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [branches, setBranches] = useState([]);
  const [answers, setAnswers] = useState({});
  const [manuals, setManuals] = useState([]);
  const [showManuals, setShowManuals] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedManual, setSelectedManual] = useState(null);
  const [activeManualCategory, setActiveManualCategory] = useState("施術");

  useEffect(() => {
    loadTopics();
  }, []);

  async function loadTopics() {
    const { data, error } = await supabase
      .from("counseling_topics")
      .select("*")
      .eq("category", "カウンセリング")
      .order("sort_order");

    if (error) {
      console.error("topics error:", error);
      setTopics([]);
      return;
    }

    setTopics(data || []);
  }

  async function selectTopic(topic) {
    setSelected(topic);
    setLoading(true);
    setAnswers({});
    setShowManuals(false);
    setManuals([]);
    setSelectedManual(null);
    setActiveManualCategory("施術");

    const [questionsRes, suggestionsRes, branchesRes] = await Promise.all([
      supabase
        .from("counseling_questions")
        .select("*")
        .eq("topic_id", topic.id)
        .order("sort_order"),

      supabase
        .from("counseling_suggestions")
        .select("*")
        .eq("topic_id", topic.id)
        .order("sort_order"),

      supabase
        .from("counseling_branches")
        .select("*")
        .eq("topic_id", topic.id)
        .order("sort_order"),
    ]);

    setQuestions(questionsRes.error ? [] : questionsRes.data || []);
    setSuggestions(suggestionsRes.error ? [] : suggestionsRes.data || []);
    setBranches(branchesRes.error ? [] : branchesRes.data || []);

    if (questionsRes.error) console.error(questionsRes.error);
    if (suggestionsRes.error) console.error(suggestionsRes.error);
    if (branchesRes.error) console.error(branchesRes.error);

    setLoading(false);
  }

  async function loadManuals() {
    setShowManuals(true);
    setSelectedManual(null);

    const { data, error } = await supabase
      .from("manuals")
      .select("*")
      .order("title");

    if (error) {
      console.error("manuals error:", error);
      setManuals([]);
      return;
    }

    setManuals(data || []);
  }

  function setAnswer(branchId, value) {
    setAnswers((prev) => ({
      ...prev,
      [branchId]: value,
    }));
  }

  function openManual(manual) {
    setSelectedManual(manual);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  function closeManual() {
    setSelectedManual(null);
  }

  const layoutStyle = {
    padding: "16px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
    background: "#f9f7f4",
    minHeight: "100vh",
    color: "#2c2420",
    maxWidth: "860px",
    margin: "0 auto",
  };

  const headingStyle = {
    fontSize: "clamp(24px, 5vw, 32px)",
    marginBottom: "24px",
    lineHeight: 1.3,
  };

  const subHeadingStyle = {
    marginBottom: 16,
    fontSize: "clamp(18px, 4vw, 22px)",
  };

  const buttonStyle = {
    padding: "12px 16px",
    borderRadius: 12,
    border: "1px solid #d8c7b3",
    background: "#fff",
    cursor: "pointer",
    fontSize: 16,
    lineHeight: 1.4,
    minHeight: 48,
    width: "100%",
    textAlign: "left",
  };

  const activeButtonStyle = {
    ...buttonStyle,
    background: "#efe3d4",
    border: "1px solid #b89a7a",
  };

  const actionButtonStyle = {
    padding: "12px 16px",
    borderRadius: 12,
    border: "1px solid #2c2420",
    background: "#2c2420",
    color: "#fff",
    cursor: "pointer",
    fontSize: 16,
    lineHeight: 1.4,
    minHeight: 48,
    width: "100%",
  };

  const smallButtonStyle = {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #d8c7b3",
    background: "#fff",
    cursor: "pointer",
    fontSize: 14,
    minHeight: 42,
    width: "100%",
  };

  const topicGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
    marginBottom: 28,
  };

  const answerButtonsWrapStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 10,
    marginBottom: 14,
  };

  const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    background: "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
  };

  const sectionTitleStyle = {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  };

  const resultBoxGreen = {
    background: "#f7fbf7",
    padding: 14,
    borderRadius: 12,
    border: "1px solid #d7ead9",
  };

  const resultBoxPink = {
    background: "#fbf8f6",
    padding: 14,
    borderRadius: 12,
    border: "1px solid #eadfda",
  };

  const textStyle = {
    marginTop: 0,
    lineHeight: 1.9,
    fontSize: 15,
  };

  const labelBaseStyle = {
    display: "inline-block",
    fontSize: 10,
    padding: "3px 8px",
    borderRadius: 4,
    marginBottom: 6,
    fontWeight: 600,
    letterSpacing: 0.3,
  };

  const manualTabWrapStyle = {
    display: "flex",
    gap: 10,
    overflowX: "auto",
    paddingBottom: 6,
    marginBottom: 16,
  };

  const getManualTabStyle = (isActive) => ({
    flex: "0 0 auto",
    minWidth: 120,
    padding: "12px 14px",
    borderRadius: 14,
    border: isActive ? "1px solid #8b6842" : "1px solid #d8c7b3",
    background: isActive ? "#efe3d4" : "#fff",
    cursor: "pointer",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 1.5,
    fontWeight: isActive ? 700 : 500,
  });

  const filteredManuals = manuals.filter(
    (m) => m.category === activeManualCategory
  );

  return (
    <div style={layoutStyle}>
      <h1 style={headingStyle}>AXIO Salon カウンセリングツリー</h1>

      <h2 style={subHeadingStyle}>お悩みを選択</h2>

      <div style={topicGridStyle}>
        {topics.map((t) => (
          <button
            key={t.id}
            onClick={() => selectTopic(t)}
            style={selected?.id === t.id ? activeButtonStyle : buttonStyle}
          >
            {t.name}
          </button>
        ))}
      </div>

      {loading && <p style={textStyle}>読み込み中です...</p>}

      {selected && !loading && (
        <div>
          <div style={cardStyle}>
            <div style={sectionTitleStyle}>選択中のお悩み</div>
            <p
              style={{
                fontSize: "clamp(20px, 4vw, 24px)",
                fontWeight: "bold",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {selected.name}
            </p>
          </div>

          <div style={cardStyle}>
            <div style={sectionTitleStyle}>確認質問</div>

            {!questions || questions.length === 0 ? (
              <p style={textStyle}>質問データはまだありません。</p>
            ) : (
              <ul style={{ paddingLeft: 20, lineHeight: 1.9, margin: 0 }}>
                {questions.map((q) => (
                  <li key={q.id} style={{ marginBottom: 8 }}>
                    {q.question}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={cardStyle}>
            <div style={sectionTitleStyle}>YES / NO 分岐</div>

            {!branches || branches.length === 0 ? (
              <p style={textStyle}>分岐データはまだありません。</p>
            ) : (
              branches.map((b) => (
                <div
                  key={b.id}
                  style={{
                    borderTop: "1px solid #eee",
                    paddingTop: 18,
                    marginTop: 18,
                  }}
                >
                  <p
                    style={{
                      fontWeight: "bold",
                      marginBottom: 12,
                      lineHeight: 1.8,
                      fontSize: 16,
                    }}
                  >
                    {b.question}
                  </p>

                  <div style={answerButtonsWrapStyle}>
                    <button
                      onClick={() => setAnswer(b.id, "yes")}
                      style={{
                        ...buttonStyle,
                        textAlign: "center",
                        background: answers[b.id] === "yes" ? "#dff3e3" : "#fff",
                        borderColor: answers[b.id] === "yes" ? "#6aa57a" : "#d8c7b3",
                      }}
                    >
                      はい
                    </button>

                    <button
                      onClick={() => setAnswer(b.id, "no")}
                      style={{
                        ...buttonStyle,
                        textAlign: "center",
                        background: answers[b.id] === "no" ? "#f5e5e5" : "#fff",
                        borderColor: answers[b.id] === "no" ? "#c98989" : "#d8c7b3",
                      }}
                    >
                      いいえ
                    </button>
                  </div>

                  {answers[b.id] === "yes" && (
                    <div style={resultBoxGreen}>
                      <h3 style={{ marginTop: 0, marginBottom: 8 }}>原因候補</h3>
                      <p style={textStyle}>{b.yes_result || "未設定"}</p>
                      <h3 style={{ marginBottom: 8 }}>おすすめ対応</h3>
                      <p style={textStyle}>{b.yes_proposal || "未設定"}</p>
                    </div>
                  )}

                  {answers[b.id] === "no" && (
                    <div style={resultBoxPink}>
                      <h3 style={{ marginTop: 0, marginBottom: 8 }}>原因候補</h3>
                      <p style={textStyle}>{b.no_result || "未設定"}</p>
                      <h3 style={{ marginBottom: 8 }}>おすすめ対応</h3>
                      <p style={textStyle}>{b.no_proposal || "未設定"}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div style={cardStyle}>
            <div style={sectionTitleStyle}>基本の原因と提案</div>

            {!suggestions || suggestions.length === 0 ? (
              <p style={textStyle}>提案データはまだありません。</p>
            ) : (
              suggestions.map((s) => (
                <div
                  key={s.id}
                  style={{
                    borderTop: "1px solid #eee",
                    paddingTop: 18,
                    marginTop: 18,
                  }}
                >
                  <h3 style={{ marginBottom: 8 }}>原因</h3>
                  <p style={textStyle}>{s.cause_hypothesis || "未設定"}</p>

                  <h3 style={{ marginBottom: 8 }}>おすすめ施術</h3>
                  <p style={textStyle}>{s.proposal_menu || "未設定"}</p>

                  <h3 style={{ marginBottom: 8 }}>説明トーク</h3>
                  <p style={textStyle}>{s.talk_script || "未設定"}</p>

                  {s.caution && (
                    <>
                      <h3 style={{ marginBottom: 8 }}>注意点</h3>
                      <p style={textStyle}>{s.caution}</p>
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          <div style={cardStyle}>
            <div style={sectionTitleStyle}>次の行動</div>

            <button onClick={loadManuals} style={actionButtonStyle}>
              施術マニュアルを見る
            </button>
          </div>

          {showManuals && (
            <div style={cardStyle}>
              <div style={sectionTitleStyle}>マニュアル一覧</div>

              <div style={manualTabWrapStyle}>
                {MANUAL_CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => {
                      setActiveManualCategory(cat.key);
                      setSelectedManual(null);
                    }}
                    style={getManualTabStyle(activeManualCategory === cat.key)}
                  >
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{cat.icon}</div>
                    <div>{cat.label}</div>
                  </button>
                ))}
              </div>

              {filteredManuals.length === 0 ? (
                <p style={textStyle}>このカテゴリのマニュアルはまだありません。</p>
              ) : (
                filteredManuals.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      borderTop: "1px solid #eee",
                      paddingTop: 18,
                      marginTop: 18,
                    }}
                  >
                    <h3 style={{ marginBottom: 8, lineHeight: 1.6 }}>{m.title}</h3>
                    <p style={textStyle}>{m.description || m.content || "説明なし"}</p>
                    <button onClick={() => openManual(m)} style={smallButtonStyle}>
                      詳細を見る
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {selectedManual && (
            <div style={cardStyle}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <div style={sectionTitleStyle}>マニュアル詳細</div>
                <button onClick={closeManual} style={smallButtonStyle}>
                  閉じる
                </button>
              </div>

              {selectedManual.title === "幹細胞発毛メニュー" ? (
                <div>
                  <div
                    style={{
                      textAlign: "center",
                      background: "linear-gradient(135deg,#b7946e,#8b6842)",
                      color: "#fff",
                      borderRadius: 10,
                      padding: 12,
                      marginBottom: 16,
                      fontSize: 14,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      lineHeight: 1.5,
                    }}
                  >
                    ⏱ 施術時間：1時間30分（全9ステップ）
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: 8,
                      marginBottom: 16,
                      padding: "12px 14px",
                      background: "#fff",
                      borderRadius: 10,
                      border: "1px solid rgba(183,148,110,0.12)",
                    }}
                  >
                    <span style={{ fontSize: 12, lineHeight: 1.6 }}>
                      <span
                        style={{
                          ...labelBaseStyle,
                          background: "rgba(139,104,66,0.1)",
                          color: "#8b6842",
                          border: "1px solid rgba(139,104,66,0.2)",
                        }}
                      >
                        💬 声かけ
                      </span>{" "}
                      お客様への言葉
                    </span>
                    <span style={{ fontSize: 12, lineHeight: 1.6 }}>
                      <span
                        style={{
                          ...labelBaseStyle,
                          background: "rgba(76,120,100,0.1)",
                          color: "#3a7a58",
                          border: "1px solid rgba(76,120,100,0.2)",
                        }}
                      >
                        📋 説明
                      </span>{" "}
                      施術の説明
                    </span>
                    <span style={{ fontSize: 12, lineHeight: 1.6 }}>
                      <span
                        style={{
                          ...labelBaseStyle,
                          background: "rgba(80,100,160,0.1)",
                          color: "#4060b0",
                          border: "1px solid rgba(80,100,160,0.2)",
                        }}
                      >
                        ⚙ 作業
                      </span>{" "}
                      スタッフの動作
                    </span>
                  </div>

                  {[
                    {
                      num: 1,
                      title: "付け位置確認",
                      time: "約5分",
                      blocks: [
                        {
                          type: "voice",
                          label: "💬 声かけ",
                          text: "「幹細胞の付け位置を確認します」",
                        },
                      ],
                    },
                    {
                      num: 2,
                      title: "クレンジング＋スチーム準備",
                      time: "約5分",
                      blocks: [
                        {
                          type: "work",
                          label: "⚙ 作業",
                          text: "シャンプー台に倒してクレンジング塗布＋スチームのスイッチ準備",
                        },
                        {
                          type: "explanation",
                          label: "📋 説明",
                          text: "「毛穴に詰まった普段落としきれていない汚れを浮き出させるクレンジングです」",
                        },
                        {
                          type: "voice",
                          label: "💬 声かけ",
                          text: "「クレンジングが冷たいです。失礼します」",
                        },
                      ],
                    },
                    {
                      num: 3,
                      title: "スチーム 10分",
                      time: "約15分",
                      blocks: [
                        {
                          type: "work",
                          label: "⚙ 作業",
                          text: "起こしてターバンとキャップをつけてスチーム10分",
                        },
                        {
                          type: "explanation",
                          label: "📋 説明",
                          text: "「水素のスチームに入れることで血行促進と毛穴の汚れを浮き出させるお手伝いの2つの効果があります」",
                        },
                        {
                          type: "voice",
                          label: "💬 声かけ",
                          text: "「徐々にスチームであったかくなっていきます。温度が熱すぎたりしたらおっしゃってください。置き時間にお飲み物をお持ちします」",
                        },
                      ],
                    },
                    {
                      num: 4,
                      title: "飲み物・幹細胞の準備",
                      time: "③と並行",
                      blocks: [
                        {
                          type: "work",
                          label: "⚙ 作業",
                          text: "スチーム置き時間中にお飲み物を準備する",
                        },
                        {
                          type: "work",
                          label: "⚙ 作業",
                          text: "幹細胞上清液を準備する",
                        },
                      ],
                    },
                    {
                      num: 5,
                      title: "シャンプー（ハーブフォンデュシャンプー）",
                      time: "約20分",
                      blocks: [
                        {
                          type: "explanation",
                          label: "📋 説明",
                          text: "「髪が生えるときに必要なベースのミネラル分にプラスしてハーブや漢方などのエキスが入っていますので血行促進や抗酸化作用があり、育毛・アンチエイジングの効果が高いシャンプーです」",
                        },
                        {
                          type: "voice",
                          label: "💬 声かけ",
                          text: "「2回目のシャンプーは育毛効果の高いハーブのシャンプーでマッサージしていきます」",
                        },
                      ],
                    },
                    {
                      num: 6,
                      title: "幹細胞上清液付け・エレクトロポレーション",
                      time: "約15分",
                      blocks: [
                        {
                          type: "voice",
                          label: "💬 声かけ",
                          text: "「機械の強さは程よく刺激を感じるぐらいが良いので、痛すぎたり弱すぎたりしたら調整しますのでおっしゃってください」",
                        },
                      ],
                    },
                    {
                      num: 7,
                      title: "トリートメント＆ブロー",
                      time: "約10分",
                      blocks: [
                        {
                          type: "work",
                          label: "⚙ 作業",
                          text: "毛先にトリートメントスプレーをつけてブロー仕上げ",
                        },
                      ],
                    },
                    {
                      num: 8,
                      title: "アフターカウンセリング",
                      time: "約5分",
                      blocks: [
                        {
                          type: "voice",
                          label: "💬 声かけ",
                          text: "「ご自身での実感はいかがですか？私は○○になってきていると思います」",
                        },
                      ],
                    },
                    {
                      num: 9,
                      title: "会計・次回予約・お見送り",
                      time: "約5分",
                      blocks: [
                        { type: "final", label: "💳", text: "お会計" },
                        { type: "final", label: "📅", text: "次回予約の確認" },
                        { type: "final", label: "🚪", text: "笑顔でお見送り" },
                      ],
                    },
                  ].map((step) => (
                    <div
                      key={step.num}
                      style={{
                        background: "#fff",
                        border: "1px solid rgba(183,148,110,0.2)",
                        borderRadius: 12,
                        padding: "14px 14px",
                        marginBottom: 14,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "28px 1fr",
                          gap: 10,
                          marginBottom: 12,
                          borderBottom: "1px solid rgba(183,148,110,0.2)",
                          paddingBottom: 10,
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            background: "linear-gradient(135deg,#b7946e,#8b6842)",
                            color: "#fff",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {step.num}
                        </div>

                        <div>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              lineHeight: 1.5,
                              marginBottom: 6,
                            }}
                          >
                            {step.title}
                          </div>
                          <span
                            style={{
                              display: "inline-block",
                              fontSize: 11,
                              padding: "4px 10px",
                              borderRadius: 999,
                              background:
                                step.time === "③と並行"
                                  ? "rgba(80,100,160,0.08)"
                                  : "rgba(183,148,110,0.12)",
                              border:
                                step.time === "③と並行"
                                  ? "1px solid rgba(80,100,160,0.25)"
                                  : "1px solid rgba(183,148,110,0.3)",
                              color:
                                step.time === "③と並行" ? "#4060b0" : "#8b6842",
                              lineHeight: 1.4,
                            }}
                          >
                            {step.time}
                          </span>
                        </div>
                      </div>

                      {step.blocks.map((block, index) => {
                        let currentLabelStyle = {
                          ...labelBaseStyle,
                          background: "rgba(139,104,66,0.1)",
                          color: "#8b6842",
                          border: "1px solid rgba(139,104,66,0.2)",
                        };

                        if (block.type === "explanation") {
                          currentLabelStyle = {
                            ...labelBaseStyle,
                            background: "rgba(76,120,100,0.1)",
                            color: "#3a7a58",
                            border: "1px solid rgba(76,120,100,0.2)",
                          };
                        }

                        if (block.type === "work" || block.type === "final") {
                          currentLabelStyle = {
                            ...labelBaseStyle,
                            background: "rgba(80,100,160,0.1)",
                            color: "#4060b0",
                            border: "1px solid rgba(80,100,160,0.2)",
                          };
                        }

                        return (
                          <div key={index} style={{ marginBottom: 10 }}>
                            <div style={currentLabelStyle}>{block.label}</div>
                            <div
                              style={{
                                background: "#f9f6f1",
                                borderLeft: "3px solid rgba(183,148,110,0.4)",
                                padding: "10px 12px",
                                borderRadius: "0 6px 6px 0",
                                fontSize: 13,
                                lineHeight: 1.85,
                                color: "#5a4a40",
                                whiteSpace: "pre-line",
                              }}
                            >
                              {block.text}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <h2 style={{ marginTop: 0, lineHeight: 1.5 }}>{selectedManual.title}</h2>
                  <p style={textStyle}>{selectedManual.description || "説明なし"}</p>
                  <div
                    style={{
                      whiteSpace: "pre-line",
                      lineHeight: 1.9,
                      background: "#fafafa",
                      padding: 16,
                      borderRadius: 12,
                      fontSize: 14,
                    }}
                  >
                    {selectedManual.content || "本文なし"}
                  </div>
                  <p style={{ marginTop: 16, marginBottom: 6, lineHeight: 1.7 }}>
                    <strong>所要時間:</strong> {selectedManual.total_time || "未設定"}
                  </p>
                  <p style={{ marginTop: 0, lineHeight: 1.7 }}>
                    <strong>カテゴリ:</strong> {selectedManual.category || "未設定"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
