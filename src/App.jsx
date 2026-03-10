import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://exqcmiqnjqcymbycbsqd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4cWNtaXFuanFjeW1ieWNic3FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NjM3NjgsImV4cCI6MjA4ODUzOTc2OH0.UsLJ_fnFcTOmpHSq3Ocui6yVX6fgFjfdXTGX1eXoBGg";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const COLORS = {
  bg: "#0f0a0a",
  surface: "#1a1010",
  card: "#221414",
  border: "rgba(212,165,165,0.15)",
  accent: "#D4A5A5",
  accentDark: "#a87070",
  text: "#f0e8e8",
  textMuted: "rgba(240,232,232,0.45)",
  danger: "#ff6b6b",
  success: "#6bcb8b",
  warning: "#f0c060",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Noto+Sans+JP:wght@300;400;500;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${COLORS.bg}; color: ${COLORS.text}; }
  input, textarea, select {
    background: rgba(255,255,255,0.05) !important;
    border: 1px solid ${COLORS.border} !important;
    border-radius: 10px !important;
    color: ${COLORS.text} !important;
    padding: 10px 14px !important;
    font-size: 14px !important;
    font-family: 'Noto Sans JP', sans-serif !important;
    outline: none !important;
    width: 100%;
  }
  input:focus, textarea:focus, select:focus {
    border-color: ${COLORS.accent} !important;
  }
  button { cursor: pointer; font-family: 'Noto Sans JP', sans-serif; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 2px; }
  .fade-in { animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
`;

// ── UI Parts ──────────────────────────────────────────
const Btn = ({ children, onClick, color = COLORS.accent, outline, small, danger, style = {} }) => (
  <button onClick={onClick} style={{
    padding: small ? "6px 14px" : "12px 20px",
    borderRadius: 10,
    border: outline ? `1px solid ${danger ? COLORS.danger : color}` : "none",
    background: outline ? "transparent" : danger ? COLORS.danger : `linear-gradient(135deg, ${color}, ${COLORS.accentDark})`,
    color: outline ? (danger ? COLORS.danger : color) : "#fff",
    fontSize: small ? 12 : 14,
    fontWeight: 500,
    transition: "opacity 0.2s",
    ...style,
  }}
    onMouseEnter={e => e.target.style.opacity = "0.8"}
    onMouseLeave={e => e.target.style.opacity = "1"}
  >{children}</button>
);

const Card = ({ children, style = {} }) => (
  <div style={{
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    padding: 20,
    ...style,
  }}>{children}</div>
);

const Badge = ({ children, color = COLORS.accent }) => (
  <span style={{
    background: `${color}22`,
    color: color,
    border: `1px solid ${color}44`,
    borderRadius: 6,
    padding: "2px 8px",
    fontSize: 11,
    fontWeight: 500,
  }}>{children}</span>
);

const Modal = ({ title, onClose, children }) => (
  <div style={{
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000, padding: 16,
  }} onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="fade-in" style={{
      background: COLORS.surface, border: `1px solid ${COLORS.border}`,
      borderRadius: 20, padding: 24, width: "100%", maxWidth: 480,
      maxHeight: "85vh", overflowY: "auto",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ color: COLORS.accent, fontSize: 16 }}>{title}</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", color: COLORS.textMuted, fontSize: 20 }}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

// ── Login Screen ──────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [staffList, setStaffList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("staff").select("*").then(({ data }) => {
      setStaffList(data || []);
      setLoading(false);
    });
  }, []);

  const login = async () => {
    const { data } = await supabase.from("staff").select("*")
      .eq("id", selected.id).eq("password", pw).single();
    if (data) { onLogin(data); }
    else { setError("パスワードが違います"); }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 30% 20%, #3d1515 0%, ${COLORS.bg} 60%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Noto Sans JP', sans-serif", padding: 16,
    }}>
      <style>{css}</style>
      <div className="fade-in" style={{
        width: "100%", maxWidth: 360,
        background: "rgba(34,20,20,0.8)",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 24, padding: "40px 32px",
        backdropFilter: "blur(20px)",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 44, marginBottom: 8 }}>✂️</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: COLORS.accent, letterSpacing: 4 }}>SALON</div>
        <div style={{ fontSize: 11, color: COLORS.textMuted, letterSpacing: 3, marginBottom: 36 }}>STAFF PORTAL</div>

        {loading ? (
          <div style={{ color: COLORS.textMuted }}>読み込み中...</div>
        ) : !selected ? (
          <>
            <p style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 16 }}>スタッフを選択</p>
            {staffList.map(s => (
              <button key={s.id} onClick={() => setSelected(s)} style={{
                width: "100%", marginBottom: 10, padding: "12px 16px",
                background: "rgba(255,255,255,0.04)", border: `1px solid ${COLORS.border}`,
                borderRadius: 12, color: COLORS.text, display: "flex", alignItems: "center", gap: 12,
                transition: "all 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = COLORS.accent}
                onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: "bold", fontSize: 15,
                }}>{s.name[0]}</div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 500 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted }}>{s.role}</div>
                </div>
                {s.is_owner && <Badge color={COLORS.warning}>オーナー</Badge>}
              </button>
            ))}
          </>
        ) : (
          <>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`,
              margin: "0 auto 16px", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 22, fontWeight: "bold",
            }}>{selected.name[0]}</div>
            <p style={{ color: COLORS.text, marginBottom: 20, fontSize: 15 }}>{selected.name}さん</p>
            <input type="password" placeholder="パスワード" value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === "Enter" && login()}
              style={{ marginBottom: 8 }} />
            {error && <p style={{ color: COLORS.danger, fontSize: 12, marginBottom: 8 }}>{error}</p>}
            <Btn onClick={login} style={{ width: "100%", marginBottom: 12 }}>ログイン</Btn>
            <button onClick={() => { setSelected(null); setPw(""); setError(""); }}
              style={{ background: "none", border: "none", color: COLORS.textMuted, fontSize: 13 }}>← 戻る</button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Home Tab ──────────────────────────────────────────
