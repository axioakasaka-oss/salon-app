import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [manuals, setManuals] = useState([]);
  const [topics, setTopics] = useState([]);
  const [talks, setTalks] = useState([]);
  const [page, setPage] = useState("home");

  useEffect(() => {
    loadManuals();
    loadTopics();
    loadTalks();
  }, []);

  async function loadManuals() {
    const { data } = await supabase.from("manuals").select("*");
    setManuals(data || []);
  }

  async function loadTopics() {
    const { data } = await supabase.from("counseling_topics").select("*");
    setTopics(data || []);
  }

  async function loadTalks() {
    const { data } = await supabase.from("talk_scripts").select("*");
    setTalks(data || []);
  }

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>AXIO Salon App</h1>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setPage("home")}>ホーム</button>
        <button onClick={() => setPage("manual")}>施術マニュアル</button>
        <button onClick={() => setPage("counseling")}>カウンセリング</button>
        <button onClick={() => setPage("talk")}>接客トーク</button>
      </div>

      {page === "home" && (
        <div>
          <h2>メニュー</h2>
          <p>施術マニュアル / カウンセリングナビ / 接客トーク</p>
        </div>
      )}

      {page === "manual" && (
        <div>
          <h2>施術マニュアル</h2>
          {manuals.map((m) => (
            <div
              key={m.id}
              style={{
                border: "1px solid #ddd",
                padding: 20,
                marginBottom: 10,
              }}
            >
              <h3>{m.title}</h3>
              <p>{m.description}</p>
              <p>時間: {m.total_time}</p>
            </div>
          ))}
        </div>
      )}

      {page === "counseling" && (
        <div>
          <h2>カウンセリングナビ</h2>
          {topics.map((t) => (
            <div
              key={t.id}
              style={{
                border: "1px solid #ddd",
                padding: 15,
                marginBottom: 10,
              }}
            >
              <h3>{t.name}</h3>
              <p>{t.description}</p>
            </div>
          ))}
        </div>
      )}

      {page === "talk" && (
        <div>
          <h2>接客トーク</h2>
          {talks.map((t) => (
            <div
              key={t.id}
              style={{
                border: "1px solid #ddd",
                padding: 15,
                marginBottom: 10,
              }}
            >
              <h3>{t.title}</h3>
              <p>{t.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
