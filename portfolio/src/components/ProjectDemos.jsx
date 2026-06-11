import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlay, FiRefreshCw, FiCheckCircle, FiMic, FiTrendingUp, FiShoppingCart, FiCreditCard, FiLock, FiCalendar, FiClock, FiActivity } from "react-icons/fi";

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
                border: "none", padding: "0.25rem 0.6rem", borderRadius: "4px", fontSize: "0.65rem", cursor: "pointer", transition: "all 0.2s"
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
          color: "var(--text)", padding: "0.6rem", fontSize: "0.75rem", fontFamily: "inherit", outline: "none", resize: "none", cursor: "pointer"
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
                border: "none", padding: "0.25rem 0.6rem", borderRadius: "4px", fontSize: "0.65rem", cursor: "pointer"
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
              padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.65rem", cursor: "pointer"
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
          style={{ fontSize: "0.55rem", border: "1px solid rgba(250,250,250,0.1)", background: "rgba(255,255,255,0.02)", color: "var(--text)", padding: "0.15rem 0.3rem", borderRadius: "3px", cursor: "pointer" }}
        >
          "Scan Fresh"
        </button>
        <button 
          onClick={() => handleVoiceCommand(`Set condition Damaged`)}
          style={{ fontSize: "0.55rem", border: "1px solid rgba(250,250,250,0.1)", background: "rgba(255,255,255,0.02)", color: "var(--text)", padding: "0.15rem 0.3rem", borderRadius: "3px", cursor: "pointer" }}
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
          color: "#0a0a0f", fontWeight: "600", fontSize: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", cursor: "pointer"
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


