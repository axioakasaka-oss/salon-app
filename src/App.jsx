import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [topics, setTopics] = useState([]);
  const [selected, setSelected] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTopics();
  }, []);

  async function loadTopics() {
    const { data, error } = await supabase
      .from("counseling_topics")
      .select("*")
      .eq("category", "カウンセリング")
      .eq("is_active", true)
      .order("sort_order");

    if (error) {
      console.error("topics error:", error);
      return;
    }

    setTopics(data || []);
  }

  async function selectTopic(topic) {
    setSelected(topic);
    setLoading(true);

    const [questionsRes, suggestionsRes] = await Promise.all([
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

    setLoading(false);
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
            <div style={sectionTitleStyle}>原因と提案</div>

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
        </div>
      )}
    </div>
  );
}
