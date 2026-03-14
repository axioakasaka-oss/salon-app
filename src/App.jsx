{showManuals && (
  <div style={cardStyle}>
    <div style={sectionTitleStyle}>施術マニュアル</div>

    {["施術", "薬剤", "店販商品", "接客", "カウンセリング", "システム"].map(
      (cat) => (
        <div key={cat} style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 18 }}>{cat}</h2>

          {manuals
            .filter((m) => m.category === cat)
            .map((m) => (
              <div
                key={m.id}
                style={{
                  borderTop: "1px solid #eee",
                  paddingTop: 18,
                  marginTop: 18,
                }}
              >
                <h3 style={{ marginBottom: 8 }}>{m.title}</h3>

                <p style={textStyle}>
                  {m.description || m.content || "説明なし"}
                </p>

                <button
                  onClick={() => openManual(m)}
                  style={smallButtonStyle}
                >
                  詳細を見る
                </button>
              </div>
            ))}
        </div>
      )
    )}
  </div>
)}
