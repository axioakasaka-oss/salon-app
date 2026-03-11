import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [topics, setTopics] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadTopics();
  }, []);

  async function loadTopics() {
    const { data, error } = await supabase
      .from("counseling_topics")
      .select("*")
      .order("sort_order");

    if (error) {
      console.error(error);
      return;
    }

    setTopics(data);
  }

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>AXIO Salon カウンセリング</h1>

      <h2>お悩みを選択</h2>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {topics.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelected(t)}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid #ccc",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            {t.name}
          </button>
        ))}
      </div>

      {selected && (
        <div style={{ marginTop: 40 }}>
          <h2>原因</h2>
          <p>{selected.description || "原因データなし"}</p>

          <h2>おすすめ提案</h2>
          <p>{selected.solution || "提案データなし"}</p>
        </div>
      )}
    </div>
  );
}
