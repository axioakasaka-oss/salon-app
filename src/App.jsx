import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [manuals, setManuals] = useState([]);
  const [topics, setTopics] = useState([]);
  const [talks, setTalks] = useState([]);
  const [page, setPage] = useState("home");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [manualsRes, topicsRes, talksRes] = await Promise.all([
        supabase.from("manuals").select("*").order("title"),
        supabase.from("counseling_topics").select("*").order("sort_order"),
        supabase.from("talk_scripts").select("*").order("sort_order"),
      ]);

      if (manualsRes.error) throw manualsRes.error;
      if (topicsRes.error) throw topicsRes.error;
      if (talksRes.error) throw talksRes.error;

      setManuals(manualsRes.data || []);
      setTopics(topicsRes.data || []);
      setTalks(talksRes.data || []);
    } catch (error) {
      console.error("読み込みエラー:", error);
    } finally {
      setLoading(false);
    }
  }

  const buttonStyle = {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #c8b29b",
    background: "#fff",
    cursor: "pointer",
    marginRight: "8px",
    marginBottom: "8px",
  };

  const cardStyle = {
    border: "1px solid #e5d7c8",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "12px",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  };

  return (
    <div
      style={{
        padding: "24px",
        fontFamily: "sans-serif",
        background: "#f8f5f1",
        minHeight: "100vh",
        color: "#2c2420",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>AXIO Salon App</h1>

      <div style={{ marginBottom: "24px" }}>
        <button style={buttonStyle} onClick={() => setPage("home")}>
          ホーム
        </button>
        <button style={buttonStyle} onClick={() => setPage("manual")}>
          施術マニュアル
        </button>
        <button style={buttonStyle} onClick={() => setPage("counseling")}>
          カウンセリング
        </button>
        <button style={buttonStyle} onClick={() => setPage("talk")}>
          接客トーク
        </button>
      </div>

      {loading && <p>読み込み中です...</p>}

      {!loading && page === "home" && (
        <div style={cardStyle}>
          <h2>メニュー</h2>
          <p>施術マニュアル / カウンセリングナビ / 接客トーク</p>
        </div>
      )}

      {!loading && page === "manual" && (
        <div>
          <h2>施術マニュアル</h2>
          {manuals.map((m) => (
            <div key={m.id} style={cardStyle}>
              <h3>{m.title}</h3>
              <p>{m.description || m.content || "説明なし"}</p>
              <p>カテゴリ: {m.category || "-"}</p>
              <p>時間: {m.total_time || "-"}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && page === "counseling" && (
        <div>
          <h2>カウンセリングナビ</h2>
          {topics.map((t) => (
            <div key={t.id} style={cardStyle}>
              <h3>{t.name}</h3>
              <p>カテゴリ: {t.category || "-"}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && page === "talk" && (
        <div>
          <h2>接客トーク</h2>
          {talks.map((t) => (
            <div key={t.id} style={cardStyle}>
              <h3>{t.title}</h3>
              <p>{t.script || t.content || "本文なし"}</p>
              <p>カテゴリ: {t.category || "-"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
