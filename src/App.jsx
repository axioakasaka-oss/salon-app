import { useEffect, useState } from "react";
import { supabase } from "./supabase";

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

    if (questionsRes.error) {
      console.error("questions error:", questionsRes.error);
      setQuestions([]);
    } else {
      setQuestions(questionsRes.data || []);
    }

    if (suggestionsRes.error) {
      console.error("suggestions error:", suggestionsRes.error);
      setSuggestions([]);
    } else {
      setSuggestions(suggestionsRes.data || []);
    }

    if (branchesRes.error) {
      console.error("branches error:", branchesRes.error);
      setBranches([]);
    } else {
      setBranches(branchesRes.data || []);
    }

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
  }

  function closeManual() {
    setSelectedManual(null);
  }

  const buttonStyle = {
    padding: "10px 16px",
    borderRadius: 10,
    border: "1px solid #d8c7b3",
    background: "#fff",
    cursor: "pointer",
    fontSize: 16,
  };

  const activeButtonStyle = {
    ...buttonStyle,
    background: "#efe3d4",
    border: "1px solid #b89a7a",
  };

  const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    background: "#fff",
  };

  const sectionTitleStyle = {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  };

  const darkButtonStyle = {
    ...buttonStyle,
    background: "#2c2420",
    color: "#fff",
    border: "1px solid #2c2420",
  };

  const smallButtonStyle = {
    ...buttonStyle,
    padding: "8px 12px",
    fontSize: 14,
  };

  return (
    <div
      style={{
        padding: 40,
        fontFamily: "sans-serif",
        background: "#f9f7f4",
        minHeight: "100vh",
        color: "#2c2420",
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 30 }}>
        AXIO Salon カウンセリングツリー
      </h1>

      <h2 style={{ marginBottom: 20 }}>お悩みを選択</h2>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
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

      {loading && <p>読み込み中です...</p>}

      {selected && !loading && (
        <div>
          <div style={cardStyle}>
            <div style={sectionTitleStyle}>選択中のお悩み</div>
            <p style={{ fontSize: 24, fontWeight: "bold", margin: 0 }}>
              {selected.name}
            </p>
          </div>

          <div style={cardStyle}>
            <div style={sectionTitleStyle}>確認質問</div>

            {!questions || questions.length === 0 ? (
              <p>質問データはまだありません。</p>
            ) : (
              <ul style={{ paddingLeft: 20, lineHeight: 1.9 }}>
                {questions.map((q) => (
                  <li key={q.id}>{q.question}</li>
                ))}
              </ul>
            )}
          </div>

          <div style={cardStyle}>
            <div style={sectionTitleStyle}>YES / NO 分岐</div>

            {!branches || branches.length === 0 ? (
              <p>分岐データはまだありません。</p>
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
                  <p style={{ fontWeight: "bold", marginBottom: 12 }}>{b.question}</p>

                  <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                    <button
                      onClick={() => setAnswer(b.id, "yes")}
                      style={{
                        ...buttonStyle,
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
                        background: answers[b.id] === "no" ? "#f5e5e5" : "#fff",
                        borderColor: answers[b.id] === "no" ? "#c98989" : "#d8c7b3",
                      }}
                    >
                      いいえ
                    </button>
                  </div>

                  {answers[b.id] === "yes" && (
                    <div style={{ background: "#f7fbf7", padding: 14, borderRadius: 10 }}>
                      <h3 style={{ marginTop: 0 }}>原因候補</h3>
                      <p>{b.yes_result || "未設定"}</p>
                      <h3>おすすめ対応</h3>
                      <p>{b.yes_proposal || "未設定"}</p>
                    </div>
                  )}

                  {answers[b.id] === "no" && (
                    <div style={{ background: "#fbf8f6", padding: 14, borderRadius: 10 }}>
                      <h3 style={{ marginTop: 0 }}>原因候補</h3>
                      <p>{b.no_result || "未設定"}</p>
                      <h3>おすすめ対応</h3>
                      <p>{b.no_proposal || "未設定"}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div style={cardStyle}>
            <div style={sectionTitleStyle}>基本の原因と提案</div>

            {!suggestions || suggestions.length === 0 ? (
              <p>提案データはまだありません。</p>
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
                  <p style={{ marginTop: 0, lineHeight: 1.8 }}>
                    {s.cause_hypothesis || "未設定"}
                  </p>

                  <h3 style={{ marginBottom: 8 }}>おすすめ施術</h3>
                  <p style={{ marginTop: 0, lineHeight: 1.8 }}>
                    {s.proposal_menu || "未設定"}
                  </p>

                  <h3 style={{ marginBottom: 8 }}>説明トーク</h3>
                  <p style={{ marginTop: 0, lineHeight: 1.8 }}>
                    {s.talk_script || "未設定"}
                  </p>

                  {s.caution && (
                    <>
                      <h3 style={{ marginBottom: 8 }}>注意点</h3>
                      <p style={{ marginTop: 0, lineHeight: 1.8 }}>{s.caution}</p>
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          <div style={cardStyle}>
            <div style={sectionTitleStyle}>次の行動</div>

            <button onClick={loadManuals} style={darkButtonStyle}>
              施術マニュアルを見る
            </button>
          </div>

          {showManuals && (
            <div style={cardStyle}>
              <div style={sectionTitleStyle}>施術マニュアル一覧</div>

              {!manuals || manuals.length === 0 ? (
                <p>マニュアルデータはまだありません。</p>
              ) : (
                manuals.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      borderTop: "1px solid #eee",
                      paddingTop: 18,
                      marginTop: 18,
                    }}
                  >
                    <h3 style={{ marginBottom: 8 }}>{m.title}</h3>
                    <p style={{ marginTop: 0, lineHeight: 1.8 }}>
                      {m.description || m.content || "説明なし"}
                    </p>
                    <p style={{ marginTop: 0 }}>
                      <strong>所要時間:</strong> {m.total_time || "未設定"}
                    </p>
                    <p style={{ marginTop: 0 }}>
                      <strong>カテゴリ:</strong> {m.category || "未設定"}
                    </p>

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
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={sectionTitleStyle}>マニュアル詳細</div>
                <button onClick={closeManual} style={smallButtonStyle}>
                  閉じる
                </button>
              </div>

              {selectedManual.title === "幹細胞頭皮ケア" ? (
                <div>
                  <div
                    style={{
                      textAlign: "center",
                      background: "linear-gradient(135deg,#b7946e,#8b6842)",
                      color: "#fff",
                      borderRadius: 8,
                      padding: 10,
                      marginBottom: 16,
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: 1,
                    }}
                  >
                    ⏱ 施術時間：1時間30分（全9ステップ）
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      flexWrap: "wrap",
                      marginBottom: 16,
                      padding: "10px 14px",
                      background: "#fff",
                      borderRadius: 8,
                      border: "1px solid rgba(183,148,110,0.12)",
                    }}
                  >
                    <span style={{ fontSize: 10 }}>💬 声かけ：お客様への言葉</span>
                    <span style={{ fontSize: 10 }}>📋 説明：施術の説明</span>
                    <span style={{ fontSize: 10 }}>⚙ 作業：スタッフの動作</span>
                  </div>

                  {[
                    {
                      num: 1,
                      title: "付け位置確認",
                      time: "約5分",
                      blocks: [{ label: "💬 声かけ", text: "「幹細胞の付け位置を確認します」" }],
                    },
                    {
                      num: 2,
                      title: "クレンジング＋スチーム準備",
                      time: "約5分",
                      blocks: [
                        { label: "⚙ 作業", text: "シャンプー台に倒してクレンジング塗布＋スチームのスイッチ準備" },
                        { label: "📋 説明", text: "「毛穴に詰まった普段落としきれていない汚れを浮き出させるクレンジングです」" },
                        { label: "💬 声かけ", text: "「クレンジングが冷たいです。失礼します」" },
                      ],
                    },
                    {
                      num: 3,
                      title: "スチーム 10分",
                      time: "約15分",
                      blocks: [
                        { label: "⚙ 作業", text: "起こしてターバンとキャップをつけてスチーム10分" },
                        { label: "📋 説明", text: "「水素のスチームに入れることで血行促進と毛穴の汚れを浮き出させるお手伝いの2つの効果があります」" },
                        { label: "💬 声かけ", text: "「徐々にスチームであったかくなっていきます。温度が熱すぎたりしたらおっしゃってください。置き時間にお飲み物をお持ちします」" },
                      ],
                    },
                    {
                      num: 4,
                      title: "飲み物・幹細胞の準備",
                      time: "③と並行",
                      blocks: [
                        { label: "⚙ 作業", text: "スチーム置き時間中にお飲み物を準備する" },
                        { label: "⚙ 作業", text: "幹細胞上清液を準備する" },
                      ],
                    },
                    {
                      num: 5,
                      title: "シャンプー（ハーブフォンデュシャンプー）",
                      time: "約20分",
                      blocks: [
                        { label: "📋 説明", text: "「髪が生えるときに必要なベースのミネラル分にプラスしてハーブや漢方などのエキスが入っていますので血行促進や抗酸化作用があり、育毛・アンチエイジングの効果が高いシャンプーです」" },
                        { label: "💬 声かけ", text: "「2回目のシャンプーは育毛効果の高いハーブのシャンプーでマッサージしていきます」" },
                      ],
                    },
                    {
                      num: 6,
                      title: "幹細胞上清液付け・エレクトロポレーション",
                      time: "約15分",
                      blocks: [
                        { label: "💬 声かけ", text: "「機械の強さは程よく刺激を感じるぐらいが良いので、痛すぎたり弱すぎたりしたら調整しますのでおっしゃってください」" },
                      ],
                    },
                    {
                      num: 7,
                      title: "トリートメント＆ブロー",
                      time: "約10分",
                      blocks: [
                        { label: "⚙ 作業", text: "毛先にトリートメントスプレーをつけてブロー仕上げ" },
                      ],
                    },
                    {
                      num: 8,
                      title: "アフターカウンセリング",
                      time: "約5分",
                      blocks: [
                        { label: "💬 声かけ", text: "「ご自身での実感はいかがですか？私は○○になってきていると思います」" },
                      ],
                    },
                    {
                      num: 9,
                      title: "会計・次回予約・お見送り",
                      time: "約5分",
                      blocks: [
                        { label: "💳", text: "お会計" },
                        { label: "📅", text: "次回予約の確認" },
                        { label: "🚪", text: "笑顔でお見送り" },
                      ],
                    },
                  ].map((step) => (
                    <div
                      key={step.num}
                      style={{
                        background: "#fff",
                        border: "1px solid rgba(183,148,110,0.2)",
                        borderRadius: 10,
                        padding: "16px 18px",
                        marginBottom: 14,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          marginBottom: 12,
                          borderBottom: "1px solid rgba(183,148,110,0.2)",
                          paddingBottom: 10,
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
                            flexShrink: 0,
                          }}
                        >
                          {step.num}
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, flex: 1 }}>
                          {step.title}
                        </div>
                        <span
                          style={{
                            fontSize: 10,
                            padding: "3px 9px",
                            borderRadius: 10,
                            background: "rgba(183,148,110,0.12)",
                            border: "1px solid rgba(183,148,110,0.3)",
                            color: "#8b6842",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {step.time}
                        </span>
                      </div>

                      {step.blocks.map((block, index) => (
                        <div key={index} style={{ marginBottom: 10 }}>
                          <div
                            style={{
                              display: "inline-block",
                              fontSize: 9,
                              padding: "2px 7px",
                              borderRadius: 2,
                              marginBottom: 5,
                              fontWeight: 500,
                              letterSpacing: 1,
                              background: "rgba(139,104,66,0.1)",
                              color: "#8b6842",
                              border: "1px solid rgba(139,104,66,0.2)",
                            }}
                          >
                            {block.label}
                          </div>
                          <div
                            style={{
                              background: "#f9f6f1",
                              borderLeft: "2px solid rgba(183,148,110,0.4)",
                              padding: "8px 12px",
                              borderRadius: "0 4px 4px 0",
                              fontSize: 12,
                              lineHeight: 1.85,
                              color: "#5a4a40",
                            }}
                          >
                            {block.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <h2 style={{ marginTop: 0 }}>{selectedManual.title}</h2>
                  <p>{selectedManual.description || "説明なし"}</p>
                  <div
                    style={{
                      whiteSpace: "pre-line",
                      lineHeight: 1.9,
                      background: "#fafafa",
                      padding: 16,
                      borderRadius: 10,
                    }}
                  >
                    {selectedManual.content || "本文なし"}
                  </div>
                  <p style={{ marginTop: 16 }}>
                    <strong>所要時間:</strong> {selectedManual.total_time || "未設定"}
                  </p>
                  <p>
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
