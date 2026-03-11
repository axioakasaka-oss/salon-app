import { useEffect, useState } from "react";

export default function App() {
  const [message, setMessage] = useState("確認中です...");

  useEffect(() => {
    async function runCheck() {
      try {
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!url) {
          setMessage("エラー: VITE_SUPABASE_URL が読めていません");
          return;
        }

        if (!key) {
          setMessage("エラー: VITE_SUPABASE_ANON_KEY が読めていません");
          return;
        }

        const mod = await import("@supabase/supabase-js");
        const createClient = mod.createClient;

        const supabase = createClient(url, key);

        const { error } = await supabase.from("manuals").select("*").limit(1);

        if (error) {
          setMessage("Supabase接続エラー: " + error.message);
          return;
        }

        setMessage("Supabase接続成功");
      } catch (e) {
        setMessage("実行エラー: " + (e?.message || String(e)));
      }
    }

    runCheck();
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>AXIO Salon App</h1>
      <p>{message}</p>
    </div>
  );
}