function HomeTab({ staff }) {
  const [notices, setNotices] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [allStaff, setAllStaff] = useState([]);

  useEffect(() => {
    supabase.from("notices").select("*").order("created_at", { ascending: false }).limit(5)
      .then(({ data }) => setNotices(data || []));
    const today = new Date();
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today); d.setDate(today.getDate() - today.getDay() + i);
      return d.toISOString().split("T")[0];
    });
    supabase.from("shifts").select("*, staff(name)").in("date", weekDates)
      .then(({ data }) => setShifts(data || []));
    supabase.from("staff").select("*").then(({ data }) => setAllStaff(data || []));
  }, []);

  const days = ["日", "月", "火", "水", "木", "金", "土"];
  const today = new Date();
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() - today.getDay() + i);
    return d;
  });

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: 12, color: COLORS.textMuted, letterSpacing: 3, marginBottom: 12 }}>📢 お知らせ</h2>
      {notices.length === 0 ? (
        <Card><p style={{ color: COLORS.textMuted, fontSize: 13, textAlign: "center" }}>お知らせはありません</p></Card>
      ) : notices.map(n => (
        <Card key={n.id} style={{ marginBottom: 8, borderLeft: n.important ? `3px solid ${COLORS.accent}` : `3px solid transparent` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            {n.important && <Badge color={COLORS.accent}>重要</Badge>}
            <span style={{ fontSize: 11, color: COLORS.textMuted, marginLeft: "auto" }}>
              {new Date(n.created_at).toLocaleDateString("ja-JP")}
            </span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{n.title}</div>
          {n.content && <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 6 }}>{n.content}</div>}
        </Card>
      ))}

      <h2 style={{ fontSize: 12, color: COLORS.textMuted, letterSpacing: 3, margin: "24px 0 12px" }}>📅 今週のシフト</h2>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        {weekDates.map((d, i) => {
          const dateStr = d.toISOString().split("T")[0];
          const dayShifts = shifts.filter(s => s.date === dateStr);
          const isToday = dateStr === today.toISOString().split("T")[0];
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 20px",
              borderBottom: i < 6 ? `1px solid ${COLORS.border}` : "none",
              background: isToday ? `${COLORS.accent}10` : "transparent",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: isToday ? `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})` : "rgba(255,255,255,0.05)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: "bold", fontSize: 13, color: isToday ? "#fff" : COLORS.textMuted,
              }}>{days[d.getDay()]}</div>
              <div style={{ fontSize: 12, color: COLORS.textMuted, width: 60 }}>{d.getMonth() + 1}/{d.getDate()}</div>
              <div style={{ fontSize: 13, color: dayShifts.length ? COLORS.text : COLORS.textMuted }}>
                {dayShifts.length ? dayShifts.map(s => s.staff?.name).join("・") : "—"}
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

// ── Manual Tab ────────────────────────────────────────
function ManualTab({ staff }) {
  const [manuals, setManuals] = useState([]);
  const [open, setOpen] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", category: "", content: "", icon: "📄", is_html: false });

  const load = () => supabase.from("manuals").select("*").order("updated_at", { ascending: false })
    .then(({ data }) => setManuals(data || []));

  useEffect(() => { load(); }, []);

  const save = async () => {
    await supabase.from("manuals").insert({ ...form, updated_at: new Date().toISOString() });
    setShowForm(false); setForm({ title: "", category: "", content: "", icon: "📄", is_html: false }); load();
  };

  const del = async (id) => {
    await supabase.from("manuals").delete().eq("id", id);
    setOpen(null); load();
  };

  const cats = [...new Set(manuals.map(m => m.category).filter(Boolean))];

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ fontSize: 12, color: COLORS.textMuted, letterSpacing: 3 }}>📖 マニュアル</h2>
        {staff.is_owner && <Btn small onClick={() => setShowForm(true)}>＋ 追加</Btn>}
      </div>

      {open ? (
        <div className="fade-in">
          <button onClick={() => setOpen(null)} style={{ background: "none", border: "none", color: COLORS.accent, fontSize: 14, marginBottom: 16 }}>← 一覧に戻る</button>
          <Card>
            <div style={{ fontSize: 36, marginBottom: 12 }}>{open.icon}</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <h3 style={{ fontSize: 18, color: COLORS.text }}>{open.title}</h3>
              {open.category && <Badge>{open.category}</Badge>}
            </div>
            <p style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 16 }}>
              更新：{new Date(open.updated_at).toLocaleDateString("ja-JP")}
            </p>
            {open.is_html ? (
              <div style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.9 }}
                dangerouslySetInnerHTML={{ __html: open.content }} />
            ) : (
              <div style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.9, whiteSpace: "pre-wrap" }}>{open.content}</div>
            )}
            {staff.is_owner && (
              <div style={{ marginTop: 20, borderTop: `1px solid ${COLORS.border}`, paddingTop: 16 }}>
                <Btn small danger onClick={() => del(open.id)}>削除</Btn>
              </div>
            )}
          </Card>
        </div>
      ) : (
        <>
          {cats.map(cat => (
            <div key={cat} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: COLORS.accent, letterSpacing: 2, marginBottom: 8 }}>{cat}</div>
              {manuals.filter(m => m.category === cat).map(m => (
                <button key={m.id} onClick={() => setOpen(m)} style={{
                  width: "100%", background: COLORS.card, border: `1px solid ${COLORS.border}`,
                  borderRadius: 12, padding: "14px 16px", marginBottom: 8,
                  display: "flex", alignItems: "center", gap: 14, textAlign: "left", color: COLORS.text,
                  transition: "border-color 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = COLORS.accent}
                  onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}
                >
                  <span style={{ fontSize: 26 }}>{m.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{m.title}</div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 3 }}>
                      更新：{new Date(m.updated_at).toLocaleDateString("ja-JP")}
                    </div>
                  </div>
                  <span style={{ color: COLORS.accent }}>›</span>
                </button>
              ))}
            </div>
          ))}
          {manuals.filter(m => !m.category).map(m => (
            <button key={m.id} onClick={() => setOpen(m)} style={{
              width: "100%", background: COLORS.card, border: `1px solid ${COLORS.border}`,
              borderRadius: 12, padding: "14px 16px", marginBottom: 8,
              display: "flex", alignItems: "center", gap: 14, textAlign: "left", color: COLORS.text,
            }}>
              <span style={{ fontSize: 26 }}>{m.icon}</span>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 500, fontSize: 14 }}>{m.title}</div></div>
              <span style={{ color: COLORS.accent }}>›</span>
            </button>
          ))}
          {manuals.length === 0 && (
            <Card><p style={{ color: COLORS.textMuted, fontSize: 13, textAlign: "center" }}>マニュアルはまだありません</p></Card>
          )}
        </>
      )}

      {showForm && (
        <Modal title="マニュアル追加" onClose={() => setShowForm(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input placeholder="タイトル" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <input placeholder="カテゴリ（例：接客・技術）" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            <input placeholder="アイコン（絵文字）" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} />
            <textarea placeholder="内容（テキストまたはHTMLコード）" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
              style={{ minHeight: 120, resize: "vertical" }} />
            <label style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.text, fontSize: 14, cursor: "pointer" }}>
              <input type="checkbox" checked={form.is_html} onChange={e => setForm({ ...form, is_html: e.target.checked })}
                style={{ width: "auto", padding: 0 }} />
              HTMLとして表示する
            </label>
            <Btn onClick={save}>保存</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Checklist Tab ─────────────────────────────────────
function ChecklistTab({ staff }) {
  const [items, setItems] = useState([]);
  const [logs, setLogs] = useState([]);
  const [type, setType] = useState("open");
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const load = () => {
    supabase.from("checklists").select("*").order("order_num").then(({ data }) => setItems(data || []));
    supabase.from("checklist_logs").select("*").eq("date", today).then(({ data }) => setLogs(data || []));
  };

  useEffect(() => { load(); }, []);

  const toggle = async (item) => {
    const existing = logs.find(l => l.checklist_id === item.id);
    if (existing) {
      await supabase.from("checklist_logs").delete().eq("id", existing.id);
    } else {
      await supabase.from("checklist_logs").insert({ checklist_id: item.id, staff_id: staff.id, date: today });
    }
    load();
  };

  const addItem = async () => {
    if (!newItem.trim()) return;
    const maxOrder = Math.max(...items.filter(i => i.type === type).map(i => i.order_num || 0), 0);
    await supabase.from("checklists").insert({ title: newItem, type, order_num: maxOrder + 1 });
    setNewItem(""); setShowForm(false); load();
  };

  const filtered = items.filter(i => i.type === type);
  const done = filtered.filter(i => logs.some(l => l.checklist_id === i.id)).length;

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 12, color: COLORS.textMuted, letterSpacing: 3 }}>✅ チェックリスト</h2>
        {staff.is_owner && <Btn small onClick={() => setShowForm(true)}>＋ 追加</Btn>}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["open", "close"].map(t => (
          <button key={t} onClick={() => setType(t)} style={{
            flex: 1, padding: "10px", borderRadius: 10,
            background: type === t ? `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})` : COLORS.card,
            border: `1px solid ${type === t ? "transparent" : COLORS.border}`,
            color: type === t ? "#fff" : COLORS.textMuted, fontSize: 13, fontWeight: 500,
          }}>{t === "open" ? "🌅 開店" : "🌙 閉店"}</button>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: COLORS.textMuted, marginBottom: 6 }}>
          <span>進捗</span><span>{done}/{filtered.length}</span>
        </div>
        <div style={{ height: 6, background: COLORS.card, borderRadius: 3, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 3,
            width: filtered.length ? `${(done / filtered.length) * 100}%` : "0%",
            background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentDark})`,
            transition: "width 0.4s ease",
          }} />
        </div>
      </div>

      {filtered.map(item => {
        const checked = logs.some(l => l.checklist_id === item.id);
        return (
          <button key={item.id} onClick={() => toggle(item)} style={{
            width: "100%", background: COLORS.card,
            border: `1px solid ${checked ? COLORS.accent + "44" : COLORS.border}`,
            borderRadius: 12, padding: "14px 16px", marginBottom: 8,
            display: "flex", alignItems: "center", gap: 14, textAlign: "left",
            transition: "all 0.2s",
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: "50%",
              background: checked ? `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})` : "transparent",
              border: checked ? "none" : `2px solid ${COLORS.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "all 0.2s",
            }}>{checked && <span style={{ color: "#fff", fontSize: 12 }}>✓</span>}</div>
            <span style={{ fontSize: 14, color: checked ? COLORS.textMuted : COLORS.text, textDecoration: checked ? "line-through" : "none" }}>
              {item.title}
            </span>
          </button>
        );
      })}

      {showForm && (
        <Modal title="項目追加" onClose={() => setShowForm(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <select value={type} onChange={e => setType(e.target.value)}>
              <option value="open">開店チェック</option>
              <option value="close">閉店チェック</option>
            </select>
            <input placeholder="項目名" value={newItem} onChange={e => setNewItem(e.target.value)} />
            <Btn onClick={addItem}>追加</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Supply Tab ────────────────────────────────────────
function SupplyTab({ staff }) {
  const [supplies, setSupplies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: "", category: "", current_stock: 0, min_stock: 1, unit: "個" });

  const load = () => supabase.from("supplies").select("*").order("category").then(({ data }) => setSupplies(data || []));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (editItem) {
      await supabase.from("supplies").update(form).eq("id", editItem.id);
    } else {
      await supabase.from("supplies").insert(form);
    }
    setShowForm(false); setEditItem(null); setForm({ name: "", category: "", current_stock: 0, min_stock: 1, unit: "個" }); load();
  };

  const updateStock = async (id, delta) => {
    const item = supplies.find(s => s.id === id);
    const newVal = Math.max(0, (item.current_stock || 0) + delta);
    await supabase.from("supplies").update({ current_stock: newVal }).eq("id", id);
    load();
  };

  const cats = [...new Set(supplies.map(s => s.category).filter(Boolean))];
  const lowStock = supplies.filter(s => s.current_stock <= s.min_stock);

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 12, color: COLORS.textMuted, letterSpacing: 3 }}>📦 備品在庫</h2>
        {staff.is_owner && <Btn small onClick={() => setShowForm(true)}>＋ 追加</Btn>}
      </div>

      {lowStock.length > 0 && (
        <Card style={{ borderColor: `${COLORS.warning}44`, marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: COLORS.warning, fontWeight: 500, marginBottom: 8 }}>⚠️ 在庫が少ない商品</div>
          {lowStock.map(s => (
            <div key={s.id} style={{ fontSize: 13, color: COLORS.textMuted, padding: "4px 0" }}>
              {s.name}：残り{s.current_stock}{s.unit}
            </div>
          ))}
        </Card>
      )}

      {cats.map(cat => (
        <div key={cat} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: COLORS.accent, letterSpacing: 2, marginBottom: 8 }}>{cat}</div>
          {supplies.filter(s => s.category === cat).map(s => {
            const low = s.current_stock <= s.min_stock;
            return (
              <Card key={s.id} style={{ marginBottom: 8, borderColor: low ? `${COLORS.warning}44` : COLORS.border }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{s.name}</div>
                    {low && <Badge color={COLORS.warning}>要発注</Badge>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button onClick={() => updateStock(s.id, -1)} style={{
                      width: 28, height: 28, borderRadius: "50%", border: `1px solid ${COLORS.border}`,
                      background: "transparent", color: COLORS.text, fontSize: 16,
                    }}>−</button>
                    <span style={{ fontSize: 16, fontWeight: 500, minWidth: 40, textAlign: "center" }}>
                      {s.current_stock}<span style={{ fontSize: 11, color: COLORS.textMuted }}>{s.unit}</span>
                    </span>
                    <button onClick={() => updateStock(s.id, 1)} style={{
                      width: 28, height: 28, borderRadius: "50%", border: `1px solid ${COLORS.border}`,
                      background: "transparent", color: COLORS.text, fontSize: 16,
                    }}>＋</button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ))}

      {showForm && (
        <Modal title="備品追加" onClose={() => { setShowForm(false); setEditItem(null); }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input placeholder="備品名" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input placeholder="カテゴリ" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            <input placeholder="単位（本・枚・個など）" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} />
            <input type="number" placeholder="現在の在庫数" value={form.current_stock} onChange={e => setForm({ ...form, current_stock: parseInt(e.target.value) || 0 })} />
            <input type="number" placeholder="最低在庫数（これ以下で警告）" value={form.min_stock} onChange={e => setForm({ ...form, min_stock: parseInt(e.target.value) || 1 })} />
            <Btn onClick={save}>保存</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Report Tab ────────────────────────────────────────
function ReportTab({ staff }) {
  const [reports, setReports] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().split("T")[0], sales: "", customer_count: "", memo: "" });

  const load = () => supabase.from("daily_reports").select("*, staff(name)").order("date", { ascending: false }).limit(30)
    .then(({ data }) => setReports(data || []));
  useEffect(() => { load(); }, []);

  const save = async () => {
    await supabase.from("daily_reports").insert({ ...form, staff_id: staff.id, sales: parseInt(form.sales) || 0, customer_count: parseInt(form.customer_count) || 0 });
    setShowForm(false); load();
  };

  const totalMonth = reports.filter(r => r.date?.startsWith(new Date().toISOString().slice(0, 7)))
    .reduce((sum, r) => sum + (r.sales || 0), 0);

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 12, color: COLORS.textMuted, letterSpacing: 3 }}>💰 日報・売上</h2>
        <Btn small onClick={() => setShowForm(true)}>＋ 入力</Btn>
      </div>

      <Card style={{ marginBottom: 16, textAlign: "center" }}>
        <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 4 }}>今月の売上合計</div>
        <div style={{ fontSize: 28, fontFamily: "'Cormorant Garamond', serif", color: COLORS.accent }}>
          ¥{totalMonth.toLocaleString()}
        </div>
      </Card>

      {reports.map(r => (
        <Card key={r.id} style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, color: COLORS.textMuted }}>{r.date}</div>
              <div style={{ fontSize: 15, fontWeight: 500, marginTop: 2 }}>¥{(r.sales || 0).toLocaleString()}</div>
              <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>👥 {r.customer_count}名 · {r.staff?.name}</div>
              {r.memo && <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>{r.memo}</div>}
            </div>
          </div>
        </Card>
      ))}

      {showForm && (
        <Modal title="日報入力" onClose={() => setShowForm(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            <input type="number" placeholder="売上（円）" value={form.sales} onChange={e => setForm({ ...form, sales: e.target.value })} />
            <input type="number" placeholder="来客数" value={form.customer_count} onChange={e => setForm({ ...form, customer_count: e.target.value })} />
            <textarea placeholder="メモ（任意）" value={form.memo} onChange={e => setForm({ ...form, memo: e.target.value })} />
            <Btn onClick={save}>保存</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Customer Notes Tab ────────────────────────────────
function CustomerTab({ staff }) {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ customer_name: "", note: "" });

  const load = () => supabase.from("customer_notes").select("*, staff(name)").order("updated_at", { ascending: false })
    .then(({ data }) => setNotes(data || []));
  useEffect(() => { load(); }, []);

  const save = async () => {
    await supabase.from("customer_notes").insert({ ...form, staff_id: staff.id, updated_at: new Date().toISOString() });
    setShowForm(false); setForm({ customer_name: "", note: "" }); load();
  };

  const filtered = notes.filter(n => n.customer_name?.includes(search));

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ fontSize: 12, color: COLORS.textMuted, letterSpacing: 3 }}>🧴 施術メモ</h2>
        <Btn small onClick={() => setShowForm(true)}>＋ 追加</Btn>
      </div>
      <input placeholder="🔍 お客様名で検索" value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 16 }} />

      {filtered.map(n => (
        <Card key={n.id} style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 500 }}>{n.customer_name}</div>
              <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 6, lineHeight: 1.7 }}>{n.note}</div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 6 }}>
                {n.staff?.name} · {new Date(n.updated_at).toLocaleDateString("ja-JP")}
              </div>
            </div>
          </div>
        </Card>
      ))}

      {filtered.length === 0 && (
        <Card><p style={{ color: COLORS.textMuted, fontSize: 13, textAlign: "center" }}>メモはありません</p></Card>
      )}

      {showForm && (
        <Modal title="施術メモ追加" onClose={() => setShowForm(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input placeholder="お客様名" value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })} />
            <textarea placeholder="メモ（アレルギー・好み・注意点など）" value={form.note}
              onChange={e => setForm({ ...form, note: e.target.value })} style={{ minHeight: 100 }} />
            <Btn onClick={save}>保存</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Notice Admin (Owner only) ─────────────────────────
function NoticeAdmin({ staff }) {
  const [notices, setNotices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", important: false });

  const load = () => supabase.from("notices").select("*").order("created_at", { ascending: false })
    .then(({ data }) => setNotices(data || []));
  useEffect(() => { load(); }, []);

  const save = async () => {
    await supabase.from("notices").insert(form);
    setShowForm(false); setForm({ title: "", content: "", important: false }); load();
  };

  const del = async (id) => {
    await supabase.from("notices").delete().eq("id", id); load();
  };

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 12, color: COLORS.textMuted, letterSpacing: 3 }}>📢 お知らせ管理</h2>
        <Btn small onClick={() => setShowForm(true)}>＋ 投稿</Btn>
      </div>

      {notices.map(n => (
        <Card key={n.id} style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                {n.important && <Badge color={COLORS.accent}>重要</Badge>}
                <span style={{ fontSize: 11, color: COLORS.textMuted }}>{new Date(n.created_at).toLocaleDateString("ja-JP")}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{n.title}</div>
              {n.content && <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>{n.content}</div>}
            </div>
            <button onClick={() => del(n.id)} style={{ background: "none", border: "none", color: COLORS.danger, fontSize: 16, marginLeft: 8 }}>🗑</button>
          </div>
        </Card>
      ))}

      {showForm && (
        <Modal title="お知らせ投稿" onClose={() => setShowForm(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input placeholder="タイトル" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <textarea placeholder="内容（任意）" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
            <label style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.text, fontSize: 14, cursor: "pointer" }}>
              <input type="checkbox" checked={form.important} onChange={e => setForm({ ...form, important: e.target.checked })}
                style={{ width: "auto", padding: 0 }} />
              重要フラグをつける
            </label>
            <Btn onClick={save}>投稿</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────
export default function App() {
  const [staff, setStaff] = useState(null);
  const [tab, setTab] = useState("home");

  if (!staff) return <LoginScreen onLogin={setStaff} />;

  const tabs = [
    { key: "home", label: "ホーム", icon: "🏠" },
    { key: "manual", label: "マニュアル", icon: "📖" },
    { key: "check", label: "チェック", icon: "✅" },
    { key: "supply", label: "備品", icon: "📦" },
    { key: "report", label: "日報", icon: "💰" },
    { key: "customer", label: "施術", icon: "🧴" },
    ...(staff.is_owner ? [{ key: "notice", label: "掲示板", icon: "📢" }] : []),
  ];

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'Noto Sans JP', sans-serif", maxWidth: 430, margin: "0 auto" }}>
      <style>{css}</style>

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, #2d1010, #3d1515)`,
        padding: "16px 20px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: `1px solid ${COLORS.border}`,
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: COLORS.accent, letterSpacing: 3 }}>SALON</div>
          <div style={{ fontSize: 11, color: COLORS.textMuted }}>✂️ {staff.name} / {staff.role}</div>
        </div>
        <button onClick={() => setStaff(null)} style={{
          background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.border}`,
          borderRadius: 8, padding: "6px 12px", color: COLORS.textMuted, fontSize: 12,
        }}>ログアウト</button>
      </div>

      {/* Content */}
      <div style={{ padding: 16, paddingBottom: 90 }}>
        {tab === "home" && <HomeTab staff={staff} />}
        {tab === "manual" && <ManualTab staff={staff} />}
        {tab === "check" && <ChecklistTab staff={staff} />}
        {tab === "supply" && <SupplyTab staff={staff} />}
        {tab === "report" && <ReportTab staff={staff} />}
        {tab === "customer" && <CustomerTab staff={staff} />}
        {tab === "notice" && staff.is_owner && <NoticeAdmin staff={staff} />}
      </div>

      {/* Bottom Nav */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: COLORS.surface,
        borderTop: `1px solid ${COLORS.border}`,
        display: "flex", justifyContent: "space-around",
        padding: "8px 0 16px",
        zIndex: 100,
      }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            background: "none", border: "none",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            color: tab === t.key ? COLORS.accent : COLORS.textMuted,
            fontSize: 10, fontWeight: tab === t.key ? 700 : 400,
            padding: "4px 8px",
            transition: "color 0.2s",
          }}>
            <span style={{ fontSize: tabs.length > 5 ? 18 : 22 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
