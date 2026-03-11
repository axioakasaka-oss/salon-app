import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [topics, setTopics] = useState([]);
  const [selected, setSelected] = useState(null);
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

    const { data, error } = await supabase
      .from("counseling_suggestions")
      .select("*")
      .eq("topic_id", topic.id)
      .order("sort_order");

    if (error) {
      console.error(error);
      setSuggestions([]);
      return;
    }

    setSuggestions(data || []);
  }

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>AXIO Salon カウンセリング</h1>

      <h2>お悩みを選択</h2>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {topics.map((t) => (
          <button
            key={t.id}
            onClick={() => selectTopic(t)}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid #ccc",
              background: selected?.id === t.id ? "#f3e8dc" : "#fff",
              cursor: "pointer",
            }}
          >
            {t.name}
          </button>
        ))}
      </div>

      {selected && (
        <div style={{ marginTop: 40 }}>
          <h2>{selected.name}</h2>

          {suggestions.length === 0 ? (
            <p>この悩みの提案データはまだ入っていません。</p>
          ) : (
            suggestions.map((s) => (
              <div
                key={s.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  padding: 16,
                  marginBottom: 12,
                  background: "#fff",
                }}
              >
                <h3>原因</h3>
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
      )}
    </div>
  );
}
