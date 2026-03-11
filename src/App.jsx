import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [message, setMessage] = useState("読み込み中です...");

  useEffect(() => {
    async function checkSupabase() {
      const { data, error } = await supabase.from("manuals").select("*").limit(1);

      if (error) {
        console.error(error);
        setMessage("Supabase接続エラー: " + error.message);
        return;
      }

      setMessage("Supabase接続成功");
    }

    checkSupabase();
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>AXIO Salon App</h1>
      <p>{message}</p>
    </div>
  );
}
