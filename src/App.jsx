import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [topics, setTopics] = useState([]);
  const [selected, setSelected] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

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
      console.error(error);
      return;
    }

    setTopics(data || []);
  }

  async function selectTopic(topic) {
    setSelected(topic);

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
      console.error(questionsRes.error);
      setQuestions([]);
    } else {
      setQuestions(questionsRes.data || []);
    }

    if (suggestionsRes.error) {
      console.error(suggestionsRes.error);
      setSuggestions([]);
    } else {
      setSuggestions(suggestionsRes.data || []);
    }
  }

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif", background: "#f9f7f4", minHeight: "100vh" }}>
      <h1>AXIO Salon カウンセリングツリー</h1>

      <h2>お悩みを選択</h2>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 30 }}>
        {topics.map((t) => (
          <button
            key={t.id}
            onClick={() => selectTopic(t)}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid #ccc",
              background: selected?.id === t.id ? "#efe3d4" : "#fff",
              cursor: "pointer",
            }}
          >
            {t.name}
          </button>
        ))}
      </div>

      {selected && (
        <div style={{ marginTop: 20 }}>
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 20,
              marginBottom: 20,
              background: "#fff",
            }}
          >
            <h2>選択中のお悩み</h2>
            <p>{selected.name}</p>
          </div>

          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 20,
              marginBottom: 20,
              background: "#fff",
            }}
          >
            <h2>確認質問</h2>
            {questions.length === 0 ? (
              <p>質問データはまだありません。</p>
            ) : (
              <ul>
                {questions.map((q) => (
                  <li key={q.id} style={{ marginBottom: 8 }}>
                    {q.question}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 20,
              marginBottom: 20,
              background: "#fff",
            }}
          >
            <h2>原因と提案</h2>

            {suggestions.length === 0 ? (
              <p>提案データはまだありません。</p>
            ) : (
              suggestions.map((s) => (
                <div
                  key={s.id}
                  style={{
                    borderTop: "1px solid #eee",
                    paddingTop: 16,
                    marginTop: 16,
                  }}
                >
                  <h3>原因候補</h3>
                  <p>{s.cause_hypothesis}</p>

                  <h3>おすすめ施術</h3>
                  <p>{s.proposal_menu}</p>

                  <h3>説明トーク</h3>
                  <p>{s.talk_script || "未設定"}</p>

                  {s.caution && (
                    <>
                      <h3>注意点</h3>
                      <p>{s.caution}</p>
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