// ==========================================
// 3. AMMA'S PICKLES E-COMMERCE SIMULATOR
// ==========================================
export function AmmasPicklesDemo() {
  const [cart, setCart] = useState([
    { id: 1, name: "Avakaya Mango Pickle", price: 199, quantity: 1 },
    { id: 2, name: "Spicy Lime Pickle", price: 149, quantity: 0 },
  ]);
  const [isCheckout, setIsCheckout] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("idle"); // "idle", "processing", "success"
  const [jwtToken, setJwtToken] = useState("");
  const [authChecking, setAuthChecking] = useState(false);

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const grandTotal = subtotal + deliveryFee;

  const startCheckout = () => {
    if (grandTotal === 0) return;
    setIsCheckout(true);
    setPaymentStatus("processing");
    setTimeout(() => {
      setPaymentStatus("success");
    }, 2500);
  };

  const simulateJWTAuth = () => {
    setAuthChecking(true);
    setTimeout(() => {
      setJwtToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MGM3MmRlYSIsIm5hbWUiOiJQb29ybmEiLCJyb2xlIjoiYnV5ZXIifQ");
      setAuthChecking(false);
    }, 1200);
  };

  return (
    <div style={{ background: "rgba(10,10,15,0.6)", borderRadius: "8px", padding: "1.25rem", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem", textAlign: "left" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent)" }}>MERN Checkout & JWT Simulator</span>
        <span style={{ fontSize: "0.6rem", color: "var(--muted)", background: "rgba(255,255,255,0.03)", padding: "0.15rem 0.4rem", borderRadius: "4px" }}>v1.0.3 (Live)</span>
      </div>

      {!isCheckout ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {/* Cart Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.01)" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: "600", color: "#fff" }}>{item.name}</div>
                  <div style={{ fontSize: "0.65rem", color: "var(--muted)" }}>₹{item.price} / jar</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <button 
                    type="button"
                    onClick={() => updateQuantity(item.id, -1)}
                    style={{ width: "20px", height: "20px", border: "1px solid var(--border)", background: "rgba(255,255,255,0.02)", color: "#fff", borderRadius: "4px", fontSize: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                  >-</button>
                  <span style={{ fontSize: "0.75rem", width: "12px", textAlign: "center" }}>{item.quantity}</span>
                  <button 
                    type="button"
                    onClick={() => updateQuantity(item.id, 1)}
                    style={{ width: "20px", height: "20px", border: "1px solid var(--border)", background: "rgba(255,255,255,0.02)", color: "#fff", borderRadius: "4px", fontSize: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                  >+</button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div style={{ background: "rgba(0,0,0,0.15)", padding: "0.75rem", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.01)", fontSize: "0.7rem", color: "var(--muted)", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Items Total:</span>
              <span style={{ color: "#fff" }}>₹{subtotal}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Delivery Fee:</span>
              <span style={{ color: "#fff" }}>₹{deliveryFee}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed var(--border)", paddingTop: "0.4rem", marginTop: "0.2rem", fontSize: "0.75rem", fontWeight: "700" }}>
              <span style={{ color: "var(--text)" }}>Grand Total:</span>
              <span style={{ color: "var(--accent)" }}>₹{grandTotal}</span>
            </div>
          </div>

          {/* Secure Payment Trigger */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={simulateJWTAuth}
              disabled={authChecking}
              style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", color: jwtToken ? "var(--accent2)" : "#fff",
                padding: "0.5rem", borderRadius: "4px", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem", cursor: "pointer"
              }}
            >
              <FiLock size={12} />
              {authChecking ? "Authenticating..." : jwtToken ? "Authenticated (JWT)" : "Sign In (JWT)"}
            </button>
            <button
              type="button"
              onClick={startCheckout}
              disabled={grandTotal === 0}
              style={{
                background: grandTotal > 0 ? "var(--accent)" : "rgba(255,255,255,0.02)",
                color: grandTotal > 0 ? "#0a0a0f" : "var(--muted)", border: "none",
                padding: "0.5rem", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem", cursor: "pointer"
              }}
            >
              <FiShoppingCart size={12} />
              Pay via Razorpay
            </button>
          </div>

          {/* JWT Display */}
          {jwtToken && (
            <div style={{ background: "rgba(0,0,0,0.3)", padding: "0.5rem 0.75rem", borderRadius: "4px", border: "1px solid rgba(74,240,196,0.15)" }}>
              <div style={{ fontSize: "0.55rem", color: "var(--accent2)", textTransform: "uppercase", marginBottom: "0.2rem", fontWeight: "700" }}>Decoded JWT Session Payload:</div>
              <div style={{ fontSize: "0.6rem", color: "var(--muted)", fontFamily: "monospace" }}>
                {"{"} userId: "60c72dea", name: "Poorna", role: "buyer" {"}"}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Checkout Simulator Screen */
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ background: "rgba(18, 18, 30, 0.9)", border: "1px solid var(--border)", borderRadius: "6px", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center", textAlign: "center" }}
        >
          {paymentStatus === "processing" ? (
            <>
              <div style={{ position: "relative", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                <FiRefreshCw size={28} className="spin" />
              </div>
              <div style={{ fontSize: "0.8rem", fontWeight: "600", color: "#fff" }}>Contacting Razorpay Gateway...</div>
              <p style={{ fontSize: "0.65rem", color: "var(--muted)", margin: 0 }}>Simulating token exchange and secure routing.</p>
            </>
          ) : (
            <>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(74,240,196,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent2)" }}>
                <FiCheckCircle size={24} />
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--accent2)" }}>Payment Successful!</div>
              <div style={{ fontSize: "0.65rem", color: "var(--muted)", fontFamily: "monospace", background: "rgba(0,0,0,0.2)", padding: "0.4rem 0.8rem", borderRadius: "4px" }}>
                Order Ref: TXN_PAY_RZP902410
              </div>
              <p style={{ fontSize: "0.65rem", color: "var(--muted)", margin: 0 }}>JWT Token verified. Database stock counts updated in MongoDB Atlas.</p>
              <button 
                type="button"
                onClick={() => { setIsCheckout(false); setPaymentStatus("idle"); }}
                style={{ background: "none", border: "1px solid var(--border)", color: "#fff", padding: "0.3rem 0.8rem", fontSize: "0.65rem", borderRadius: "4px", cursor: "pointer", marginTop: "0.5rem" }}
              >
                Buy Again
              </button>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}


// ==========================================
// 4. ABHAY DENTAL CARE APPOINTMENT SIMULATOR
// ==========================================
export function AbhayDentalDemo() {
  const [service, setService] = useState("Teeth Whitening");
  const [day, setDay] = useState("Tomorrow");
  const [time, setTime] = useState("11:30 AM");
  const [patientName, setPatientName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const servicesList = [
    "Teeth Whitening", "Root Canal Therapy", "General Cleaning", "Dental Braces"
  ];

  const timeSlots = [
    "10:00 AM", "11:30 AM", "2:30 PM", "4:00 PM"
  ];

  const handleBook = (e) => {
    e.preventDefault();
    if (!patientName.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div style={{ background: "rgba(10,10,15,0.6)", borderRadius: "8px", padding: "1.25rem", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem", textAlign: "left" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent2)" }}>Appointment Booking Demo</span>
        <span style={{ fontSize: "0.65rem", color: "var(--muted)" }}>Interactive UI Component</span>
      </div>

      {!submitted ? (
        <form onSubmit={handleBook} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          
          {/* Service Selector */}
          <div>
            <label style={{ fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", display: "block", marginBottom: "0.25rem" }}>Select Treatment</label>
            <select 
              value={service}
              onChange={(e) => setService(e.target.value)}
              style={{ width: "100%", padding: "0.4rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", color: "#fff", borderRadius: "4px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none", cursor: "pointer" }}
            >
              {servicesList.map(s => <option key={s} value={s} style={{ background: "#0a0a0f" }}>{s}</option>)}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label style={{ fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", display: "block", marginBottom: "0.25rem" }}>Appointment Day</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.4rem" }}>
              {["Today", "Tomorrow", "Next Monday"].map(d => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDay(d)}
                  style={{
                    background: day === d ? "rgba(74,240,196,0.12)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${day === d ? "var(--accent2)" : "var(--border)"}`,
                    color: day === d ? "var(--accent2)" : "var(--muted)",
                    padding: "0.35rem", borderRadius: "4px", fontSize: "0.65rem", cursor: "pointer"
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Time Picker */}
          <div>
            <label style={{ fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", display: "block", marginBottom: "0.25rem" }}>Available Slot</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.3rem" }}>
              {timeSlots.map(t => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTime(t)}
                  style={{
                    background: time === t ? "rgba(200,241,53,0.12)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${time === t ? "var(--accent)" : "var(--border)"}`,
                    color: time === t ? "var(--accent)" : "var(--muted)",
                    padding: "0.3rem 0", borderRadius: "4px", fontSize: "0.6rem", cursor: "pointer"
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Patient Details */}
          <div>
            <label style={{ fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", display: "block", marginBottom: "0.25rem" }}>Patient Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. John Doe"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              style={{ width: "100%", padding: "0.45rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", color: "#fff", borderRadius: "4px", fontSize: "0.7rem", fontFamily: "inherit", outline: "none", cursor: "text" }}
            />
          </div>

          {/* Book Slot */}
          <button 
            type="submit" 
            disabled={loading || !patientName.trim()}
            style={{
              width: "100%", background: "var(--accent2)", border: "none", padding: "0.5rem", borderRadius: "4px",
              color: "#0a0a0f", fontWeight: "700", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", cursor: "pointer", marginTop: "0.25rem"
            }}
          >
            {loading ? <FiRefreshCw className="spin" size={12} /> : <FiCalendar size={12} />}
            {loading ? "Checking clinic timetable..." : "Schedule Appointment"}
          </button>
        </form>
      ) : (
        /* Ticket confirmation */
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(74,240,196,0.2)", borderRadius: "6px", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "var(--accent2)", fontWeight: "700" }}>
            <FiCheckCircle size={14} /> Appointment Booked Successfully!
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", borderLeft: "2px solid var(--accent)", paddingLeft: "0.75rem", margin: "0.5rem 0", fontSize: "0.7rem", color: "var(--muted)" }}>
            <div>Patient: <span style={{ color: "#fff", fontWeight: "600" }}>{patientName}</span></div>
            <div>Treatment: <span style={{ color: "#fff" }}>{service}</span></div>
            <div>Time: <span style={{ color: "var(--accent)" }}>{day} at {time}</span></div>
            <div>Clinic Address: <span style={{ color: "#fff" }}>Abhay Dental Care, Main Rd</span></div>
          </div>
          <div style={{ fontSize: "0.55rem", color: "var(--muted)", textTransform: "uppercase", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed var(--border)", paddingTop: "0.5rem" }}>
            <span>Ref ID: ADC-992140</span>
            <button 
              type="button"
              onClick={() => { setSubmitted(false); setPatientName(""); }}
              style={{ background: "none", border: "none", color: "var(--accent2)", fontSize: "0.55rem", cursor: "pointer", textDecoration: "underline", padding: 0 }}
            >
              Book Another
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

