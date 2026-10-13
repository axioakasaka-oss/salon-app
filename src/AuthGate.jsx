import { useEffect, useState } from "react";
import { supabase } from "./supabase";

// UI gating is defense in depth only. Database RLS and RPC authorization
// must be audited before enabling staff access in production.
export default function AuthGate({ children }) {
  const [status, setStatus] = useState("checking");
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    let generation = 0;
    async function verify(nextSession) {
      const current = ++generation;
      if (!active) return;
      setSession(null);
      setStatus(nextSession ? "checking" : "signed_out");
      if (!nextSession?.user?.id) return;
      // Until staff/Auth mapping is designed, only the existing admin profile
      // is eligible. Never infer membership from the unrelated staff table.
      const { data, error } = await supabase.from("profiles")
        .select("id, role").eq("id", nextSession.user.id).maybeSingle();
      if (!active || current !== generation) return;
      if (error) {
        setMessage("利用資格を確認できません。管理者にお問い合わせください。");
        setStatus("error");
      } else if (data?.role !== "admin") {
        setStatus("denied");
      } else {
        setSession(nextSession);
        setStatus("ready");
      }
    }
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) { setStatus("error"); setMessage("認証状態を確認できません。"); }
      else verify(data.session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      // Defer the database request outside the auth callback.
      Promise.resolve().then(() => { if (active) verify(nextSession); });
    });
    return () => { active = false; generation++; subscription.unsubscribe(); };
  }, []);

  async function signIn(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setPassword("");
    if (error) setMessage("ログインできませんでした。入力内容をご確認ください。");
    setBusy(false);
  }

  async function signOut() {
    setSession(null);
    setStatus("signed_out");
    setMessage("");
    const { error } = await supabase.auth.signOut();
    if (error) setMessage("ログアウト処理を確認できません。ページを再読み込みしてください。");
  }

  const outer = { minHeight: "100vh", background: "#f9f7f4", padding: 24, fontFamily: '"Noto Sans JP", sans-serif', color: "#2c2420" };
  const panel = { maxWidth: 400, margin: "12vh auto", padding: 24, borderRadius: 16, background: "#fff", border: "1px solid #e8ddd4" };
  const field = { display: "block", width: "100%", boxSizing: "border-box", padding: 12, margin: "8px 0 16px", border: "1px solid #e8ddd4", borderRadius: 8 };
  const button = { padding: "12px 16px", background: "#8b6842", color: "#fff", border: 0, borderRadius: 8, cursor: "pointer" };

  if (status === "ready" && session) {
    return <div>
      <div style={{ textAlign: "right", padding: "8px 16px", background: "#f9f7f4" }}>
        <button type="button" onClick={signOut} style={button}>ログアウト</button>
      </div>
      {children}
    </div>;
  }
  return <main style={outer}><section style={panel}>
    <h1 style={{ fontSize: 22 }}>AXIO スタッフ教育アプリ</h1>
    {status === "checking" && <p>認証状態を確認しています…</p>}
    {status === "signed_out" && <form onSubmit={signIn}>
      <p>招待されたアカウントでログインしてください。</p>
      <label>メールアドレス<input style={field} type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} /></label>
      <label>パスワード<input style={field} type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} /></label>
      <button style={button} disabled={busy} type="submit">{busy ? "確認中…" : "ログイン"}</button>
    </form>}
    {status === "denied" && <><p>このアカウントには利用権限がありません。管理者にお問い合わせください。</p><button style={button} onClick={signOut}>ログアウト</button></>}
    {status === "error" && <><p>利用資格の確認に失敗しました。再読み込みしてお試しください。</p><button style={button} onClick={() => window.location.reload()}>再試行</button><button style={{ ...button, marginLeft: 8 }} onClick={signOut}>ログアウト</button></>}
    {message && <p role="alert" style={{ color: "#b04040" }}>{message}</p>}
  </section></main>;
}
