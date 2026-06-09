import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlay, FiRefreshCw, FiCheckCircle, FiMic, FiTrendingUp } from "react-icons/fi";

// ==========================================
// 1. LLM TOKENIZATION SIMULATOR
// ==========================================
export function TokenizationDemo() {
  const [text, setText] = useState("Exploring tokenization cost impact!");
  const [model, setModel] = useState("GPT-2");
  const [tokens, setTokens] = useState([]);
  const [metrics, setMetrics] = useState({ count: 0, cost: 0.0 });

  useEffect(() => {
    // Generate high-fidelity simulated tokens based on the chosen model style
    let tokenList = [];
    let count = 0;
    
    if (model === "GPT-2") {
      // GPT-2 style: Byte-Pair Encoding splits (e.g., spaces stay on beginning of word)
      const words = text.split(/(\s+)/);
      words.forEach((w) => {
        if (!w) return;
        if (w.trim().length === 0) {
          tokenList.push({ text: w, id: 220 });
        } else if (w.length > 6) {
          // split long words
          const half = Math.floor(w.length / 2);
          tokenList.push({ text: w.slice(0, half), id: Math.floor(Math.random() * 40000) });
          tokenList.push({ text: w.slice(half), id: Math.floor(Math.random() * 40000) });
        } else {
          tokenList.push({ text: w, id: Math.floor(Math.random() * 40000) });
        }
      });
    } else if (model === "LLaMA") {
      // LLaMA: SentencePiece (uses leading '_' or thick space)
      const words = text.split(/\s+/);
      words.forEach((w) => {
        if (!w) return;
        tokenList.push({ text: " " + w, id: Math.floor(Math.random() * 32000) });
      });
    } else {
      // T5: SentencePiece style (adds underscore)
      const words = text.split(/\s+/);
      words.forEach((w) => {
        if (!w) return;
        tokenList.push({ text: "_" + w, id: Math.floor(Math.random() * 32100) });
      });
    }

    // Assign consistent colors based on token text/index
    tokenList = tokenList.map((t, idx) => {
      const hues = [15, 60, 110, 170, 220, 280, 320];
      const hue = hues[idx % hues.length];
      return {
        ...t,
        color: `hsla(${hue}, 85%, 65%, 0.15)`,
        borderColor: `hsla(${hue}, 85%, 65%, 0.45)`,
        textColor: `hsla(${hue}, 90%, 80%, 1)`
      };
    });

    setTokens(tokenList);
    
    // Calculate simulated cost (e.g. $1.5 per 1M tokens)
    setMetrics({
      count: tokenList.length,
      cost: Number((tokenList.length * 0.000002).toFixed(6))
    });
  }, [text, model]);

  return (
    <div style={{ background: "rgba(10,10,15,0.6)", borderRadius: "8px", padding: "1.5rem", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem", textAlign: "left" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
        <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent2)" }}>Tokenization Simulator</span>
        <div style={{ display: "flex", gap: "0.3rem" }}>
          {["GPT-2", "LLaMA", "T5"].map((m) => (
            <button 
              key={m} 
              onClick={() => setModel(m)}
              style={{
                background: model === m ? "var(--accent)" : "rgba(255,255,255,0.03)",
                color: model === m ? "#0a0a0f" : "var(--muted)",
                border: "none", padding: "0.25rem 0.6rem", borderRadius: "4px", fontSize: "0.65rem", cursor: "none", transition: "all 0.2s"
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <textarea 
        rows={2}
        value={text} 
        onChange={(e) => setText(e.target.value)}
        style={{
          width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "4px",
          color: "var(--text)", padding: "0.6rem", fontSize: "0.75rem", fontFamily: "inherit", outline: "none", resize: "none", cursor: "none"
        }}
        placeholder="Type something to split into tokens..."
      />

      <div>
        <div style={{ fontSize: "0.65rem", color: "var(--muted)", marginBottom: "0.4rem", textTransform: "uppercase" }}>Tokenized Output</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", padding: "0.75rem", background: "rgba(0,0,0,0.2)", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.02)", minHeight: "45px" }}>
          {tokens.map((t, idx) => (
            <span 
              key={idx}
              style={{
                background: t.color,
                border: `1px solid ${t.borderColor}`,
                color: t.textColor,
                padding: "0.15rem 0.35rem",
                borderRadius: "3px",
                fontSize: "0.7rem",
                fontFamily: "monospace",
                display: "inline-block"
              }}
              title={`ID: ${t.id}`}
            >
              {t.text.replace(/ /g, "␣")}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", borderTop: "1px solid var(--border)", paddingTop: "0.75rem" }}>
        <div>
          <div style={{ fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase" }}>Token Count</div>
          <div style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text)" }}>{metrics.count} <span style={{ fontSize: "0.7rem", fontWeight: "300", color: "var(--muted)" }}>tokens</span></div>
        </div>
        <div>
          <div style={{ fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase" }}>Est. Cost (Prompt)</div>
          <div style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--accent)" }}>${metrics.cost.toFixed(6)}</div>
        </div>
      </div>
    </div>
  );
}


// ==========================================
// 2. FARMLINK CROP QUALITY & PRICE SIMULATOR
// ==========================================
export function FarmLinkDemo() {
  const [crop, setCrop] = useState("Tomato");
  const [quality, setQuality] = useState("Fresh");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  
  // Voice Command Simulation
  const [voiceLog, setVoiceLog] = useState("");

  const startScan = () => {
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      setScanning(false);
      let freshness = 95;
      let recommendedPrice = 65;
      
      if (crop === "Tomato") {
        freshness = quality === "Fresh" ? 97 : quality === "Fair" ? 78 : 34;
        recommendedPrice = quality === "Fresh" ? 75 : quality === "Fair" ? 42 : 12;
      } else if (crop === "Apple") {
        freshness = quality === "Fresh" ? 99 : quality === "Fair" ? 82 : 41;
        recommendedPrice = quality === "Fresh" ? 140 : quality === "Fair" ? 90 : 30;
      } else {
        freshness = quality === "Fresh" ? 94 : quality === "Fair" ? 75 : 29;
        recommendedPrice = quality === "Fresh" ? 50 : quality === "Fair" ? 30 : 10;
      }

      setResult({
        freshness,
        recommendedPrice,
        sizeScore: quality === "Fresh" ? 92 : quality === "Fair" ? 76 : 48,
        colorScore: quality === "Fresh" ? 96 : quality === "Fair" ? 80 : 38
      });
    }, 1500);
  };

  const handleVoiceCommand = (cmd) => {
    setVoiceLog(`🎙️ Voice heard: "${cmd}"`);
    if (cmd.includes("Tomato")) { setCrop("Tomato"); }
    else if (cmd.includes("Apple")) { setCrop("Apple"); }
    else if (cmd.includes("Potato")) { setCrop("Potato"); }
    
    if (cmd.includes("Fresh")) { setQuality("Fresh"); }
    else if (cmd.includes("Fair")) { setQuality("Fair"); }
    else if (cmd.includes("Damaged")) { setQuality("Damaged"); }
  };

  return (
    <div style={{ background: "rgba(10,10,15,0.6)", borderRadius: "8px", padding: "1.5rem", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem", textAlign: "left" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent2)" }}>AI Quality & Price Scan</span>
        <div style={{ display: "flex", gap: "0.3rem" }}>
          {["Tomato", "Apple", "Potato"].map((cr) => (
            <button 
              key={cr} 
              onClick={() => { setCrop(cr); setResult(null); }}
              style={{
                background: crop === cr ? "var(--accent2)" : "rgba(255,255,255,0.03)",
                color: crop === cr ? "#0a0a0f" : "var(--muted)",
                border: "none", padding: "0.25rem 0.6rem", borderRadius: "4px", fontSize: "0.65rem", cursor: "none"
              }}
            >
              {cr}
            </button>
          ))}
        </div>
      </div>

      {/* Select Condition */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ fontSize: "0.65rem", color: "var(--muted)" }}>Crop State:</span>
        {["Fresh", "Fair", "Damaged"].map((q) => (
          <button 
            key={q} 
            onClick={() => { setQuality(q); setResult(null); }}
            style={{
              background: quality === q ? "rgba(200,241,53,0.12)" : "transparent",
              border: `1px solid ${quality === q ? "var(--accent)" : "rgba(255,255,255,0.05)"}`,
              color: quality === q ? "var(--accent)" : "var(--muted)",
              padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.65rem", cursor: "none"
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Interactive voice tester */}
      <div style={{ background: "rgba(0,0,0,0.15)", padding: "0.5rem", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.01)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <FiMic size={12} color="var(--accent)" />
        <div style={{ fontSize: "0.6rem", color: "var(--muted)", flex: 1 }}>
          {voiceLog || "Test spoken command simulation:"}
        </div>
        <button 
          onClick={() => handleVoiceCommand(`Scan Fresh ${crop}`)}
          style={{ fontSize: "0.55rem", border: "1px solid rgba(250,250,250,0.1)", background: "rgba(255,255,255,0.02)", color: "var(--text)", padding: "0.15rem 0.3rem", borderRadius: "3px", cursor: "none" }}
        >
          "Scan Fresh"
        </button>
        <button 
          onClick={() => handleVoiceCommand(`Set condition Damaged`)}
          style={{ fontSize: "0.55rem", border: "1px solid rgba(250,250,250,0.1)", background: "rgba(255,255,255,0.02)", color: "var(--text)", padding: "0.15rem 0.3rem", borderRadius: "3px", cursor: "none" }}
        >
          "Set Damaged"
        </button>
      </div>

      {/* Action Button */}
      <button 
        onClick={startScan} 
        disabled={scanning}
        style={{
          width: "100%", background: "var(--accent)", border: "none", padding: "0.5rem", borderRadius: "4px",
          color: "#0a0a0f", fontWeight: "600", fontSize: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", cursor: "none"
        }}
      >
        {scanning ? <FiRefreshCw className="spin" /> : <FiPlay />}
        {scanning ? "AI Analyzing Crop Image..." : "Simulate AI Quality Scan"}
      </button>

      {/* Scanning Laser animation */}
      {scanning && (
        <div style={{ position: "relative", height: "8px", background: "rgba(255,255,255,0.03)", borderRadius: "4px", overflow: "hidden", border: "1px solid var(--border)" }}>
          <motion.div 
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "absolute", top: 0, bottom: 0, width: "30%", background: "linear-gradient(90deg, transparent, var(--accent2), transparent)" }}
          />
        </div>
      )}

      {/* Scan Results */}
      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ background: "rgba(0,0,0,0.3)", padding: "1rem", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.03)", display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.7rem", color: "var(--accent)" }}>
              <FiCheckCircle size={14} /> Scan Complete! Grade: {quality} {crop}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
              <div style={{ background: "rgba(255,255,255,0.02)", padding: "0.4rem", borderRadius: "4px", textAlign: "center" }}>
                <div style={{ fontSize: "0.55rem", color: "var(--muted)", textTransform: "uppercase" }}>Freshness</div>
                <div style={{ fontSize: "0.9rem", fontWeight: "700", color: result.freshness > 60 ? "var(--accent2)" : "#ff6464" }}>{result.freshness}%</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.02)", padding: "0.4rem", borderRadius: "4px", textAlign: "center" }}>
                <div style={{ fontSize: "0.55rem", color: "var(--muted)", textTransform: "uppercase" }}>Color Uni.</div>
                <div style={{ fontSize: "0.9rem", fontWeight: "700" }}>{result.colorScore}%</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.02)", padding: "0.4rem", borderRadius: "4px", textAlign: "center" }}>
                <div style={{ fontSize: "0.55rem", color: "var(--muted)", textTransform: "uppercase" }}>Size Uni.</div>
                <div style={{ fontSize: "0.9rem", fontWeight: "700" }}>{result.sizeScore}%</div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "0.5rem" }}>
              <div>
                <div style={{ fontSize: "0.6rem", color: "var(--muted)" }}>AI Rec. Price</div>
                <div style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text)" }}>₹{result.recommendedPrice}/kg</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.6rem", color: "var(--accent)" }}>
                <FiTrendingUp /> Price Index Normal
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
